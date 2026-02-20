---
name: seo-audit
description: Full website SEO audit that crawls up to 500 pages, delegates to 6 specialist subagents, generates a health score 0-100, and produces a prioritized action plan with industry-specific recommendations.
---

# SEO Audit Skill

## Purpose

Perform a comprehensive, full-site SEO audit that evaluates every dimension of search performance. This skill orchestrates 6 specialist subagents to analyze technical infrastructure, content quality, schema markup, sitemap health, performance metrics, and visual/image optimization. The output is a single health score (0-100) and a prioritized action plan sorted by impact.

---

## Scoring Model

### Category Weights

| Category | Weight | Subagent | Focus |
|----------|--------|----------|-------|
| Technical SEO | 25% | `seo-technical` | Crawlability, indexability, security headers, Core Web Vitals, AI crawler management |
| Content Quality | 25% | `seo-content` | E-E-A-T signals, readability, keyword optimization, AI citation readiness |
| On-Page SEO | 20% | `seo-page` | Title tags, meta descriptions, H1s, URL structure, internal linking |
| Schema Markup | 10% | `seo-schema` | Structured data coverage, validation, type accuracy |
| Performance | 10% | `seo-performance` | Core Web Vitals (LCP, INP, CLS), TTFB, resource optimization |
| Images & Visual | 5% | `seo-visual` | Alt text, file sizes, formats, responsive images, lazy loading |
| AI Search Readiness | 5% | `seo-content` | GEO signals, AI Overview optimization, citation structure |

### Score Interpretation

| Score Range | Rating | Meaning |
|-------------|--------|---------|
| 90-100 | Excellent | Industry-leading SEO; maintain and iterate |
| 75-89 | Good | Strong foundation with optimization opportunities |
| 50-74 | Needs Work | Significant gaps impacting rankings |
| 25-49 | Poor | Fundamental issues blocking organic growth |
| 0-24 | Critical | Severe problems requiring immediate intervention |

---

## Industry Detection

Before starting the audit, detect the site's industry to apply context-specific scoring adjustments and recommendations.

### Supported Industries

| Industry | Detection Signals | Scoring Adjustments |
|----------|-------------------|---------------------|
| **SaaS** | Pricing page, signup/login flows, app subdomain, API docs | Weight schema for SoftwareApplication; prioritize conversion path SEO |
| **Local Business** | NAP data, Google Maps embed, service area pages, location schema | Weight LocalBusiness schema heavily; check Google Business Profile alignment |
| **E-commerce** | Product pages, cart, checkout, product schema, price elements | Weight Product/Offer schema; check faceted navigation, pagination |
| **Publisher** | High article count, author pages, date stamps, Article schema | Weight content freshness and E-E-A-T author signals; check pagination |
| **Agency** | Portfolio/case studies, service pages, team/about, testimonials | Weight service page optimization; check local SEO if applicable |

### Detection Protocol

1. Crawl homepage and top 10 pages by internal link count
2. Scan for industry-specific patterns (schema types, page templates, URL patterns)
3. Classify into primary industry
4. Apply industry-specific scoring multipliers and recommendation templates

---

## Crawl Protocol

### Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Max Pages | 500 | Sufficient for most sites; prevents runaway crawls |
| Concurrency | 5 | Respectful of server resources |
| Delay Between Requests | 1 second | Prevents rate limiting and server strain |
| Respect robots.txt | Yes (mandatory) | Always honor crawl directives |
| User-Agent | `AntigravitySEOBot/1.0` | Identifiable, non-deceptive |
| Timeout Per Page | 30 seconds | Skip unresponsive pages |
| Follow Redirects | Yes (max 5 hops) | Track redirect chains |
| Parse JavaScript | Optional | Note JS-dependent content for manual review |

### Crawl Phases

```
Phase 1: Seed Discovery
  Fetch robots.txt and sitemap.xml
  Extract seed URLs from sitemap
  Add homepage as primary seed
       |
Phase 2: Breadth-First Crawl
  Crawl seeds first, then discovered internal links
  Track: status codes, redirects, canonical tags, meta robots
  Record: response times, content types, content hashes
       |
Phase 3: Data Collection Per Page
  - HTTP status code
  - Response time (ms)
  - Title tag (content + length)
  - Meta description (content + length)
  - H1 tag(s) (count + content)
  - Canonical URL
  - Meta robots directives
  - hreflang tags
  - Schema markup (types + validation)
  - Image count, alt text coverage, file sizes
  - Internal links (count + anchor text)
  - External links (count + nofollow status)
  - Word count
  - Content hash (duplicate detection)
       |
Phase 4: Aggregate Analysis
  Pass collected data to 6 specialist subagents
  Each subagent scores its category independently
  Compute weighted overall score
```

### Crawl Limits and Safety

- Stop at 500 pages regardless of discovered URLs
- Skip non-HTML resources (PDFs, images, videos) unless analyzing image SEO
- Skip external domains entirely
- Log but do not follow `nofollow` links
- Detect and break infinite crawl loops (parameter-based URL variations)
- Respect `Crawl-delay` directive in robots.txt if present

---

## Subagent Delegation

### Delegation Flow

```
                    +-------------------+
                    |   SEO Audit Lead  |
                    | (This Skill)      |
                    +-------------------+
                             |
          +------------------+------------------+
          |         |        |       |          |          |
    +-----------+ +------+ +------+ +--------+ +------+ +------+
    | seo-      | | seo- | | seo- | | seo-   | | seo- | | seo- |
    | technical | | cont | | sche | | sitemap| | perf | | visu |
    +-----------+ +------+ +------+ +--------+ +------+ +------+
```

### Subagent Responsibilities

| Subagent | Input | Output |
|----------|-------|--------|
| `seo-technical` | Full crawl data, robots.txt, server headers | Technical score (0-100), issues list |
| `seo-content` | Page content, word counts, readability metrics | Content score (0-100), E-E-A-T assessment |
| `seo-schema` | Extracted JSON-LD/microdata per page | Schema score (0-100), missing types, validation errors |
| `seo-sitemap` | sitemap.xml contents, crawled URL list | Sitemap health report, orphan pages, missing URLs |
| `seo-performance` | Response times, resource sizes, CWV data | Performance score (0-100), bottleneck identification |
| `seo-visual` | Image inventory (URLs, sizes, formats, alt text) | Image optimization score (0-100), fix list |

### Subagent Invocation Template

```
You are the [SUBAGENT ROLE] specialist for the SEO Audit skill.

Site: [URL]
Industry: [DETECTED INDUSTRY]
Crawl Data: [RELEVANT SUBSET OF CRAWL DATA]

Your task:
1. Analyze all provided data from your domain expertise
2. Score 0-100 with clear justification
3. List every issue found, categorized by severity
4. Provide specific, actionable fixes for each issue
5. Note any items requiring manual verification

Output format:
- Score: XX/100
- Critical Issues: [list]
- High Priority Issues: [list]
- Medium Priority Issues: [list]
- Low Priority Issues: [list]
- Recommendations: [prioritized list with estimated impact]
```

---

## Output Artifacts

### 1. FULL-AUDIT-REPORT.md

Complete audit report containing:

```markdown
# SEO Audit Report: [Domain]
**Date:** [YYYY-MM-DD]
**Pages Crawled:** [N]
**Industry:** [Detected Industry]
**Overall Score:** [XX/100] ([Rating])

## Executive Summary
[3-5 sentence overview of site health and top priorities]

## Score Breakdown
| Category | Score | Weight | Weighted Score |
|----------|-------|--------|----------------|
| Technical SEO | XX/100 | 25% | XX |
| Content Quality | XX/100 | 25% | XX |
| On-Page SEO | XX/100 | 20% | XX |
| Schema Markup | XX/100 | 10% | XX |
| Performance | XX/100 | 10% | XX |
| Images & Visual | XX/100 | 5% | XX |
| AI Search Readiness | XX/100 | 5% | XX |
| **Overall** | | | **XX/100** |

## Technical SEO
[Full seo-technical subagent report]

## Content Quality
[Full seo-content subagent report]

## On-Page SEO
[Full seo-page analysis]

## Schema Markup
[Full seo-schema subagent report]

## Performance
[Full seo-performance subagent report]

## Images & Visual
[Full seo-visual subagent report]

## AI Search Readiness
[GEO signals and AI citation assessment]

## Crawl Summary
- Total URLs discovered: [N]
- Pages crawled: [N]
- 200 responses: [N]
- 301/302 redirects: [N]
- 404 errors: [N]
- 5xx errors: [N]
- Blocked by robots.txt: [N]
- Average response time: [N]ms
```

### 2. ACTION-PLAN.md

Prioritized action plan sorted by impact:

```markdown
# SEO Action Plan: [Domain]
**Generated:** [YYYY-MM-DD]
**Current Score:** [XX/100]
**Target Score:** [XX/100] (after completing Critical + High items)

## Critical Priority (Fix Immediately)
Impact: Blocking indexing or causing significant ranking loss

- [ ] [Issue description] — [Specific fix] — [Estimated impact: +X points]
- [ ] ...

## High Priority (Fix Within 1 Week)
Impact: Directly affecting rankings or user experience

- [ ] [Issue description] — [Specific fix] — [Estimated impact: +X points]
- [ ] ...

## Medium Priority (Fix Within 1 Month)
Impact: Optimization opportunities for incremental gains

- [ ] [Issue description] — [Specific fix] — [Estimated impact: +X points]
- [ ] ...

## Low Priority (Fix When Possible)
Impact: Minor improvements, best practices alignment

- [ ] [Issue description] — [Specific fix] — [Estimated impact: +X points]
- [ ] ...

## Estimated Score After Fixes
| Phase | Actions | Projected Score |
|-------|---------|-----------------|
| After Critical fixes | [N] items | XX/100 |
| After High fixes | [N] items | XX/100 |
| After Medium fixes | [N] items | XX/100 |
| After All fixes | [N] items | XX/100 |
```

---

## Priority Levels

| Level | Definition | Timeline | Examples |
|-------|-----------|----------|---------|
| **Critical** | Blocking indexing, causing deindexation, or severe security issues | Immediate (same day) | noindex on key pages, site-wide 5xx errors, missing canonical causing massive duplication, security vulnerability |
| **High** | Directly impacting rankings or significant user experience degradation | Within 1 week | Missing/duplicate title tags, broken internal links, missing schema on key pages, slow LCP on landing pages |
| **Medium** | Optimization opportunities with measurable ranking potential | Within 1 month | Thin content pages, suboptimal meta descriptions, missing alt text on key images, redirect chains |
| **Low** | Best practice alignment and incremental improvements | When possible | Minor heading hierarchy issues, optional schema additions, image format upgrades, cosmetic URL improvements |

---

## Execution Workflow

```
1. USER invokes: /seo-audit [URL]
       |
2. VALIDATE URL (accessible, returns 200, is not blocked)
       |
3. DETECT INDUSTRY (scan homepage + top pages)
       |
4. FETCH robots.txt and sitemap.xml
       |
5. EXECUTE CRAWL (breadth-first, max 500 pages, 5 concurrent, 1s delay)
       |
6. DELEGATE to 6 subagents (parallel where possible)
   - seo-technical: crawl data + headers + robots.txt
   - seo-content: page content + word counts
   - seo-schema: extracted structured data
   - seo-sitemap: sitemap vs crawled URLs
   - seo-performance: response times + resource data
   - seo-visual: image inventory
       |
7. COLLECT subagent scores and issue lists
       |
8. COMPUTE weighted overall score
       |
9. GENERATE FULL-AUDIT-REPORT.md
       |
10. GENERATE ACTION-PLAN.md (sorted by priority, then by estimated impact)
       |
11. PRESENT summary to user with score and top 5 actions
```

---

## Usage

```bash
# Full audit of a website
/seo-audit https://example.com

# Audit with specific page limit
/seo-audit https://example.com --max-pages 100

# Audit with industry override
/seo-audit https://example.com --industry saas
```

---

## Notes

- This skill coordinates all other SEO skills; it is the top-level orchestrator for site-wide analysis
- Individual page analysis should use the `seo-page` skill instead
- Crawl data is ephemeral; it is not persisted between audit runs
- For sites with JavaScript-rendered content, note that the crawler may not execute JS; flag these pages for manual review
- Always check if the site has a staging vs production environment and audit the correct one
