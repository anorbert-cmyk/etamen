---
name: SEO Hreflang
description: Hreflang and international SEO implementation with 8 validation checks, 3 implementation methods, common mistakes, and sitemap generation guidance.
---

# SEO Hreflang Skill

## Purpose

Implement and validate hreflang annotations for international and multilingual websites. Hreflang tells search engines which language and regional variant of a page to serve to users in different locales, preventing duplicate content issues across language versions and ensuring users see the correct regional content.

## 8 Validation Checks

Every hreflang implementation must pass all 8 checks before deployment.

### Check 1: Self-Referencing Tags

**Rule:** Every page must include a hreflang tag that points to itself.

**Why:** Google requires self-referencing hreflang annotations. Without them, the entire hreflang set for that page may be ignored.

**Correct:**
```html
<!-- On the page https://example.com/en/about -->
<link rel="alternate" hreflang="en" href="https://example.com/en/about" />
<link rel="alternate" hreflang="de" href="https://example.com/de/about" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/about" />
```

**Incorrect (missing self-reference):**
```html
<!-- On the page https://example.com/en/about -->
<link rel="alternate" hreflang="de" href="https://example.com/de/about" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/about" />
<!-- ERROR: Missing self-referencing hreflang="en" tag -->
```

### Check 2: Return Tags (Bidirectional)

**Rule:** If page A references page B with hreflang, page B MUST reference page A back. This is bidirectional confirmation.

**Why:** Google uses return tags to confirm the relationship. If page A says "my German version is B" but page B does not say "my English version is A," Google may ignore the annotation entirely.

**Validation:**
- For every hreflang URL referenced on page A, visit that URL
- Verify it contains a hreflang tag pointing back to page A
- Both directions must use the same language/region code

### Check 3: x-default Tag

**Rule:** Include exactly one `hreflang="x-default"` tag per hreflang set. This designates the fallback page for users whose language/region does not match any specified hreflang.

**Common x-default targets:**
- The English version (most common for global sites)
- A language selector/splash page
- The most popular language version

**Correct:**
```html
<link rel="alternate" hreflang="x-default" href="https://example.com/en/about" />
<link rel="alternate" hreflang="en" href="https://example.com/en/about" />
<link rel="alternate" hreflang="de" href="https://example.com/de/about" />
```

**Note:** The x-default URL should also appear as one of the language-specific hreflang entries.

### Check 4: Language Codes (ISO 639-1)

**Rule:** Language codes must be valid ISO 639-1 two-letter codes.

**Common valid codes:**

| Code | Language | Code | Language |
|------|----------|------|----------|
| `en` | English | `ja` | Japanese |
| `de` | German | `ko` | Korean |
| `fr` | French | `zh` | Chinese |
| `es` | Spanish | `ar` | Arabic |
| `it` | Italian | `pt` | Portuguese |
| `nl` | Dutch | `ru` | Russian |
| `pl` | Polish | `hi` | Hindi |
| `sv` | Swedish | `th` | Thai |

**Invalid examples that will cause failures:**
- `eng` (three-letter code, must be `en`)
- `jp` (incorrect code for Japanese, must be `ja`)
- `uk` (this is Ukrainian, not United Kingdom; use `en-GB` for British English)

### Check 5: Region Codes (ISO 3166-1 Alpha-2)

**Rule:** When targeting a specific region within a language, append a valid ISO 3166-1 Alpha-2 country code after a hyphen.

**Format:** `language-REGION` (language lowercase, region uppercase)

**Common valid combinations:**

| Code | Target Audience |
|------|-----------------|
| `en-US` | English speakers in the United States |
| `en-GB` | English speakers in the United Kingdom |
| `en-AU` | English speakers in Australia |
| `es-MX` | Spanish speakers in Mexico |
| `es-ES` | Spanish speakers in Spain |
| `pt-BR` | Portuguese speakers in Brazil |
| `pt-PT` | Portuguese speakers in Portugal |
| `zh-CN` | Simplified Chinese (China) |
| `zh-TW` | Traditional Chinese (Taiwan) |
| `fr-CA` | French speakers in Canada |
| `fr-FR` | French speakers in France |

**Rules:**
- Language code is ALWAYS lowercase: `en`, not `EN`
- Region code is ALWAYS uppercase: `US`, not `us`
- Separator is ALWAYS a hyphen: `en-US`, not `en_US` or `en/US`
- You CAN use a language code without a region (`en`) but CANNOT use a region without a language

### Check 6: Canonical URL Alignment

**Rule:** The URLs in hreflang tags must match the canonical URLs of the target pages.

**Why:** If page B has `<link rel="canonical" href="https://example.com/de/ueber-uns" />` but page A's hreflang points to `https://example.com/de/about`, there is a conflict. Google may ignore the hreflang.

**Validation Steps:**
1. For each hreflang URL, fetch the target page
2. Extract the canonical URL from `<link rel="canonical">`
3. Confirm the canonical URL exactly matches the hreflang href
4. If they differ, update the hreflang to use the canonical URL

### Check 7: Protocol Consistency

**Rule:** All URLs in a hreflang set must use the same protocol (HTTP or HTTPS). Mixing protocols invalidates the annotations.

**Correct:**
```html
<link rel="alternate" hreflang="en" href="https://example.com/en/page" />
<link rel="alternate" hreflang="de" href="https://example.com/de/page" />
```

**Incorrect:**
```html
<link rel="alternate" hreflang="en" href="https://example.com/en/page" />
<link rel="alternate" hreflang="de" href="http://example.com/de/page" />
<!-- ERROR: Mixed HTTPS and HTTP -->
```

**Additional protocol rules:**
- Always prefer HTTPS
- Include `www` or non-`www` consistently (match the canonical domain)
- Include or exclude trailing slashes consistently

### Check 8: Cross-Domain Support

**Rule:** Hreflang annotations work across different domains. The German version can be on `example.de` while the English version is on `example.com`.

**Requirements for cross-domain hreflang:**
- Both domains must be verified in Google Search Console
- Return tags (Check 2) are especially critical across domains
- Sitemaps on each domain must reference the cross-domain hreflang URLs
- XML sitemap implementation is strongly recommended for cross-domain setups

**Correct cross-domain example:**
```html
<!-- On https://example.com/about -->
<link rel="alternate" hreflang="en" href="https://example.com/about" />
<link rel="alternate" hreflang="de" href="https://example.de/ueber-uns" />

<!-- On https://example.de/ueber-uns -->
<link rel="alternate" hreflang="en" href="https://example.com/about" />
<link rel="alternate" hreflang="de" href="https://example.de/ueber-uns" />
```

## 3 Implementation Methods

### Method 1: HTML Link Tags

**Best for:** Sites with fewer than 50 language/region variants per page.

**Implementation:** Add `<link>` elements in the `<head>` section of every page.

```html
<head>
  <!-- Hreflang annotations -->
  <link rel="alternate" hreflang="x-default" href="https://example.com/about" />
  <link rel="alternate" hreflang="en" href="https://example.com/about" />
  <link rel="alternate" hreflang="en-US" href="https://example.com/en-us/about" />
  <link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/about" />
  <link rel="alternate" hreflang="de" href="https://example.com/de/about" />
  <link rel="alternate" hreflang="fr" href="https://example.com/fr/about" />
  <link rel="alternate" hreflang="es" href="https://example.com/es/about" />
</head>
```

**Advantages:**
- Simple to implement and debug
- No server configuration required
- Visible in page source for easy auditing

**Disadvantages:**
- Adds to HTML document size (significant with 20+ variants)
- Must be present on every page (easy to miss pages)
- Increases page weight and time-to-first-byte for pages with many variants

### Method 2: HTTP Headers

**Best for:** Non-HTML files (PDFs, images) or when HTML `<head>` modification is not possible.

**Implementation:** Add `Link` headers in the HTTP response.

```
HTTP/1.1 200 OK
Link: <https://example.com/about>; rel="alternate"; hreflang="x-default",
      <https://example.com/about>; rel="alternate"; hreflang="en",
      <https://example.com/de/about>; rel="alternate"; hreflang="de",
      <https://example.com/fr/about>; rel="alternate"; hreflang="fr"
```

**Advantages:**
- Works for non-HTML resources
- Does not affect HTML document size
- Can be configured at the server/CDN level

**Disadvantages:**
- Harder to audit (not visible in page source)
- Requires server configuration access
- Can become unwieldy with many variants

### Method 3: XML Sitemap (Recommended for Large Sites)

**Best for:** Sites with 50+ language/region variants, cross-domain setups, or large-scale international sites.

**Implementation:** Add `xhtml:link` elements within the sitemap using the `xmlns:xhtml` namespace.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.com/about</loc>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/about" />
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/about" />
    <xhtml:link rel="alternate" hreflang="de" href="https://example.de/ueber-uns" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://example.fr/a-propos" />
    <xhtml:link rel="alternate" hreflang="es" href="https://example.es/acerca-de" />
  </url>
  <url>
    <loc>https://example.de/ueber-uns</loc>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/about" />
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/about" />
    <xhtml:link rel="alternate" hreflang="de" href="https://example.de/ueber-uns" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://example.fr/a-propos" />
    <xhtml:link rel="alternate" hreflang="es" href="https://example.es/acerca-de" />
  </url>
</urlset>
```

**Key requirements:**
- The `xmlns:xhtml="http://www.w3.org/1999/xhtml"` namespace declaration is REQUIRED in the `<urlset>` opening tag
- Each `<url>` element must contain `<xhtml:link>` entries for ALL language variants, including itself (self-referencing)
- The `<loc>` URL must match one of the `<xhtml:link>` href values exactly
- Every URL referenced in `<xhtml:link>` must have its own `<url>` entry somewhere in the sitemap(s) with reciprocal `<xhtml:link>` tags

**Advantages:**
- Scales to hundreds of variants without affecting page load
- Works seamlessly across domains
- Centralized management (one file to update)
- Google's recommended approach for large international sites
- Easier to automate programmatically

**Disadvantages:**
- Sitemaps can become very large with many pages and variants
- Changes are not reflected until Google re-crawls the sitemap
- Requires proper sitemap index management

## Common Mistakes Table

| Mistake | Impact | Fix |
|---------|--------|-----|
| Missing self-referencing tag | Google may ignore the entire hreflang set for that page | Always include a hreflang tag pointing to the current page |
| Missing return tags | Hreflang annotations treated as unconfirmed and potentially ignored | Ensure every referenced page links back |
| Using `en-UK` instead of `en-GB` | Invalid code, annotation ignored | United Kingdom's ISO code is `GB`, not `UK` |
| Using three-letter language codes (`eng`, `deu`) | Invalid ISO 639-1, annotation ignored | Use two-letter codes: `en`, `de` |
| Lowercase region code (`en-us`) | May be tolerated by Google but technically invalid | Always uppercase region: `en-US` |
| Using `hreflang="x-default"` on a non-existent page | Users sent to 404, poor experience | Ensure x-default URL returns 200 |
| Hreflang URL differs from canonical | Conflicting signals, hreflang may be ignored | Hreflang href must match the target page's canonical |
| Mixed HTTP and HTTPS in hreflang set | Invalid set, annotations ignored | Use HTTPS consistently across all URLs |
| Forgetting hreflang on new pages | New pages serve wrong language in wrong regions | Include hreflang implementation in page creation workflow |
| Using hreflang for same-language duplicate content | Not the correct tool; use canonical instead | Hreflang is for language/region variants, not duplicates |
| Setting hreflang on pages blocked by robots.txt | Google cannot verify the annotations | Ensure all hreflang target pages are crawlable |
| Using `rel="canonical"` to point to a different language version | Incorrect; canonical should point to the same-language version | Each language version should self-canonicalize |

## Hreflang Sitemap Generation

When generating hreflang sitemaps programmatically, follow this template:

### Generation Algorithm

```
For each page in the site:
  1. Identify all language/region variants of this page
  2. Create a <url> block with:
     a. <loc> set to this page's URL
     b. One <xhtml:link> for EACH variant (including self)
     c. One <xhtml:link> for x-default
  3. Repeat for every variant URL (each gets its own <url> block with full set)
```

### Full Sitemap Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- English version of About page -->
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2026-02-14T00:00:00+00:00</lastmod>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/about" />
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/about" />
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/en-us/about" />
    <xhtml:link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/about" />
    <xhtml:link rel="alternate" hreflang="de" href="https://example.com/de/ueber-uns" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/a-propos" />
  </url>

  <!-- US English version of About page -->
  <url>
    <loc>https://example.com/en-us/about</loc>
    <lastmod>2026-02-14T00:00:00+00:00</lastmod>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/about" />
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/about" />
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/en-us/about" />
    <xhtml:link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/about" />
    <xhtml:link rel="alternate" hreflang="de" href="https://example.com/de/ueber-uns" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/a-propos" />
  </url>

  <!-- British English version of About page -->
  <url>
    <loc>https://example.com/en-gb/about</loc>
    <lastmod>2026-02-14T00:00:00+00:00</lastmod>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/about" />
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/about" />
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/en-us/about" />
    <xhtml:link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/about" />
    <xhtml:link rel="alternate" hreflang="de" href="https://example.com/de/ueber-uns" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/a-propos" />
  </url>

  <!-- German version of About page -->
  <url>
    <loc>https://example.com/de/ueber-uns</loc>
    <lastmod>2026-02-14T00:00:00+00:00</lastmod>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/about" />
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/about" />
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/en-us/about" />
    <xhtml:link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/about" />
    <xhtml:link rel="alternate" hreflang="de" href="https://example.com/de/ueber-uns" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/a-propos" />
  </url>

  <!-- French version of About page -->
  <url>
    <loc>https://example.com/fr/a-propos</loc>
    <lastmod>2026-02-14T00:00:00+00:00</lastmod>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/about" />
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/about" />
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/en-us/about" />
    <xhtml:link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/about" />
    <xhtml:link rel="alternate" hreflang="de" href="https://example.com/de/ueber-uns" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/a-propos" />
  </url>

</urlset>
```

**Critical notes for sitemap generation:**
- The `xmlns:xhtml` namespace declaration must be on the `<urlset>` element
- Every `<url>` block must contain the COMPLETE set of `<xhtml:link>` elements for all variants
- Self-referencing is mandatory in every `<url>` block
- The `href` values must be absolute URLs with protocol
- Split into multiple sitemap files if the total exceeds 50,000 URL entries or 50MB

## Rules

1. ALWAYS include self-referencing hreflang tags on every page (Check 1).
2. ALWAYS verify bidirectional return tags exist for every hreflang relationship (Check 2).
3. ALWAYS include exactly one `x-default` per hreflang set (Check 3).
4. ALWAYS use valid ISO 639-1 two-letter language codes (Check 4).
5. ALWAYS use valid ISO 3166-1 Alpha-2 region codes in uppercase after a hyphen (Check 5).
6. ALWAYS ensure hreflang URLs match the canonical URLs of target pages (Check 6).
7. ALWAYS use consistent protocols (HTTPS) across all URLs in a hreflang set (Check 7).
8. ALWAYS verify cross-domain hreflang relationships in both Search Console properties (Check 8).
9. ALWAYS use the XML sitemap method for sites with 50+ language/region variants.
10. ALWAYS include the `xmlns:xhtml="http://www.w3.org/1999/xhtml"` namespace in hreflang sitemaps.
11. NEVER use hreflang as a substitute for canonical tags to handle duplicate content.
12. NEVER use three-letter language codes or invalid region codes.
13. NEVER mix implementation methods (choose HTML, HTTP headers, or XML sitemap and use one consistently).
14. ALWAYS include hreflang implementation as part of the page creation workflow to prevent missing annotations on new pages.
