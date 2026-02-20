---
name: surfer-seo-optimizer
description: Data-driven content optimization agent that reverse-engineers top ranking pages to provide actionable content guidelines, scoring, and keyword recommendations. (Modeled after SurferSEO)
version: 1.0.0
---

# SurferSEO Optimizer Skill

## 🧠 Core Philosophy

This skill treats content as data. It does not guess. It uses the "Reverse Engineering" method to determine what Google rewards for a specific keyword.
Instead of generic advice ("write good content"), it provides specific, quantifiable targets (e.g., "Hit 2,100 words", "Use 'startup costs' 3 times").

## ⚡ Capabilities

### 1. SERP Analysis (`analyze`)

**Goal:** Determine the "Perfect Content Structure" for a target keyword.
**Protocol:**

1. **Search:** Use `search_web` to find the top 5 ranking articles for the keyword.
2. **Extract:** For each article, determine:
    * Word Count (approximate)
    * Heading Structure (H2/H3 usage)
    * Key Topics/Entities covered
3. **Synthesize:** Create a "Content Brief" defining:
    * Target Word Count (Average of Top 5 + 10%)
    * Required Sections (H2s that appear in most competitors)
    * "NLP Keywords" (Terms that appear frequently across top pages)

### 2. Content Audit (`audit`)

**Goal:** Score a local MDX/MD file against the "Perfect Structure".
**Protocol:**

1. **Read:** Read the local file content.
2. **Measure:** Run `python .agent/skills/surfer-seo-optimizer/scripts/score_content.py` (or internal logic) to calculate:
    * Current Word Count
    * Keyword Density
    * Heading Count
3. **Grade:** Assign a score (0-100) based on closeness to targets.
    * *Green:* Within 10% of target.
    * *Yellow:* Within 25% of target.
    * *Red:* Missed target significantly.

### 3. NLP Optimization (`optimize`)

**Goal:** Rewrite content to improve the score without sacrificing readability.
**Protocol:**

1. Identify a paragraph or section that is "thin" or missing keywords.
2. Rewrite it to naturally include the missing terms.
3. **Constraint:** Do not "keyword stuff". Readability > SEO.

## 📝 Usage Example (Workflow)

```markdown
User: /surfer analyze "startup valuation methods"
Agent: [Searches Web] -> [Generates Brief: 2500 words, Keywords: 'DCF', 'Berkus Method'...]

User: /surfer audit content/startup-valuation.mdx "startup valuation methods"
Agent: [Reads File] -> [Runs Scoring] -> "Your Score: 62/100. You are missing 'Berkus Method'."

User: /surfer optimize "Add the section about Berkus Method"
Agent: [Writes Content] -> "Added section..."
```

## 📂 Resources

- `scripts/score_content.py`: CLI tool for text statistics.
