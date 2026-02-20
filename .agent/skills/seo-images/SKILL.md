---
name: seo-images
description: Image SEO optimization covering alt text best practices, tiered file size thresholds, modern format recommendations (WebP, AVIF), responsive images with srcset/sizes, lazy loading, fetchpriority for LCP images, CLS prevention with dimension attributes, file naming conventions, and CDN usage.
---

# SEO Images Skill

## Purpose

Audit and optimize all images on a page or site for search engine visibility, page performance, accessibility, and user experience. Images directly impact Core Web Vitals (LCP, CLS), accessibility compliance (WCAG), and image search rankings. This skill covers every dimension of image optimization.

---

## Alt Text

### Requirements

| Rule | Specification | Rationale |
|------|---------------|-----------|
| **Presence** | Every `<img>` tag MUST have an `alt` attribute | WCAG 2.2 Level A requirement; screen reader accessibility |
| **Minimum length** | 10 characters | Descriptions under 10 characters are typically too vague ("photo", "image") |
| **Maximum length** | 125 characters | Screen readers may truncate at ~125 characters |
| **Descriptive** | Describe what the image shows, not what it is | "Dashboard showing monthly revenue chart" not "screenshot" |
| **Keyword inclusion** | Include page keyword naturally in at least one image alt | Helps image search rankings; do not force keywords into every alt |
| **No keyword stuffing** | Keyword should appear in at most 1-2 image alts per page | Stuffing keywords into every alt is a negative signal |
| **No redundancy** | Do not start with "Image of" or "Picture of" | Screen readers already announce it as an image |
| **Decorative images** | Use `alt=""` (empty alt) for purely decorative images | Prevents screen readers from announcing non-informative images |
| **Functional images** | Alt describes the function, not the image | For a search icon: "Search" not "magnifying glass" |
| **Complex images** | Use `aria-describedby` or `longdesc` for charts/infographics | Alt is the summary; longer description provided separately |

### Alt Text Quality Scoring

| Score | Criteria |
|-------|---------|
| 5/5 | Descriptive, appropriate length (10-125 chars), includes keyword naturally, unique per image |
| 4/5 | Descriptive and appropriate length but missing keyword or slightly generic |
| 3/5 | Present but vague ("product image") or too short |
| 2/5 | Present but meaningless ("img001", "photo", "untitled") |
| 1/5 | Missing entirely or contains only spaces |
| 0/5 | `alt` attribute not present on `<img>` tag |

---

## File Size Thresholds

### Tiered Size Limits

| Image Type | Maximum Size | Typical Dimensions | Use Case |
|------------|-------------|-------------------|----------|
| **Thumbnails** | < 50 KB | 150x150 to 300x300 | Product thumbnails, avatar images, grid items |
| **Content Images** | < 100 KB | 600x400 to 800x600 | In-article images, feature graphics, screenshots |
| **Hero / Banner** | < 200 KB | 1200x630 to 1920x1080 | Hero sections, OG images, page headers |
| **Background Images** | < 150 KB | 1920x1080 | Full-width background images (CSS) |
| **Icons / Logos** | < 10 KB | 16x16 to 128x128 | Favicons, brand logos, UI icons |

### Size Audit Severity

| Condition | Severity | Action |
|-----------|----------|--------|
| Image exceeds tier threshold by >100% | Critical | Compress immediately; blocking Core Web Vitals |
| Image exceeds tier threshold by 50-100% | High | Compress before next deployment |
| Image exceeds tier threshold by 10-50% | Medium | Optimize in next content update cycle |
| Image within threshold | Pass | No action needed |

### Compression Recommendations

| Tool / Method | When to Use |
|---------------|-------------|
| `sharp` (Node.js) | Build-time optimization in CI/CD pipeline |
| `squoosh` (CLI or web) | Manual one-off optimization |
| `imagemin` (Node.js) | Batch processing in build scripts |
| CDN auto-optimization | Runtime optimization (Cloudflare, Imgix, Cloudinary) |
| `<picture>` with multiple sources | Serve different sizes/formats per device |

---

## Format Recommendations

### Modern Format Support

| Format | Browser Support | Compression | Best For | Recommendation |
|--------|----------------|-------------|----------|----------------|
| **WebP** | 97%+ (all modern browsers) | 25-35% smaller than JPEG | Photos, illustrations, general web images | **Primary format for all web images** |
| **AVIF** | 92%+ (Chrome, Firefox, Opera, Safari 16.4+) | 50% smaller than JPEG | High-quality photos where maximum compression needed | **Use with WebP fallback** |
| **JPEG** | 100% | Baseline | Fallback for older browsers | **Fallback only** |
| **PNG** | 100% | Lossless | Transparency, logos, screenshots with text | **Use only when transparency needed** |
| **SVG** | 100% | Vector (infinitely scalable) | Icons, logos, simple illustrations | **Always use for icons and logos** |
| **GIF** | 100% | Poor compression | Simple animations | **Replace with WebP animated or MP4 video** |

### Format Selection Decision Tree

```
Is the image a simple icon, logo, or illustration?
  YES -> Use SVG
  NO  -> Continue

Does the image need transparency?
  YES -> Use WebP (supports alpha channel) or PNG as fallback
  NO  -> Continue

Is maximum compression critical (slow connections, large images)?
  YES -> Use AVIF with WebP fallback
  NO  -> Use WebP with JPEG fallback
```

### Implementation Pattern

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Descriptive alt text" width="800" height="600">
</picture>
```

---

## Responsive Images

### srcset and sizes

Responsive images serve appropriately sized files based on the user's device, viewport, and pixel density. This prevents mobile users from downloading desktop-sized images.

#### srcset (Resolution Switching)

```html
<img
  srcset="
    image-400w.webp 400w,
    image-800w.webp 800w,
    image-1200w.webp 1200w,
    image-1600w.webp 1600w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  src="image-800w.webp"
  alt="Descriptive alt text"
  width="800"
  height="600"
>
```

#### Breakpoint Guidelines

| Viewport | Typical Image Width | srcset Sizes |
|----------|--------------------|----- |
| Mobile (< 640px) | 100vw (full width) | 400w, 640w |
| Tablet (640px to 1024px) | 50vw (half width) | 640w, 800w |
| Desktop (> 1024px) | 33vw (third width) | 400w, 800w, 1200w |
| Full-width hero | 100vw | 640w, 1024w, 1600w, 1920w |

#### Audit Checks

| Check | Pass Criteria | Severity |
|-------|---------------|----------|
| `srcset` present | Content images over 400px wide use `srcset` | Medium |
| `sizes` present | Accompanies `srcset` with appropriate breakpoints | Medium |
| Reasonable breakpoints | At least 3 size variants for key images | Low |
| No oversized mobile images | Mobile users do not download >800px wide images | High |
| Fallback `src` | `src` attribute always present as fallback | High |

---

## Lazy Loading

### Implementation

| Attribute | Value | Use On |
|-----------|-------|--------|
| `loading="lazy"` | Native browser lazy loading | All below-fold images |
| `loading="eager"` | Load immediately (default behavior) | Above-fold / LCP images |

### Audit Rules

| Check | Pass Criteria | Severity |
|-------|---------------|----------|
| Below-fold images use `loading="lazy"` | All images not visible in initial viewport | High |
| Above-fold images do NOT use `loading="lazy"` | LCP and hero images load immediately | Critical |
| `loading` attribute present | Explicit intent declared on all `<img>` tags | Medium |
| No lazy loading on LCP image | The Largest Contentful Paint element must not be lazy loaded | Critical |

### Lazy Loading and JavaScript

| Method | When to Use | Notes |
|--------|-------------|-------|
| Native `loading="lazy"` | Default for all lazy loading | 96%+ browser support; no JS needed |
| Intersection Observer | When native is insufficient (custom animations) | More control but adds JS overhead |
| Library (lazysizes, etc.) | Legacy browser support only | Avoid unless targeting very old browsers |

---

## fetchpriority and decoding

### fetchpriority

The `fetchpriority` attribute tells the browser the relative priority for fetching an image resource.

| Value | Use On | Effect |
|-------|--------|--------|
| `fetchpriority="high"` | LCP image (hero, above-fold main image) | Browser fetches this image before others |
| `fetchpriority="low"` | Below-fold decorative images | Browser deprioritizes this image |
| (default / not set) | Everything else | Browser uses default priority heuristics |

#### Rules

| Rule | Details | Severity |
|------|---------|----------|
| LCP image MUST have `fetchpriority="high"` | The single largest above-fold image | Critical |
| Only ONE image per page should have `fetchpriority="high"` | Multiple high-priority images dilute the benefit | High |
| Do not use `fetchpriority="high"` on lazy-loaded images | Contradicts the purpose of lazy loading | High |
| Below-fold images may use `fetchpriority="low"` | Optional but beneficial for performance | Low |

### decoding

The `decoding` attribute suggests how the browser should decode the image.

| Value | Use On | Effect |
|-------|--------|--------|
| `decoding="async"` | All non-LCP images | Decode off main thread; prevents blocking |
| `decoding="sync"` | Rarely (critical above-fold only if needed) | Decode before rendering next frame |
| `decoding="auto"` | Default browser behavior | Browser decides |

#### Rules

| Rule | Details | Severity |
|------|---------|----------|
| Non-LCP images should use `decoding="async"` | Prevents decode from blocking main thread | Medium |
| LCP image may omit `decoding` or use `decoding="auto"` | Let browser optimize LCP image decode | Low |
| Never use `decoding="sync"` on below-fold images | Blocks rendering unnecessarily | Medium |

---

## CLS Prevention

Cumulative Layout Shift caused by images is one of the most common CLS sources. Every image must have its layout space reserved before the image loads.

### Required Dimension Attributes

| Approach | Implementation | Priority |
|----------|---------------|----------|
| `width` and `height` attributes | `<img width="800" height="600">` | Critical (primary method) |
| CSS `aspect-ratio` | `img { aspect-ratio: 4/3; }` | Good (complementary) |
| Container with `padding-bottom` | Aspect ratio box technique | Acceptable (older method) |

### Audit Checks

| Check | Pass Criteria | Severity |
|-------|---------------|----------|
| All `<img>` tags have `width` and `height` | Intrinsic dimensions declared | Critical |
| Dimensions match actual image proportions | Aspect ratio is correct (prevents distortion) | High |
| CSS does not override dimensions without maintaining ratio | `max-width: 100%` + `height: auto` is correct | High |
| No images injected above fold after initial render | Dynamic content does not push existing content down | Critical |
| Background images in containers with defined height | CSS backgrounds in fixed-height or aspect-ratio containers | Medium |

### Correct Responsive Pattern

```css
img {
  max-width: 100%;
  height: auto;
}
```

```html
<img src="photo.webp" alt="Description" width="1200" height="630">
```

This combination:
1. Reserves space via `width`/`height` (browser calculates aspect ratio)
2. Allows responsive scaling via `max-width: 100%`
3. Maintains aspect ratio via `height: auto`
4. Prevents CLS because the browser knows the aspect ratio before the image loads

---

## File Naming

### Conventions

| Rule | Good Example | Bad Example | Rationale |
|------|-------------|-------------|-----------|
| Descriptive keywords | `saas-pricing-comparison.webp` | `IMG_20240115.webp` | Search engines use filenames as ranking signals |
| Hyphens as separators | `blue-running-shoes.webp` | `blue_running_shoes.webp` | Google treats hyphens as word separators |
| Lowercase only | `product-dashboard.webp` | `Product-Dashboard.webp` | Prevents case-sensitivity issues on Linux servers |
| No special characters | `team-photo-2025.webp` | `team photo (2).webp` | Avoids URL encoding issues |
| Concise but descriptive | `quarterly-revenue-chart.webp` | `q.webp` | Balances readability and brevity |
| Include primary keyword | `startup-validation-framework.webp` | `framework-graphic.webp` | Reinforces page keyword relevance |
| No generic names | `customer-onboarding-flow.webp` | `image1.webp` or `banner.webp` | Every image name should communicate content |

---

## CDN Usage

### When to Use a CDN for Images

| Scenario | Recommendation |
|----------|----------------|
| Global audience | Always use CDN; reduces latency to <50ms from edge |
| Image-heavy pages (10+ images) | CDN with auto-optimization (format, resize, quality) |
| E-commerce product images | CDN with on-the-fly resizing (Cloudinary, Imgix) |
| Blog with author-uploaded images | CDN with build-time optimization + edge caching |
| Single-region audience, few images | CDN optional; build-time optimization sufficient |

### CDN Features to Leverage

| Feature | Benefit | Implementation |
|---------|---------|----------------|
| Auto-format conversion | Serves WebP/AVIF based on `Accept` header | CDN configuration (no code changes) |
| Responsive resizing | Generate width variants on-the-fly | URL parameters (`?w=800&h=600`) |
| Quality optimization | Lossy compression per format | URL parameter (`?q=80`) or global setting |
| Edge caching | Serve from nearest PoP | Automatic with CDN; set long `Cache-Control` |
| Immutable caching | Cache forever with content-hash filenames | `Cache-Control: public, max-age=31536000, immutable` |

### Audit Checks

| Check | Pass Criteria | Severity |
|-------|---------------|----------|
| Images served from CDN or edge | Response headers show CDN (e.g., `cf-cache-status`, `x-cache`) | Medium |
| Cache headers set | `Cache-Control` with appropriate `max-age` | Medium |
| No cache-busting query params on static images | Use filename hashing instead of `?v=123` | Low |
| CDN supports modern formats | Auto-negotiation for WebP/AVIF | Medium |
| Failover configured | Original server accessible if CDN fails | Low |

---

## Complete Image Audit Checklist

### Per Image

| # | Check | Category | Severity |
|---|-------|----------|----------|
| 1 | `alt` attribute present and descriptive (10-125 chars) | Accessibility | Critical |
| 2 | File size within tier threshold | Performance | High |
| 3 | Modern format (WebP or AVIF) used | Performance | Medium |
| 4 | `width` and `height` attributes set | CLS Prevention | Critical |
| 5 | `loading="lazy"` for below-fold; not on LCP | Performance | High |
| 6 | `fetchpriority="high"` on LCP image only | Performance | High |
| 7 | `decoding="async"` on non-LCP images | Performance | Medium |
| 8 | Descriptive, keyword-rich filename | SEO | Low |
| 9 | Responsive `srcset`/`sizes` for images >400px | Performance | Medium |
| 10 | Served from CDN with proper cache headers | Performance | Medium |

### Per Page Summary

| Metric | Target |
|--------|--------|
| Total image weight | < 500 KB (entire page) |
| Alt text coverage | 100% of content images |
| Modern format usage | > 80% of images in WebP or AVIF |
| Lazy loading coverage | 100% of below-fold images |
| CLS dimension coverage | 100% of images have width/height |
| LCP image optimized | fetchpriority="high", no lazy load, <200KB |

---

## Output Format

```markdown
# Image Optimization Audit: [URL]
**Analyzed:** [YYYY-MM-DD]
**Total Images:** [N]
**Total Image Weight:** [X] KB

## Summary Score: XX/100

| Category | Score | Max |
|----------|-------|-----|
| Alt Text Quality | XX | 25 |
| File Size Optimization | XX | 25 |
| Format & Responsiveness | XX | 20 |
| Loading Behavior | XX | 15 |
| CLS Prevention | XX | 15 |
| **Total** | **XX** | **100** |

## Image Inventory
| # | Filename | Size | Format | Alt | Lazy | Dimensions | Issues |
|---|----------|------|--------|-----|------|------------|--------|
| 1 | [name] | [KB] | [fmt] | [Y/N] | [Y/N] | [WxH or missing] | [list] |

## LCP Image Analysis
- Element: [description]
- Size: [KB]
- Format: [format]
- fetchpriority: [high/missing]
- loading: [eager/lazy/missing]
- Verdict: [PASS/FAIL]

## Priority Fixes
1. [fix] — Impact: [High/Medium/Low]
2. [fix] — Impact: [High/Medium/Low]
...
```

---

## Usage

```bash
# Audit images on a single page
/seo-images https://example.com/blog/article

# Audit images site-wide (via seo-audit delegation)
/seo-images audit --sitemap https://example.com/sitemap.xml

# Generate optimized image HTML for a specific image
/seo-images optimize --src hero.jpg --alt "SaaS dashboard overview" --lcp
```

---

## Notes

- `fetchpriority` has 95%+ browser support as of 2025; safe to use without fallback
- Native `loading="lazy"` has 96%+ browser support; JavaScript lazy loading libraries are no longer needed for most sites
- AVIF support is at 92%+ but always provide WebP fallback in a `<picture>` element
- The LCP image is the single most impactful image optimization target on any page
- CLS from images without dimensions is one of the top 3 CLS causes across the web
- Image file names are a lightweight but real ranking signal for Google Image Search
- CDN auto-format negotiation (serving WebP/AVIF based on Accept header) eliminates the need for `<picture>` elements in many cases
