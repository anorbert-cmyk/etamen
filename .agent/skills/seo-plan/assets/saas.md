# SaaS SEO Strategy Template

> Industry vertical template for Software-as-a-Service businesses.
> Load this template when the client operates a SaaS product, developer tool, or cloud platform.

---

## Industry Characteristics

SaaS SEO differs fundamentally from other verticals due to these traits:

| Characteristic | SEO Implication |
|---|---|
| **Long sales cycles** (30 to 180+ days) | Content must nurture across funnel stages; top-of-funnel alone will not convert |
| **Feature-focused evaluation** | Buyers compare feature matrices; dedicated feature pages rank for long-tail queries |
| **Comparison shopping** | "X vs Y" and "alternatives to X" queries carry 4 to 7% conversion rates |
| **Free trial / freemium models** | CTA optimization matters more than raw traffic volume |
| **High customer LTV** | Justifies investment in competitive head terms |
| **Technical audience segments** | Documentation and API references drive organic discovery |
| **Multi-stakeholder buying** | Content must address end users, managers, and procurement simultaneously |
| **Seasonal budget cycles** | Q4 and Q1 see elevated "best [category] software" searches |

---

## Recommended Site Architecture

```
/                                   Homepage (brand + category positioning)
├── /product                        Product overview (features summary, hero demo)
│   ├── /product/tour               Interactive product tour or video walkthrough
│   └── /product/changelog          Release notes (freshness signal, developer trust)
├── /features                       Feature hub page
│   ├── /features/[feature-slug]    Individual feature pages (one per core feature)
│   └── /features/[feature-slug]    Target "[category] [feature]" long-tail queries
├── /integrations                   Integration hub page
│   ├── /integrations/[partner]     Individual integration pages
│   └── /integrations/[partner]     Target "[product] + [partner] integration"
├── /solutions                      Use-case or persona hub
│   ├── /solutions/[use-case]       "for marketing teams", "for startups", etc.
│   └── /solutions/[industry]       "for healthcare", "for finance", etc.
├── /pricing                        Pricing page (target "[category] pricing")
├── /customers                      Customer hub
│   ├── /customers/[case-study]     Individual case studies with metrics
│   └── /customers/stories          Testimonial aggregation page
├── /resources                      Content hub
│   ├── /resources/blog             Blog (educational, thought leadership)
│   ├── /resources/guides           Long-form guides (2000+ words, pillar content)
│   ├── /resources/webinars         Webinar library (video + transcript for SEO)
│   ├── /resources/templates        Free templates (lead magnets with organic value)
│   └── /resources/glossary         Glossary of industry terms (long-tail capture)
├── /docs                           Documentation
│   ├── /docs/getting-started       Quickstart guides
│   ├── /docs/api                   API reference
│   └── /docs/[topic]               Technical documentation pages
├── /compare                        Comparison hub
│   ├── /compare/[competitor]       "Us vs Competitor" pages
│   └── /compare/[category]         Category comparison matrices
├── /about                          Company information
│   ├── /about/team                 Team page (E-E-A-T signals)
│   └── /about/careers              Careers (trust signal)
├── /contact                        Contact and sales
├── /security                       Security and compliance page
└── /legal                          Terms, privacy, DPA
    ├── /legal/terms
    ├── /legal/privacy
    └── /legal/dpa
```

### Architecture Rules

1. **Maximum depth**: 3 levels from root. Deeper pages lose crawl priority.
2. **Feature pages**: One page per sellable feature. Do NOT bundle 10 features onto one page.
3. **Integration pages**: Create only for integrations with search volume. Check "Ahrefs" or "Google Keyword Planner" first.
4. **Solution pages**: Minimum 4, maximum 12. More than 12 dilutes internal linking authority.
5. **Comparison pages**: Prioritize competitors with the highest branded search volume.

---

## Content Priorities

### High Priority (implement in Phase 1)

| Page Type | Word Count | Update Frequency | Target Intent |
|---|---|---|---|
| Homepage | 800 to 1200 | Monthly | Brand + category |
| Feature pages | 600 to 1000 each | Quarterly | Feature-specific long-tail |
| Pricing page | 400 to 800 | As pricing changes | Transactional |
| Comparison pages | 1200 to 2000 each | Quarterly | High-intent commercial |
| Case studies | 1000 to 1500 each | Ongoing | Trust, social proof |
| Documentation | Variable | Continuous | Developer discovery |

### Medium Priority (implement in Phase 2)

| Page Type | Word Count | Update Frequency | Target Intent |
|---|---|---|---|
| Blog posts | 1200 to 2500 | 2 to 4 per month | Informational, top-of-funnel |
| Solution pages | 800 to 1200 each | Quarterly | Use-case specific |
| Integration pages | 600 to 1000 each | As integrations launch | Partner + feature overlap |
| Long-form guides | 2000 to 4000 | Monthly | Pillar content, link building |
| Glossary terms | 300 to 600 each | As needed | Long-tail informational |
| Templates | 400 to 800 + downloadable asset | Monthly | Lead generation |
| Webinar pages | 300 to 500 + transcript | Per event | Video SEO, E-E-A-T |

---

## Schema Recommendations by Page Type

### Homepage

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your SaaS Name",
  "url": "https://yoursaas.com",
  "logo": "https://yoursaas.com/logo.png",
  "sameAs": [
    "https://twitter.com/yoursaas",
    "https://linkedin.com/company/yoursaas",
    "https://github.com/yoursaas"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "email": "sales@yoursaas.com"
  }
}
```

### Product / Feature Pages

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Your SaaS Name",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "lowPrice": "29",
    "highPrice": "299",
    "offerCount": "3"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "350",
    "bestRating": "5"
  },
  "featureList": [
    "Feature 1 description",
    "Feature 2 description",
    "Feature 3 description"
  ]
}
```

### Blog / Resource Pages

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title (max 110 chars)",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://yoursaas.com/about/team#author-slug"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Your SaaS Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yoursaas.com/logo.png"
    }
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-06-01",
  "image": "https://yoursaas.com/blog/headers/article-slug.jpg",
  "mainEntityOfPage": "https://yoursaas.com/resources/blog/article-slug"
}
```

### Pricing Page

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Pricing",
  "description": "Compare pricing plans for Your SaaS Name",
  "mainEntity": {
    "@type": "SoftwareApplication",
    "name": "Your SaaS Name",
    "offers": [
      {
        "@type": "Offer",
        "name": "Starter",
        "price": "29",
        "priceCurrency": "USD",
        "billingIncrement": "P1M"
      },
      {
        "@type": "Offer",
        "name": "Professional",
        "price": "99",
        "priceCurrency": "USD",
        "billingIncrement": "P1M"
      },
      {
        "@type": "Offer",
        "name": "Enterprise",
        "price": "299",
        "priceCurrency": "USD",
        "billingIncrement": "P1M"
      }
    ]
  }
}
```

### Comparison Pages

Use `WebPage` with structured comparison content. Do NOT use `ItemList` for competitor comparisons as Google may misinterpret the intent.

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Your SaaS vs Competitor",
  "description": "Detailed comparison of Your SaaS and Competitor across features, pricing, and support",
  "mainEntityOfPage": "https://yoursaas.com/compare/competitor"
}
```

---

## Comparison and Alternative Pages

### Why This Matters

Comparison and alternative pages are the highest-converting organic content type for SaaS:

| Content Type | Typical Conversion Rate | Search Intent |
|---|---|---|
| Blog posts (informational) | 0.5% to 1.8% | Awareness |
| Feature pages | 2% to 4% | Consideration |
| **Comparison pages ("X vs Y")** | **4% to 7%** | **Decision** |
| **Alternative pages ("alternatives to X")** | **4% to 7%** | **Decision** |
| Pricing pages | 3% to 6% | Decision |

### Template Structure for Comparison Pages

1. **Opening**: Acknowledge the buyer's dilemma (50 to 100 words)
2. **Quick verdict**: TL;DR comparison table at the top
3. **Feature-by-feature comparison**: 5 to 8 key dimensions with honest assessment
4. **Pricing comparison**: Side-by-side tier breakdown
5. **Pros and cons**: For both products (builds trust through fairness)
6. **Ideal customer profile**: "Choose X if..., Choose Us if..."
7. **Migration section**: How to switch (reduces friction)
8. **FAQ**: 3 to 5 comparison-specific questions

### Comparison Page Rules

- **Be honest**: Acknowledge competitor strengths. Readers detect bias and bounce.
- **Update quarterly**: Competitors ship features. Stale comparisons lose rankings.
- **Include screenshots**: Annotated UI comparisons increase time on page.
- **Target long-tail**: "[Competitor] alternative for [use-case]" captures micro-segments.
- **Internal link**: From each comparison page, link to relevant feature pages and case studies.

### Prioritization

Create comparison pages in this order:

1. **Direct competitors** with highest branded search volume
2. **Category leaders** (even if not direct competitors, people search "[leader] alternative")
3. **Adjacent tools** people might use instead (spreadsheets, manual processes)
4. **Deprecated or acquired products** (users searching for migration paths)

---

## GEO Checklist for SaaS

Generative Engine Optimization ensures your content surfaces in AI-generated answers (ChatGPT, Perplexity, Google AI Overviews, etc.).

- [ ] **Structured data on every page**: SoftwareApplication, Article, Organization schemas help LLMs parse your content
- [ ] **Definitive statements**: Write "X is a [category] platform that does Y" rather than vague marketing copy
- [ ] **Feature lists in clean HTML**: Use `<ul>` or `<ol>` for feature lists; LLMs extract lists more reliably than prose
- [ ] **Comparison tables**: HTML `<table>` elements with clear headers are heavily cited by AI Overviews
- [ ] **Statistics with sources**: Include specific numbers ("reduces onboarding time by 40%") with source attribution
- [ ] **Author attribution**: Every article has a named author with a linked bio page
- [ ] **FAQ sections**: Use `<h2>` or `<h3>` question headings followed by direct answers (first sentence is the answer, then elaboration)
- [ ] **Freshness signals**: Display "Last updated: [date]" prominently; LLMs prefer recent content
- [ ] **Canonical definitions**: If you coin a term or define a concept, use the pattern "What is [X]? [X] is..." to become the canonical source
- [ ] **Cite authoritative sources**: Reference Gartner, Forrester, G2, or academic research to boost credibility signals
- [ ] **Pricing transparency**: Display actual prices; AI assistants frequently answer "how much does X cost" queries
- [ ] **API documentation**: Well-structured docs with code examples are heavily cited by developer-focused AI tools

---

## Key Metrics to Track

### Organic Performance

| Metric | Tool | Target | Frequency |
|---|---|---|---|
| Organic sessions | Google Analytics 4 | +15% QoQ | Weekly |
| Keyword rankings (top 10) | Ahrefs / SEMrush | +20 keywords per quarter | Weekly |
| Organic signups / trials | GA4 + CRM | +10% QoQ | Weekly |
| Organic MRR contribution | CRM attribution | Track trend | Monthly |

### Content Performance

| Metric | Tool | Target | Frequency |
|---|---|---|---|
| Comparison page conversion rate | GA4 | 4% to 7% | Monthly |
| Blog to signup rate | GA4 | 0.5% to 2% | Monthly |
| Average time on page | GA4 | 3+ minutes (blog), 2+ minutes (feature) | Monthly |
| Pages per session (organic) | GA4 | 2.5+ | Monthly |

### Technical SEO

| Metric | Tool | Target | Frequency |
|---|---|---|---|
| Core Web Vitals pass rate | PageSpeed Insights / CrUX | 90%+ URLs passing | Monthly |
| Index coverage errors | Google Search Console | 0 critical errors | Weekly |
| Crawl budget efficiency | GSC + server logs | 90%+ useful crawls | Monthly |
| Schema validation errors | Schema.org validator | 0 errors | Per deployment |

### GEO (Generative Engine Optimization)

| Metric | Tool | Target | Frequency |
|---|---|---|---|
| AI Overview appearances | Manual tracking / Semrush | Increase MoM | Monthly |
| Brand mentions in AI answers | Perplexity / ChatGPT manual checks | Presence in top 3 competitors | Monthly |
| Citation rate | Track referral from AI platforms | Establish baseline, then grow | Monthly |
| Structured data coverage | Schema validator | 100% of indexable pages | Per deployment |

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1 to 4)

- [ ] Technical SEO audit and fixes (crawlability, indexing, Core Web Vitals)
- [ ] Homepage optimization (category keyword targeting, Organization schema)
- [ ] Pricing page optimization (SoftwareApplication schema, comparison keywords)
- [ ] Top 3 feature pages created or optimized
- [ ] SoftwareApplication schema deployed site-wide

### Phase 2: Competitive Moat (Weeks 5 to 8)

- [ ] Top 5 comparison pages published (highest volume competitors)
- [ ] Top 3 alternative pages published
- [ ] Case studies published with metrics (minimum 3)
- [ ] Integration pages for top 5 partners

### Phase 3: Content Engine (Weeks 9 to 16)

- [ ] Blog cadence established (2 to 4 posts per month)
- [ ] 2 pillar guides published (2000+ words each)
- [ ] Glossary seeded with 20+ terms
- [ ] Solution pages for top 4 use cases
- [ ] Documentation SEO audit and optimization

### Phase 4: Authority (Ongoing)

- [ ] Link building via guest posts, data studies, partnerships
- [ ] Quarterly content refresh (update dates, stats, competitor mentions)
- [ ] GEO optimization pass across all key pages
- [ ] Expand comparison and alternative pages to cover 10+ competitors
- [ ] Webinar program with transcript-based SEO pages
