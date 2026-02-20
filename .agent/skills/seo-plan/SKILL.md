---
name: SEO Plan
description: Strategic SEO planning for new or existing websites with a 6-step process, industry templates, and phased implementation roadmaps.
---

# SEO Plan Skill

## Purpose

Create comprehensive, actionable SEO strategies for new or existing websites. This skill provides a structured 6-step planning process, industry-specific templates, and a phased implementation roadmap designed to deliver measurable results within 12 months.

## 6-Step SEO Planning Process

### Step 1: Discovery

Gather foundational information before making any recommendations.

**Required Inputs:**
- Business type and industry vertical
- Target audience (demographics, geography, intent profiles)
- Current website URL (if existing site)
- Primary business goals (leads, sales, signups, awareness)
- Revenue model (SaaS, e-commerce, service, content/ads)
- Existing analytics data (traffic, top pages, conversion rates)
- Brand positioning and unique value proposition
- Budget and resource constraints (in-house vs agency vs AI-assisted)

**Discovery Outputs:**
- Business context summary
- Target audience personas (2 to 4 personas with search behavior profiles)
- Current SEO baseline metrics (if existing site)
- Opportunity sizing estimate (total addressable search traffic)

**Analysis Framework:**
1. Identify the primary conversion action (what "success" means for this site)
2. Map the customer journey from awareness to conversion
3. Identify which journey stages have the highest search volume
4. Determine content types needed at each stage (informational, commercial, transactional)

### Step 2: Competitive Analysis

Analyze the top 5 organic competitors (not just business competitors).

**Per Competitor, Analyze:**

| Factor | What to Measure | Tool/Method |
|--------|----------------|-------------|
| **Domain Authority** | DA/DR score, referring domains count | Ahrefs, Moz, Semrush |
| **Content Volume** | Total indexed pages, blog post frequency | `site:competitor.com` query, Screaming Frog |
| **Keyword Coverage** | Number of ranking keywords, keyword overlap | Semrush Keyword Gap, Ahrefs Content Gap |
| **Top Pages** | Highest traffic pages and their content format | Ahrefs Top Pages, Semrush Organic Research |
| **Content Types** | Blog posts, tools, templates, comparison pages, glossaries | Manual review |
| **Technical SEO** | Core Web Vitals, mobile usability, schema markup | PageSpeed Insights, Rich Results Test |
| **Backlink Profile** | Top referring domains, link velocity, anchor text distribution | Ahrefs Backlink Checker |
| **SERP Features** | Featured snippets, PAA, knowledge panels owned | Manual SERP review |
| **AI Visibility** | Brand mentions in AI overviews, ChatGPT citations | Manual AI search testing |

**Competitive Analysis Outputs:**
- Competitor comparison matrix (strengths, weaknesses, opportunities)
- Content gap analysis (keywords competitors rank for that you do not)
- Link gap analysis (domains linking to competitors but not to you)
- SERP feature opportunities (featured snippets, PAA boxes you can capture)
- Competitive advantage identification (what you can do that they cannot)

### Step 3: Architecture Design

Design the site structure for both users and search engines.

**URL Hierarchy Principles:**
- Maximum 3 levels deep from the homepage for any indexable page
- Flat architecture preferred (every important page within 3 clicks of homepage)
- Logical category grouping that mirrors user mental models
- Clean URL patterns: `/category/subcategory/page-name`

**Architecture Components:**

| Component | Purpose | Example |
|-----------|---------|---------|
| **Pillar Pages** | Comprehensive topic hubs that target head terms | `/startup-validation` |
| **Cluster Pages** | Supporting content targeting long-tail keywords | `/blog/how-to-validate-startup-idea` |
| **Service/Product Pages** | Conversion-focused pages targeting commercial intent | `/pricing`, `/features` |
| **Comparison Pages** | Capture competitive search intent | `/vs/competitor-name` |
| **Resource Pages** | Link magnets and authority builders | `/tools/free-calculator`, `/templates` |
| **Location Pages** | Local SEO targeting (if applicable) | `/services/new-york` |

**Internal Linking Strategy:**
- Every pillar page links to all its cluster pages
- Every cluster page links back to its pillar page
- Cross-link related clusters where contextually relevant
- Use descriptive, keyword-rich anchor text (not "click here")
- Maintain a link equity flow from high-authority pages to conversion pages

**Reference**: Use templates from `assets/` directory for industry-specific architecture blueprints.

### Step 4: Content Strategy

Plan content production aligned with business goals and search demand.

**Content Prioritization Matrix:**

| Priority | Criteria | Action |
|----------|----------|--------|
| **P0 (Immediate)** | High search volume + high commercial intent + low competition | Create within first 4 weeks |
| **P1 (High)** | Medium volume + commercial intent OR high volume + informational | Create within weeks 5 to 12 |
| **P2 (Medium)** | Supporting content for P0/P1 clusters, internal linking targets | Create within weeks 13 to 24 |
| **P3 (Ongoing)** | Thought leadership, brand building, long-tail coverage | Continuous production |

**Content Types to Plan:**

| Type | SEO Purpose | Cadence |
|------|------------|---------|
| **Blog Posts** | Informational keyword coverage, topical authority | 2 to 4 per month |
| **Pillar Pages** | Head term targeting, link magnets | 1 per quarter |
| **Comparison Pages** | Competitive keyword capture | As needed per competitor |
| **Case Studies** | E-E-A-T signals, conversion support | 1 per month |
| **Tools/Calculators** | Link magnets, engagement, brand queries | 1 per quarter |
| **Glossary/Definitions** | Featured snippet capture, topical coverage | Build library of 20 to 50 |
| **FAQ Pages** | PAA box capture, AI Overview citations | Per major topic area |

**Content Brief Template (per piece):**
- Target keyword (primary + 3 to 5 secondary)
- Search intent classification (informational, commercial, transactional, navigational)
- Target word count (based on SERP analysis of ranking content)
- Required sections and heading structure
- Internal links to include (minimum 3)
- External authority links to include (minimum 3 high-DA sources)
- Schema markup type (Article, FAQ, HowTo, etc.)
- CTA placement strategy

### Step 5: Technical Foundation

Establish the technical SEO infrastructure required for the strategy.

**Technical Requirements Checklist:**

| Category | Requirements |
|----------|-------------|
| **Crawlability** | XML sitemap, robots.txt, clean URL structure, no orphan pages |
| **Indexability** | Canonical tags, noindex on thin/duplicate pages, pagination handling |
| **Performance** | Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1), image optimization, CDN |
| **Mobile** | Responsive design, mobile-first indexing compliance, touch target sizing |
| **Security** | HTTPS everywhere, HSTS headers, no mixed content |
| **Structured Data** | Organization schema, breadcrumb schema, page-type-specific schema |
| **International** | Hreflang tags (if multi-language/region), correct language declarations |
| **AI Readiness** | llms.txt, AI crawler access in robots.txt, structured FAQ content |

**Technical Audit Priorities:**
1. Fix crawl errors and broken links (immediate)
2. Implement canonical tags and resolve duplicate content (week 1)
3. Optimize Core Web Vitals (weeks 1 to 4)
4. Implement structured data (weeks 2 to 4)
5. Set up monitoring (Search Console, analytics, rank tracking)

### Step 6: Implementation Roadmap

A phased execution plan designed for sustainable growth.

#### Phase 1: Foundation (Weeks 1 to 4)

| Week | Focus | Deliverables |
|------|-------|-------------|
| 1 | Technical audit and fixes | Crawl error resolution, canonical implementation, sitemap submission |
| 2 | On-page optimization | Title tags, meta descriptions, heading structure for existing pages |
| 3 | Content infrastructure | Blog setup, category structure, content calendar creation |
| 4 | Analytics and monitoring | Search Console verification, rank tracking setup, baseline metrics documented |

**Phase 1 Success Metrics:**
- Zero critical technical errors
- All existing pages have unique title tags and meta descriptions
- Sitemap submitted and indexed
- Baseline traffic and ranking data recorded

#### Phase 2: Expansion (Weeks 5 to 12)

| Focus | Deliverables |
|-------|-------------|
| P0 content creation | 4 to 8 high-priority pieces published |
| Internal linking | Link architecture implemented across all existing and new content |
| Schema markup | Structured data on all key page types |
| First link building campaign | 5 to 10 quality backlinks acquired |
| AI optimization | llms.txt created, FAQ sections added, citability optimized |

**Phase 2 Success Metrics:**
- 20% increase in indexed keywords
- Core Web Vitals passing on all pages
- Schema markup validated on 100% of eligible pages
- First featured snippets or SERP features captured

#### Phase 3: Growth (Weeks 13 to 24)

| Focus | Deliverables |
|-------|-------------|
| P1 content production | 8 to 16 additional content pieces |
| Comparison and alternatives pages | 3 to 5 competitor comparison pages |
| Content refresh | Update and re-optimize Phase 2 content based on performance data |
| Advanced link building | Guest posts, digital PR, resource link building |
| Conversion optimization | CTA testing, landing page optimization |

**Phase 3 Success Metrics:**
- 50% increase in organic traffic from baseline
- 10+ keywords in top 10 positions
- Measurable conversion improvement from organic traffic
- Multiple SERP features captured

#### Phase 4: Authority (Months 7 to 12)

| Focus | Deliverables |
|-------|-------------|
| Topical authority | Complete coverage of primary topic clusters |
| Thought leadership | Original research, data studies, expert contributions |
| P2 and P3 content | Long-tail coverage and supporting content |
| International/local expansion | If applicable, hreflang or location page rollout |
| Programmatic SEO | If applicable, scaled page generation with quality gates |

**Phase 4 Success Metrics:**
- 100%+ increase in organic traffic from baseline
- Dominant positions (top 3) for primary keywords
- Brand appearing in AI Overviews and AI search citations
- Sustainable organic growth trajectory established

## Industry Templates

Select the appropriate template based on business type. Templates are available in the `assets/` directory.

| Template | File | Best For |
|----------|------|----------|
| **SaaS** | `assets/saas-template.md` | Software products, subscription services, developer tools |
| **Local Service** | `assets/local-service-template.md` | Plumbers, lawyers, dentists, restaurants, local businesses |
| **E-commerce** | `assets/ecommerce-template.md` | Online stores, marketplaces, product catalogs |
| **Publisher** | `assets/publisher-template.md` | News sites, magazines, content platforms, blogs |
| **Agency** | `assets/agency-template.md` | Marketing agencies, consultancies, professional services |
| **Generic** | `assets/generic-template.md` | Any site that does not fit the above categories |

Each template includes:
- Pre-configured site architecture blueprint
- Industry-specific keyword research framework
- Recommended content types and cadence
- Common technical SEO requirements for the industry
- Competitive benchmarks and realistic timeline expectations

## Rules

1. ALWAYS complete the Discovery step before making any recommendations. Never skip straight to tactics.
2. ALWAYS analyze at least 5 organic competitors, not just direct business competitors.
3. ALWAYS create a phased roadmap. Never dump all tasks into a single "to do" list.
4. ALWAYS prioritize content by search volume, commercial intent, and competition level.
5. ALWAYS include technical SEO as a foundation, not an afterthought.
6. ALWAYS set measurable success metrics for each phase.
7. NEVER recommend tactics without explaining the expected impact and timeline.
8. NEVER create a plan that requires more resources than the client has available.
9. ALWAYS reference the appropriate industry template from the `assets/` directory.
10. ALWAYS include AI/GEO readiness as part of the technical foundation (llms.txt, AI crawler access, citability optimization).
11. ALWAYS plan for content refresh cycles. Content published in Phase 2 should be reviewed and updated in Phase 3.
12. NEVER recommend keyword cannibalization. Each page must target a distinct primary keyword.
