---
name: seo
description: Technical SEO and generative search (GEO) rules - server-rendered content, page metadata, canonical and hreflang, sitemap and robots.txt, structured data, local business pages. Apply when creating or editing a public page or route, its metadata, the rendering mode (SSR, prerender, client-only), i18n routing, a store locator, or when auditing whether a page can be indexed and cited.
---

# Technical SEO and GEO

Goal: every public page can be crawled, understood and cited by search engines and AI assistants. Generative search (AI Overviews, ChatGPT, Gemini, Perplexity) relies on the same foundations as classic SEO: what the developer controls is listed here. Content strategy, links and reviews are not code; they go in the recommendations for the client (last section).

## Pages that should not be indexed
DOOH screens, installation kiosks, private apps, campaign pages reached only by QR code, staging and previews: `noindex` (meta robots or `X-Robots-Tag` header), decided in the brief. Make sure a staging `noindex` never reaches production.

## 1. Content in the server HTML
- Indexable content (headings, text, links, product data, addresses) is in the HTML sent by the server: SSR or prerendering. Most AI crawlers do not run JavaScript.
- Nuxt: keep SSR on. `ssr: false` only through `routeRules` for app areas not meant for search.
- 3D, WebGL and WebAR scenes: inside `<ClientOnly>` within a server-rendered page that has its `h1`, a text description of the experience and the fallback. Never a page whose only content is a canvas.
- Navigation through real links (`<NuxtLink>`, `<a href>`), never click handlers on other elements.
- Check: fetch the page without JavaScript (`curl` or view source) and look for the main content.

## 2. Metadata per page
- A unique `title` (about 60 characters) and `description` (about 155) per page, in the content language, describing that page. Nuxt: `useSeoMeta` (`title`, `description`, `ogTitle`, `ogDescription`, `ogImage` as an absolute URL).
- `lang` on `<html>`, one `h1` per page.
- Canonical: an absolute URL built from a configured site URL (for example `runtimeConfig.public.siteUrl`), never from the request host or `localhost`, without tracking parameters. If no site URL is configured, say so instead of guessing one.
- Multilingual: one crawlable URL per language, `hreflang` alternates with `x-default`, no automatic redirect based on `Accept-Language`. With `@nuxtjs/i18n`, check its current documentation for SEO settings.

## 3. Crawling and status codes
- `sitemap.xml` with canonical, indexable URLs only; `robots.txt` points to it.
- A missing page returns a real 404 (Nuxt: `createError({ statusCode: 404 })`), a moved URL a 301. On a redesign, list the old URLs and map them.
- AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended...): allowing or blocking them in `robots.txt` is the client's decision. Ask; never block or open them silently. Hosting, CDN or firewall bot protection must not block search crawlers.
- `llms.txt`: optional, only on request. Search engines do not need a special file.

## 4. Structured data
- JSON-LD describing only what the page shows, with the same values as the visible text. Typical types: `Organization` and `WebSite` (home), `Product` with `Offer` (price, currency, availability) for e-commerce, `Article`, `BreadcrumbList`, `LocalBusiness` (section 5). `FAQPage` only for a visible FAQ.
- Build it as an object serialized with `JSON.stringify`, never by string concatenation. Escape `<` as `<` when values come from a CMS or users (see `security-frontend`).
- No SEO module or extra dependency for a few tags: `useSeoMeta` and `useHead` are enough. A module is justified when the project needs sitemap, robots, structured data and OG images together (see `code-simplicity`).
- Validate with Google's Rich Results Test or validator.schema.org: an invalid block fails silently.

## 5. Local business
For sites with one or more physical locations (shop, workshop, restaurant, practice):
- **One source for the NAP** (name, address, phone, opening hours): defined once in the code or the CMS, reused by the location page, footer, contact page and JSON-LD. It must match the Google Business Profile exactly: ask the client for the reference values.
- **`LocalBusiness` JSON-LD**, or a more specific subtype: `name`, `address` (`PostalAddress`), `telephone` in international format (`+33...`), `openingHoursSpecification`, `url`, `geo` if known, `sameAs` (Google Business Profile, social networks).
- Visible phone as a `tel:` link, address in `<address>`.
- **One server-rendered page per location**, with content specific to it (access, team, services), not a template where only the city changes.
- **Store locator**: a crawlable list of links to the location pages; the interactive map is an enhancement on top.

## 6. Page experience
Core Web Vitals are part of search ranking: apply `performance-memory` and `responsive`. Images: `width` and `height`, `loading="lazy"` below the fold, never on the main above-the-fold image. Semantic HTML: see `accessibility`, which also helps machines read the page.

## 7. Recommendations outside the code
When delivering a public site or a significant public page, end the summary with a short list for the client, once per project, adapted to the project and presented as good practice, not as guarantees:
- Search Console set up, sitemap submitted.
- Google Business Profile complete, with exactly the same NAP as the site; same NAP on directories and social networks.
- Detailed customer reviews; mentions in local press, partner and town hall sites.
- Content that answers customers' real questions with specific, original information: AI assistants cite precise, verifiable sources.
- E-commerce: product feed in Google Merchant Center.
- AI visibility varies from one answer to the next: measure trends over time, not positions.
