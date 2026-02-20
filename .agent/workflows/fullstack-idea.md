---
description: Complete idea-to-production pipeline with quality gates. Includes feasibility, multi-agent architecture, and automatic execution with testing, a11y, SEO, security, and world-class design standards.
---

# /fullstack-idea - Enterprise-Grade Idea Pipeline v2.0

## Purpose

One command from idea to production-ready project with:

- **Dynamic Skill Loading** per phase (see `.agent/skills-reference/SKILLS_LIST_60.md` for 60 curated skills)
- **Multi-Agent Orchestration** (3+ agents on critical phases)
- **Checkpoints** between every phase
- **Atomic Task Execution**

---

## Usage

```bash
/fullstack-idea "AI fitness coach app"
/fullstack-idea --quick "landing page for SaaS"
```

---

## 🔴 CRITICAL: Execution Rules

### 1. ONE PHASE AT A TIME

- Complete Phase N before starting Phase N+1
- Each phase has entry/exit criteria
- **NEVER** skip phases

### 2. SKILL LOADING IS MANDATORY

Before ANY work in a phase:

```
view_file [SKILL.md path]
```

Apply loaded rules to ALL tasks in that phase.

### 3. CHECKPOINTS ARE BLOCKING

After each phase, show user the output and ask:

```
"✅ Phase N complete. Review: [output file]
Proceed to Phase N+1? (Y/N)"
```

**DO NOT proceed without explicit Y**

### 4. ATOMIC TASKS IN task.md

Every task must be:

- Single action
- Verifiable
- Marked `[/]` when starting, `[x]` when done

---

## Phase 0: CODEBASE AWARENESS (Mandatory First Step)

**Purpose:** Understand the existing project before ANY changes.

### Actions

```bash
# 1. File structure
find . -type f -name "*.ts" -o -name "*.tsx" | head -50

# 2. Dependencies
cat package.json | jq '.dependencies, .devDependencies'

# 3. Known issues
grep -r "TODO\|FIXME\|BUG" --include="*.ts" --include="*.tsx" .

# 4. Architecture docs
cat ARCHITECTURE.md 2>/dev/null || echo "No architecture doc"
cat .agent/GEMINI.md 2>/dev/null
```

### Output

Mental model of:

- Tech stack
- File patterns
- Legacy code
- Known bugs

### Exit Criteria

- [ ] Can answer: "What framework is this?"
- [ ] Can answer: "What patterns are used?"
- [ ] Can answer: "What are known issues?"

---

## Phase 1: FEASIBILITY (Orchestrate: 3+ Agents)

**Purpose:** Determine if the idea is viable before investing time.

### Skill Loading (MANDATORY)

```
view_file ~/.gemini/skills/product/research-idea-validator/SKILL.md
view_file ~/.gemini/skills/security/appsec-engineer/SKILL.md
view_file ~/.gemini/skills/design/ux-researcher/SKILL.md
```

### Agents to Orchestrate

| Agent | Focus |
|-------|-------|
| Research Idea Validator | Market fit, TAM, competition |
| AppSec Engineer | Security feasibility |
| UX Researcher | User needs validation |

### Output

`docs/FEASIBILITY-{slug}.md`

- Problem statement
- Market analysis
- Risk matrix (Tech/Market/Execution)
- **Go/No-Go recommendation**

### ⏸️ CHECKPOINT

```
"✅ Feasibility analysis complete.
Verdict: [GO/CONDITIONAL/NO-GO]
Review: docs/FEASIBILITY-{slug}.md

Proceed to Architecture? (Y/N)"
```

---

## Phase 2: ARCHITECTURE (Orchestrate: 3+ Agents)

**Purpose:** Design the technical foundation.

### Skill Loading (MANDATORY)

```
view_file ~/.gemini/skills/engineering/backend-architect/SKILL.md
view_file ~/.gemini/skills/engineering/frontend-developer/SKILL.md
view_file ~/.gemini/skills/engineering/ai-engineer/SKILL.md  # if AI features
```

### Agents to Orchestrate

| Agent | Focus |
|-------|-------|
| Backend Architect | API design, DB schema, caching |
| Frontend Developer | Component architecture, state |
| AI Engineer | LLM integration (if applicable) |
| AppSec Engineer | Threat model, auth design |

### Output

`docs/ARCHITECTURE-{slug}.md`

- System diagram
- API endpoints
- Database schema
- Component tree
- Security considerations

### ⏸️ CHECKPOINT

```
"✅ Architecture designed.
Review: docs/ARCHITECTURE-{slug}.md

Proceed to Design System? (Y/N)"
```

---

## Phase 3: DESIGN SYSTEM (Skill Loading)

**Purpose:** Establish visual language and UX standards.

### Skill Loading (MANDATORY)

```
view_file ~/.gemini/skills/design/ui-designer/SKILL.md
view_file ~/.gemini/skills/design/design-system-guardian/SKILL.md
view_file ~/.gemini/skills/design/ux-qa-a11y-reviewer/SKILL.md
```

### Apply These Standards

#### Visual Design (Non-AI Aesthetic)

- NO generic purple/violet gradients
- NO stock template layouts
- YES custom typography (Inter, Outfit)
- YES micro-interactions
- YES generous whitespace

#### UX Copy Standards

| Element | Max Length |
|---------|------------|
| Headlines | 6-8 words |
| CTAs | 2-4 words |
| Paragraphs | 3-4 sentences |
| Error messages | 8-12 words |

#### Accessibility

- WCAG 2.2 AA
- 4.5:1 contrast ratio
- Keyboard navigable
- Screen reader friendly

### Output

- Design tokens (colors, spacing, typography)
- Component specifications
- Responsive breakpoints

### ⏸️ CHECKPOINT

```
"✅ Design system established.
Proceed to Task Generation? (Y/N)"
```

---

## Phase 4: TASK GENERATION (PRD Creator)

**Purpose:** Break down the project into atomic, executable tasks.

### Skill Loading (MANDATORY)

```
view_file .agent/skills/prd-creator/SKILL.md
```

### Task Requirements

Every task MUST be:

- **Single action** - One clear thing
- **Verifiable** - Has pass/fail check
- **Ordered** - Dependencies respected

### Output

`task.md` with 30-100 atomic tasks:

```markdown
## Phase 1: Foundation
- [ ] Create project structure
- [ ] Set up design tokens
- [ ] Configure database

## Phase 2: Core Features
- [ ] Implement [Feature 1]
  - Acceptance: [How to verify]
- [ ] Implement [Feature 2]

## Phase 3: Quality Gates
- [ ] Run a11y audit
- [ ] Run security scan
- [ ] Run performance test
```

### ⏸️ CHECKPOINT

```
"✅ Generated {N} tasks.
Review: task.md

Proceed to Execution? (Y/N)"
```

---

## Phase 5: EXECUTION (Ralph Loop with Per-Task Skill Loading)

**Purpose:** Implement all tasks with proper skill context.

### Execution Protocol

```
FOR each task in task.md:
    1. DETECT task domain (frontend/backend/security/etc.)
    2. LOAD relevant skill for that domain
    3. Mark task [/] in task.md
    4. IMPLEMENT the task
    5. VERIFY (run test, check browser, etc.)
    6. If PASS: Mark [x], commit
    7. If FAIL: Fix immediately, then [x]
```

### Domain → Skill Mapping

| Task Contains | Load Skill |
|---------------|------------|
| "component", "UI", "page" | frontend-developer |
| "API", "endpoint", "database" | backend-architect |
| "auth", "security", "token" | appsec-engineer |
| "test", "spec" | testing-patterns |
| "style", "CSS", "design" | ui-designer |
| "SEO", "meta" | seo-strategist |

### Momentum Rules

- DO NOT ask permission between tasks
- Self-correct on failures
- Commit after each successful task
- Only STOP for critical blockers

---

## Phase 6: QA GATES (Orchestrate: 4+ Agents)

**Purpose:** Verify the project meets all quality standards.

### Skill Loading (MANDATORY)

```
view_file ~/.gemini/skills/accessibility/a11y-auditor/SKILL.md
view_file ~/.gemini/skills/security/appsec-engineer/SKILL.md
view_file ~/.gemini/skills/testing/performance-benchmarker/SKILL.md
view_file ~/.gemini/skills/web-growth/seo-strategist/SKILL.md
```

### Agents to Orchestrate (MINIMUM 4)

| Agent | Standard | Acceptance |
|-------|----------|------------|
| A11y Auditor | WCAG 2.2 AA | 0 critical violations |
| AppSec Engineer | OWASP Top 10 | 0 high/critical vulns |
| Performance Benchmarker | Core Web Vitals | LCP<2.5s, INP<200ms, CLS<0.1 |
| SEO Strategist | Technical SEO | Lighthouse SEO >90 |

### Verification Commands

```bash
# Accessibility
npx @axe-core/cli http://localhost:3000

# Security
pnpm audit

# Performance
npx lighthouse http://localhost:3000 --output=json

# All tests
npm run test
```

### Output

`docs/QA-REPORT-{slug}.md`

- A11y results
- Security findings
- Performance scores
- SEO analysis
- Test coverage

### ⏸️ FINAL CHECKPOINT

```
"✅ QA complete.

Results:
🧪 Tests: {pass}/{total}
♿ A11y: {violations} violations
🔒 Security: {vulns} vulnerabilities
⚡ LCP: {score}s
🔍 SEO: {score}/100

Review: docs/QA-REPORT-{slug}.md

Project ready for deployment? (Y/N)"
```

---

## Quick Mode (`--quick`)

Skips:

- Phase 1 multi-agent (uses single feasibility check)
- Phase 2 multi-agent (uses existing architecture)
- Phase 6 multi-agent (runs basic checks only)

For: Landing pages, simple projects, prototypes.

---

## Summary: Phase Flow

```
/fullstack-idea "idea"
        │
        ▼
┌───────────────────┐
│ Phase 0: SCAN     │◄── Know the codebase
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Phase 1: FEASIBLE │◄── 3+ agents, Go/No-Go
└───────────────────┘
        │ CHECKPOINT
        ▼
┌───────────────────┐
│ Phase 2: ARCH     │◄── 3+ agents, design
└───────────────────┘
        │ CHECKPOINT
        ▼
┌───────────────────┐
│ Phase 3: DESIGN   │◄── Skill load, tokens
└───────────────────┘
        │ CHECKPOINT
        ▼
┌───────────────────┐
│ Phase 4: TASKS    │◄── PRD → atomic tasks
└───────────────────┘
        │ CHECKPOINT
        ▼
┌───────────────────┐
│ Phase 5: EXECUTE  │◄── Ralph loop
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Phase 6: QA       │◄── 4+ agents, verify
└───────────────────┘
        │ FINAL CHECKPOINT
        ▼
    🎉 DEPLOYED
```
