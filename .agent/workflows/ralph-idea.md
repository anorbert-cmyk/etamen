---
description: Ralph Ideation mode with Antigravity skill analysis. Scans available skills for feasibility study.
---

# /ralph-idea - Ideation with Skill-Based Feasibility

## Purpose

Analyze an idea's feasibility by scanning **all available Antigravity skills** and determining which ones apply to validate, research, and implement the concept.

---

## Task

### Phase 1: Idea Capture

```text
Mi az ötleted? (1-2 mondat)
Példa: "AI-powered competitor analysis tool for startups"
```

### Phase 2: Skill Discovery

**Scan all skills** to find relevant capabilities:

```bash
# Antigravity Global Skills
~/.gemini/skills/

# Project-Specific Skills
.agent/skills/

# 60 Curated SkillsMP Skills Reference
.agent/skills-reference/SKILLS_LIST_60.md
```

**Categorize skills by relevance:**

| Category | Skills to Check |
| -------- | --------------- |
| **Research** | UX Researcher, SEO Strategist, Research Idea Validator |
| **Security** | AppSec Engineer, AI Security Engineer, WSTG Test Planner |
| **Design** | UI Designer, Design System Guardian, Brand Guardian |
| **Engineering** | Frontend Developer, Backend Architect, AI Engineer |
| **Testing** | Performance Benchmarker, A11y Auditor |

### Phase 3: Feasibility Analysis

For each relevant skill, answer:

1. **Applicable?** (Yes/No/Partial)
2. **Risk Level** (Low/Medium/High)
3. **Effort Estimate** (Hours/Days/Weeks)
4. **Blocking Dependencies?**

**Output Format:**

```markdown
## Feasibility Report: [Idea Name]

### Skill Analysis

| Skill | Applicable | Risk | Effort | Notes |
|-------|------------|------|--------|-------|
| Frontend Developer | ✅ | Low | 2 days | React SPA |
| AI Engineer | ✅ | Medium | 1 week | LLM integration |
| Backend Architect | ✅ | Low | 3 days | API + DB |
| AppSec Engineer | ⚠️ | Medium | 1 day | Auth review |

### Go/No-Go Recommendation

**Verdict:** 🟢 GO / 🟡 CONDITIONAL / 🔴 NO-GO

**Reasoning:** [Az analízis alapján...]

### Suggested Task Breakdown

Based on skill analysis, here are the recommended phases:
1. [Phase 1 tasks]
2. [Phase 2 tasks]
...
```

### Phase 4: Decision Point

```text
Feasibility analysis complete.

Options:
1. Start Ralph Loop with generated tasks (/ralph)
2. Generate full PRD (/ideate)
3. Deep dive on specific skill
4. Abort
```

---

## Skill Mapping

The workflow automatically maps idea keywords to skills:

| Keyword | Skills to Load |
| ------- | -------------- |
| "AI", "LLM", "GPT" | AI Engineer, AI Security Engineer |
| "web", "app", "dashboard" | Frontend Developer, UI Designer |
| "API", "backend", "database" | Backend Architect, Database Design |
| "mobile", "iOS", "Android" | Mobile Developer, Mobile Design |
| "security", "auth" | AppSec Engineer, WSTG Test Planner |
| "SEO", "content", "marketing" | SEO Strategist, GEO Fundamentals |
| "performance", "speed" | Performance Optimizer, Benchmarker |

---

## Usage

```bash
/ralph-idea                       # Interactive mode
/ralph-idea "AI fitness coach"    # Direct mode
```

---

## Output

| Deliverable | Location |
| ----------- | -------- |
| Feasibility Report | `docs/FEASIBILITY-{slug}.md` |
| Skill Matrix | Inline in report |
| Task Suggestions | Ready for `/ralph` |
