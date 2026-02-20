# Prerendering Infrastructure Skill

> **Complete knowledge of Prerender.io, dynamic rendering, Puppeteer prerendering, CDN level bot routing, and self hosted solutions (2025/2026)**

---

## 1. Prerender.io Architecture

### How It Works
1. Request arrives at server/CDN
2. Middleware inspects User Agent header
3. If bot: forward to `service.prerender.io` with token
4. Prerender.io renders via Headless Chrome (or serves cache)
5. HTML snapshot returned to bot
6. If human: request passes through unchanged

### Express Integration
```javascript
const prerender = require('prerender-node');

// Basic (one line)
app.use(prerender.set('prerenderToken', 'YOUR_TOKEN'));

// With whitelist
app.use(prerender
  .set('prerenderToken', 'YOUR_TOKEN')
  .whitelisted(['/blog', '/pricing', '/demo-analysis'])
  .blacklisted(['/admin', '/api'])
  .set('protocol', 'https')
  .set('host', 'validatestrategy.com')
);

// Add AI crawlers
app.use(prerender
  .set('prerenderToken', 'YOUR_TOKEN')
  .addUserAgents(['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Amazonbot'])
);

// Self hosted prerender server
app.use(prerender
  .set('prerenderServiceUrl', 'http://localhost:3000')
);
```

### Cache Management
```bash
# Recache single URL
curl -X POST https://api.prerender.io/recache \
  -H "Content-Type: application/json" \
  -d '{"prerenderToken": "TOKEN", "url": "https://example.com/page"}'

# Recache multiple (up to 1000)
curl -X POST https://api.prerender.io/recache \
  -H "Content-Type: application/json" \
  -d '{"prerenderToken": "TOKEN", "urls": ["url1", "url2"]}'

# Clear wildcard
curl "https://api.prerender.io/cache-clear?token=TOKEN&url=https://example.com/blog/*"
```

**Best practice:** Long TTL (7 days) + API recache on content change.

### Pricing (Nov 2025+)
| Plan | Price | Renders/Month | Min Cache |
|------|-------|---------------|-----------|
| Starter | $49/mo | 25,000 | Configurable |
| Growth | ~$99/mo | Higher | Configurable |
| Pro | ~$400/mo | 100K+ | 12h |
| Enterprise | Custom | Millions | 6h |

---

## 2. Google Dynamic Rendering Status

**DEPRECATED by Google** (2024/2025). Removed from docs. Called a "workaround."

**However:**
- Bing STILL recommends it for JS heavy sites
- AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do NOT execute JS, need prerendered HTML
- NOT cloaking if content is identical to what users see
- Google prefers: SSR > SSG > Hydration > Dynamic rendering (last resort)

### Googlebot WRS (Web Rendering Service)
- Uses evergreen Chromium (few versions behind latest Chrome)
- Two phase: Phase 1 = fetch HTML, Phase 2 = render with JS (delayed)
- Stateless: no cookies, no localStorage persistence
- No permissions: geolocation, camera etc denied
- Timeout based: large JS may cause incomplete content

---

## 3. Alternatives Comparison

| Approach | Cost | Setup | Maintenance | Framework |
|----------|------|-------|-------------|-----------|
| Prerender.io | $49+/mo | Hours | Zero | Any SPA |
| Self hosted Prerender | Server cost | 1 to 2 weeks | Moderate | Any |
| Puppeteer DIY | Server cost | 4 to 8 weeks | High | Any |
| CF Workers + Browser | CF pricing | 1 to 2 weeks | Low to Moderate | Any |
| Vercel ISR | Vercel pricing | Days | Low | Next.js only |
| Netlify + Prerender | Netlify + ext | Hours | Low | Any |
| react snap | Free | Hours | Low | React only |

### Cloudflare Workers + Browser Rendering
```javascript
export default {
  async fetch(request, env) {
    const ua = request.headers.get('user-agent') || '';
    const isBot = /googlebot|bingbot|facebookexternalhit|twitterbot|GPTBot|ClaudeBot/i.test(ua);

    if (!isBot) return fetch(request);

    const cacheKey = new URL(request.url).pathname;
    const cached = await env.CACHE.get(cacheKey);
    if (cached) return new Response(cached, {
      headers: { 'Content-Type': 'text/html' }
    });

    const browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();
    await page.goto(request.url, { waitUntil: 'networkidle0', timeout: 8000 });
    const html = await page.content();
    await browser.close();

    await env.CACHE.put(cacheKey, html, { expirationTtl: 86400 });
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
  }
};
```

### Puppeteer DIY Pattern
```javascript
async function prerenderUrl(url) {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const type = req.resourceType();
    if (['image', 'stylesheet', 'font', 'media'].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
  const html = await page.content();
  await page.close();
  return html;
}
```

**Challenges:** Chrome = 280MB, needs 30+ Linux packages, memory leaks, manual bot list, no built in cache.

---

## 4. Implementation Patterns

### Nginx Bot Routing
```nginx
map $http_user_agent $is_bot {
    default                 0;
    "~*googlebot"           1;
    "~*bingbot"             1;
    "~*facebookexternalhit" 1;
    "~*twitterbot"          1;
    "~*linkedinbot"         1;
    "~*GPTBot"              1;
    "~*ClaudeBot"           1;
    "~*PerplexityBot"       1;
    "~*Prerender"           0;  # Prevent loop
}
```

### CDN Level Routing (CloudFront + Lambda@Edge)
1. Viewer Request function: detect bot, set `x-should-prerender: true`
2. Origin Request function: rewrite origin to prerender service
3. Prerender.io manages own cache; disable CloudFront caching for bot requests

### Edge vs Origin Rendering
| Aspect | Edge | Origin |
|--------|------|--------|
| Latency | Low (nearest POP) | Higher (round trip) |
| Scalability | Distributed | Limited by server |
| Cost | Per request | Always running |
| Best for | High traffic global | Simple deployments |

**Recommended:** Edge detection + routing, origin or managed prerendering.

---

## 5. HTTP Headers for Bot Responses

```typescript
res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
res.setHeader('Vary', 'User-Agent'); // CRITICAL: separate cache per UA
res.setHeader('X-Robots-Tag', 'all');
```

**`Vary: User-Agent` is critical.** Without it, CDNs may serve prerendered HTML to real users or SPA shell to bots.

---

## 6. Content Parity Rules (Avoid Cloaking Penalties)

1. Prerendered HTML must contain SAME primary content as client rendered version
2. Removing JS widgets/effects from bot version is OK
3. NEVER add extra keyword text, hidden links, or SEO only content
4. Regularly compare bot vs user versions with automated tests
5. Keep snapshots fresh; stale = indexing problems

---

## 7. ValidateStrategy Current Implementation

### Architecture (3 layers)
1. **Meta injection** (all requests): `routeMeta.ts` injects route specific meta tags
2. **Body injection** (all requests): `routeMeta.ts` `injectBodyContent()` adds blog content
3. **Static prerendering** (bots only, highest priority): Puppeteer + `prerenderMiddleware.ts`

### Middleware Order (Production)
1. `prerenderMiddleware` -> if bot + file exists, respond
2. Static file serving -> CSS/JS/images
3. Catch all -> `index.html` with injected meta + body content

### Identified Gaps
- Missing `Vary: User-Agent` header on bot responses
- `getBotName()` only maps 18 of 36 patterns (rest = "unknown bot")
- No in memory file existence cache (fs check per bot request)
- Missing bots: Bytespider, PetalBot, Snapchat, Reddit, DeepSeek, Grok
- `contentkingbot` pattern should be `contentking` (actual UA token)
- `siteauditbot` should also match `sebot-wa` (SE Ranking actual UA)

### Improvement Options (by effort)
1. **Low:** Add missing bot patterns + `Vary: User-Agent` header
2. **Medium:** Add Prerender.io as fallback for non prerendered pages ($49/mo)
3. **High:** Cloudflare Workers edge level prerendering (if migrating CDN)
