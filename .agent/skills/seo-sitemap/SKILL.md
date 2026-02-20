---
name: SEO Sitemap
description: Sitemap analysis, validation, and generation for XML sitemaps with quality gates and industry templates.
---

# SEO Sitemap Skill

## Purpose

Analyze, validate, and generate XML sitemaps that comply with the Sitemaps Protocol 0.9 and current Google Search Central guidelines. This skill covers both audit mode (validating existing sitemaps) and generation mode (creating new sitemaps from scratch).

## Sitemap XML Format

A valid sitemap follows this structure:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/page-one</loc>
    <lastmod>2026-02-14T00:00:00+00:00</lastmod>
  </url>
  <url>
    <loc>https://example.com/page-two</loc>
    <lastmod>2026-01-20T00:00:00+00:00</lastmod>
  </url>
</urlset>
```

For large sites requiring multiple sitemaps, use a sitemap index:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-pages.xml</loc>
    <lastmod>2026-02-14T00:00:00+00:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-blog.xml</loc>
    <lastmod>2026-02-10T00:00:00+00:00</lastmod>
  </sitemap>
</sitemapindex>
```

## Validation Mode

### 6 Core Validation Checks

| # | Check | Pass Criteria | Severity |
|---|-------|---------------|----------|
| 1 | **XML Format** | Well-formed XML, correct `xmlns` namespace declaration, UTF-8 encoding | CRITICAL |
| 2 | **URL Count** | Total URLs must be under 50,000 per sitemap file (protocol hard limit) | CRITICAL |
| 3 | **HTTP Status** | Every `<loc>` URL returns HTTP 200; flag 3xx redirects, 4xx errors, 5xx failures | HIGH |
| 4 | **lastmod Accuracy** | `<lastmod>` dates match actual page modification dates within 7 days; flag stale or fabricated dates | MEDIUM |
| 5 | **Deprecated Tags** | Flag usage of `<priority>` and `<changefreq>` as unnecessary. Google confirmed these tags are ignored and have been since at least 2018. Remove them to reduce file size and avoid false confidence. | LOW |
| 6 | **File Size** | Uncompressed sitemap must be under 50MB per file | HIGH |

### Additional Validation

- **Protocol consistency**: All URLs must use the same protocol (HTTPS preferred). Mixed HTTP/HTTPS is an error.
- **Trailing slash consistency**: URLs should follow a consistent pattern (all with or all without trailing slashes).
- **Canonical alignment**: Sitemap URLs must match canonical URLs. If a page has `<link rel="canonical" href="X">`, the sitemap must list URL X, not a variant.
- **Robots.txt reference**: Verify that `robots.txt` includes a `Sitemap:` directive pointing to the sitemap or sitemap index URL.
- **No query parameters**: Flag URLs containing query strings unless they represent distinct, indexable content.
- **No fragment identifiers**: URLs must never contain `#` fragments.

### Validation Output Format

```
SITEMAP AUDIT REPORT
====================
File: sitemap.xml
URLs found: 342
File size: 48KB (uncompressed)

CRITICAL: 0 issues
HIGH: 2 issues
  - 3 URLs returning 301 redirects (lines 45, 112, 298)
  - 1 URL returning 404 (line 67)
MEDIUM: 1 issue
  - 12 URLs have lastmod dates older than 6 months with no actual changes
LOW: 1 issue
  - <priority> and <changefreq> tags present on all entries (ignored by Google, safe to remove)

RECOMMENDATION: Fix HIGH issues before resubmission.
```

## Generation Mode

### Industry Templates

Select a template based on site type to determine sitemap structure and splitting strategy:

| Industry | Typical URL Types | Recommended Split |
|----------|-------------------|-------------------|
| **SaaS** | Marketing pages, docs, blog, changelog | `sitemap-pages.xml`, `sitemap-blog.xml`, `sitemap-docs.xml` |
| **E-commerce** | Products, categories, brands, blog | `sitemap-products.xml`, `sitemap-categories.xml`, `sitemap-blog.xml` |
| **Local Service** | Service pages, location pages, blog | `sitemap-pages.xml`, `sitemap-locations.xml`, `sitemap-blog.xml` |
| **Publisher** | Articles, categories, authors, tags | `sitemap-articles-YYYY-MM.xml` (monthly split), `sitemap-categories.xml` |
| **Agency** | Services, portfolio, case studies, blog | `sitemap-pages.xml`, `sitemap-portfolio.xml`, `sitemap-blog.xml` |

### Quality Gates for Programmatic Pages

When generating sitemaps that include programmatic or templated pages (location pages, product variants, tag pages):

| Threshold | Action | Rationale |
|-----------|--------|-----------|
| **< 30 location/template pages** | PASS. Include all in sitemap. | Safe volume, unlikely to trigger thin content flags. |
| **30 to 49 pages** | WARNING. Review each page for unique, substantial content (minimum 300 words unique per page). Require manual approval before inclusion. | Approaching the boundary where Google may scrutinize content quality. |
| **50+ pages** | HARD STOP. Do not generate sitemap entries until content quality audit is complete. Each page must demonstrate unique value. | High risk of being classified as "scaled content abuse" under Google's March 2024 and June 2025 spam policies. |

### Safe vs Penalty Risk Programmatic Pages

**Safe to include in sitemap:**
- Pages with genuinely unique content (unique descriptions, reviews, data)
- Location pages with real local information (addresses, hours, local testimonials, area specific service details)
- Product pages with distinct specifications, images, and descriptions
- Blog category/tag pages that aggregate meaningful content clusters

**Penalty risk (exclude or noindex):**
- Pages generated solely by swapping a city/state name into a template
- Tag pages with fewer than 3 associated posts
- Parameter based pagination pages (use `rel="next"/"prev"` or infinite scroll instead)
- Thin product variant pages (color only, size only) that lack unique content
- Auto generated pages from user submitted data without editorial review

### Sitemap Index Splitting Strategy

Split into multiple sitemaps when:

1. **URL count exceeds 10,000** per logical section (split proactively, not just at the 50K limit)
2. **Content types differ significantly** (blog vs products vs pages have different update frequencies)
3. **Update frequency varies** (frequently updated sections benefit from their own sitemap for faster crawl processing)

### Generation Output

When generating a sitemap, always output:

1. The complete XML content
2. A summary of URLs included per section
3. Instructions for `robots.txt` Sitemap directive
4. Recommended Google Search Console submission steps
5. Any quality gate warnings triggered

## Rules

1. NEVER include `<priority>` or `<changefreq>` tags in generated sitemaps. Google ignores them entirely.
2. ALWAYS use W3C Datetime format for `<lastmod>` (YYYY-MM-DD or full ISO 8601).
3. ALWAYS use absolute URLs with protocol in `<loc>` elements.
4. NEVER include URLs that are blocked by `robots.txt` or have a `noindex` meta tag.
5. ALWAYS validate XML well-formedness before outputting.
6. ALWAYS recommend gzip compression for sitemaps over 10MB.
7. NEVER exceed 50,000 URLs per sitemap file or 50MB uncompressed file size.
8. ALWAYS include a sitemap index when using multiple sitemap files.
9. ALWAYS ensure `lastmod` reflects genuine content changes, not automated timestamp updates.
10. ALWAYS cross-reference sitemap URLs against the site's canonical URLs to prevent indexing conflicts.
