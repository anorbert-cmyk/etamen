# Generic Business SEO Strategy Template

> Universal SEO template for businesses that do not fit neatly into SaaS, e-commerce, local service, publisher, or agency verticals.
> Use this as a baseline template and customize using the adaptation points at the end of this document.

---

## Universal SEO Principles

These apply to every website regardless of industry, size, or business model.

### Title Tags

| Rule | Specification |
|---|---|
| Length | 30 to 60 characters (Google displays approximately 55 to 60) |
| Format | Primary Keyword + Secondary Modifier \| Brand Name |
| Uniqueness | Every page must have a unique title tag |
| Keyword placement | Primary keyword within the first 40 characters |
| No keyword stuffing | Maximum 2 keyword phrases per title |
| No all-caps | Use title case or sentence case |

### Meta Descriptions

| Rule | Specification |
|---|---|
| Length | 120 to 160 characters (Google truncates at approximately 155 to 160) |
| Include primary keyword | Naturally, not forced |
| Include call to action | "Learn more", "Get started", "Compare options" |
| Unique per page | No duplicate meta descriptions across the site |
| Compelling language | Write for CTR, not just keyword inclusion |

### Heading Hierarchy

| Element | Rule |
|---|---|
| H1 | Exactly one per page; contains primary keyword; visible (not hidden in `sr-only`) |
| H2 | Main sections of the page; include secondary keywords naturally |
| H3 | Subsections under H2s; support long-tail variations |
| H4 to H6 | Use for deep content structure; avoid skipping levels (no H2 followed directly by H4) |
| No empty headings | Every heading must contain meaningful text |
| No headings for styling | Use CSS for visual size; headings are semantic |

### URL Structure

| Rule | Specification |
|---|---|
| Lowercase | All URLs in lowercase |
| Hyphens for separators | Use hyphens, not underscores or spaces |
| Descriptive slugs | `/services/brand-strategy` not `/services/page-1` |
| No parameters in indexed URLs | Use clean URLs; handle parameters via canonical tags |
| Maximum depth | 3 levels from root preferred; 4 maximum |
| Trailing slashes | Be consistent (either always or never); set canonical accordingly |

### Image Optimization

| Rule | Specification |
|---|---|
| Alt text | Descriptive, includes context; 50 to 125 characters |
| File names | Descriptive with hyphens: `brand-strategy-workshop.jpg` |
| Format | WebP preferred; JPEG for photos; PNG for graphics with transparency |
| Dimensions | Set explicit `width` and `height` attributes to prevent CLS |
| Lazy loading | Apply to below-fold images; never lazy-load the hero/LCP image |
| Compression | Target < 200KB for hero images; < 100KB for inline images |

---

## Site Architecture

```
/                                   Homepage (brand positioning + primary offering)
├── /products                       Product or service hub
│   ├── /products/[slug]            Individual product/service pages
│   └── /products/[category]/[slug] Category-organized products (if catalog is large)
├── /solutions                      Solution or use-case pages
│   ├── /solutions/[use-case]       "For [persona]", "For [industry]", "For [problem]"
│   └── /solutions/[use-case]       Target "[product type] for [audience]" queries
├── /about                          Company information
│   ├── /about/team                 Team page with bios
│   ├── /about/story                Company story / mission / values
│   └── /about/careers              Careers page
├── /resources                      Content hub
│   ├── /resources/blog             Blog (educational, thought leadership)
│   ├── /resources/guides           Long-form guides, whitepapers
│   ├── /resources/videos           Video content with transcripts
│   ├── /resources/webinars         Webinar recordings
│   └── /resources/faq              FAQ hub page
├── /contact                        Contact page with form, email, phone, map
├── /pricing                        Pricing page (if applicable)
├── /customers                      Customer stories, testimonials, case studies
│   └── /customers/[case-study]     Individual case studies
└── /legal                          Legal pages
    ├── /legal/terms                Terms of service
    ├── /legal/privacy              Privacy policy
    └── /legal/cookies              Cookie policy
```

### Architecture Rules

1. **Every page reachable in 3 clicks from homepage.** Use hub pages and internal linking to flatten deep structures.
2. **One primary keyword per page.** Never target the same keyword on two different pages (cannibalization).
3. **Hub-and-spoke model.** Hub pages (e.g., `/resources/blog`) link to all spokes (individual posts). Spokes link back to hub and to related spokes.
4. **Breadcrumbs on every page.** Use BreadcrumbList schema for navigation hierarchy.
5. **Orphan page audit.** Every page must receive at least one internal link from another page.

---

## Schema Markup for All Sites

### Organization Schema (Homepage)

Every website must have Organization schema on the homepage:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "alternateName": "Brand Name (if different)",
  "url": "https://company.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://company.com/logo.png",
    "width": 600,
    "height": 60
  },
  "description": "One-sentence company description with primary keyword",
  "foundingDate": "2020-01-01",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "telephone": "+1-555-000-0000",
    "email": "hello@company.com",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://linkedin.com/company/companyname",
    "https://twitter.com/companyname",
    "https://facebook.com/companyname"
  ]
}
```

### WebSite Schema with SearchAction (Homepage)

If your site has internal search, add this for sitelinks search box eligibility:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Company Name",
  "url": "https://company.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://company.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### Article Schema (Blog Posts and Resources)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title (max 110 characters)",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://company.com/about/team#author-slug"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Company Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://company.com/logo.png"
    }
  },
  "datePublished": "2026-01-15",
  "dateModified": "2026-02-01",
  "image": "https://company.com/blog/headers/article-slug.jpg",
  "mainEntityOfPage": "https://company.com/resources/blog/article-slug",
  "description": "Compelling meta description under 160 characters"
}
```

### Product or Service Schema

For product-based businesses:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "brand": {
    "@type": "Brand",
    "name": "Company Name"
  },
  "offers": {
    "@type": "Offer",
    "price": "99.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

For service-based businesses:

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Service Name",
  "description": "Service description",
  "provider": {
    "@type": "Organization",
    "name": "Company Name"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "serviceType": "Professional Service Category"
}
```

### BreadcrumbList Schema (Every Page Except Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://company.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Resources",
      "item": "https://company.com/resources"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Blog",
      "item": "https://company.com/resources/blog"
    }
  ]
}
```

---

## E-E-A-T Essentials

E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) is Google's quality framework. Every website must demonstrate these signals regardless of industry.

### Experience

| Signal | Implementation |
|---|---|
| First-hand experience | Content includes real examples, screenshots, or data from actual use |
| Case studies | Demonstrate that you have actually done what you write about |
| Original photography | Use real photos over stock images where possible |
| User-generated content | Reviews, testimonials, and community content show real experience |

### Expertise

| Signal | Implementation |
|---|---|
| Author credentials | Every article has a named author with relevant qualifications |
| Author pages | Dedicated page for each content creator with bio, credentials, and portfolio |
| Depth of content | Comprehensive coverage that goes beyond surface-level information |
| Technical accuracy | Content reviewed by subject matter experts |

### Authoritativeness

| Signal | Implementation |
|---|---|
| Backlink profile | Earn links from authoritative sites in your industry |
| Brand mentions | Your brand is mentioned on relevant industry sites and publications |
| Awards and recognition | Display industry awards, certifications, and rankings |
| Speaking and publishing | Team members publish in industry journals and speak at conferences |

### Trustworthiness

| Signal | Implementation |
|---|---|
| HTTPS | Mandatory; no exceptions |
| Contact information | Physical address, phone number, email on every page (footer) |
| Privacy policy | Clear, accessible privacy policy |
| Editorial policy | How content is created, reviewed, and updated |
| Corrections | Process for handling errors and updates |
| Security | Security page for sites handling sensitive data |
| Transparency | About page explaining who you are and why you exist |

---

## 4-Phase Implementation Plan

### Phase 1: Foundation (Weeks 1 to 4)

Focus: Technical health, core pages, and baseline measurement.

- [ ] **Technical audit**: Crawl the site with Screaming Frog or Sitebulb; fix all critical issues
- [ ] **Core Web Vitals**: Achieve passing scores (LCP < 2.5s, INP < 200ms, CLS < 0.1) on all key pages
- [ ] **Index coverage**: Fix all errors in Google Search Console; submit updated sitemap
- [ ] **Schema deployment**: Organization schema on homepage; Article schema on all blog posts
- [ ] **Title and meta optimization**: Audit and rewrite all title tags and meta descriptions
- [ ] **H1 audit**: Ensure every page has exactly one H1 with the primary keyword
- [ ] **Internal linking audit**: Fix orphan pages; ensure 3-click depth from homepage
- [ ] **Analytics setup**: GA4 with conversion tracking; GSC verified and monitored
- [ ] **Baseline measurement**: Record current keyword rankings, organic traffic, and conversion rates

### Phase 2: Expansion (Weeks 5 to 12)

Focus: Content creation, on-page optimization, and structural improvements.

- [ ] **Content gap analysis**: Identify high-value keywords you do not rank for but competitors do
- [ ] **Create 5 to 10 new pages** targeting gap keywords (service pages, solution pages, or guides)
- [ ] **Blog launch or optimization**: Publish 2 to 4 high-quality posts per month
- [ ] **E-E-A-T improvements**: Create author pages, about page, editorial standards
- [ ] **Schema expansion**: Add Service/Product schema, BreadcrumbList on all pages
- [ ] **Image optimization**: Compress all images; add alt text; convert to WebP
- [ ] **Mobile optimization**: Audit and fix mobile usability issues
- [ ] **FAQ sections**: Add structured FAQ to top 10 traffic pages

### Phase 3: Growth (Weeks 13 to 24)

Focus: Content velocity, link building, and competitive keyword targeting.

- [ ] **Pillar content strategy**: Publish 2 to 4 long-form guides (2000+ words)
- [ ] **Comparison content**: "X vs Y" and "alternatives to X" pages for competitive queries
- [ ] **Link building campaign**: Guest posts, digital PR, data studies, industry partnerships
- [ ] **Content refresh**: Update all content older than 6 months with new data and examples
- [ ] **Schema enrichment**: Add all applicable schema types for your business category
- [ ] **GEO optimization**: Ensure all high-value pages are optimized for AI citation
- [ ] **Local SEO** (if applicable): Google Business Profile, local citations, location pages

### Phase 4: Authority (Ongoing, Month 7+)

Focus: Brand building, thought leadership, and sustainable competitive advantage.

- [ ] **Thought leadership program**: Team members publishing, speaking, and contributing externally
- [ ] **Data-driven content**: Original research, surveys, industry reports (highest link-earning content type)
- [ ] **Brand search optimization**: Ensure SERP dominance for brand name queries
- [ ] **Competitor monitoring**: Track competitor content, rankings, and strategies monthly
- [ ] **Content pruning**: Remove or consolidate underperforming content (< 100 sessions in 12 months)
- [ ] **Advanced schema**: Implement event, video, and other niche schema types as applicable
- [ ] **International SEO** (if applicable): hreflang tags, localized content, country-specific domains/subfolders
- [ ] **Quarterly strategy review**: Reassess priorities based on performance data

---

## GEO Checklist (Universal)

Generative Engine Optimization ensures your content is cited by AI assistants and appears in AI Overviews.

### Content Structure

- [ ] **Clear, definitive statements**: Write "X is Y" rather than vague descriptions; LLMs extract direct claims
- [ ] **Structured headings**: Use descriptive H2/H3 that mirror common questions ("What is X?", "How does X work?")
- [ ] **Lists and tables**: Use HTML `<ul>`, `<ol>`, and `<table>` for structured data; LLMs parse these more reliably than prose
- [ ] **FAQ sections**: Use H2 or H3 for questions, followed by direct one-sentence answers, then elaboration
- [ ] **Statistics with attribution**: Include specific numbers with sources ("According to Gartner, 75% of enterprises will...")
- [ ] **Comparison content**: Side-by-side comparisons in table format are heavily cited by AI assistants

### Technical

- [ ] **Schema on every page**: Minimum Organization (homepage) and Article (content pages)
- [ ] **Author attribution**: Every content piece has a named author linked to a profile page
- [ ] **datePublished and dateModified**: Present in schema and visible on page
- [ ] **Canonical URLs**: Every page has a self-referencing canonical tag
- [ ] **Fast rendering**: Content must be available in initial HTML (not behind JavaScript-only rendering)
- [ ] **Mobile-friendly**: Responsive design that works on all devices

### Authority

- [ ] **Cite authoritative sources**: Reference industry leaders, academic research, and official data
- [ ] **Be citable yourself**: Write in a way that others (and AI) want to quote: clear, specific, evidence-based
- [ ] **Brand consistency**: Use the same brand name across all platforms, schema, and content
- [ ] **Freshness signals**: Display last-updated dates; update quarterly at minimum

---

## Customization Points

Use these decision points to adapt this template for specific business types.

### B2B vs B2C

| Dimension | B2B Adaptation | B2C Adaptation |
|---|---|---|
| Content tone | Professional, data-driven, ROI-focused | Conversational, benefit-driven, emotional |
| Sales cycle | Longer; create content for every funnel stage | Shorter; focus on transaction-ready content |
| Keywords | Industry jargon acceptable; feature-specific | Plain language; benefit-oriented |
| Schema | Service, ProfessionalService, SoftwareApplication | Product, Offer, LocalBusiness |
| Lead capture | Gated content (whitepapers, webinars) | Email signup, cart optimization |
| Social proof | Case studies with metrics, client logos | Reviews, ratings, user-generated content |

### Geographic Scope

| Scope | Adaptation |
|---|---|
| **Single city** | Focus on local SEO; Google Business Profile is priority #1; LocalBusiness schema |
| **Multi-city / regional** | Location pages for each city; service area business setup; regional content |
| **National** | Standard SEO without local signals; industry and solution pages matter most |
| **International** | hreflang implementation; localized content; country-specific subfolders or domains |

### Content Volume

| Team Size / Budget | Recommended Cadence |
|---|---|
| Solo / bootstrapped | 2 to 4 blog posts per month; focus on quality over quantity |
| Small team (2 to 5) | 4 to 8 posts per month; add guides and case studies |
| Medium team (5 to 15) | 8 to 16 posts per month; full content program with multiple formats |
| Enterprise | 16+ posts per month; dedicated content team with editorial calendar |

### Technology Stack Considerations

| Stack | SEO Consideration |
|---|---|
| **Static site (Next.js SSG, Gatsby, Astro)** | Best for SEO out of the box; fast, pre-rendered HTML |
| **Server-rendered (Next.js SSR, Nuxt)** | Good for SEO; ensure proper caching for performance |
| **Client-side SPA (React, Vue, Angular)** | Requires server-side meta injection or prerendering for SEO |
| **WordPress** | Good SEO plugin ecosystem (Yoast, RankMath); watch for plugin bloat and speed |
| **Headless CMS + frontend** | Flexible; ensure the frontend rendering strategy serves HTML to crawlers |
| **Shopify** | Built-in SEO basics; limited URL structure control; use apps for advanced schema |

---

## Quick Reference: SEO Checklist Per Page

Use this checklist for every new page published on the site:

### Before Publishing

- [ ] Title tag: 30 to 60 characters, includes primary keyword
- [ ] Meta description: 120 to 160 characters, includes keyword and CTA
- [ ] H1: Exactly one, includes primary keyword, visible on page
- [ ] H2/H3 structure: Logical hierarchy, no skipped levels
- [ ] URL: Clean, descriptive, lowercase, hyphens as separators
- [ ] Images: Alt text on all images; compressed; explicit width/height
- [ ] Internal links: 3+ links to relevant pages on the site
- [ ] External links: 1 to 2 links to authoritative sources (where appropriate)
- [ ] Schema: Appropriate type for the page (Article, Product, Service, etc.)
- [ ] Canonical tag: Self-referencing canonical present
- [ ] Author byline: Named author linked to profile (for content pages)
- [ ] OG tags: Title, description, image for social sharing
- [ ] Mobile: Renders correctly on mobile devices

### After Publishing

- [ ] Submit URL to Google Search Console for indexing
- [ ] Verify schema with Google Rich Results Test
- [ ] Check page with PageSpeed Insights
- [ ] Add internal links from 2 to 3 existing pages to the new page
- [ ] Share on social media channels
- [ ] Monitor GSC for indexing confirmation within 7 days
