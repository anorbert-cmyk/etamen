---
name: SEO Programmatic
description: Programmatic SEO strategy for generating pages at scale with quality gates, thin content safeguards, and compliance with Google's Scaled Content Abuse policy.
---

# SEO Programmatic Skill

## Purpose

Plan and execute programmatic SEO strategies that generate large volumes of pages from structured data while maintaining content quality, avoiding Google penalties, and delivering genuine user value. This skill covers data assessment, template engineering, URL strategy, internal linking, and critical quality safeguards.

## When to Use Programmatic SEO

Programmatic SEO is appropriate when:

- You have a structured data source (database, API, spreadsheet) with 50+ unique entities
- Each entity has enough unique data to generate a genuinely useful page
- There is proven search demand for the entity type (e.g., "[city] + [service]", "[product] + specifications")
- Manual content creation for each page is not feasible at the required scale
- The pages serve a clear user need that is not already well-served by existing content

Programmatic SEO is NOT appropriate when:

- You are simply swapping a single variable (city name, product color) into an otherwise identical template
- The data source lacks enough unique information per entity to create substantial pages
- The goal is purely to capture long-tail traffic without delivering user value
- You cannot commit to ongoing quality monitoring and maintenance

## 5-Step Programmatic SEO Process

### Step 1: Data Source Assessment

Before generating any pages, rigorously evaluate the data source.

**Data Quality Checklist:**

| Factor | Minimum Requirement | Red Flag |
|--------|---------------------|----------|
| **Unique fields per entity** | 5+ distinct data points | Fewer than 3 fields per entity |
| **Content uniqueness** | 40%+ unique text per page (after template removal) | Below 30% unique content |
| **Data completeness** | 80%+ of fields populated per entity | More than 50% of entities missing key fields |
| **Data accuracy** | Verified within last 12 months | Stale data with no update mechanism |
| **Data volume** | 50+ entities minimum | Fewer than 20 entities (create manually instead) |
| **Search demand** | Verified keyword volume for the entity pattern | No search demand for the entity type |

**Data Enrichment Strategies:**
- Cross-reference with multiple data sources to fill gaps
- Add user-generated content (reviews, ratings, Q&A)
- Include dynamically updated data (prices, availability, statistics)
- Generate unique descriptions using AI with human editorial review
- Add geographic or contextual data specific to each entity

### Step 2: Template Engine Planning

Design templates that produce pages with genuine unique value.

**Template Architecture:**

```
+---------------------------+
|     SHARED HEADER         |  (Navigation, branding: identical across pages)
+---------------------------+
|     UNIQUE HERO           |  (Entity name, primary data, unique image)
+---------------------------+
|     UNIQUE DATA SECTION   |  (Entity-specific facts, stats, details)
+---------------------------+
|     UNIQUE CONTENT BLOCK  |  (Description, analysis, context: must be unique)
+---------------------------+
|     DYNAMIC COMPARISON    |  (How this entity compares to similar ones)
+---------------------------+
|     RELATED ENTITIES      |  (Internal links to related pages)
+---------------------------+
|     FAQ SECTION           |  (Entity-specific questions and answers)
+---------------------------+
|     SHARED FOOTER         |  (Site-wide footer: identical across pages)
+---------------------------+
```

**Template Quality Rules:**
- Shared/boilerplate content must be less than 60% of total page content
- Every page must have at least one section of genuinely unique narrative content (not just data fields)
- Dynamic data sections must display differently based on the entity's actual data (conditional rendering)
- Empty data fields must be gracefully hidden, not displayed as "N/A" or blank
- Each page must have a unique title tag, meta description, H1, and OG image (or at minimum, a dynamically generated OG image)

### Step 3: URL Pattern Strategy

Design URL patterns that are logical, scalable, and SEO-friendly.

**URL Pattern Examples:**

| Page Type | URL Pattern | Example |
|-----------|-------------|---------|
| **Location + Service** | `/services/{service}/{city}` | `/services/plumbing/austin` |
| **Product Specifications** | `/products/{category}/{product-slug}` | `/products/laptops/thinkpad-x1-carbon` |
| **Comparison** | `/compare/{entity-a}-vs-{entity-b}` | `/compare/react-vs-vue` |
| **Directory Listing** | `/directory/{category}/{entity-slug}` | `/directory/restaurants/joes-pizza` |
| **Statistics** | `/stats/{topic}/{year}` | `/stats/startup-funding/2026` |

**URL Rules:**
- Use lowercase letters, numbers, and hyphens only
- Keep URLs under 75 characters (excluding domain)
- Include the primary keyword in the URL path
- Use logical hierarchy that matches site architecture
- Avoid date-based URLs unless the content is inherently temporal
- Never use query parameters for indexable programmatic pages

### Step 4: Internal Linking (Hub and Spoke Model)

Build a robust internal linking structure that distributes authority and aids discovery.

**Hub and Spoke Architecture:**

```
              +------------------+
              |    HUB PAGE      |
              | (Category/Index) |
              +--------+---------+
                       |
         +-------------+-------------+
         |             |             |
    +----v----+  +-----v-----+  +---v------+
    | SPOKE 1 |  | SPOKE 2   |  | SPOKE 3  |
    | (Entity)|  | (Entity)  |  | (Entity) |
    +---------+  +-----------+  +----------+
```

**Linking Implementation:**

| Link Type | From | To | Purpose |
|-----------|------|-----|---------|
| **Hub to Spoke** | Category index page | Each entity page | Discovery, crawl distribution |
| **Spoke to Hub** | Each entity page | Category index | Authority consolidation |
| **Spoke to Spoke** | Entity page | Related entity pages | Cross-discovery, engagement |
| **Breadcrumb** | Every page | Parent hierarchy | Navigation, schema markup |
| **Contextual** | Within page content | Relevant related pages | Topical relevance signals |

**Linking Rules:**
- Every programmatic page must be reachable within 3 clicks from the homepage
- Hub pages should link to no more than 100 spoke pages per page (use pagination for larger sets)
- Related entity links should be contextually relevant (same category, same geography, similar attributes)
- Use descriptive anchor text that includes the target page's primary keyword
- Implement breadcrumb navigation with BreadcrumbList schema markup

### Step 5: Thin Content Safeguards and Quality Gates

This is the most critical step. Google's Scaled Content Abuse policy carries severe penalties.

**Google's Scaled Content Abuse Policy Timeline:**
- **March 2024**: Google's core update introduced "scaled content abuse" as a manual action category
- **June 2025**: First wave of large-scale manual actions against programmatic SEO sites
- **August 2025**: SpamBrain update specifically targeting AI-generated and template-based thin content at scale

**Quality Gate Thresholds:**

| Threshold | Status | Required Action |
|-----------|--------|-----------------|
| **< 100 unreviewed pages** | GREEN | Proceed with generation. Spot-check 10% of pages for quality. |
| **100 to 499 unreviewed pages** | WARNING | Full quality audit required before indexing. Review at least 20% of pages manually. Flag any page with less than 40% unique content. Hold indexing until review is complete. |
| **500+ unreviewed pages** | HARD STOP | Do not index. Comprehensive quality audit required. Every page must demonstrate unique value. Consider phased rollout (50 pages per week) with monitoring. Require editorial sign-off before each batch. |

**Unique Content Measurement:**

To calculate the unique content percentage for a programmatic page:

1. Strip all shared template content (header, footer, navigation, sidebar, boilerplate text)
2. Strip all content that appears identically on 5+ other programmatic pages
3. Measure the remaining unique text as a percentage of total visible text content
4. **Minimum threshold: 40% unique content per page**

**Pages that should be flagged:**

| Signal | Action |
|--------|--------|
| Unique content below 40% | BLOCK from indexing. Add more unique content or noindex. |
| Fewer than 200 words of unique text | BLOCK from indexing. Page is too thin. |
| More than 3 empty data fields visible | BLOCK from indexing. Hide empty fields or enrich data. |
| No search demand for this entity | Consider noindex. Does this page serve any user? |
| Duplicate title tag or meta description | BLOCK. Every page must have unique metadata. |

### Canonical Strategy

Programmatic pages require careful canonical tag management to prevent duplicate content issues.

**Canonical Rules:**

| Scenario | Canonical Target |
|----------|-----------------|
| Unique entity page | Self-referencing canonical |
| Paginated list page | Self-referencing canonical (each page is canonical to itself) |
| Filtered/sorted view of the same data | Canonical to the default (unfiltered) view |
| Regional variant with identical content | Canonical to the primary region; use hreflang for localization |
| HTTP and HTTPS versions | Canonical to HTTPS version |
| Trailing slash and non-trailing slash | Canonical to whichever is the site-wide standard |

**Never do:**
- Set all paginated pages canonical to page 1 (Google deprecated rel=prev/next but each page should still self-canonicalize)
- Canonicalize to a page that returns 404 or redirects
- Use relative URLs in canonical tags (always use absolute URLs with protocol)

### Sitemap Integration

Programmatic pages must be properly represented in XML sitemaps.

**Sitemap Strategy:**
- Create a dedicated sitemap file for programmatic pages (e.g., `sitemap-locations.xml`, `sitemap-products.xml`)
- Split into multiple sitemaps if approaching 10,000 URLs per file (well under the 50K limit for faster processing)
- Include only pages that are indexable (200 status, no noindex, self-canonical)
- Update `lastmod` only when page content actually changes
- Reference all sitemaps in the sitemap index file
- Submit sitemaps to Google Search Console and Bing Webmaster Tools

### Index Bloat Prevention

Index bloat occurs when too many low-value pages enter Google's index, diluting crawl budget and overall site quality signals.

**Prevention Strategies:**

| Strategy | Implementation |
|----------|---------------|
| **Noindex thin pages** | Add `<meta name="robots" content="noindex">` to pages below quality thresholds |
| **Crawl budget management** | Use robots.txt to block crawling of faceted navigation, sort parameters, and filter combinations |
| **Phased indexing** | Release programmatic pages in batches of 50 to 100 per week; monitor index coverage in Search Console |
| **Regular pruning** | Monthly audit of indexed programmatic pages; noindex or remove pages with zero traffic after 90 days |
| **Quality monitoring** | Track the ratio of indexed pages to pages receiving organic traffic. If less than 30% of indexed pages get traffic, you likely have index bloat. |

**Index Coverage Monitoring:**
- Check Google Search Console "Pages" report weekly during rollout
- Monitor for "Crawled, currently not indexed" and "Discovered, currently not indexed" signals
- Track the total number of indexed pages vs submitted pages
- Set up alerts for sudden drops in indexed page count (may indicate quality penalty)

## Rules

1. ALWAYS complete the Data Source Assessment before generating any pages. Poor data produces poor pages.
2. ALWAYS enforce the 40% minimum unique content threshold. No exceptions.
3. ALWAYS implement the quality gate thresholds (WARNING at 100+, HARD STOP at 500+ unreviewed pages).
4. ALWAYS use self-referencing canonical tags on programmatic pages.
5. ALWAYS create dedicated sitemaps for programmatic page sets.
6. ALWAYS monitor index coverage weekly during initial rollout.
7. NEVER generate pages from a data source with fewer than 5 unique fields per entity.
8. NEVER index pages with fewer than 200 words of unique text content.
9. NEVER release more than 100 programmatic pages per week without quality review.
10. NEVER use programmatic SEO solely to capture traffic without delivering genuine user value.
11. ALWAYS implement the hub-and-spoke internal linking model for programmatic page sets.
12. ALWAYS include breadcrumb navigation with BreadcrumbList schema on every programmatic page.
13. ALWAYS plan for ongoing data freshness. Stale programmatic pages are a liability.
14. NEVER duplicate title tags or meta descriptions across programmatic pages. Every page must have unique metadata.
