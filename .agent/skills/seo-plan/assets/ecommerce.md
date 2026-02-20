# E-commerce SEO Strategy Template

> Industry vertical template for online retail, direct-to-consumer brands, and marketplace sellers.
> Load this template when the client sells physical or digital products through an online store.

---

## Industry Characteristics

| Characteristic | SEO Implication |
|---|---|
| **High transaction intent** (product and category queries convert 2 to 5%) | Prioritize product and category page optimization over blog content |
| **Price sensitivity** (65% of shoppers compare prices before purchasing) | Include pricing, shipping info, and competitive positioning in content |
| **Seasonal demand** (Black Friday, holidays, back-to-school drive 30%+ of annual revenue) | Plan content calendar 8+ weeks ahead of peak seasons |
| **Large product catalogs** (hundreds to millions of SKUs) | Crawl budget management, faceted navigation control, and canonical strategy are critical |
| **Visual-first discovery** (Google Shopping, image search, Pinterest) | Product image optimization and structured data are mandatory |
| **Review dependency** (93% of consumers read reviews before purchasing) | AggregateRating and Review schema drive CTR from SERPs |
| **Variant complexity** (size, color, material create URL multiplication) | Canonical and pagination strategy prevents index bloat |
| **Return and trust concerns** | Trust signals (reviews, return policy, security badges) affect both rankings and conversion |

---

## Site Architecture

```
/                                   Homepage (brand + primary category positioning)
├── /collections                    Category hub (or /categories, /shop)
│   ├── /collections/[category]     Top-level category pages
│   │   Example: /collections/running-shoes
│   │   Example: /collections/wireless-headphones
│   ├── /collections/[category]/[subcategory]   Subcategory pages
│   │   Example: /collections/running-shoes/trail-running
│   │   Example: /collections/wireless-headphones/noise-canceling
│   └── /collections/[category]?filter=...      Faceted URLs (see Technical section)
├── /products                       Product pages (or /p/)
│   ├── /products/[product-slug]    Individual product pages
│   │   Example: /products/ultraboost-22-black
│   │   Example: /products/sony-wh1000xm5
│   └── /products/[product-slug]    Each product = one canonical URL
├── /brands                         Brand hub page
│   ├── /brands/[brand-slug]        Brand landing pages
│   │   Example: /brands/nike
│   │   Example: /brands/sony
│   └── /brands/[brand-slug]        Target "[brand] [category]" queries
├── /sale                           Sale / clearance hub
│   └── /sale/[category]            Category-specific sale pages
├── /new-arrivals                   New arrivals page (freshness signal)
├── /best-sellers                   Best sellers page (social proof signal)
├── /gift-guides                    Gift guide hub (seasonal)
│   └── /gift-guides/[occasion]     "Gifts for runners", "Holiday gift guide"
├── /blog                           Content hub
│   ├── /blog/[post-slug]           Buying guides, how-tos, comparisons
│   └── /blog/[post-slug]           Target informational queries
├── /about                          Brand story, mission, team
├── /contact                        Customer service, returns, FAQ
├── /shipping                       Shipping policy and info
├── /returns                        Return policy page
└── /reviews                        Customer review aggregation page
```

### Architecture Rules

1. **URL structure**: Keep product URLs flat (`/products/[slug]`), not nested under categories. Products may belong to multiple categories.
2. **Category depth**: Maximum 3 levels (category > subcategory > sub-subcategory). Deeper nesting hurts crawl efficiency.
3. **Pagination**: Use `rel="next"` / `rel="prev"` on paginated category pages. Provide a "View All" option where catalog size allows.
4. **Out-of-stock products**: Keep the URL live with a "notify me" option and link to alternatives. Do NOT 404 or redirect unless permanently discontinued.
5. **Seasonal pages**: Keep `/sale`, `/gift-guides`, and seasonal URLs live year-round. Update content seasonally rather than creating new URLs.

---

## Schema Markup

### Product Schema (Every Product Page)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Sony WH-1000XM5 Wireless Headphones",
  "image": [
    "https://store.example.com/images/sony-xm5-front.jpg",
    "https://store.example.com/images/sony-xm5-side.jpg",
    "https://store.example.com/images/sony-xm5-case.jpg"
  ],
  "description": "Industry-leading noise canceling wireless headphones with Auto NC Optimizer, 30-hour battery, and multipoint connection.",
  "sku": "WH1000XM5B",
  "gtin13": "4548736132610",
  "mpn": "WH-1000XM5/B",
  "brand": {
    "@type": "Brand",
    "name": "Sony"
  },
  "color": "Black",
  "material": "Synthetic leather, plastic",
  "weight": {
    "@type": "QuantitativeValue",
    "value": "250",
    "unitCode": "GRM"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://store.example.com/products/sony-wh1000xm5",
    "priceCurrency": "USD",
    "price": "348.00",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": {
      "@type": "Organization",
      "name": "Example Store"
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0",
        "currency": "USD"
      },
      "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": "US"
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": {
          "@type": "QuantitativeValue",
          "minValue": 0,
          "maxValue": 1,
          "unitCode": "DAY"
        },
        "transitTime": {
          "@type": "QuantitativeValue",
          "minValue": 2,
          "maxValue": 5,
          "unitCode": "DAY"
        }
      }
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "US",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 30,
      "returnMethod": "https://schema.org/ReturnByMail",
      "returnFees": "https://schema.org/FreeReturn"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "2847",
    "bestRating": "5"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Alex M."
      },
      "datePublished": "2025-08-15",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Best noise canceling headphones I have ever owned. The sound quality and comfort are exceptional."
    }
  ]
}
```

### ProductGroup Schema (For Products with Variants)

Use `ProductGroup` when a product has color, size, or material variants that each have their own URL or SKU.

```json
{
  "@context": "https://schema.org",
  "@type": "ProductGroup",
  "name": "Sony WH-1000XM5",
  "description": "Premium wireless noise canceling headphones",
  "brand": {
    "@type": "Brand",
    "name": "Sony"
  },
  "productGroupID": "WH1000XM5",
  "variesBy": ["https://schema.org/color"],
  "hasVariant": [
    {
      "@type": "Product",
      "name": "Sony WH-1000XM5 (Black)",
      "color": "Black",
      "sku": "WH1000XM5B",
      "offers": {
        "@type": "Offer",
        "price": "348.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    },
    {
      "@type": "Product",
      "name": "Sony WH-1000XM5 (Silver)",
      "color": "Silver",
      "sku": "WH1000XM5S",
      "offers": {
        "@type": "Offer",
        "price": "348.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    }
  ]
}
```

### Certification Schema (April 2025 Addition)

Google added support for `Certification` within `Product` schema. Use this for products with certifications like Energy Star, organic, fair trade, etc.

```json
{
  "@type": "Product",
  "name": "EcoSmart LED Bulb",
  "hasCertification": {
    "@type": "Certification",
    "certificationIdentification": "ES-2025-12345",
    "certificationBody": {
      "@type": "Organization",
      "name": "Energy Star"
    },
    "issuedBy": {
      "@type": "Organization",
      "name": "U.S. Environmental Protection Agency"
    },
    "validFrom": "2025-04-01",
    "validThrough": "2028-04-01"
  }
}
```

### OfferShippingDetails (Required for Merchant Center)

Google Merchant Center now requires shipping details in structured data. Include on every product page:

```json
{
  "@type": "OfferShippingDetails",
  "shippingRate": {
    "@type": "MonetaryAmount",
    "value": "0",
    "currency": "USD"
  },
  "shippingDestination": {
    "@type": "DefinedRegion",
    "addressCountry": "US"
  },
  "deliveryTime": {
    "@type": "ShippingDeliveryTime",
    "handlingTime": {
      "@type": "QuantitativeValue",
      "minValue": 0,
      "maxValue": 1,
      "unitCode": "DAY"
    },
    "transitTime": {
      "@type": "QuantitativeValue",
      "minValue": 2,
      "maxValue": 5,
      "unitCode": "DAY"
    }
  }
}
```

### Category Pages

Use `CollectionPage` with `ItemList` for category pages:

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Wireless Headphones",
  "description": "Shop our collection of wireless headphones from top brands.",
  "url": "https://store.example.com/collections/wireless-headphones",
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": 48,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "url": "https://store.example.com/products/sony-wh1000xm5"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "url": "https://store.example.com/products/bose-qc-ultra"
      }
    ]
  }
}
```

---

## Content Requirements

### Product Pages (Minimum 400 Words)

| Element | Requirement |
|---|---|
| **Title tag** | "[Product Name] [Key Attribute] | [Brand] | [Store]" (50 to 60 chars) |
| **H1** | Product name with primary keyword naturally included |
| **Product description** | 150 to 300 words unique description (NOT manufacturer copy) |
| **Specifications table** | Structured data in HTML `<table>` (dimensions, weight, materials, compatibility) |
| **Images** | Minimum 4 images; alt text with product name + angle/context; WebP format preferred |
| **Reviews section** | Minimum display 5 reviews; include AggregateRating schema |
| **FAQ section** | 3 to 5 product-specific questions (sizing, compatibility, warranty) |
| **Related products** | Cross-sell and upsell recommendations |
| **Breadcrumbs** | Full category path with BreadcrumbList schema |
| **Availability** | Clear in-stock/out-of-stock status (synced with Offer schema) |

### Category Pages (Minimum 400 Words)

| Element | Requirement |
|---|---|
| **Title tag** | "[Category Name]: Shop [Key Attribute] | [Store]" (50 to 60 chars) |
| **H1** | Category name with primary keyword |
| **Category description** | 200 to 400 words above the product grid (buying guide style) |
| **Filters** | Price range, brand, rating, attributes relevant to category |
| **Product count** | Display total products and current page range |
| **Bottom content** | 200 to 300 words of additional category context below the product grid |
| **Internal links** | Link to subcategories, related categories, and buying guides |

### Blog / Buying Guides (1200 to 2500 Words)

| Content Type | Purpose | Target Queries |
|---|---|---|
| Buying guides | "Best [product category] in [year]" | High-volume informational |
| Comparison articles | "[Product A] vs [Product B]" | Decision-stage commercial |
| How-to guides | "How to choose [product type]" | Early-stage informational |
| Seasonal roundups | "[Holiday] gift guide for [persona]" | Seasonal traffic spikes |
| Product care | "How to clean/maintain [product]" | Post-purchase, brand loyalty |

---

## Technical SEO Requirements

### Pagination

| Approach | When to Use |
|---|---|
| **rel="next" / rel="prev"** | Default for all paginated category pages |
| **View All page** | When catalog size per category is under 200 products |
| **Infinite scroll** | ONLY if combined with paginated URLs (Google cannot crawl infinite scroll JS) |
| **Load More button** | Same as infinite scroll: must have crawlable paginated fallback URLs |

### Faceted Navigation

Faceted navigation (filters for color, size, price, brand) creates massive URL multiplication. Uncontrolled, a 1000 product store can generate 100,000+ filter URLs.

| Strategy | Implementation |
|---|---|
| **Canonical to base category** | All filter URLs point `rel="canonical"` to the unfiltered category page |
| **Robots noindex on filter combos** | Multi-filter combinations get `noindex` |
| **Crawl-worthy filters** | ONLY allow indexing of single high-volume filters (e.g., `/collections/shoes?brand=nike` if "Nike shoes" has search volume) |
| **URL parameter handling** | Configure in Google Search Console and robots.txt |
| **Internal linking** | Do NOT link to filter URLs from sitewide navigation; link only from contextual content |

### Decision Matrix: Index or Noindex Filter URLs

| Scenario | Decision |
|---|---|
| Single brand filter with search volume | **Index** (canonical to itself) |
| Single attribute filter with search volume (e.g., "red dresses") | **Index** |
| Multi-filter combination | **Noindex** (canonical to base category) |
| Price range filter | **Noindex** |
| Sort order parameter | **Noindex** (canonical to base) |
| Page number parameter | **Index** with rel="next/prev" |

### Product Variations

| Variation Type | URL Strategy |
|---|---|
| **Color** (visually distinct) | Separate URLs if each color has search volume; otherwise single URL with variant selector |
| **Size** (same product) | Single URL, variant selector, no separate URLs |
| **Material** (different product experience) | Separate URLs if distinct enough to warrant unique descriptions |
| **Bundle/kit** | Separate URL (different product) |

**Rule**: If a variant would have identical title, description, and images, it does NOT deserve its own URL. Use a single canonical URL with a variant selector.

---

## GEO Checklist for E-commerce

- [ ] **Product schema on every product page** with price, availability, rating, shipping details, and return policy
- [ ] **Unique product descriptions** (not manufacturer copy); AI models penalize duplicate content across stores
- [ ] **Specification tables in HTML `<table>`** format; LLMs extract tabular data more reliably than prose
- [ ] **Comparison content**: "Best [category]" and "[Product A] vs [Product B]" pages with clear winner statements
- [ ] **Price transparency**: Display actual prices, not "Contact for pricing"; AI shopping assistants need explicit pricing
- [ ] **Shipping and return details in structured data**: OfferShippingDetails and MerchantReturnPolicy schemas
- [ ] **FAQ on product pages**: Address sizing, compatibility, warranty, and return questions with direct answers
- [ ] **Review content accessible to crawlers**: Do not lazy-load reviews behind JavaScript-only widgets; include at least 3 to 5 reviews in initial HTML
- [ ] **Brand attribution**: Use `Brand` schema; AI assistants frequently answer "where to buy [brand] [product]" queries
- [ ] **Category descriptions**: 200+ words per category page describing what the category includes and who it is for
- [ ] **Freshness signals**: Display "Last updated" on buying guides and comparison content; update quarterly
- [ ] **Image alt text**: Every product image has descriptive alt text with product name, color, and use context
- [ ] **Breadcrumb schema**: BreadcrumbList on every product and category page for site hierarchy signals
- [ ] **Certification schema**: Add `Certification` markup for products with Energy Star, organic, fair trade, or similar certifications

---

## Key Metrics to Track

### Revenue and Conversion

| Metric | Tool | Target | Frequency |
|---|---|---|---|
| Organic revenue | GA4 + Ecommerce tracking | +15% QoQ | Weekly |
| Organic conversion rate | GA4 | 2% to 5% (category pages), 3% to 8% (product pages) | Weekly |
| Average order value (organic) | GA4 | Track trend, aim to match or exceed paid | Monthly |
| Product page organic traffic | GA4 | +20% QoQ | Weekly |

### Search Visibility

| Metric | Tool | Target | Frequency |
|---|---|---|---|
| Product keywords in top 10 | Ahrefs / SEMrush | +30 keywords per quarter | Weekly |
| Category keywords in top 10 | Ahrefs / SEMrush | +15 keywords per quarter | Weekly |
| Rich result appearance rate | GSC (Search Appearance) | 80%+ of product pages showing rich results | Monthly |
| Google Shopping organic clicks | GSC (Shopping tab) | Establish baseline, +10% QoQ | Monthly |

### Technical Health

| Metric | Tool | Target | Frequency |
|---|---|---|---|
| Crawl budget efficiency | GSC + server logs | 90%+ crawls on indexable pages | Monthly |
| Index coverage (product pages) | GSC | 95%+ of active products indexed | Weekly |
| Core Web Vitals pass rate | CrUX / PSI | 90%+ URLs passing | Monthly |
| Schema validation errors | Rich Results Test | 0 errors on product pages | Per deployment |
| 404 error rate (product pages) | GSC | < 0.5% of total products | Weekly |

### Content Performance

| Metric | Tool | Target | Frequency |
|---|---|---|---|
| Buying guide organic traffic | GA4 | +25% QoQ | Monthly |
| Buying guide to product page CTR | GA4 | 15%+ click-through to product pages | Monthly |
| Category page bounce rate | GA4 | < 45% | Monthly |
| Product page add-to-cart rate (organic) | GA4 | 8% to 15% | Monthly |
