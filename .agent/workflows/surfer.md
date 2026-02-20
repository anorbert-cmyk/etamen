---
description: Activates the SurferSEO Optimizer skill to analyze SERPs or audit local content. Use this for data-driven SEO improvements.
---

# SurferSEO Workflow

This workflow activates the `surfer-seo-optimizer` skill. It routes your request to either analyzing the web (SERP) or auditing a file.

## Usage

- `/surfer analyze "keyword"` -> Generates a content brief based on top competitors.
- `/surfer audit path/to/file.md "keyword"` -> Scores your content against SEO benchmarks.
- `/surfer optimize "instructions"` -> Rewrites content to improve the score.

## Steps

1. **Load Skill:**
   - Review `@[surfer-seo-optimizer/SKILL.md]` guidelines.

2. **Intent Classification:**
   - **If "analyze":**
     - Use `search_web` to find top results for the keyword.
     - Summarize word counts and headers from these results.
     - Output a "Content Brief".
   - **If "audit":**
     - Run `python .agent/skills/surfer-seo-optimizer/scripts/score_content.py <file> <keyword>`
     - Display the Score and Stats.
     - Provide specific recommendations to improve the score (e.g., "Add 2 more H2s", "Mention 'X' keyword").
   - **If "optimize":**
     - Use `replace_file_content` or `rewrite` logic to inject keywords naturally as per the audit findings.

3. **Report:**
   - Always output results in a structured Markdown table or "Scorecard".
