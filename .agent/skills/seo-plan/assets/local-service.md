# Local Service Business SEO Strategy Template

> Industry vertical template for local service businesses (plumbers, HVAC, lawyers, dentists, landscapers, home services, etc.).
> Load this template when the client serves a defined geographic area and depends on local search visibility.

---

## Industry Characteristics

| Characteristic | SEO Implication |
|---|---|
| **Geographic intent** (90%+ of searches include location) | Every service page needs a city/region modifier or local landing page |
| **High purchase intent** ("near me" queries convert at 28%+) | Optimize for transactional and local pack keywords first |
| **Reviews-driven** (88% of consumers trust online reviews as much as referrals) | Review generation and schema markup are top priorities |
| **Mobile-first** (76% of local searches happen on mobile) | Page speed and mobile UX are non-negotiable |
| **Same-day decision cycles** | Speed of information delivery matters: phone number, hours, service area above the fold |
| **Repeat and referral business** | NAP consistency and brand recognition drive long-term value |
| **Multi-location complexity** | Each real location needs a unique page; SABs need service-area pages |
| **Google Business Profile dependency** | GBP optimization is equal in importance to on-site SEO for local |

---

## Site Architecture

```
/                                   Homepage (brand + primary service + primary city)
├── /services                       Service hub page
│   ├── /services/[service-slug]    Individual service pages
│   │   Example: /services/emergency-plumbing
│   │   Example: /services/water-heater-installation
│   │   Example: /services/drain-cleaning
│   └── /services/[service-slug]    Target "[service] [city]" queries
├── /locations                      Location hub page (service area map)
│   ├── /locations/[city-slug]      City landing pages
│   │   Example: /locations/austin-tx
│   │   Example: /locations/round-rock-tx
│   │   Example: /locations/cedar-park-tx
│   └── /locations/[city-slug]/[service-slug]   (OPTIONAL: city + service combos)
│       Example: /locations/austin-tx/emergency-plumbing
│       WARNING: Only create these if search volume justifies it
├── /about                          About page (E-E-A-T, trust signals)
│   ├── /about/team                 Team bios with credentials and photos
│   └── /about/certifications       Licenses, insurance, certifications
├── /reviews                        Review aggregation page
│   └── /reviews/[platform]         Optional: per-platform review highlights
├── /blog                           Blog / resource center
│   ├── /blog/[post-slug]           Educational content, seasonal tips, local guides
│   └── /blog/[post-slug]           Target informational "how to" queries
├── /gallery                        Before/after project photos (image SEO)
├── /contact                        Contact page with embedded map
├── /emergency                      (If applicable) Emergency service page
└── /financing                      (If applicable) Financing options page
```

### Architecture Rules

1. **Flat hierarchy**: Maximum 3 clicks from homepage to any page.
2. **Service pages first**: Prioritize service pages over location pages. A well-optimized service page ranks in local pack.
3. **Location pages**: Create only for cities/areas you actively serve and can verify with Google Business Profile.
4. **No thin location pages**: Every location page must have unique content (local testimonials, team members in that area, specific service details).

---

## Location Page Quality Gates

### WARNING Thresholds

| Location Page Count | Gate Level | Action Required |
|---|---|---|
| 1 to 15 | **GREEN** | Standard creation. Unique content per page required. |
| 16 to 29 | **YELLOW** | Review each page for thin content. Consolidate nearby cities if content is duplicate. |
| 30 to 49 | **WARNING** | High risk of thin content penalty. Each page MUST have 400+ words of unique content, local testimonials, and area-specific details. Manual review required. |
| **50+** | **HARD STOP** | Do NOT create 50+ location pages. Google's Helpful Content system penalizes scaled location pages with minimal unique value. Consolidate into regional hubs instead. |

### Unique Content Requirements Per Location Page

Every location page must include ALL of the following to avoid thin content classification:

- [ ] **Unique opening paragraph** referencing local landmarks, neighborhoods, or characteristics (not just "We serve [City]")
- [ ] **Local testimonial** from a customer in that specific area
- [ ] **Area-specific service details** (e.g., "Common plumbing issues in Austin include limestone-related hard water buildup")
- [ ] **Local team member mention** if applicable
- [ ] **Embedded Google Map** centered on the service area
- [ ] **City-specific FAQ** (minimum 3 questions unique to this location)
- [ ] **Unique meta title and description** (not templated with only city name swapped)

---

## Schema Markup

### LocalBusiness Schema (Primary)

Deploy this on every page. Customize `@type` for your specific business category.

```json
{
  "@context": "https://schema.org",
  "@type": "Plumber",
  "name": "ABC Plumbing Services",
  "image": "https://abcplumbing.com/images/storefront.jpg",
  "url": "https://abcplumbing.com",
  "telephone": "+1-512-555-0199",
  "email": "info@abcplumbing.com",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main Street",
    "addressLocality": "Austin",
    "addressRegion": "TX",
    "postalCode": "78701",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 30.2672,
    "longitude": -97.7431
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "08:00",
      "closes": "14:00"
    }
  ],
  "areaServed": [
    {
      "@type": "City",
      "name": "Austin",
      "sameAs": "https://en.wikipedia.org/wiki/Austin,_Texas"
    },
    {
      "@type": "City",
      "name": "Round Rock"
    },
    {
      "@type": "City",
      "name": "Cedar Park"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "287",
    "bestRating": "5"
  },
  "sameAs": [
    "https://www.facebook.com/abcplumbing",
    "https://www.yelp.com/biz/abc-plumbing-austin",
    "https://www.google.com/maps/place/abc+plumbing"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Plumbing Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Emergency Plumbing",
          "description": "24/7 emergency plumbing repair service"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Water Heater Installation",
          "description": "Tank and tankless water heater installation and repair"
        }
      }
    ]
  }
}
```

### Common LocalBusiness @type Values

| Business Type | Schema @type |
|---|---|
| Plumber | `Plumber` |
| Electrician | `Electrician` |
| HVAC | `HVACBusiness` |
| Lawyer | `Attorney` or `LegalService` |
| Dentist | `Dentist` |
| Locksmith | `Locksmith` |
| Roofing | `RoofingContractor` |
| General contractor | `GeneralContractor` |
| Auto repair | `AutoRepair` |
| Cleaning service | `HousekeepingOrganization` |
| Landscaping | `LandscapeBusiness` (custom, use `LocalBusiness` with `additionalType`) |

---

## Google Business Profile Updates (2025 and 2026)

### Critical Changes

| Update | Date | Impact |
|---|---|---|
| **Video verification required** for new listings | Rolling out 2025 | Budget 5 to 10 minutes for a live video walkthrough of the business location |
| **WhatsApp messaging integration** | 2025 | Enable WhatsApp as a messaging channel in GBP settings |
| **Q&A section removed** | Late 2024 / 2025 | Migrate important Q&A content to your website FAQ pages |
| **Business hours as ranking factor** | 2025 | Businesses open NOW rank higher in "near me" queries; keep hours accurate to the minute |
| **AI-generated business descriptions** | 2025 | Google may auto-generate your business description from reviews and website content; ensure consistent messaging |
| **Review response urgency** | 2025+ | Response time to reviews is now a quality signal; respond within 24 hours |
| **Photo/video freshness** | Ongoing | Upload new photos monthly; stale profiles lose visibility |

### SAB (Service Area Business) Update: June 2025

**Critical change**: Service Area Businesses can no longer claim entire states or countries as service areas.

| Before June 2025 | After June 2025 |
|---|---|
| Could list "Texas" as service area | Must list specific cities or counties |
| Could list "United States" | Must list specific metro areas |
| Broad radius targeting | Granular city-level targeting |

**Action required**:
1. Audit current GBP service areas
2. Replace any state-level or country-level areas with specific cities
3. Prioritize cities where you have the most reviews and jobs completed
4. Maximum recommended service areas: 20 cities (Google may suppress listings claiming too many areas)

---

## AI Visibility for Local Search

### Current State (2025 to 2026)

| Metric | Value | Source |
|---|---|---|
| Local keywords triggering AI Overviews | **0.14%** | BrightLocal / Semrush |
| "Near me" queries with AI Overviews | **< 1%** | Google Search data |
| Local pack still dominant | **93%** of local queries show local pack | Google |

### What This Means

- **AI Overviews are NOT yet disrupting local search.** The local pack and Google Business Profile remain the primary discovery mechanism.
- **Invest in GBP and traditional local SEO first.** AI optimization is secondary for local businesses.
- **Monitor quarterly.** Google is testing AI Overviews for local; this percentage will likely increase in 2026.

### When AI Overviews DO Appear for Local

They tend to appear for:
- "Best [service] in [city]" queries (listicle-style recommendations)
- "How to choose a [service provider]" queries (informational)
- Cost-related queries ("How much does [service] cost in [city]")

**To prepare**: Ensure your website has clear pricing ranges, service descriptions with specifics, and structured FAQ content that AI models can extract.

---

## GEO Checklist for Local Service Businesses

- [ ] **LocalBusiness schema** deployed on every page with accurate NAP (Name, Address, Phone)
- [ ] **Service schema** for each service offered, nested under LocalBusiness
- [ ] **GeoCoordinates** included in schema (lat/lng of business location)
- [ ] **areaServed** lists all cities/regions served (use City or AdministrativeArea types)
- [ ] **openingHoursSpecification** is accurate and includes holiday hours
- [ ] **FAQ content on every service page** with direct, specific answers (not vague marketing language)
- [ ] **Pricing transparency**: Include price ranges or "starting at" pricing on service pages
- [ ] **Review snippets on website**: Display Google/Yelp reviews with AggregateRating schema
- [ ] **Local content signals**: Reference specific neighborhoods, streets, landmarks in content
- [ ] **Author/team attribution**: Service pages reference the specific technicians or team members who perform the work
- [ ] **Mobile optimization**: Click-to-call button, simplified navigation, fast load times
- [ ] **Consistent NAP**: Business name, address, and phone number are identical across website, GBP, Yelp, Facebook, and all directories
- [ ] **Photo alt text**: All images include descriptive alt text with service and location context
- [ ] **Emergency/urgency signals**: If applicable, prominently display "24/7" or "Same Day Service" availability

---

## Content Strategy

### Service Pages (High Priority)

| Element | Requirement |
|---|---|
| Word count | 600 to 1000 words minimum |
| H1 | "[Service Name] in [Primary City]" |
| Content | What the service includes, process overview, pricing range, FAQ |
| CTA | Phone number, contact form, booking widget |
| Images | 3+ original photos (team at work, before/after, equipment) |
| Internal links | Link to related services and relevant location pages |

### Location Pages (High Priority)

| Element | Requirement |
|---|---|
| Word count | 400+ words of unique content (not templated) |
| H1 | "[Service Category] in [City Name]" |
| Content | Local context, area-specific service notes, local testimonials |
| Map | Embedded Google Map centered on the city |
| FAQ | 3+ location-specific questions |
| Internal links | Link to all service pages and the location hub |

### Blog Posts (Medium Priority)

| Element | Requirement |
|---|---|
| Word count | 800 to 1500 words |
| Frequency | 2 to 4 posts per month |
| Topics | Seasonal tips, how-to guides, local news, cost guides |
| Target | Informational queries ("how to unclog a drain", "average cost of [service] in [city]") |

---

## Key Metrics to Track

### Local Visibility

| Metric | Tool | Target | Frequency |
|---|---|---|---|
| Local pack rankings (top 3) | BrightLocal / Local Falcon | Top 3 for primary services in primary city | Weekly |
| GBP profile views | Google Business Profile Insights | +15% QoQ | Monthly |
| GBP actions (calls, directions, website clicks) | GBP Insights | +10% QoQ | Monthly |
| Review count and average rating | GBP | 4.5+ stars, +5 reviews/month | Monthly |

### Organic Performance

| Metric | Tool | Target | Frequency |
|---|---|---|---|
| Organic sessions (local landing pages) | GA4 | +20% QoQ | Weekly |
| Phone calls from organic | Call tracking (CallRail, etc.) | Track volume and trend | Weekly |
| Form submissions from organic | GA4 | +15% QoQ | Monthly |
| Organic revenue attribution | CRM | Track trend | Monthly |

### Technical

| Metric | Tool | Target | Frequency |
|---|---|---|---|
| Mobile PageSpeed score | PageSpeed Insights | 90+ | Monthly |
| NAP consistency score | BrightLocal / Moz Local | 95%+ across all directories | Quarterly |
| Schema validation | Schema.org validator | 0 errors | Per deployment |
| Index coverage | Google Search Console | 0 critical errors | Weekly |
