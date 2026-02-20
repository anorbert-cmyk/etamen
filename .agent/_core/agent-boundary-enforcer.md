# Agent Boundary Enforcement Protocol

> **CRITICAL RULE**: Before writing or editing ANY file, you MUST verify it falls within your allowed domain.

---

## Pre-Write Checklist

Before you use the Write or Edit tool on ANY file:

1. Check your `file_patterns_allowed` in your agent frontmatter
2. Check your `file_patterns_forbidden` in your agent frontmatter
3. If the file matches a **FORBIDDEN** pattern → **STOP** and report to orchestrator
4. If the file does **NOT** match any **ALLOWED** pattern → **STOP** and report to orchestrator
5. Only proceed if the file explicitly matches an ALLOWED pattern

---

## File Ownership Matrix

| File Location | Owner Agent | All Others |
|---------------|-------------|------------|
| `client/src/components/**` | frontend-specialist | BLOCKED |
| `client/src/pages/**` | frontend-specialist | BLOCKED |
| `client/src/hooks/**` | frontend-specialist | BLOCKED |
| `client/src/contexts/**` | frontend-specialist | BLOCKED |
| `client/src/features/**` | frontend-specialist | BLOCKED |
| `client/src/lib/**` | frontend-specialist | BLOCKED |
| `client/src/styles/**` | frontend-specialist | BLOCKED |
| `client/src/App.tsx` | frontend-specialist | BLOCKED |
| `client/src/main.tsx` | frontend-specialist | BLOCKED |
| `server/routers/**` | backend-specialist | BLOCKED |
| `server/services/**` | backend-specialist | BLOCKED |
| `server/_core/**` | backend-specialist | BLOCKED |
| `server/auth/**` | backend-specialist | BLOCKED |
| `server/middleware/**` | backend-specialist | BLOCKED |
| `server/webhooks.ts` | backend-specialist | BLOCKED |
| `shared/**` | backend-specialist | BLOCKED |
| `scripts/**` | backend-specialist | BLOCKED |
| `drizzle/**` | database-architect | BLOCKED |
| `drizzle.config.ts` | database-architect | BLOCKED |
| `**/*.test.{ts,tsx,js}` | test-engineer | BLOCKED |
| `**/__tests__/**` | test-engineer | BLOCKED |
| `**/test/**` | test-engineer | BLOCKED |
| `.github/**` | devops-engineer | BLOCKED |
| `render.yaml` | devops-engineer | BLOCKED |
| `Dockerfile*` | devops-engineer | BLOCKED |
| `prompts/**` | ai-engineer | BLOCKED |
| `docs/**` | documentation-writer | BLOCKED |

---

## Shared Files (Multiple Owners)

These files may be modified by more than one agent, but coordination is required:

| File | Allowed Agents | Coordination |
|------|---------------|--------------|
| `shared/types.ts` | backend-specialist, frontend-specialist | Notify both when changing |
| `shared/pricing.ts` | backend-specialist | Only backend |
| `package.json` | devops-engineer, backend-specialist | Notify both |
| `tsconfig.json` | devops-engineer | Only devops |
| `vite.config.ts` | devops-engineer, frontend-specialist | Notify both |

---

## Read-Only Agents

These agents may ONLY read files, never write:

| Agent | Purpose |
|-------|---------|
| `explorer-agent` | Codebase discovery and analysis |
| `security-auditor` | Security audit and review |
| `penetration-tester` | Vulnerability assessment |

---

## Violation Protocol

If you are about to write a file outside your domain:

1. **STOP** immediately - do not write the file
2. **REPORT**: State "[BOUNDARY] I need to modify `{file}` but it belongs to `{correct-agent}`"
3. **DESCRIBE** the change needed so the orchestrator can route it
4. **WAIT** for the orchestrator to assign the correct agent

**NEVER** bypass this check. **NEVER** write files outside your domain "just this once."

---

## Orchestrator Responsibility

The orchestrator MUST perform a boundary check before invoking any agent:

```
BOUNDARY CHECK for [agent-name]:
  Task: [what the agent will do]
  Files to modify:
    - path/to/file.ts → ALLOWED (matches pattern)
    - path/to/other.ts → FORBIDDEN (belongs to other-agent)
  Result: PROCEED / SPLIT NEEDED / RE-ROUTE
```

If a task requires files from multiple domains, the orchestrator MUST split it across the correct agents.
