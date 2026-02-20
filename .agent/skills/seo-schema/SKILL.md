---
name: seo-schema
description: Schema markup detection, validation, and generation in JSON-LD format. Covers active schema types, restricted types, deprecated types, JSON-LD templates for common use cases, and a validation checklist for ensuring rich results eligibility.
---

# SEO Schema Skill

## Purpose

Detect existing schema markup on pages, validate its accuracy and completeness, identify missing schema opportunities, and generate correct JSON-LD markup. This skill ensures structured data meets Google's current requirements for rich results eligibility while avoiding deprecated or restricted types.

---

## Schema Detection Protocol

### Step 1: Extract All Structured Data

| Format | How to Detect | Priority |
|--------|---------------|----------|
| **JSON-LD** | `<script type="application/ld+json">` blocks | Preferred (Google recommended) |
| **Microdata** | `itemscope`, `itemtype`, `itemprop` attributes | Acceptable but not recommended for new implementations |
| **RDFa** | `vocab`, `typeof`, `property` attributes | Acceptable but not recommended for new implementations |

### Step 2: Parse and Catalog

For each detected block:
1. Parse JSON-LD (validate JSON syntax)
2. Identify `@type` (or array of types)
3. Catalog all properties and their values
4. Check for nesting (e.g., Author inside Article)
5. Record location in DOM (which page, position)

### Step 3: Compare Against Requirements

- Map detected schema types against page type requirements
- Identify missing required properties
- Flag deprecated or restricted types
- Compare against Google's Rich Results eligibility

---

## Active Schema Types (Eligible for Rich Results)

### High Priority (Should Be On Every Applicable Site)

| Type | Use On | Rich Result | Required Properties |
|------|--------|-------------|---------------------|
| `Organization` | Homepage | Knowledge Panel, Logo | `name`, `url`, `logo`, `sameAs` |
| `WebSite` | Homepage | Sitelinks Search Box | `name`, `url`, `potentialAction` (SearchAction) |
| `BreadcrumbList` | All non-homepage pages | Breadcrumb trail in SERPs | `itemListElement` with `ListItem` objects |
| `Article` / `BlogPosting` | Blog posts, news articles | Article rich result | `headline`, `image`, `datePublished`, `author` |
| `FAQPage` | FAQ sections | FAQ accordion in SERPs | `mainEntity` with `Question` + `acceptedAnswer` |
| `Product` | Product pages | Product rich result | `name`, `image`, `offers` (with `price`, `priceCurrency`, `availability`) |

### Medium Priority (Use When Applicable)

| Type | Use On | Rich Result | Required Properties |
|------|--------|-------------|---------------------|
| `LocalBusiness` | Local businesses | Local pack, Knowledge Panel | `name`, `address`, `telephone`, `openingHours` |
| `SoftwareApplication` | SaaS/App pages | Software rich result | `name`, `operatingSystem`, `applicationCategory`, `offers` |
| `Review` / `AggregateRating` | Review pages | Star ratings in SERPs | `reviewRating` or `ratingValue`, `ratingCount` |
| `Event` | Event pages | Event rich result | `name`, `startDate`, `location`, `offers` |
| `Course` | Education/course pages | Course rich result | `name`, `provider`, `description` |
| `Recipe` | Recipe pages | Recipe rich result | `name`, `image`, `recipeIngredient`, `recipeInstructions` |
| `VideoObject` | Video pages | Video rich result | `name`, `description`, `thumbnailUrl`, `uploadDate` |
| `JobPosting` | Job listing pages | Job listing rich result | `title`, `description`, `datePosted`, `hiringOrganization` |

### Lower Priority (Situational)

| Type | Use On | Rich Result |
|------|--------|-------------|
| `Book` | Book review/listing pages | Book rich result |
| `MusicGroup` / `MusicRecording` | Music pages | Music rich result |
| `Dataset` | Data pages | Dataset search result |
| `MathSolver` | Math tool pages | Math solver rich result |
| `EducationalOccupationalProgram` | Program pages | Program listing |
| `Podcast` | Podcast pages | Podcast carousel |

---

## Restricted Schema Types

These types have limited eligibility. Using them incorrectly will not generate rich results and may trigger manual actions.

| Type | Restriction | Since | Details |
|------|-------------|-------|---------|
| **FAQPage** | Government and health websites only | August 2023 | Google restricted FAQ rich results to government (.gov) and health (recognized health authority) websites. Other sites can still use the markup but will NOT receive the FAQ rich result in SERPs. Still useful for AI citation extraction. |
| **HowTo** | Rich results completely removed | September 2023 | Google removed HowTo rich results entirely. The schema type still exists in schema.org but will not generate any SERP feature. Avoid using for SEO purposes; no visual benefit. |

---

## Deprecated Schema Types

These types have been fully deprecated by Google and should be removed from implementations.

| Type | Deprecated | Details | Action |
|------|-----------|---------|--------|
| **HowTo** (rich result) | September 2023 | Rich result removed from SERPs | Remove or repurpose; no SEO benefit |
| **SpecialAnnouncement** | July 2025 | Created during COVID-19 for emergency announcements; no longer supported | Remove entirely; will not generate any rich result |
| **ClaimReview** | June 2025 | Fact-check rich results deprecated | Remove; consider `Article` with fact-check content structure instead |

### Migration Guidance

| Deprecated Type | Recommended Replacement | Notes |
|----------------|------------------------|-------|
| `HowTo` | `Article` with clear step-by-step content structure | Content itself should be structured as steps; schema should be Article/BlogPosting |
| `SpecialAnnouncement` | `Article` or `NewsArticle` with appropriate `datePublished` | Remove the SpecialAnnouncement schema entirely |
| `ClaimReview` | `Article` or `NewsArticle` with structured fact-check content | Remove ClaimReview markup; focus on content quality |

---

## JSON-LD Templates

### Organization (Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "alternateName": "Brand Name",
  "url": "https://example.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://example.com/logo.png",
    "width": 600,
    "height": 60
  },
  "description": "Brief company description (1-2 sentences)",
  "foundingDate": "2020",
  "sameAs": [
    "https://twitter.com/company",
    "https://linkedin.com/company/name",
    "https://github.com/company"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "support@example.com",
    "availableLanguage": ["English"]
  }
}
```

### LocalBusiness

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business Name",
  "image": "https://example.com/photo.jpg",
  "url": "https://example.com",
  "telephone": "+1-555-555-5555",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "City",
    "addressRegion": "ST",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "priceRange": "$$"
}
```

### Article / BlogPosting

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Article Title (max 110 characters)",
  "description": "Brief article summary (max 155 characters)",
  "image": {
    "@type": "ImageObject",
    "url": "https://example.com/article-image.jpg",
    "width": 1200,
    "height": 630
  },
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/about/author"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Publisher Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png",
      "width": 600,
      "height": 60
    }
  },
  "datePublished": "2025-01-15T08:00:00+00:00",
  "dateModified": "2025-06-01T10:30:00+00:00",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/blog/article-slug"
  },
  "wordCount": 2500,
  "keywords": ["keyword1", "keyword2", "keyword3"]
}
```

### SoftwareApplication

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Application Name",
  "description": "Brief application description",
  "url": "https://example.com",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "49.00",
    "priceCurrency": "USD",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  },
  "screenshot": "https://example.com/screenshot.png"
}
```

### WebSite with SearchAction (Sitelinks Search Box)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Site Name",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://example.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Article Title",
      "item": "https://example.com/blog/article-slug"
    }
  ]
}
```

### FAQPage (Note: Rich results limited to gov/health sites)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the first question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The answer to the first question."
      }
    },
    {
      "@type": "Question",
      "name": "What is the second question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The answer to the second question."
      }
    }
  ]
}
```

---

## Validation Checklist

### Syntax Validation

| Check | Pass Criteria | Severity |
|-------|---------------|----------|
| Valid JSON | Parses without syntax errors | Critical |
| `@context` present | `"@context": "https://schema.org"` | Critical |
| `@type` present | Valid schema.org type | Critical |
| No trailing commas | JSON does not contain trailing commas | Critical |
| Proper nesting | Nested objects have correct `@type` | High |
| No duplicate blocks | Same type not duplicated on a single page (unless intentional, e.g., multiple Products) | Medium |

### Content Validation

| Check | Pass Criteria | Severity |
|-------|---------------|----------|
| Property values match visible content | `headline` matches the actual page title | High |
| URLs are absolute | All URL properties use full URLs (https://...) | High |
| Dates are ISO 8601 | `datePublished` uses format `YYYY-MM-DDTHH:MM:SS+00:00` | High |
| Images are accessible | Image URLs return 200 status | High |
| No placeholder values | No "Lorem ipsum" or "TODO" in schema | Critical |
| Author exists | Author object has at minimum `name` property | Medium |
| Publisher exists | Publisher object has `name` and `logo` | Medium |

### Google Rich Results Eligibility

| Check | Pass Criteria | Severity |
|-------|---------------|----------|
| Type is supported | Google supports the `@type` for rich results | High |
| Required properties present | All Google-required properties for the type are filled | Critical |
| Recommended properties present | As many recommended properties as applicable | Medium |
| Not using deprecated types | Not using HowTo, SpecialAnnouncement, ClaimReview for rich results | High |
| Not using restricted types incorrectly | FAQPage only on gov/health sites for rich result expectation | Medium |
| Passes Rich Results Test | No errors in Google's Rich Results Test tool | High |
| No policy violations | Content in schema matches page content (no spammy markup) | Critical |

### Cross-Page Consistency

| Check | Pass Criteria | Severity |
|-------|---------------|----------|
| Organization consistent | Same Organization schema across all pages | Medium |
| Publisher consistent | Same publisher info in all Article schemas | Medium |
| Logo consistent | Same logo URL used throughout | Low |
| Breadcrumbs accurate | Breadcrumb trail matches actual URL hierarchy | High |
| No conflicting sameAs | sameAs links consistent across all Organization references | Low |

---

## Schema Generation Rules

When generating new schema markup:

1. **Always use JSON-LD** format (Google's preferred format)
2. **Place in `<head>`** section of the HTML (or just before `</body>`)
3. **One block per type** unless multiple entities of the same type exist on the page
4. **Match visible content** exactly; do not add information not present on the page
5. **Use absolute URLs** for all URL properties
6. **Include both required and recommended properties** wherever data is available
7. **Test with Google's Rich Results Test** before deploying
8. **Check the deprecated/restricted lists** before implementing any type
9. **Use ISO 8601 for dates** with timezone offset
10. **Keep schema up to date** when page content changes

---

## Output Format

```markdown
# Schema Markup Audit: [URL]
**Analyzed:** [YYYY-MM-DD]

## Detected Schema
| # | Type | Format | Valid | Properties Count |
|---|------|--------|-------|-----------------|
| 1 | [type] | JSON-LD | Yes/No | [N] |
| 2 | [type] | JSON-LD | Yes/No | [N] |

## Validation Results
### Block 1: [Type]
- Syntax: [PASS/FAIL]
- Required Properties: [X/Y present]
- Recommended Properties: [X/Y present]
- Rich Results Eligible: [Yes/No/Restricted]
- Issues: [list any issues]

## Missing Schema Opportunities
| Recommended Type | Reason | Priority |
|-----------------|--------|----------|
| [type] | [why this page should have it] | [High/Medium/Low] |

## Generated Schema (if requested)
[JSON-LD blocks ready to implement]

## Deprecated/Restricted Warnings
[Any detected uses of deprecated or restricted types]
```

---

## Usage

```bash
# Detect and validate schema on a page
/seo-schema https://example.com/blog/article

# Generate schema for a page type
/seo-schema generate --type BlogPosting --url https://example.com/blog/article

# Audit schema across entire site (used as subagent of seo-audit)
/seo-schema audit --sitemap https://example.com/sitemap.xml
```

---

## Notes

- JSON-LD is the only format recommended for new implementations; microdata and RDFa should be migrated
- FAQPage schema still has value for AI citation extraction even though rich results are restricted
- Google's Rich Results Test is the authoritative validation tool
- Schema.org types evolve; always check current documentation when implementing
- Multiple JSON-LD blocks on a single page are valid and common (e.g., Organization + BreadcrumbList + Article)
- Schema should be maintained alongside content; outdated schema (wrong dates, prices) can trigger manual actions
