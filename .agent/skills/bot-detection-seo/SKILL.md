# Bot Detection and SEO Crawler Serving Skill

> **Complete reference for bot/crawler detection, user agent strings, OG tag requirements, and prerendered content serving (2025/2026)**

---

## 1. Master Bot Detection Regex

### Comprehensive Pattern (TypeScript)

```typescript
const BOT_PATTERNS: RegExp[] = [
  // === SEARCH ENGINES ===
  /googlebot/i,
  /google-inspectiontool/i,
  /storebot-google/i,
  /adsbot-google/i,
  /mediapartners-google/i,
  /google-read-aloud/i,
  /feedfetcher-google/i,
  /apis-google/i,
  /bingbot/i,
  /bingpreview/i,
  /adidxbot/i,
  /msnbot/i,
  /yandexbot/i,
  /baiduspider/i,
  /duckduckbot/i,
  /slurp/i,                        // Yahoo
  /applebot/i,
  /sogou/i,
  /petalbot/i,
  /yeti\//i,                       // Naver

  // === SOCIAL MEDIA CRAWLERS ===
  /facebookexternalhit/i,
  /facebookcatalog/i,
  /meta-externalagent/i,
  /meta-externalfetcher/i,
  /twitterbot/i,
  /linkedinbot/i,
  /discordbot/i,
  /telegrambot/i,
  /whatsapp/i,
  /slackbot/i,
  /slack-imgproxy/i,
  /pinterestbot/i,
  /pinterest\//i,
  /snap url preview/i,             // Snapchat
  /snapchatads/i,
  /skypeuripreview/i,
  /vkshare/i,
  /redditbot/i,
  /outbrain/i,

  // === SEO TOOL CRAWLERS ===
  /semrushbot/i,
  /ahrefsbot/i,
  /ahrefssiteaudit/i,
  /mj12bot/i,                      // Majestic
  /dotbot/i,                       // Moz
  /rogerbot/i,                     // Moz
  /screaming frog/i,
  /seobilitybot/i,
  /sitecheckerbotcrawler/i,
  /contentking/i,                  // NOT contentkingbot
  /sebot-wa/i,                     // SE Ranking
  /serpstatbot/i,
  /siteimprove/i,
  /deepcrawl/i,                    // Lumar
  /oncrawl/i,

  // === AI / LLM CRAWLERS ===
  /gptbot/i,
  /oai-searchbot/i,
  /chatgpt-user/i,
  /chatgpt-browser/i,
  /claudebot/i,
  /claude-searchbot/i,
  /claude-user/i,
  /claude-web/i,
  /anthropic-ai/i,
  /perplexitybot/i,
  /perplexity-user/i,
  /ccbot/i,                        // Common Crawl
  /google-extended/i,
  /google-cloudvertexbot/i,
  /applebot-extended/i,
  /amazonbot/i,
  /bytespider/i,
  /deepseekbot/i,
  /cohere-ai/i,
  /duckassistbot/i,
  /youbot/i,
  /ai2bot/i,
  /diffbot/i,
  /pangubot/i,
  /timpibot/i,
  /iaskspider/i,
  /chatglm-spider/i,
  /grok/i,
  /crawl4ai/i,
  /firecrawl/i,
  /webzio-extended/i,

  // === ARCHIVE / MISC ===
  /ia_archiver/i,
  /archive\.org_bot/i,
  /embedly/i,
  /flipboard/i,
  /w3c_validator/i,
  /seznam/i,
  /google-safety/i,
];
```

---

## 2. JavaScript Execution by Bot Type

| Category | Executes JS? | Bots |
|----------|:------------:|------|
| Full JS | YES | Googlebot (Chromium), Applebot, Google-Extended |
| Partial JS | PARTIAL | Bingbot (limited, struggles with complex JS) |
| No JS | NO | ALL social bots, ALL AI crawlers, ALL SEO tools, DuckDuckBot, YandexBot, Baiduspider |

**69% of AI crawlers cannot execute JavaScript.**

**Implication:** Since most bots do NOT execute JS, prerendered HTML is essential for: social media link previews, AI search indexing, SEO tool analysis, non Google search engines.

---

## 3. robots.txt Compliance

| Bot | Respects robots.txt? |
|-----|:--------------------:|
| Googlebot | Yes (ignores Crawl-delay) |
| Bingbot | Yes (respects Crawl-delay) |
| AdsBot-Google | Partially (ignores wildcard * rules) |
| GPTBot | Claims yes (disputed) |
| ChatGPT-User | NO (removed compliance Dec 2025) |
| ClaudeBot | Claims yes |
| PerplexityBot | Claims yes (stealth crawling reports) |
| Perplexity-User | NO (ignores when user provides URL) |
| Bytespider | NO |
| ContentKing | NO |

**Duke University 2025 study:** AI search crawlers "rarely check robots.txt."

---

## 4. Bot Verification Methods

### IP Based Verification (Gold Standard)

**Google:** Reverse DNS must resolve to `*.googlebot.com`, `*.google.com`, or `*.googleusercontent.com`. Forward DNS must match original IP.

**Facebook/Meta:** ASN AS32934
**Twitter/X:** ASN AS13414
**Telegram:** IP range 149.154.164.0/22
**Bing:** Reverse DNS must resolve to `*.search.msn.com`

**5.7% of AI crawler traffic is spoofed** (HUMAN Security 2025).

### Header Based Detection
| Header | Purpose | Status |
|--------|---------|--------|
| `_escaped_fragment_` URL param | Legacy Google AJAX signal | Deprecated |
| `X-Prerender-Token` | Prerender.io middleware | Service specific |
| `X-Forwarded-For` | Reveal bot IPs behind proxies | Useful |

---

## 5. OpenGraph / Meta Tag Requirements

### Universal Minimum (All Platforms)
```html
<meta property="og:type" content="website" />
<meta property="og:title" content="Title (max 60 chars)" />
<meta property="og:description" content="Description (2 to 4 sentences)" />
<meta property="og:image" content="https://example.com/image-1200x630.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="https://example.com/page" />
<meta name="twitter:card" content="summary_large_image" />
```

### Platform Specific

| Platform | Image Size | Special Tags | Fallback |
|----------|-----------|--------------|----------|
| Facebook | 1200x630px min | og:* required | None |
| Twitter/X | 1200x600px (2:1) | twitter:card, twitter:site | Falls back to og:* |
| LinkedIn | 1200x627px (1.91:1) | Standard OG | None |
| Discord | Standard OG | Standard OG | None |
| WhatsApp | Standard OG | Standard OG | None |
| Telegram | Standard OG | Standard OG | None |
| Pinterest | Standard OG | pinterest-rich-pin | OG |
| Snapchat | Standard OG | OG + twitter:card | None |

**ALL social bots read from initial HTML only. Client side JS injected OG tags are INVISIBLE.**

---

## 6. Serving Bots Correctly

### Cloaking vs Dynamic Rendering
- **Acceptable:** Serving identical content prerendered to bots
- **Cloaking (PENALTY):** Different content to bots vs users
- **Test:** Regularly compare bot vs user rendered content

### Required HTTP Headers
```typescript
res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
res.setHeader('Vary', 'User-Agent'); // Separate CDN cache per UA
res.setHeader('X-Robots-Tag', 'all');
```

### Static Asset Exclusion
Never prerender these extensions:
```
.js .css .xml .png .jpg .jpeg .gif .pdf .txt .ico .rss .zip .mp3
.rar .exe .wmv .avi .ppt .mpg .mpeg .tif .wav .mov .psd .ai .xls
.mp4 .m4a .swf .dat .dmg .iso .flv .m4v .torrent .ttf .woff .woff2
.svg .eot .webp .avif .webm .map .json
```

### Preventing Infinite Loops
If prerender service makes requests to your own site, exclude its User Agent:
```typescript
// Prerender.io UA contains "Prerender"
if (/Prerender/i.test(userAgent)) return next(); // Skip prerendering
```

---

## 7. Google Crawlers (Complete Reference)

| Bot | Token | Purpose |
|-----|-------|---------|
| Googlebot | `Googlebot` | Web search |
| Googlebot-Image | `Googlebot-Image` | Image search |
| Googlebot-Video | `Googlebot-Video` | Video search |
| Googlebot-News | `Googlebot-News` | Google News |
| Google-InspectionTool | `Google-InspectionTool` | Search Console |
| Storebot-Google | `Storebot-Google` | Google Shopping |
| AdsBot-Google | `AdsBot-Google` | Ads quality check |
| Mediapartners-Google | `Mediapartners-Google` | AdSense |
| GoogleOther | `GoogleOther` | R&D |
| Google-Extended | `Google-Extended` | Gemini AI training |
| Google-CloudVertexBot | `Google-CloudVertexBot` | Vertex AI |
| APIs-Google | `APIs-Google` | Push notifications |
| Google-Read-Aloud | `Google-Read-Aloud` | Text to speech |
| FeedFetcher-Google | `FeedFetcher-Google` | RSS/Atom |

---

## 8. AI Crawlers (Complete Reference)

| Bot | Organization | Purpose | Respects robots.txt |
|-----|-------------|---------|:-------------------:|
| GPTBot | OpenAI | Training | Claims yes |
| OAI-SearchBot | OpenAI | Search | Claims yes |
| ChatGPT-User | OpenAI | Browsing | NO |
| ClaudeBot | Anthropic | Training/Search | Claims yes |
| Claude-SearchBot | Anthropic | Search | Claims yes |
| PerplexityBot | Perplexity | Search indexing | Claims yes |
| Perplexity-User | Perplexity | User browsing | NO |
| CCBot | Common Crawl | Open dataset | Yes |
| Bytespider | ByteDance | LLM training | NO |
| Amazonbot | Amazon | Alexa/AI | Claims yes |
| DeepSeekBot | DeepSeek | LLM training | Unclear |
| cohere-ai | Cohere | Training | Claims yes |
| DuckAssistBot | DuckDuckGo | AI answers | Claims yes |
| YouBot | You.com | AI search | Claims yes |
| Diffbot | Diffbot | Scraping/AI | Claims yes |
| ChatGLM-Spider | Zhipu AI | LLM training | Unclear |
| Grok | X/Twitter | AI | Unclear |
| Crawl4AI | Open source | Data collection | Unclear |

---

## 9. Social Crawlers (Complete Reference)

| Bot | Token | Platform | Image Size |
|-----|-------|----------|-----------|
| facebookexternalhit | `facebookexternalhit` | Facebook/Instagram | 1200x630 |
| Meta-ExternalAgent | `Meta-ExternalAgent` | Meta AI | N/A |
| Twitterbot | `Twitterbot` | Twitter/X | 1200x600 |
| LinkedInBot | `LinkedInBot` | LinkedIn | 1200x627 |
| Discordbot | `Discordbot` | Discord | Standard OG |
| TelegramBot | `TelegramBot` | Telegram | Standard OG |
| WhatsApp | `WhatsApp` | WhatsApp | Standard OG |
| Slackbot | `Slackbot` | Slack | Standard OG |
| Pinterestbot | `Pinterestbot` | Pinterest | Standard OG |
| Snap URL Preview | `Snap URL Preview Service` | Snapchat | Standard OG |
| SkypeUriPreview | `SkypeUriPreview` | Skype | Standard OG |

**iMessage note:** Uses combined facebookexternalhit + Twitterbot UA. Comes from end user IPs, not Meta/X IPs.

---

## 10. ValidateStrategy Missing Bots (Action Items)

### Missing from BOT_PATTERNS
**Search engines:** google-inspectiontool, storebot-google, adsbot-google, mediapartners-google, bingpreview, adidxbot, sogou, petalbot

**Social:** slackbot (distinct from generic slack), snap url preview, snapchatads, skypeuripreview, redditbot, meta-externalfetcher, facebookcatalog

**SEO tools:** ahrefssiteaudit, serpstatbot, siteimprove, deepcrawl, oncrawl

**AI crawlers:** chatgpt-browser, claude-user, claude-web, perplexity-user, google-cloudvertexbot, bytespider, deepseekbot, cohere-ai, duckassistbot, youbot, ai2bot, diffbot, pangubot, chatglm-spider, grok, crawl4ai

### Pattern Fixes Needed
- `contentkingbot` -> `contentking` (actual UA token)
- `siteauditbot` -> add `sebot-wa` (SE Ranking actual UA)
- Add `Vary: User-Agent` header to bot responses
