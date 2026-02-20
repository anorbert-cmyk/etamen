# Rendering Mastery Skill

> **Complete knowledge of CSR, SSR, SSG, ISR, Streaming SSR, Hybrid Rendering, and Modern Patterns (2025/2026)**

---

## Rendering Strategy Decision Matrix

```
                         Content Changes             User-Specific
                    Rarely    Sometimes    Frequently    Data?
                  +----------+-----------+-----------+-----------+
  SEO Required?   |          |           |           |           |
  Yes            | SSG      | ISR       | SSR       | SSR +     |
                  |          |           | Streaming | Streaming |
                  +----------+-----------+-----------+-----------+
  No             | SSG or   | ISR or    | CSR       | CSR       |
                  | CSR      | CSR       |           |           |
                  +----------+-----------+-----------+-----------+
```

**Best practice 2025/2026: HYBRID rendering per route.**

---

## 1. CSR (Client Side Rendering)

**Architecture:**
```
Browser -> Server (minimal HTML shell) -> Download JS -> Execute JS -> Fetch API -> Render
```

| Metric | Rating | Why |
|--------|--------|-----|
| TTFB | Good | Server sends tiny HTML shell |
| FCP | Poor | Nothing until JS downloads + executes |
| LCP | Poor | Content depends on JS + API calls |
| TBT | Poor | Large JS blocks main thread |
| CLS | Variable | Content pops in after JS loads |
| SEO | Poor | Social crawlers see empty page |

**Use for:** Authenticated dashboards, internal tools, SaaS apps behind login
**Never for:** SEO critical pages, social sharing pages

**Critical SEO fact:** Social crawlers (Facebook, Twitter, LinkedIn, Discord, Telegram, WhatsApp) do NOT execute JavaScript. OG tags injected via React Helmet client side are invisible to them.

---

## 2. SSR (Server Side Rendering)

**Architecture:**
```
Browser -> Server (fetch data + render HTML) -> Full HTML response -> Hydrate
```

| Metric | Rating | Why |
|--------|--------|-----|
| TTFB | Moderate | Server must process before responding |
| FCP | Excellent | Full HTML arrives immediately |
| LCP | Good | Main content in initial HTML |
| TBT | Moderate | Hydration blocks main thread |
| CLS | Good | Pre rendered, minimal shifts |
| SEO | Excellent | Full content on first crawl |

**React Server Components (RSC) benchmarks:**
- TTFB: 350ms -> 40ms with streaming
- LCP: 1.2s -> 380ms
- Bundle size: 20 to 40% reduction (up to 60% in some cases)

**Key RSC rules:**
- Default = Server Component (no directive needed)
- `"use client"` = Client Component (push to leaf level)
- Server Components: NO useState, useEffect, onClick, browser APIs
- Server Components: CAN access DB, filesystem, env vars directly
- Client Components CANNOT import Server Components (but can accept as children)

---

## 3. SSG (Static Site Generation)

**Architecture:**
```
Build time: Fetch data + Render HTML -> Static files -> CDN
Request time: CDN serves pre built HTML (no processing)
```

| Metric | Rating | Why |
|--------|--------|-----|
| TTFB | Excellent | CDN edge, zero processing |
| FCP | Excellent | Complete HTML immediate |
| LCP | Excellent | Pre rendered in HTML |
| TBT | Excellent | Minimal or zero JS |
| CLS | Excellent | Layout fixed at build time |
| SEO | Excellent | Best possible foundation |

**Real benchmark:** WordPress blog (72/100 mobile) migrated to Astro SSG = 99/100 mobile with zero custom optimization.

**Limitations:** Content updates need rebuild. Build times grow with page count. No personalization.

---

## 4. ISR (Incremental Static Regeneration)

**Architecture:**
```
Build: Generate static pages (like SSG)
Request within TTL: Serve cached HTML
Request after TTL: Serve stale + trigger background regeneration
Next request: Fresh version
```

**Two mechanisms:**
1. **Time based:** `export const revalidate = 60` (Next.js)
2. **On demand:** `revalidatePath('/blog/post')` or `revalidateTag('articles')`

**Best practice:** Combine both. Long TTL as safety net + on demand for immediate updates.

Performance = SSG level for most requests. Requires runtime server (not pure static hosting).

---

## 5. Streaming SSR

**Architecture:**
```
Browser -> Server starts rendering -> Send shell immediately
-> Send content chunk when data resolves -> Send next chunk...
Single HTTP response with progressive chunks
```

**Key implementation:** React `renderToPipeableStream` (Node.js) / `renderToReadableStream` (Edge)

**Suspense boundary strategy:**
- Too few = page blocks on slowest query
- Too many = "popcorn effect" (bad UX)
- Rule: One boundary per independent data dependency, grouped by visual section

**Infrastructure requirement:** MUST disable Nginx buffering: `proxy_buffering off` or `X-Accel-Buffering: no`

**Real impact:** Wix reported 40% faster interaction with selective hydration + Suspense.

---

## 6. Hybrid Rendering (2025/2026 Best Practice)

**Per route strategy selection:**
```
/                 -> SSG (marketing, CDN served)
/blog/*           -> SSG + ISR (static with periodic refresh)
/pricing          -> SSG (rebuilt on deploy)
/dashboard/*      -> SSR + Streaming (per user data)
/admin/*          -> CSR (no SEO needed)
/product/:id      -> ISR (on demand revalidation)
/search           -> SSR (query dependent)
```

### Next.js Partial Prerendering (PPR)
Static shell served from CDN + dynamic holes filled via streaming. Single HTTP response. Available in Next.js 15 experimental, default in Next.js 16.

### Astro Islands Architecture
Page = static HTML by default. Interactive components opt in with directives:
- `client:load` = hydrate immediately
- `client:idle` = hydrate when browser idle
- `client:visible` = hydrate on viewport entry
- `client:media` = hydrate on media query match
- No directive = zero JS

**Benchmark:** 83% less JavaScript than equivalent Next.js for documentation sites.

---

## 7. Hydration Strategies

| Strategy | JS on Load | TTI | Best For |
|----------|-----------|-----|----------|
| Full Hydration | Full bundle | Slow | Complex SPAs |
| Partial Hydration | Interactive only | Moderate | Content + interactive |
| Progressive Hydration | Deferred | Good | Long pages |
| Selective Hydration | Prioritized | Good | Complex React apps (18+/19) |
| Resumability (Qwik) | Zero | Instant | Performance critical |
| Islands (Astro) | Per island | Excellent | Content heavy |

### Selective Hydration (React 18+/19)
- Suspense boundaries = independent hydration units
- If user clicks unhydrated component, React reprioritizes its hydration
- `use()` API in React 19 for cleaner async handling

### Resumability (Qwik)
- Zero JS on page load (not even hydration)
- 1KB Qwikloader handles lazy loading on interaction
- Eliminates 200ms to 500ms hydration tax entirely

---

## 8. Performance Patterns

### Speculation Rules API (Chrome)
```html
<script type="speculationrules">
{
  "prerender": [{"urls": ["/pricing"], "eagerness": "moderate"}],
  "prefetch": [{"where": {"href_matches": "/blog/*"}, "eagerness": "moderate"}]
}
</script>
```
- `prefetch` = fetch HTML only (low overhead)
- `prerender` = full render in invisible tab (near instant navigation)
- Chrome limits: 2 prerendered pages max in memory

### View Transitions API
```javascript
document.startViewTransition(() => root.render(<NewPage />));
```
Browser support: Chrome 111+, Edge 111+, Firefox 144+, Safari 18+

### bfcache (Back/Forward Cache)
Stores complete page snapshot. Back/forward = instant (~100ms LCP).
**Blockers:** `unload` listeners, WebLocks, `Cache-Control: no-store`, open WebSockets.

### React Activity API (19.2)
```jsx
<Activity mode={active ? 'visible' : 'hidden'}>
  <Component /> {/* State preserved when hidden */}
</Activity>
```
Replaces unmount/remount pattern. Preserves state without rendering cost.

---

## 9. Anti Patterns to Avoid

1. **Hydration mismatches:** Date.now(), Math.random(), window.* in render. Use `useSyncExternalStore` with `getServerSnapshot`.
2. **Layout shift from hydration:** Use dimension matched skeleton fallbacks.
3. **Double rendering:** Rendering null first then real content in useEffect. Use `useSyncExternalStore` instead.
4. **Over hydration:** Sending JS for static content. Use Server Components or Islands.
5. **FOUC (Flash of Unstyled Content):** Critical CSS must be in `<head>`. Use blocking `<script>` for dark mode.

---

## 10. Core Web Vitals (2025/2026)

| Metric | Good | Target | Ranking Factor |
|--------|------|--------|----------------|
| LCP | < 2.5s | < 2.0s | Yes (Core) |
| INP | < 200ms | < 150ms | Yes (Core, replaced FID) |
| CLS | < 0.1 | < 0.08 | Yes (Core) |
| TTFB | < 0.8s | | No (diagnostic) |
| FCP | < 1.8s | | No (diagnostic) |

**December 2025 update impact:** Sites with poor CWV saw 20 to 30% more severe traffic losses. CWV is now a ranking threshold, not a tiebreaker.

### LCP Sub parts (for images)
1. TTFB (server response)
2. Resource load delay (time until download starts)
3. Resource load duration (download time)
4. Element render delay (download to paint)

### INP Optimization
- Input delay: Break long tasks, defer scripts, code split
- Processing: Lightweight handlers, debounce, Web Workers
- Presentation: Reduce DOM size, CSS containment, `content-visibility`
- React specific: `useDeferredValue`, `useTransition`, `React.memo`

---

## 11. Framework Comparison (2025/2026)

| Project Type | Framework | Primary Strategy |
|---|---|---|
| Content/blog | Astro | SSG (islands for interactivity) |
| E commerce | Next.js | ISR + SSR + PPR hybrid |
| SaaS marketing | Astro or Next.js | SSG + ISR |
| SaaS application | Next.js or SvelteKit | SSR + streaming + CSR |
| Documentation | Astro or Starlight | SSG (zero JS) |
| Real time dashboard | Next.js or Remix | SSR + streaming + CSR |
| Performance critical | Qwik or Astro | Resumability / zero JS |

---

## 12. Consolidated Performance Matrix

| Strategy | TTFB | FCP | LCP | TBT | CLS | SEO |
|---|---|---|---|---|---|---|
| CSR | Excellent | Poor | Poor | Poor | Variable | Poor |
| SSR | Moderate | Excellent | Good | Moderate | Good | Excellent |
| SSG | Excellent | Excellent | Excellent | Excellent | Excellent | Excellent |
| ISR | Excellent | Excellent | Excellent | Excellent | Excellent | Excellent |
| Streaming SSR | Excellent | Excellent | Very Good | Good | Good | Excellent |
| PPR (Hybrid) | Excellent | Excellent | Excellent | Good | Good | Excellent |
| Astro Islands | Excellent | Excellent | Excellent | Excellent | Excellent | Excellent |
| Qwik | Excellent | Excellent | Excellent | Excellent | Excellent | Excellent |
