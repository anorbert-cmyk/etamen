# Agentic Kit - Workflow Decision Paths

Visual guide to choosing the right command for your situation.

---

## 🎯 Path 1: Building Something New

```
START: "I want to build something new"
  ├─ "Need it production-ready"
  │  └─→ /fullstack-idea "description"
  │     ├─ Feasibility analysis
  │     ├─ Architecture design
  │     ├─ Code generation
  │     ├─ QA checks
  │     └─ Ready to deploy
  │
  ├─ "Need fast prototype (1 hour)"
  │  └─→ /fullstack-idea --quick "description"
  │     └─ Minimal viable product
  │
  └─ "Want to validate first"
     └─→ /ralph-idea "description"
        ├─ Feasibility check
        └─ Go/No-Go decision
```

---

## 🔧 Path 2: Working on Existing Project

```
START: "I have existing codebase"
  │
  ├─ "Adding new feature"
  │  └─→ /enhance "feature description"
  │     ├─ Plan → Design → Code
  │     ├─ Tests → Verification
  │     └─ Ready for PR
  │
  ├─ "Found a bug"
  │  └─→ /debug "problem description"
  │     ├─ Root cause analysis
  │     ├─ Fix implementation
  │     ├─ Regression testing
  │     └─ Resolved
  │
  ├─ "Big refactor/redesign"
  │  └─→ /orchestrate "change description"
  │     ├─ Multi-perspective analysis
  │     ├─ Detailed plan
  │     ├─ Phase-by-phase execution
  │     └─ Validation
  │
  ├─ "Need to verify quality"
  │  └─→ /test
  │     ├─ Unit tests
  │     ├─ Integration tests
  │     ├─ E2E tests
  │     └─ Coverage report
  │
  └─ "Ready to ship"
     └─→ /deploy
        ├─ Pre-deployment checks
        ├─ Deployment
        ├─ Smoke tests
        └─ Production verified
```

---

## 💡 Path 3: Need Guidance

```
START: "I need help deciding"
  │
  ├─ "Exploring ideas/options"
  │  └─→ /brainstorm "topic or question"
  │     ├─ Multi-angle analysis
  │     ├─ Options generation
  │     └─ Recommendation
  │
  ├─ "Planning something complex"
  │  └─→ /plan "what to plan"
  │     ├─ Strategic breakdown
  │     ├─ Phased approach
  │     └─ Implementation roadmap
  │
  ├─ "Checking project status"
  │  └─→ /status
  │     ├─ Current state from task.md
  │     ├─ Progress summary
  │     └─ Next steps
  │
  └─ "Content needs optimization"
     └─→ /content-loop "file.md" "keyword"
        ├─ Content analysis
        ├─ SEO optimization
        ├─ Quality improvement
        └─ Auto-iteration until pass QA
```

---

## ⚙️ Advanced Paths

### Content & SEO
```
/seo "page or topic"
├─ Technical SEO audit
├─ Content optimization
├─ Meta tags improvement
└─ Structure optimization

/content-loop "file.md" "target keyword"
├─ Automated content improvement
├─ Quality scoring
└─ Iterative refinement
```

### UI/UX Design
```
/ui-ux-pro-max "design requirement"
├─ Design system creation
├─ Component library
├─ Accessibility compliance
└─ Design documentation
```

### SEO-Specific Content
```
/surfer "topic or keyword"
├─ Content research
├─ Competitor analysis
├─ Outline generation
└─ Optimized content draft
```

---

## 🔄 Common Multi-Step Workflows

### Full Feature Development
```
1. /brainstorm "Feature idea"
   ↓
2. /enhance "Feature description"
   ↓
3. /test
   ↓
4. /deploy
```

### Major Refactoring
```
1. /orchestrate "Refactoring plan"
   ↓
2. /ralph (execute from task.md)
   ↓
3. /test
   ↓
4. /deploy
```

### Content Publishing
```
1. /brainstorm "Content topic"
   ↓
2. /content-loop "draft.md" "target keyword"
   ↓
3. /seo "published page"
   ↓
4. /surfer "optimization"
```

### New Project Launch
```
1. /ralph-idea "Product idea"
   ↓
2. /fullstack-idea "Full description"
   ↓
3. /test
   ↓
4. /deploy
   ↓
5. /seo "marketing content"
```

---

## 🎓 Decision Tree: Quick Lookup

**Q: Am I building something new?**
- Yes → Use `/fullstack-idea` or `/fullstack-idea --quick`
- No → Go to next Q

**Q: Am I fixing existing code?**
- Bug fix → Use `/debug`
- Feature → Use `/enhance`
- Big refactor → Use `/orchestrate`

**Q: Do I need guidance?**
- Brainstorm → Use `/brainstorm`
- Plan → Use `/plan`
- Status → Use `/status`

**Q: Is code ready?**
- Need tests → Use `/test`
- Ready to ship → Use `/deploy`

**Q: Is content involved?**
- General optimization → Use `/content-loop`
- SEO focus → Use `/seo` or `/surfer`
- Design focus → Use `/ui-ux-pro-max`

---

## 🧠 Skills Reference

Before starting any workflow, consider loading relevant skills from the curated collection:

> **See:** `.agent/skills-reference/SKILLS_LIST_60.md` - 60 curated agent skills for programming, marketing, and design

| Workflow Type | Recommended Skill Combos |
|---------------|-------------------------|
| Feature Development | brainstorming + writing-plans + test-driven-development + frontend-design + nodejs-best-practices |
| Security Work | owasp-security + defense-in-depth + trail-of-bits-security + code-review-excellence |
| Content & SEO | content-strategy + seo-audit + copywriting + copy-editing + programmatic-seo |
| Marketing Optimization | page-cro + analytics-tracking + ab-test-setup + email-sequence |
| Design System | frontend-design + theme-factory + brand-guidelines + accessibility-checker |

---

## ✅ Command Execution Checklist

Before running any command:

- [ ] I know what I want to accomplish
- [ ] The command matches my goal (from paths above)
- [ ] I have enough context ready
- [ ] I understand the output will be used for
- [ ] I've checked `.agent/skills-reference/SKILLS_LIST_60.md` for relevant skills

After command execution:

- [ ] Review generated output
- [ ] Verify quality standards met
- [ ] Plan next steps
- [ ] Update task.md if needed

---

## 🔗 Command Chain Examples

### Scenario: Add Dashboard to SaaS
```bash
/enhance "User dashboard with analytics"
/test
/preview  # Optional: see what changed
/deploy
```

### Scenario: Migrate Frontend Framework
```bash
/orchestrate "Migrate from Vue to React"
/ralph      # Execute tasks from task.md
/test
/deploy
```

### Scenario: Launch Landing Page
```bash
/fullstack-idea --quick "SaaS landing page"
/seo "landing page"
/content-loop "copy.md" "main keyword"
/deploy
```

### Scenario: Fix Critical Bug
```bash
/debug "Users can't log in with email"
/test
/deploy
```

---

## 📍 You Are Here

When starting work:

1. **Review** this file to find your path
2. **Execute** the recommended command
3. **Follow** the workflow steps
4. **Verify** quality gates pass
5. **Deploy** when ready

---

**All paths lead to production-ready code.** ✅

