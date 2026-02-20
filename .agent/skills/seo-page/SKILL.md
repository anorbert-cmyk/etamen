---
name: seo-page
description: Deep single-page SEO analysis covering on-page elements, content quality, technical meta tags, schema markup, images, and Core Web Vitals flags with a scored report card (XX/100 per category).
---

# SEO Page Skill

## Purpose

Perform an exhaustive SEO analysis of a single page. This skill evaluates every on-page signal that affects search ranking and user experience, producing a detailed score card with category-level grades and specific, actionable recommendations.

---

## Analysis Categories

### 1. On-Page Elements (25 points)

#### Title Tag

| Check | Pass Criteria | Points |
|-------|---------------|--------|
| Exists | Exactly 1 `<title>` tag in `<head>` | 2 |
| Length | 50-60 characters (optimal); flag if <30 or >65 | 2 |
| Keyword Placement | Primary keyword within first 60 characters | 2 |
| Uniqueness | Not duplicated across site (if site data available) | 1 |
| Brand Suffix | Consistent brand format (e.g., "Page Title \| Brand") | 1 |

#### Meta Description

| Check | Pass Criteria | Points |
|-------|---------------|--------|
| Exists | Present and non-empty | 2 |
| Length | 120-155 characters (optimal); flag if <70 or >160 | 2 |
| Keyword Inclusion | Contains primary keyword naturally | 1 |
| Call to Action | Contains action-oriented language | 1 |
| Uniqueness | Not duplicated across site | 1 |

#### H1 Tag

| Check | Pass Criteria | Points |
|-------|---------------|--------|
| Exists | Exactly 1 `<h1>` tag on page | 2 |
| Keyword Inclusion | Contains primary keyword (visible text, not sr-only) | 2 |
| Length | 20-70 characters | 1 |
| Distinct from Title | Not an exact copy of the `<title>` tag | 1 |

#### URL Structure

| Check | Pass Criteria | Points |
|-------|---------------|--------|
| Readable | Human-readable, uses hyphens as separators | 1 |
| Length | Under 75 characters (path portion) | 1 |
| Keyword in URL | Primary keyword present in URL slug | 1 |
| No Parameters | Clean URL without query parameters (for indexable pages) | 1 |
| Lowercase | All lowercase characters | 1 |

---

### 2. Content Quality (25 points)

#### Word Count

| Page Type | Minimum | Optimal | Points |
|-----------|---------|---------|--------|
| Blog Post / Article | 800 | 1,500-2,500 | 3 |
| Landing Page | 300 | 500-1,000 | 3 |
| Product Page | 200 | 300-800 | 3 |
| Category Page | 100 | 200-500 | 3 |
| Homepage | 300 | 500-1,000 | 3 |

#### Readability

| Metric | Target | Points |
|--------|--------|--------|
| Flesch Reading Ease | 60-70 (standard); 70-80 (consumer) | 3 |
| Average Sentence Length | 15-20 words | 1 |
| Paragraph Length | 2-4 sentences per paragraph | 1 |
| Subheading Frequency | Every 200-300 words | 1 |

#### Keyword Optimization

| Check | Pass Criteria | Points |
|-------|---------------|--------|
| Keyword Density | 1-2% for primary keyword | 2 |
| Keyword in First 100 Words | Primary keyword appears early | 2 |
| Semantic Variations | Uses synonyms and related terms (LSI) | 2 |
| No Keyword Stuffing | Density under 3%; reads naturally | 2 |

#### E-E-A-T Signals

| Signal | What to Check | Points |
|--------|---------------|--------|
| Experience | First-person accounts, case studies, original data | 2 |
| Expertise | Author bio/credentials visible, technical depth | 2 |
| Authoritativeness | Outbound links to authoritative sources, citations | 2 |
| Trustworthiness | Contact info, privacy policy linked, HTTPS, clear attribution | 2 |

---

### 3. Technical Meta Tags (20 points)

#### Canonical Tag

| Check | Pass Criteria | Points |
|-------|---------------|--------|
| Exists | `<link rel="canonical">` present | 3 |
| Self-Referencing | Points to the current page URL (for non-duplicate pages) | 2 |
| Absolute URL | Uses full URL, not relative path | 1 |
| Matches Protocol | HTTPS canonical on HTTPS page | 1 |

#### Open Graph Tags

| Tag | Required | Points |
|-----|----------|--------|
| `og:title` | Yes | 1 |
| `og:description` | Yes | 1 |
| `og:image` | Yes (1200x630px recommended) | 2 |
| `og:url` | Yes (canonical URL) | 1 |
| `og:type` | Yes (article, website, product) | 1 |
| `og:site_name` | Recommended | 0.5 |
| `og:locale` | Recommended | 0.5 |

#### Twitter Card Tags

| Tag | Required | Points |
|-----|----------|--------|
| `twitter:card` | Yes (summary_large_image preferred) | 1 |
| `twitter:title` | Yes | 1 |
| `twitter:description` | Yes | 1 |
| `twitter:image` | Yes | 1 |

#### Additional Meta Tags

| Tag | Check | Points |
|-----|-------|--------|
| `meta robots` | Appropriate directives (index,follow for public pages) | 1 |
| `hreflang` | Present if multilingual; self-referencing default | 1 |
| Viewport | `<meta name="viewport" content="width=device-width, initial-scale=1">` | 1 |

---

### 4. Schema Markup (15 points)

| Check | Pass Criteria | Points |
|-------|---------------|--------|
| Schema Present | At least one JSON-LD block found | 3 |
| Valid JSON-LD | Parses without errors | 2 |
| Appropriate Type | Schema type matches page purpose (Article for blog, Product for product, etc.) | 3 |
| Required Properties | All required properties for the type are present | 3 |
| No Warnings | Passes Google Rich Results Test without warnings | 2 |
| Nested Correctly | Author, publisher, image objects properly structured | 2 |

#### Schema Type Mapping

| Page Type | Expected Schema | Key Properties |
|-----------|----------------|----------------|
| Homepage | Organization, WebSite | name, url, logo, sameAs, potentialAction (SearchAction) |
| Blog Post | Article or BlogPosting | headline, author, datePublished, dateModified, image |
| Product | Product + Offer | name, description, price, priceCurrency, availability |
| Service | Service | name, provider, description, areaServed |
| FAQ | FAQPage | mainEntity with Question + acceptedAnswer pairs |
| Contact | ContactPage | Organization with contactPoint |

---

### 5. Image Optimization (15 points)

#### Alt Text

| Check | Pass Criteria | Points |
|-------|---------------|--------|
| Present | All `<img>` tags have `alt` attribute | 3 |
| Descriptive | Alt text is meaningful, not "image1.jpg" or empty | 2 |
| Length | 10-125 characters | 1 |
| Keyword Relevant | At least one image alt contains page keyword naturally | 1 |

#### File Size

| Image Type | Maximum Size | Points |
|------------|-------------|--------|
| Thumbnails | < 50 KB | 1 |
| Content Images | < 100 KB | 1 |
| Hero / Banner | < 200 KB | 1 |

#### Format and Loading

| Check | Pass Criteria | Points |
|-------|---------------|--------|
| Modern Format | WebP or AVIF used (not just JPEG/PNG) | 1 |
| Lazy Loading | Below-fold images use `loading="lazy"` | 1 |
| Dimensions Set | `width` and `height` attributes present (CLS prevention) | 1 |
| Responsive | `srcset` and `sizes` used for responsive images | 1 |
| LCP Image | Above-fold hero image has `fetchpriority="high"` | 1 |

---

## Core Web Vitals Flags

These are not directly measured (requires real user data or Lighthouse), but flags are raised for likely issues:

| Metric | Flag Conditions |
|--------|----------------|
| **LCP** (Largest Contentful Paint) | Hero image >200KB, no `fetchpriority="high"`, large unoptimized fonts, render-blocking CSS/JS |
| **INP** (Interaction to Next Paint) | Heavy JS bundles, long tasks >50ms, no code splitting evident, excessive event listeners |
| **CLS** (Cumulative Layout Shift) | Images without dimensions, dynamically injected content above fold, web fonts without `font-display`, ads without reserved space |

---

## Output Format: Page Score Card

```markdown
# Page SEO Score Card: [URL]
**Analyzed:** [YYYY-MM-DD]
**Primary Keyword:** [keyword]
**Page Type:** [blog/landing/product/category/homepage]

## Overall Score: XX/100

| Category | Score | Max | Grade |
|----------|-------|-----|-------|
| On-Page Elements | XX | 25 | [A-F] |
| Content Quality | XX | 25 | [A-F] |
| Technical Meta Tags | XX | 20 | [A-F] |
| Schema Markup | XX | 15 | [A-F] |
| Image Optimization | XX | 15 | [A-F] |
| **Total** | **XX** | **100** | **[A-F]** |

## Grade Scale
| Grade | Score Range |
|-------|------------|
| A | 90-100% of category max |
| B | 75-89% |
| C | 60-74% |
| D | 40-59% |
| F | Below 40% |

## Detailed Findings

### On-Page Elements
[List each check with PASS/FAIL and current value]

### Content Quality
[Word count, readability score, keyword analysis, E-E-A-T assessment]

### Technical Meta Tags
[Canonical, OG, Twitter Card, meta robots analysis]

### Schema Markup
[Schema types found, validation results, missing properties]

### Image Optimization
[Image inventory with alt text, sizes, formats, loading attributes]

## Core Web Vitals Flags
[Any LCP, INP, or CLS risk factors identified]

## Priority Fixes
1. [Most impactful fix] — Expected impact: [High/Medium/Low]
2. [Second fix] — Expected impact: [High/Medium/Low]
3. [Third fix] — Expected impact: [High/Medium/Low]
...
```

---

## Usage

```bash
# Analyze a specific page
/seo-page https://example.com/blog/my-article

# Analyze with a specific target keyword
/seo-page https://example.com/pricing --keyword "saas pricing"

# Analyze with page type override
/seo-page https://example.com/ --type homepage
```

---

## Notes

- This skill analyzes a single page in depth; for site-wide audits use `seo-audit`
- Primary keyword can be auto-detected from title/H1 if not provided
- The score card uses a 100-point system distributed across 5 categories
- Core Web Vitals flags are heuristic-based, not measured; recommend running Lighthouse for exact metrics
- For SPA (single page applications), analyze both the server-rendered HTML and the client-rendered DOM
- Social meta tags (OG, Twitter) are critical because social crawlers do not execute JavaScript
