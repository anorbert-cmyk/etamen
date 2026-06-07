---
description: Iterative code review loop. Spawns 3 reviewer agents in parallel, applies their P0/P1 fixes, repeats until reviewer consensus or 3-iteration cap.
---

# Code Review Loop

A self-correcting code review pipeline. Runs after any implementation step:
spawns `security-auditor`, `frontend-specialist`, and `debugger` in parallel
to audit a target file set, applies their P0/P1 findings as a single fixer
pass, then re-spawns the reviewers. The loop exits when every reviewer
returns `status: "clean"` in the same iteration, or after 3 iterations,
whichever comes first. Each iteration's fixes land in their own commit so a
bad fix is trivially revertible.

## Usage

`/review-loop [target-glob] [--max-iter=3]`

- `target-glob` — optional. Defaults to `git diff --name-only HEAD~1`. If
  the working tree has uncommitted changes, those files are included too.
- `--max-iter` — optional. Hard cap on iterations (default 3, max 5).

> **Skills:** `parallel-agents` + `code-review-checklist` + `clean-code` +
> `lint-and-validate` + `systematic-debugging`

## State

All loop state persists under `.agent/state/review-loop/` so a session
restart can resume:

| Path | Purpose |
|---|---|
| `.agent/state/review-loop/state.json` | `{ iteration, started_at, head_at_start, target, max_iter }` |
| `.agent/state/review-loop/iter-N/{security,frontend,debugger}.json` | Per-reviewer findings for iteration N |
| `.agent/state/review-loop/iter-N/report.md` | Final report written at exit |

## Exit codes

| Code | Name | Meaning |
|---|---|---|
| `0` | `REVIEW_CLEAN` | All 3 reviewers returned `clean` in the same iteration |
| `1` | `REVIEW_DIRTY` | Loop still running (transient; never returned to caller) |
| `2` | `REVIEW_CAPPED` | Cap hit before consensus; partial fixes kept, report emitted |

## Steps

1. **Baseline**
   - Read `HEAD` sha; persist as `head_at_start`.
   - Resolve target file list: `git diff --name-only HEAD~1` by default,
     plus any uncommitted files from `git status --porcelain`. If the
     resulting list is empty, fall back to `git ls-files` and warn the
     user that scope ballooned.
   - Run baseline checks once so the regression guard has a reference:
     - `python3 .agent/skills/lint-and-validate/scripts/lint_runner.py`
     - `python3 .agent/skills/vulnerability-scanner/scripts/security_scan.py`
   - Record their pass/fail status in `state.json`.
   - Initialize `state.json` with `{ iteration: 1, head_at_start, target, max_iter, baseline: {...} }`.

2. **Parallel review** *(iteration N, N ≤ max_iter)*
   - In a single message, spawn three reviewer agents using the
     `parallel-agents` Pattern 1:

     | Slot | Agent | File pattern allowance |
     |---|---|---|
     | Security | `security-auditor` | Read-only across all files |
     | UX / Frontend | `frontend-specialist` | `client/src/components/**`, CSS, HTML |
     | Bug hunter | `debugger` | `client/src/**`, `server/**`, root-level JS |

   - Pass each reviewer:
     - The target file list
     - `git diff <head_at_start>..HEAD` (cumulative diff since loop start)
     - Previous iteration's findings JSON (if iteration > 1) so they can
       check whether stuck issues persist
   - Each reviewer **must** write its output to
     `.agent/state/review-loop/iter-N/<reviewer>.json` matching the
     [Findings schema](#findings-schema) below.

3. **Consensus gate**
   - Parse all 3 JSON files.
   - **If** every reviewer's `status` is `"clean"` (0 P0 AND 0 P1):
     - Write the final report (see [Step 5](#5-loop--report)).
     - Exit `REVIEW_CLEAN` (0).
   - **Else** proceed to Step 4.

4. **Fixer pass** *(orchestrator, same session)*
   - Merge findings from all three JSON files. Dedupe by
     `(file, line, category)`; concatenate rationales on collision.
   - Severity disagreement: take the **max** (one P0 vote → P0).
   - Sort findings P0 → P1 (P2/P3 are not auto-fixed).
   - Apply fixes file by file using `Edit` / `Write`. Group fixes per file
     to minimize re-reads.
   - **Regression guard:** after each file's fixes land, re-run:
     - `python3 .agent/skills/lint-and-validate/scripts/lint_runner.py`
     - `python3 .agent/skills/vulnerability-scanner/scripts/security_scan.py`

     If either script flips from green (in baseline) to red:
     - `git restore <file>` to undo that file's fixes
     - Mark the offending finding with `regression-block: true`
     - Demote it to P2 in the next iteration's findings JSON
     - Continue with remaining fixes
   - **Stuck-finding detector:** if a finding `id` from iteration N-1
     reappears unchanged in iteration N, mark `stuck: true` and skip its
     auto-fix on iteration N+1; let the user resolve.
   - **Diff-growth guard:** if
     `git diff --shortstat <head_at_start>..HEAD` exceeds 500 lines
     changed, halt the loop, write the report, exit `REVIEW_CAPPED`.
   - Commit:
     ```
     git add <touched files>
     git commit -m "review-loop iter-N: fix X P0/P1 findings"
     ```

5. **Loop / report**
   - Increment `state.json.iteration`.
   - If `iteration ≤ max_iter` and no diff-growth halt, return to Step 2.
   - Otherwise write `.agent/state/review-loop/iter-N/report.md` containing:
     - Iteration table (iter # | security/frontend/debugger status |
       P0/P1/P2/P3 counts)
     - "Fixed in this loop" — bullet list of finding `id` + commit sha
     - "Remaining" — open P2/P3 findings
     - "Stuck" — findings flagged `stuck: true` or `regression-block: true`
     - `git diff --stat <head_at_start>..HEAD`
     - Links to per-iteration JSON files
   - Echo the report to stdout. Exit `REVIEW_CAPPED` (2). Working tree
     keeps the last successful iteration's commits intact; user decides
     whether to revert or open a PR.

## Findings schema

Each reviewer writes one JSON file. The orchestrator parses it; do not
return findings in prose.

```json
{
  "reviewer": "security-auditor",
  "iteration": 1,
  "status": "dirty",
  "summary": "3 findings: 1 P0, 2 P1",
  "findings": [
    {
      "id": "SEC-001",
      "severity": "P0",
      "category": "security",
      "file": "js/nav.js",
      "line": 25,
      "rationale": "endTrigger above trigger inverts ScrollTrigger progress",
      "fix_suggestion": "Swap trigger/endTrigger to match DOM source order"
    }
  ]
}
```

| Field | Required | Notes |
|---|---|---|
| `reviewer` | yes | `security-auditor` \| `frontend-specialist` \| `debugger` |
| `iteration` | yes | Matches `state.json.iteration` at the moment of writing |
| `status` | yes | `"clean"` iff `findings` has 0 P0 AND 0 P1; else `"dirty"` |
| `findings[].id` | yes | `<reviewer-prefix>-<seq>`, **stable** across iterations so the stuck-finding detector works |
| `findings[].severity` | yes | `P0` \| `P1` \| `P2` \| `P3`. Severity rubric mapping: 🔴 blocking → P0, 🟡 strong suggestion → P1, 🟡 minor → P2, 🟢 nit → P3 (see `code-review-checklist/SKILL.md`) |
| `findings[].category` | yes | `security` \| `correctness` \| `ux` \| `a11y` \| `perf` \| `style` |
| `findings[].file` + `line` | yes | Absolute path relative to repo root + 1-indexed line |
| `findings[].fix_suggestion` | yes | Concrete enough that the orchestrator can implement without re-reading the reviewer's prose |
| `findings[].regression-block` | no | `true` when the regression guard rolled back this fix |
| `findings[].stuck` | no | `true` when the same id appeared in a prior iteration |

## Reviewer roster

| Slot | Agent file | Why this agent |
|---|---|---|
| Bug hunter | `.agent/agents/debugger.md` | `clean-code` + `systematic-debugging` skills; writes across `client/src/**`, `server/**`, root-level JS — closest match to "code quality inspector" |
| UX / frontend | `.agent/agents/frontend-specialist.md` | `frontend-design` + `tailwind-patterns` + a11y skills; covers the "UX/UI lead" role |
| Security | `.agent/agents/security-auditor.md` | OWASP, XSS, injection, supply-chain; read-only by design so it cannot accidentally edit |

The roster is **fixed** across iterations. Dynamic agent selection per
iteration would invalidate the stuck-finding detector (different reviewer
→ different finding `id`s).

## Runaway protection

1. **Hard cap.** `max_iter` iterations (default 3, max 5).
2. **Diff-growth limit.** `git diff --shortstat <head_at_start>..HEAD` >
   500 lines changed → halt + escalate. Auto-fixes should not balloon a
   review.
3. **Stuck-finding detector.** Finding `id` reappears after orchestrator
   claimed fix → mark `stuck: true`, skip auto-fix on next pass.
4. **Regression guard.** Lint + security re-run after each file's fixes;
   failing fixes are reverted via `git restore <file>` and the finding is
   demoted to P2 with `regression-block: true`.
5. **Cap behavior.** Exit `REVIEW_CAPPED` (2). Working tree keeps the
   last successful iteration's commits; report lists remaining findings;
   user decides next step. **No auto-rollback.**

## Edge cases

- **Empty `git diff HEAD~1`** — fall back to full working tree
  (`git ls-files`). Print a warning so the user knows scope ballooned.
- **No prior commits on branch** — same fallback as above.
- **Context window pressure** — if the target list exceeds 20 files,
  partition by reviewer scope: security → JS/server, frontend →
  CSS/HTML/components, debugger → JS logic. Each reviewer only sees its
  partition.
- **Reviewer disagrees on severity** — take the max (one P0 vote → P0).
- **Reviewer's fix breaks a passing script** — regression guard reverts
  that single fix; loop continues with other fixes.

## Example output

```text
[review-loop] Baseline: HEAD=3a219ac, target=2 files (js/nav.js, css/team.css)
[review-loop] Baseline checks: lint=pass, security=pass
[review-loop] Iter 1: spawning 3 reviewers in parallel...
[review-loop] Iter 1 findings: security=clean, frontend=dirty(1 P1), debugger=dirty(1 P0)
[review-loop] Fixer: applying 1 P0 + 1 P1...
[review-loop] Iter 1 commit: 87fa3c2 review-loop iter-1: fix 2 P0/P1 findings
[review-loop] Iter 2: spawning 3 reviewers in parallel...
[review-loop] Iter 2 findings: security=clean, frontend=clean, debugger=clean
[review-loop] CONSENSUS REACHED. Exiting REVIEW_CLEAN.
[review-loop] Report: .agent/state/review-loop/iter-2/report.md
```

## See also

- `.agent/workflows/content-loop.md` — structural template for scored loops
- `.agent/workflows/orchestrate.md` — multi-agent coordination (no iteration)
- `.agent/skills/parallel-agents/SKILL.md` — Pattern 1 for parallel spawn
- `.agent/skills/code-review-checklist/SKILL.md` — severity rubric source
- `.agent/skills/lint-and-validate/scripts/lint_runner.py` — regression check
- `.agent/skills/vulnerability-scanner/scripts/security_scan.py` — regression check
