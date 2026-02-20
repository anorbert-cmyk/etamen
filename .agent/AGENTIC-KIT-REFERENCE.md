# Agentic Kit Reference - Master Knowledge Base

**Last Updated:** Jan 29, 2026  
**Source:** https://github.com/anorbert-cmyk/agentic-kit  
**Created by:** Norbert Barna  

---

## 🚀 Overview

This is an enterprise-grade AI Agent orchestration system for high-velocity software development. It transforms Claude Code into a multi-agent autonomous software factory.

### Core Capabilities

- **Automated Feasibility Analysis**: Validates ideas before coding
- **Multi-Agent Orchestration**: Coordinates 10+ specialized agents (Backend, Frontend, Security, QA, etc.)
- **Quality Gates**: OWASP Security, WCAG 2.2 Accessibility, Core Web Vitals, SEO standards
- **Atomic Task Execution**: The "Ralph Loop" for step-by-step autonomous implementation
- **Dynamic Skill Loading**: Context-aware skill injection per phase
- **Self-Correcting Content Pipeline**: Auto-auditing until quality standards met

---

## 📋 Complete Workflow Catalog

### Workflows (`.agent/workflows/`)

All commands follow the pattern: `/command-name`

#### Core Workflows

| Command | File | Purpose | Use When |
|---------|------|---------|----------|
| `/fullstack-idea` | fullstack-idea.md | Create new product from scratch (6-phase pipeline) | Building production-ready SaaS/app |
| `/fullstack-idea --quick` | fullstack-idea.md | Rapid prototyping mode | Need MVP in 1 hour |
| `/ralph-idea` | ralph-idea.md | Validate idea feasibility | Need Go/No-Go decision |
| `/ralph` | ralph.md | Execute task list (task.md) | Running existing task.md |
| `/orchestrate` | orchestrate.md | Plan complex changes (multi-perspective) | Large refactors or redesigns |
| `/enhance` | enhance.md | Add feature to existing app | Feature development |
| `/debug` | debug.md | Fix bug with root cause analysis | Debugging issues |
| `/brainstorm` | brainstorm.md | Explore options / ask questions | Ideation or option analysis |
| `/plan` | plan.md | Create detailed plans | Planning phase of work |
| `/test` | test.md | Run test suite | Quality verification |
| `/deploy` | deploy.md | Deploy to production | Production releases |
| `/content-loop` | content-loop.md | Auto-optimize content | SEO/marketing content improvement |

#### Advanced Workflows

| Command | File | Purpose |
|---------|------|---------|
| `/status` | status.md | Show current project state (from task.md) |
| `/preview` | preview.md | Preview changes before commit |
| `/seo` | seo.md | SEO optimization workflow |
| `/surfer` | surfer.md | Content optimization tool integration |
| `/ui-ux-pro-max` | ui-ux-pro-max.md | Professional UI/UX design workflow |

---

## 🛠️ Skill Categories

### Global Skills (`gemini-skills/` - installed to `~/.gemini/skills/`)

#### Foundational Domains
- **accessibility** - WCAG 2.2 AA compliance
- **design** - Design systems and UI/UX patterns
- **engineering** - Core software engineering principles
- **product** - Product thinking and strategy
- **security** - OWASP Top 10 and threat modeling
- **testing** - QA and testing methodologies
- **web-growth** - SEO, marketing, analytics

### 60 SkillsMP Skills Reference (`.agent/skills-reference/SKILLS_LIST_60.md`)

Curated collection of **60 essential agent skills** from [SkillsMP.com](https://skillsmp.com) for daily development, marketing, and design work. 7 categories: Frontend (10), Backend (8), Testing (8), Security/DevOps (8), Marketing/SEO (10), Productivity (8), Git/Automation (8). Sources: Anthropic Official, obra/superpowers, coreyhaines31/marketingskills, BehiSecc/awesome-claude-skills. Install via `~/.claude/skills/` or `.claude/skills/`.

### Project-Specific Skills (`.agent/skills/`)

#### Development Domains
- `api-patterns/` - REST, GraphQL, SDK patterns
- `app-builder/` - App scaffolding and setup
- `architecture/` - System design and architecture
- `bash-linux/` - Shell scripting (Linux)
- `behavioral-modes/` - Agent behavior patterns
- `brainstorming/` - Ideation techniques
- `database-design/` - Schema design and optimization
- `deployment-procedures/` - DevOps and release workflows
- `doc.md` - Documentation standards
- `docker-expert/` - Containerization
- `documentation-templates/` - Doc structure templates
- `feature-impact-analysis/` - Feature impact assessment
- `frontend-design/` - React, Vue, CSS patterns
- `game-development/` - Game engine patterns
- `geo-fundamentals/` - Geographic systems
- `infrastructure-as-code/` - Terraform, Ansible
- `javascript-expert/` - Advanced JS patterns
- `mcp-builder/` - MCP (Model Context Protocol) development
- `mobile-design/` - iOS/Android patterns
- `nestjs-expert/` - NestJS framework expertise
- `performance-profiling/` - Performance optimization
- `plan-writing/` - Strategic planning
- `powershell-windows/` - Windows scripting
- `prd-creator/` - Product Requirements Document
- `python-expert/` - Python development
- `react-patterns/` - React best practices
- `red-team-tactics/` - Security testing
- `seo-fundamentals/` - SEO implementation
- `seo-optimization-expert/` - Advanced SEO
- `sql-expert/` - SQL and database queries
- `tailwind-css-pro/` - Tailwind CSS mastery
- `testing-strategies/` - Test planning
- `typescript-expert/` - Advanced TypeScript
- `webapp-testing/` - Web app test patterns

---

## ⚡ Command Protocol

When user types `/command`:

1. **Locate**: Search `.agent/workflows/command.md`
2. **Read**: Read file completely
3. **Execute**: Follow steps exactly

---

## 🎯 Usage Scenarios

### Scenario 1: New Product Development
```bash
/fullstack-idea "AI-powered Gardening Assistant"
# → Feasibility analysis
# → Architecture design
# → task.md generation
# → Ralph Loop execution
# → QA verification
```

### Scenario 2: Feature Addition
```bash
/brainstorm "Best dashboard layout for B2B"
/enhance "Add user dashboard with charts"
/test
/deploy
```

### Scenario 3: Rapid Prototype
```bash
/fullstack-idea --quick "Landing page for Cat Cafe"
# → Deployed in ~1 hour
```

### Scenario 4: Bug Fixing
```bash
/debug "API returns 500 on user login"
# → Root cause analysis
# → Fix implementation
# → Test verification
```

### Scenario 5: Complex Planning
```bash
/orchestrate "Plan frontend migration from Vue to React"
# → Multi-perspective analysis
# → Detailed roadmap
```

---

## 🛡️ Quality Gates (Global Standards)

Every output must meet:

- **Security**: OWASP Top 10 compliance
- **Accessibility**: WCAG 2.2 AA minimum
- **Code Quality**: Production-ready, no filler comments
- **Performance**: Core Web Vitals standards
- **SEO**: Best practices for discoverability

---

## 📂 Installation

### 1. Global Setup (One-time)
```bash
mkdir -p ~/.gemini/skills
cp -r gemini-skills/* ~/.gemini/skills/
```

### 2. Project Setup
```bash
# Already done if .agent/ exists in project
# Otherwise: copy .agent/ and scripts/ directories
```

### 3. Verify
```bash
/status
```

---

## 🤖 Key Concepts

### The Ralph Loop
Atomic task execution with iterative refinement:
1. Read task
2. Execute step
3. Verify completion
4. Repeat until done

### Task.md Format
Standard structure for task lists:
```markdown
# Tasks

## Phase 1: Planning
- [ ] Task 1
- [ ] Task 2

## Phase 2: Implementation
- [ ] Task 3
- [ ] Task 4
```

### Content Loop
Self-correcting pipeline for content:
1. Generate initial draft
2. Audit against quality standards
3. Identify gaps
4. Regenerate until passing QA

---

## 🔑 Key Rules

1. **Follow workflows exactly** - No deviation from .md instructions
2. **Dynamic skill loading** - Only load skills needed per phase
3. **Atomic execution** - Complete tasks one at a time
4. **Quality gates mandatory** - Security, accessibility, performance
5. **Production-ready code** - No shortcuts or tech debt
6. **Clear documentation** - Every component documented

---

## 📞 When to Use Each Command

| Need | Command |
|------|---------|
| Start new project | `/fullstack-idea` |
| Quick MVP | `/fullstack-idea --quick` |
| Check feasibility | `/ralph-idea` |
| Run tasks | `/ralph` |
| Plan changes | `/orchestrate` |
| Add feature | `/enhance` |
| Debug issue | `/debug` |
| Brainstorm | `/brainstorm` |
| Run tests | `/test` |
| Deploy | `/deploy` |
| Improve content | `/content-loop` |
| Show status | `/status` |

---

## 🎓 Master Principles

1. **Autonomous** - Agents work independently with minimal supervision
2. **Multi-perspective** - Problems analyzed from multiple angles
3. **Quality-first** - Standards enforced at every step
4. **Task-driven** - Clear task.md defines work
5. **Skill-augmented** - Context-specific knowledge injected dynamically
6. **Self-correcting** - Loops verify and improve until standards met

---

## 📚 Additional Resources

- **60 SkillsMP Skills Reference**: `.agent/skills-reference/SKILLS_LIST_60.md` - 60 curated agent skills with installation guides and power combos
- **Content Loop Guide**: `docs/content-loop.md`
- **Conventions**: `gemini-skills/_conventions.md`
- **Scripts**: `scripts/` directory for automation

---

**Built with ❤️ by Norbert Barna**  
**Available at:** https://github.com/anorbert-cmyk/agentic-kit
