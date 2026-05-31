# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing website for **Codelli**, an AI studio targeting francophone B2B SMEs in Belgium / France / Luxembourg. It is a **static** Astro v6 site (`output: 'static'`), **trilingual** (FR / EN / NL), deployed on **Netlify** at `https://codelli.tech`. There is no backend and no client framework — vanilla `.astro` + one global CSS file + one global animation script.

> Location note: the live project is this directory (`…/Bureau/test`). The sibling `…/Bureau/codelli-astro` working directory is empty/stale, and a few old paths (the `scripts/` codegen, some `.claude` permission entries) still point at it — ignore those, this tree is the source of truth.

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Dev server at `localhost:4321`. **Does NOT enforce the production CSP** (see Deployment). |
| `npm run build` | Static build to `./dist/`. Requires Node ≥ 22.12. |
| `npm run preview` | Serve the built `dist/` locally. |
| `npm run astro -- check` | Astro type-check of `.astro`/`.ts`. This is the closest thing to a linter — it offers to install `@astrojs/check` on first run. |

There is **no unit-test framework and no ESLint/Prettier config** in this repo. Correctness rests on `tsconfig` strict mode + `astro check` + the build. Don't invent a test command.

The `scripts/gen-articles*.mjs` files are **not** npm scripts and must not be run — see "Article generation is dead code" below.

## The one thing to internalize: everything is tri-located by hand

There are **no dynamic routes** (`[...slug]`) and **no Astro i18n routing**. FR lives at the site root, EN under `/en/`, NL under `/nl/`. **Every page therefore exists as three physical files** — `src/pages/<name>.astro`, `src/pages/en/<name>.astro`, `src/pages/nl/<name>.astro` — each hardcoding `const lang = 'fr'|'en'|'nl'`. Adding or changing a page almost always means touching all three, plus translation keys in three JSON files. The whole architecture is shaped by this manual triplication; nothing auto-scales across locales.

## i18n engine — `src/i18n/utils.ts` + `fr.json` / `en.json` / `nl.json`

Hand-rolled, dependency-free. Memorize these four functions:

- `t(lang, 'dot.notation.key', fallback?)` — nested-key lookup. **It never throws.** A missing key first falls back to FR, then returns `fallback ?? key` (i.e. the literal key string). A key-looking string on the page = a missing translation, not an error.
- `getTranslations(lang)` — the whole dictionary; `BaseLayout` uses it for the `meta.*` SEO block.
- `getLangFromUrl(url)` — **first path segment only** (`/en/…`→en, `/nl/…`→nl, else fr). Any new top-level EN/NL route must sit under `/en/` or `/nl/` or it's mis-detected as FR.
- `localePath(lang, path)` — the FR-at-root URL builder: returns `path` unchanged for FR, prefixes `/en` or `/nl` otherwise. **Never hardcode an internal href** — wrap it (`href={localePath(lang, '/blog/')}`, anchors as `` `${localePath(lang,'/')}#contact` ``).

Conventions / traps:
- `lang` flows as an explicit **prop** down the layout/component tree; components only fall back to `getLangFromUrl` when no prop is given. Every text-rendering component takes `Props { lang: Lang }` and pulls copy via `t(lang, …)`.
- **`fr.json` defines the `Translations` type (`typeof fr`); `en.json`/`nl.json` are imported as plain JSON and are NOT type-checked against it.** Structural drift compiles fine and only shows up as silent FR fallback at runtime. To add a string, add the **same dot-path key to all three files** with identical nesting. Keep them structurally aligned by hand.
- `HTML_LANG` maps `fr→fr-BE`, `en→en`, `nl→nl-BE` — these BCP-47 tags (not bare `fr`/`nl`) are what appear in `<html lang>`, hreflang, and the sitemap.
- Some JSON values contain HTML (`<strong>`, anchors) and are rendered with `set:html` — keep that markup consistent across the three files.

## Layout chain — all `<head>`/SEO logic is centralized

`BaseLayout.astro` → `PageLayout.astro` → `BlogArticleLayout.astro`.

- **`BaseLayout`** is the *only* file that renders `<html>/<head>/<body>`. It owns: title/description/canonical, the full hreflang matrix, OG/Twitter, favicons/manifest, GTM + Google Consent Mode v2, non-blocking fonts, and the closing `<script>` tags loaded in order **gsap → lenis → main.js**. It exposes named slots `schema` and `head`.
- **`PageLayout`** wraps BaseLayout and adds the shared chrome: `Nav`, `<main><slot/></main>`, `Footer`, `CookieBanner`, `StickyMobileCta`. Normal pages import this. A page never imports `Nav`/`Footer` directly.
- **`BlogArticleLayout`** wraps PageLayout for articles (hero/author/TOC, reading-progress, `og:type=article`, auto-injected `BreadcrumbList` JSON-LD, ~500 lines of `is:global` blog CSS).

Rules when adding a page:
- **All URL props (`canonical`, `ogImage`, hreflang) are PATH-ONLY** — never include the domain. The single hardcoded `siteUrl = 'https://codelli.tech'` lives in `BaseLayout`; if the domain changes, edit BaseLayout (and the `public/*.txt` AEO files), not the pages.
- Title/description cascade: explicit prop ?? i18n `meta.*` ?? hardcoded FR default. You can omit them if the i18n `meta` block covers the page.
- Set `navLangUrls={{ fr, nl, en }}` (path-only) on sub-pages so the Nav language switcher cross-links to the right localized URL instead of the homepage (see `src/pages/audit-ia.astro`).
- **hreflang has two modes.** Default mode assumes the path is *identical* across locales and just swaps the `/en`|`/nl` prefix. For any page whose **slug is translated per language** (blog articles), you must pass `hreflangUrls` to force override mode, or alternates point at non-existent URLs.

### JSON-LD is hand-written per page

Structured data is **not** generated by layouts. Each page injects raw `<script type="application/ld+json" slot="schema">`. The big `@graph` (Organization/ProfessionalService + Person + Service nodes, with prices, ratings, `areaServed` cities) lives in `src/pages/index.astro`; blog pages inject `BlogPosting` + `FAQPage`. It is **not validated at build** and is easy to desync — keep prices/ratings/dates consistent across the page schema, the i18n JSON, and the two `llms*.txt` files.

## Design & animation — decoupled by a CSS-class contract

Section components in `src/components/sections/` are **markup-only**: they map i18n keys to class-tagged DOM, with **zero scoped `<style>` and almost zero JS**. Styling and animation live in two global files keyed off those class names:

- **`public/styles/global.css`** — the single stylesheet. Design tokens are in the `:root` block at the top: accent `--color-accent: #FF6B35`, `--color-bg: #0F0F0F`, fonts `--font-display: Outfit` (headings) / `--font-sans: Satoshi` (body), plus spacing/radius/z-index vars (`main.js` even reads some at runtime).
- **`public/scripts/main.js`** — the global animation engine. Reveals are **scrub-tied GSAP `ScrollTrigger` timelines selected by class** (not play-once IntersectionObservers). Each animation function early-returns with a `gsap.set(... opacity:1)` "force visible" block when `prefersReducedMotion || isMobile`.
- Vendor libs (`public/vendor/gsap.bundle.min.js`, `lenis.min.js`) are **self-hosted** and loaded via `<script is:inline>` in BaseLayout (CSP is `script-src 'self'`). Keep new vendor JS local, not on a CDN.
- **Lenis smooth-scroll is initialized in `Nav.astro`, not main.js** (desktop-only; exposed as `window.lenis`; scroll helpers fall back to native when it's absent). A custom layout rendered without Nav has no smooth scroll.

**Adding a homepage section touches four places, none auto-wired:** (1) create `sections/Foo.astro` (`Props { lang }`, copy uses `t()`, stable root class + `id`); (2) import + place it in `src/pages/index.astro` (the composition root); (3) write its styles in `global.css`; (4) if it animates, add a block to `main.js` **and** list its selectors in the mobile/reduced-motion guard so it stays visible on mobile. Renaming a class silently breaks CSS/animation — the class name is the public API between the three layers. Repeating items (FAQ/Process/Testimonials/TechStack) are driven by a small array of key-suffixes in the component frontmatter — extend the array *and* add matching i18n keys.

## Blog & content collection

- **The `blog` content collection (`src/content.config.ts`) stores frontmatter ONLY.** The article HTML body lives as escaped-string consts (`toc`/`body`/`cta`/`intro`) inside each `src/pages/.../blog/<slug>.astro` file, injected via `set:html`. **To edit article text, edit the `.astro` page, not the `.md`.** The `.md` drives listings/dates/category and is read by `getEntry('blog', '<id>')`.
- Required frontmatter: `title, description, pubDate (bare YAML date — not a quoted string), category, readingTime, lang`. Cross-locale linking comes from `translationSlugs: {fr,en,nl}`.
- **Blog slugs differ per language** via filename suffix: `<slug>.md` (FR), `<slug>-en.md`, `<slug>-nl.md`. The `getEntry` id = filename stem and must match exactly. Keep all article `.md` files **flat** in `src/content/blog/` (the glob is recursive; a file in a subfolder gets id `subfolder/slug` and breaks links).
- **Four places must stay in sync for blog hreflang, none derived from the others:** (a) each `.md`'s `translationSlugs`, (b) the page `canonical`, (c) **`BLOG_HREFLANG_MAP` in `astro.config.mjs`** (the sitemap `serialize()` hook can't auto-detect differing slugs — every new article must be added here), and (d) the 301 redirects in `netlify.toml`.

## Deployment & analytics

- **Netlify**, configured entirely in `netlify.toml`: build command, `.html → trailing-slash` 301 redirects for every legacy URL (the catch-all `/* → /404.html` must stay **last**), cache headers, and the **Content-Security-Policy**.
- **The CSP is enforced only in production**, not by `astro dev`/`preview`. A new third-party script, iframe, font host, or fetch endpoint will work locally and break only on the deployed site unless you add it to the CSP allowlist in `netlify.toml`.
- **GA4 fires only through GTM** (container `GTM-N6J49WQW`); there is no `gtag.js`/measurement ID in the repo — configure tags in GTM. Consent Mode v2 defaults everything to `denied` (EEA) and **must** run before the GTM loader. All Calendly CTAs call `trackCalendlyClick('<source>')` (defined in BaseLayout) and use the centralized `CALENDLY_URL` from `src/config.ts`.

## AEO (answer-engine optimization) is first-class

`public/llms.txt` (concise) and `public/llms-full.txt` (exhaustive: identity, pricing, FAQ, testimonials, full page/article index) are **hand-maintained** Markdown mirroring the on-page content, each with its own "Last updated" date. `public/robots.txt` explicitly allow-lists AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, …). **When you add/rename a page or article, update both `llms*.txt` files.** The SEO/AEO roadmap and rationale live in `tasks.md`.

## Article generation is dead code

`scripts/gen-articles.mjs` and `scripts/gen-articles-i18n.mjs` were **one-off scaffolding** that scraped now-deleted source `.html` files and wrote to the now-gone `codelli-astro` tree using hardcoded absolute paths. They are **not** wired into the build, their inputs no longer exist, and `writeFileSync` would **clobber the hand-edited `.astro` article pages** (now the source of truth). Do not run them; author new articles by hand following `src/pages/blog/fastapi-vs-nodejs-mvp-2026.astro`.
