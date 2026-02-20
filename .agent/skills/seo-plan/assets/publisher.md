# Publisher / Media SEO Strategy Template

> Industry vertical template for news publishers, content platforms, digital magazines, and media companies.
> Load this template when the client produces high-volume editorial content and depends on organic traffic for ad revenue or subscriptions.

---

## Industry Characteristics

| Characteristic | SEO Implication |
|---|---|
| **High content volume** (10 to 100+ articles per day) | Crawl budget management, sitemap strategy, and editorial workflow automation are critical |
| **Time-sensitive content** | Freshness signals, Google News eligibility, and publication speed directly affect rankings |
| **Ad revenue dependency** | Traffic volume is the primary KPI; even small ranking drops have significant revenue impact |
| **AI Overviews impact** (publishers lose 20 to 60% CTR on queries with AI Overviews) | Diversify traffic sources; optimize for AI citation; invest in unique reporting |
| **E-E-A-T scrutiny** (YMYL topics face highest quality bar) | Author pages, editorial standards, corrections policy are mandatory |
| **Content decay** (news articles lose 90% of traffic within 72 hours) | Evergreen content strategy alongside breaking news is essential for sustainable traffic |
| **Syndication and duplicate content** | Canonical management for syndicated content prevents self-cannibalization |
| **Subscription/paywall considerations** | Google supports paywalled content via `isAccessibleForFree` schema, but implementation must follow guidelines |

---

## Site Architecture

```
/                                   Homepage (top stories, trending, editorial picks)
├── /news                           News hub (reverse-chronological feed)
│   ├── /news/[category]            Category feeds
│   │   Example: /news/technology
│   │   Example: /news/politics
│   │   Example: /news/business
│   └── /news/[category]/[slug]     Individual news articles
│       Example: /news/technology/apple-announces-m5-chip
├── /topics                         Topic hub (evergreen topic pages)
│   ├── /topics/[topic-slug]        Topic aggregation pages
│   │   Example: /topics/artificial-intelligence
│   │   Example: /topics/climate-change
│   │   Example: /topics/cryptocurrency
│   └── /topics/[topic-slug]        Automatically aggregate related articles
├── /opinion                        Opinion/editorial section
│   ├── /opinion/[slug]             Op-eds, editorials, columns
│   └── /opinion/[columnist]        Columnist archive pages
├── /reviews                        Product/service reviews
│   ├── /reviews/[category]         Review category pages
│   └── /reviews/[slug]             Individual review articles
├── /features                       Long-form features and investigations
│   └── /features/[slug]            In-depth feature articles (2000+ words)
├── /authors                        Author hub page
│   └── /authors/[author-slug]      Individual author profile pages
│       Includes: bio, credentials, article archive, social links
├── /video                          Video content hub
│   └── /video/[slug]               Video pages with transcript
├── /podcasts                       Podcast hub (if applicable)
│   └── /podcasts/[episode-slug]    Episode pages with transcript and show notes
├── /newsletters                    Newsletter landing pages
│   └── /newsletters/[name]         Individual newsletter signup pages
├── /about                          About the publication
│   ├── /about/editorial-standards  Editorial standards and corrections policy
│   ├── /about/team                 Masthead / editorial team
│   └── /about/contact              Contact, tips, press inquiries
└── /search                         Site search results page (noindex)
```

### Architecture Rules

1. **URL includes date**: For news articles, include date in URL path (`/news/2026/02/14/article-slug`) or use a flat structure with publication date in schema. Date in URL helps crawlers and users assess freshness.
2. **Topic pages are evergreen**: `/topics/` pages should auto-aggregate related articles and serve as pillar content. Update the topic description quarterly.
3. **Author pages are mandatory**: Every bylined article links to an author page. Author pages must include bio, credentials, article archive, and external profile links.
4. **Pagination**: News archives use paginated URLs with `rel="next"` / `rel="prev"`. Do NOT rely on infinite scroll alone.
5. **Expired content**: News articles older than 2 years can be noindexed if they generate zero traffic, but keep the URL live (200 status) for link equity.

---

## Schema Markup

### NewsArticle Schema (Every News Article)

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Apple Announces M5 Chip with 40% Performance Improvement",
  "alternativeHeadline": "M5 Chip Brings Biggest Performance Leap in Three Years",
  "description": "Apple unveiled the M5 processor at WWDC 2026, promising 40% faster CPU performance and 50% better machine learning throughput.",
  "image": {
    "@type": "ImageObject",
    "url": "https://publisher.example.com/images/apple-m5-chip.jpg",
    "width": 1200,
    "height": 630,
    "caption": "The Apple M5 chip on a MacBook Pro logic board"
  },
  "datePublished": "2026-02-14T09:00:00-05:00",
  "dateModified": "2026-02-14T14:30:00-05:00",
  "author": [
    {
      "@type": "Person",
      "name": "Jane Smith",
      "url": "https://publisher.example.com/authors/jane-smith",
      "jobTitle": "Senior Technology Editor",
      "sameAs": [
        "https://twitter.com/janesmith",
        "https://linkedin.com/in/janesmith"
      ]
    }
  ],
  "publisher": {
    "@type": "Organization",
    "name": "Example Publisher",
    "url": "https://publisher.example.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://publisher.example.com/logo.png",
      "width": 600,
      "height": 60
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://publisher.example.com/news/technology/apple-announces-m5-chip"
  },
  "articleSection": "Technology",
  "wordCount": 1500,
  "keywords": ["Apple", "M5 chip", "WWDC 2026", "processor", "MacBook"],
  "isAccessibleForFree": true,
  "speakable": {
    "@type": "Speakable",
    "cssSelector": [".article-headline", ".article-summary"]
  }
}
```

### For Paywalled Content

Add `isAccessibleForFree: false` and use `hasPart` to specify which sections are free:

```json
{
  "@type": "NewsArticle",
  "isAccessibleForFree": false,
  "hasPart": [
    {
      "@type": "WebPageElement",
      "isAccessibleForFree": true,
      "cssSelector": ".article-lead"
    },
    {
      "@type": "WebPageElement",
      "isAccessibleForFree": false,
      "cssSelector": ".article-body"
    }
  ]
}
```

### Person Schema (Author Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jane Smith",
  "url": "https://publisher.example.com/authors/jane-smith",
  "image": "https://publisher.example.com/authors/headshots/jane-smith.jpg",
  "jobTitle": "Senior Technology Editor",
  "worksFor": {
    "@type": "Organization",
    "name": "Example Publisher",
    "url": "https://publisher.example.com"
  },
  "description": "Jane Smith has covered the technology industry for 12 years, specializing in semiconductor design and consumer electronics. Previously at Wired and The Verge.",
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Columbia Journalism School"
  },
  "sameAs": [
    "https://twitter.com/janesmith",
    "https://linkedin.com/in/janesmith",
    "https://janesmith.com"
  ],
  "knowsAbout": ["Technology", "Semiconductors", "Consumer Electronics", "Apple"]
}
```

### ProfilePage Schema (Author Profile Pages)

Google introduced `ProfilePage` markup in 2024 to help identify creator pages. Use alongside `Person`:

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "Jane Smith",
    "url": "https://publisher.example.com/authors/jane-smith",
    "description": "Senior Technology Editor covering semiconductors and consumer electronics"
  },
  "dateCreated": "2020-03-15",
  "dateModified": "2026-02-14"
}
```

---

## E-E-A-T Requirements

E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) is the most important quality signal for publishers. Google's Quality Rater Guidelines hold news and media to the highest standards.

### Author Pages (Mandatory)

Every author page must include:

| Element | Requirement |
|---|---|
| **Full name** | Real name, not pseudonym (unless safety concerns) |
| **Professional headshot** | High-quality photo, consistent across the site |
| **Bio** | 150 to 300 words covering experience, beat, credentials |
| **Credentials** | Education, awards, previous publications, industry expertise |
| **Article archive** | Paginated list of all articles by this author |
| **Social profiles** | Links to Twitter/X, LinkedIn, personal website |
| **Contact** | Email or contact form for tips and corrections |
| **Author schema** | Person + ProfilePage structured data |

### Editorial Standards Page (Mandatory)

Publish at `/about/editorial-standards` and include:

- [ ] Editorial mission statement
- [ ] Fact-checking process description
- [ ] Corrections and updates policy (how errors are handled)
- [ ] Conflict of interest disclosure policy
- [ ] Advertising vs editorial separation statement
- [ ] Source attribution standards
- [ ] AI usage disclosure (if AI tools are used in content creation)
- [ ] Contact information for editorial complaints

### Trust Signals

- [ ] Physical address of the publication (in footer or about page)
- [ ] Copyright notice with current year
- [ ] Privacy policy and terms of service
- [ ] Masthead listing editorial leadership
- [ ] Awards and industry recognition
- [ ] Membership in journalism organizations (SPJ, Online News Association, etc.)

---

## Publisher Updates: 2025 and 2026

### Google News: Automatic Inclusion (2025)

| Change | Impact |
|---|---|
| **Google News no longer requires manual submission** | Sites are automatically evaluated for Google News inclusion based on content quality, E-E-A-T signals, and technical setup |
| **News sitemap still recommended** | While not required for inclusion, news sitemaps (`<news:news>` format) help Google discover and index articles faster |
| **Publication name in schema** | Ensure `publisher.name` in NewsArticle schema matches your Google News publication name exactly |

**Action**: Focus on content quality and E-E-A-T rather than Google News Publisher Center settings. The center still exists for branding (logo, publication name) but inclusion is algorithmic.

### KPI Shift: From Traffic to Engagement and Revenue

Publishers in 2025/2026 should track these KPIs alongside raw traffic:

| Old KPI | New KPI | Why |
|---|---|---|
| Pageviews | **Engaged sessions** (GA4) | AI Overviews satisfy queries without clicks; raw pageviews decline |
| Unique visitors | **Subscriber growth rate** | Subscription revenue is more resilient than ad revenue |
| Bounce rate | **Scroll depth and time on page** | Engagement quality matters more than quantity |
| Keyword rankings | **AI citation rate** | Being cited in AI answers is a new discovery channel |
| Backlinks | **Brand search volume** | Brand strength protects against algorithm volatility |

### Site Reputation Abuse (Google March 2024 Update, Enforced 2025)

Google now penalizes publishers that host low-quality third-party content to exploit domain authority.

| Risk | Example | Action |
|---|---|---|
| **Coupon subdomains** | `coupons.publisher.com` with thin affiliate content | Remove or noindex; or invest in genuine editorial quality |
| **Sponsored content farms** | `/sponsored/` section with minimal editorial oversight | Ensure all sponsored content meets editorial standards |
| **Third-party product reviews** | Unvetted product reviews on high-DA publisher domain | Apply same editorial standards as regular content |
| **Parasite SEO partnerships** | Renting subdirectories to external companies | Terminate these arrangements; Google is actively targeting them |

**Rule**: Every page on your domain must meet the same editorial quality bar, regardless of who created it or how it is monetized.

---

## GEO Considerations for Publishers

### AI Citation as a Standalone KPI

In 2025/2026, publisher SEO must treat **AI citation** as a first-class metric alongside organic search traffic.

#### Why

- AI Overviews appear on 30 to 40% of informational queries (the core of publisher traffic)
- When an AI Overview cites your publication, it drives brand awareness even without a click
- Users increasingly trust AI-recommended sources, creating a halo effect for cited publications
- Perplexity, ChatGPT with browsing, and Google AI Overviews all cite sources differently; optimize for all three

#### How to Optimize for AI Citation

| Strategy | Implementation |
|---|---|
| **Be the primary source** | Break news first; original reporting gets cited more than aggregation |
| **Structured claims** | Write clear, attributable statements: "According to [Source], [Claim]." LLMs extract these patterns |
| **Data journalism** | Original data, surveys, and analysis are the highest-cited content type |
| **Expert quotes** | Named expert quotes with credentials are frequently extracted by AI |
| **Clear article structure** | Use descriptive H2/H3 headings, short paragraphs, and bullet points; LLMs parse structured content better than long prose |
| **Speakable schema** | Mark key summary sections with Speakable schema for voice assistant citation |
| **Fact-check markup** | Use ClaimReview schema for fact-checking articles |
| **Freshness** | Update dateModified when substantive edits are made; AI models prefer recent sources |

#### Tracking AI Citations

| Method | Tool/Approach |
|---|---|
| **Manual sampling** | Weekly: Search 10 key topics in ChatGPT, Perplexity, Google AI Overviews; record citations |
| **Referral traffic** | Monitor GA4 for referrals from `perplexity.ai`, `chat.openai.com`, and other AI platforms |
| **Brand monitoring** | Use Mention, Brandwatch, or similar to track when your publication is named in AI-generated content |
| **Search Console** | Monitor impressions on queries that trigger AI Overviews (Google is adding this reporting) |

---

## Content Strategy for Publishers

### Content Types and SEO Treatment

| Content Type | SEO Priority | Schema | Update Cycle | Word Count |
|---|---|---|---|---|
| Breaking news | High (speed) | NewsArticle | One-time with corrections | 300 to 800 |
| Analysis/explainers | High (depth) | NewsArticle or Article | Update as story evolves | 1000 to 2500 |
| Investigative/features | High (E-E-A-T) | NewsArticle | Rarely updated | 2000 to 5000+ |
| Opinion/editorials | Medium | Article (not NewsArticle) | One-time | 800 to 1500 |
| Product reviews | High (commerce) | Review + Product | Update annually | 1500 to 3000 |
| Listicles/roundups | Medium | Article + ItemList | Update quarterly | 1500 to 2500 |
| Evergreen reference | High (sustainable traffic) | Article | Update quarterly | 1500 to 3000 |
| Topic pages | High (hub content) | CollectionPage | Auto-updated on publish | 300 + article feed |

### Evergreen Strategy (Critical for Revenue Stability)

Breaking news drives spikes; evergreen content drives baseline. Target a 40/60 split:

- **40% breaking/timely**: News, reactions, event coverage
- **60% evergreen**: Explainers, how-tos, buyer's guides, reference content

Evergreen articles should be refreshed quarterly with updated statistics, new examples, and current dateModified.

---

## Technical SEO for Publishers

### Sitemaps

| Sitemap Type | Purpose | Update Frequency |
|---|---|---|
| **News sitemap** (`/sitemap-news.xml`) | Articles published in last 48 hours | Real-time (on publish) |
| **Standard sitemap** (`/sitemap.xml`) | All indexable URLs | Daily |
| **Video sitemap** (`/sitemap-video.xml`) | Video content pages | On publish |
| **Sitemap index** (`/sitemap-index.xml`) | References all sitemaps | Daily |

### Crawl Budget

For high-volume publishers, crawl budget is a real constraint:

- [ ] Remove low-value pages from index (tag pages with < 5 articles, date archives, empty author pages)
- [ ] Use `robots.txt` to block crawling of search results, print pages, and AMP versions (if deprecated)
- [ ] Implement server-side rendering or pre-rendering; do not rely on JavaScript rendering for article content
- [ ] Monitor crawl stats in GSC; aim for 90%+ crawl requests on high-value content
- [ ] Set appropriate cache headers (news articles: short TTL; evergreen: long TTL)

### Page Speed

| Metric | Target | Common Publisher Issues |
|---|---|---|
| LCP | < 2.5s | Ad scripts blocking render; hero images unoptimized |
| INP | < 200ms | Ad refresh JavaScript; social embed widgets |
| CLS | < 0.1 | Ad slots without reserved dimensions; lazy-loaded images without width/height |

**Critical**: Ad scripts are the number one cause of poor Core Web Vitals for publishers. Use lazy loading for below-fold ads, reserve explicit dimensions for all ad slots, and defer non-critical ad scripts.

---

## Key Metrics to Track

### Traffic and Revenue

| Metric | Tool | Target | Frequency |
|---|---|---|---|
| Organic sessions | GA4 | Monitor trend (expect AI Overview impact) | Daily |
| Ad revenue per organic session | Ad server + GA4 | Maintain or improve RPM | Weekly |
| Subscriber conversions from organic | GA4 + subscription platform | +10% QoQ | Monthly |
| Engaged sessions (scroll depth > 75%) | GA4 | 40%+ of sessions | Weekly |

### Search Visibility

| Metric | Tool | Target | Frequency |
|---|---|---|---|
| Google News impressions | GSC (News tab) | Maintain or grow MoM | Weekly |
| Discover impressions | GSC (Discover tab) | Establish baseline, grow | Weekly |
| Top Stories appearances | GSC (Search Appearance) | Track by topic/category | Weekly |
| AI Overview citations | Manual tracking | Increase MoM | Monthly |

### Content Quality

| Metric | Tool | Target | Frequency |
|---|---|---|---|
| Average time on page | GA4 | 2+ minutes (news), 4+ minutes (features) | Weekly |
| Author page traffic | GA4 | Growing (signals E-E-A-T investment) | Monthly |
| Correction rate | Editorial CMS | < 2% of published articles | Monthly |
| Content freshness (% updated in last 90 days) | CMS audit | 60%+ of evergreen content | Quarterly |

### Technical

| Metric | Tool | Target | Frequency |
|---|---|---|---|
| Crawl budget efficiency | GSC | 90%+ useful crawls | Weekly |
| Index coverage errors | GSC | 0 critical errors | Daily |
| Core Web Vitals pass rate | CrUX | 75%+ (publisher standard, ads make 90% difficult) | Monthly |
| News sitemap freshness | Manual check | Updated within 5 minutes of publish | Weekly |
