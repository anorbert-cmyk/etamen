---
description: Autonomous loop that audits content, fixes issues via AI agents, and re-verifies until quality score is 90+.
---

# Content Quality Loop

This workflow implements a "Self-Correcting" content pipeline.

## Usage

`/content-loop path/to/article.md "main keyword"`

> **Skills:** Load content skills from `.agent/skills-reference/SKILLS_LIST_60.md`
> Power combo: `content-strategy + seo-audit + copywriting + copy-editing + content-research-writer + programmatic-seo`

## Steps

1. **Initial Audit (Surfer)**
   - Run `python3 .agent/skills/surfer-seo-optimizer/scripts/score_content.py {{1}} "{{2}}"` and capture output.
   - Run `python3 scripts/check_surfer_score.py <output>` to check if score < 90.

2. **Decision Gate**
   - If `check_surfer_score.py` returns `SCORE_OK` (Exit Code 0):
     - Log "Content is already high quality (90+). No action needed."
     - Stop.

   - If `check_surfer_score.py` returns `SCORE_LOW` (Exit Code 1):
     - Log "Score is low. Initiating repair sequence..."
     - Proceed to Step 3.

3. **Diagnosis (Brainstorm)**
   - Pass the "Issues List" from Step 1 to `/brainstorm`.
   - Prompt: "Analyze these content gaps: [Issues]. Propose 3 editorial strategies to fix them without fluff. **Mandatory:** Include plan for 2-3 internal links, 2-3 High DA external links, and a 5-question FAQ section."
   - *Autonomous Selection:* Automatically pick the strategy that adds the most value (usually "Option A: Deep Dive Expansion").

4. **Execution (SEO Writer)**
   - Activate `/seo` (Writer Agent).
   - Prompt: "You are the Fixer. Implement the chosen strategy on {{1}}. Focus on [Issues].
     **Strict Requirements:**
     1. **UX layout:** Use short paragraphs (F-pattern), bullet points, and dark-themed tables for data.
     2. **Links:** Insert exactly 2-3 contextually relevant internal links to other blog posts AND 2-3 external links to High Domain Authority sites (e.g., Nielsen, HubSpot, TechCrunch).
     3. **FAQ:** Append a 'Frequently Asked Questions' section with 5 relevant questions/answers at the end.
     4. **Visuals:** Ensure high contrast and 'dark mode' aesthetic elements where applicable."
   - **Action:** The SEO agent reads the file, expands sections, adds keywords/links/FAQ, and saves the file.

5. **Polish (Humanizer)**
   - Activate `/seo` (Humanizer Agent).
   - Prompt: "Review the updated content in {{1}}. Smooth out any robotic phrasing. Verify that the 5-question FAQ is present and the table styling follows the 'dark background' requirement. Add rhetorical questions and vary sentence structure."
   - **Action:** Rewrite portions that flag as "AI-generated" while preserving SEO keywords and new structure.

6. **Verification Audit**
   - Run `python3 .agent/skills/surfer-seo-optimizer/scripts/score_content.py {{1}} "{{2}}"` again.
   - Report the new score.
   - If still < 90, warn user (prevent infinite loop vs recursive fix).

## Example Output

```text
[Loop] Auditing startup-risk.md... Score: 56.
[Loop] Issues: Word count low. Missing 'market fit'.
[Brainstorm] Strategy: Add 'Case Studies' section.
[SEO Agent] Writing new section... Done.
[Loop] Re-auditing... New Score: 92. SUCCESS.
```
