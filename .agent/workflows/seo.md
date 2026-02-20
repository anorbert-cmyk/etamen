---
description: Generate SEO-optimized blog articles using the 6-agent content pipeline. Produces rankable, humanized content.
---

# /seo - 6-Agent SEO Content Pipeline

You are now in **SEO CONTENT MODE**. Your task: generate a high-quality, rankable blog article using the 6-agent pipeline.

## Task

$ARGUMENTS

---

## Pipeline Overview

```text
Research → Writer → Fact-Check → E-E-A-T → Humanizer → SEO Polish
```

Each agent has a specific role:

1. **Research Agent** - Competitor analysis, scientific sources, community insights
2. **Writer Agent** - Drafts article following brand voice
3. **Fact-Check Agent** - Verifies claims, flags unsupported statements
4. **E-E-A-T Agent** - Adds experience/expertise/authority/trust signals
5. **Humanizer Agent** - Breaks AI patterns, adds authentic human voice
6. **SEO Agent** - Meta descriptions, keyword optimization, final polish

---

## Configuration Files

| File | Purpose |
| ---- | ------- |
| `seo-content-engine/config.md` | Brand voice, approved stats, differentiators |
| `seo-content-engine/content-status.md` | Article queue and link map |
| `seo-content-engine/agents/*.md` | Individual agent prompts |

---

## Execution Protocol

### Step 1: Check Queue

Read `seo-content-engine/content-status.md` to find the next queued article.

If no specific article requested, pick the first `queued` item.

### Step 2: Load Configuration

Read `seo-content-engine/config.md` to understand:

- Brand voice and tone
- Approved statistics
- Key differentiators
- Phrases to use and avoid

### Step 3: Execute 6-Agent Pipeline (Sequential)

**🔴 CRITICAL: Run agents IN ORDER. Each agent builds on previous output.**

#### Agent 1: Research

Read: `seo-content-engine/agents/research-agent.md`

- Web search for competitor articles (top 5 ranking)
- Find scientific/academic sources
- Gather community insights (Reddit, forums)
- Create recommended outline

#### Agent 2: Writer

Read: `seo-content-engine/agents/writer-agent.md`

- Write full article using research
- Follow brand voice from config.md
- Include 2-3 natural product mentions
- Target word count based on content type

#### Agent 3: Fact-Check

Read: `seo-content-engine/agents/fact-check-agent.md`

- Verify every factual claim
- Flag unsupported statements
- Check scientific citations
- Ensure stats are from approved list

#### Agent 4: E-E-A-T Enhancement

Read: `seo-content-engine/agents/eeat-agent.md`

- Add experience signals (user data)
- Include expert references
- Add trust signals and disclaimers
- Strengthen authority markers

#### Agent 5: Humanizer

Read: `seo-content-engine/agents/humanizer-agent.md`

- Break AI patterns (rule of three, parallel structure)
- Add sentence fragments, rhetorical questions
- Vary paragraph lengths
- Make it sound like a real person wrote it

#### Agent 6: SEO Polish

Read: `seo-content-engine/agents/seo-agent.md`

- Optimize meta description (150-160 chars)
- Check keyword density (1-2%)
- Verify keyword placement (title, intro, H2, conclusion)
- Add proper frontmatter

### Step 4: Save Draft

Save the finished article to `seo-content-engine/drafts/[slug].mdx`

### Step 5: Update Status

Update `seo-content-engine/content-status.md`:

- Change article status from `queued` to `drafted`
- Add date

---

## Output Format

The final article MUST include this frontmatter:

```yaml
---
title: "Article Title Here"
description: "Meta description 150-160 characters with primary keyword."
date: "YYYY-MM-DD"
author: "Valid8 Editorial Team"
category: "category-slug"
primaryKeyword: "primary keyword here"
---
```

---

## Quality Checklist

Before completing, verify:

- [ ] Frontmatter complete with all required fields
- [ ] Meta description is 150-160 characters
- [ ] Primary keyword in: title, first 100 words, one H2, conclusion
- [ ] 2-3 internal links to existing articles
- [ ] 2-3 natural product mentions (not salesy)
- [ ] No AI patterns (rule of three, "Furthermore", "In conclusion")
- [ ] Reads naturally when spoken aloud
- [ ] Saved to `seo-content-engine/drafts/`

---

## Commands

| Command | Action |
| ------- | ------ |
| `/seo` | Generate next queued article |
| `/seo [topic]` | Generate article on specific topic |
| `/seo status` | Show queue status |

---

## Example Usage

```bash
/seo
→ Picks next queued article from content-status.md

/seo How to calculate TAM SAM SOM for SaaS
→ Generates article on specified topic

/seo status
→ Shows published vs queued articles
```

---

## 📚 Skills Reference

> Load SEO and content skills from `.agent/skills-reference/SKILLS_LIST_60.md`
> Power combo: `content-strategy + seo-audit + copywriting + copy-editing + content-research-writer + programmatic-seo + schema-markup`

---

**Begin SEO content generation now. Execute all 6 agents sequentially, save draft, update status.**
