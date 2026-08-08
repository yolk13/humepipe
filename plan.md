# Contech Hume Pipes — System Design & Implementation Plan

**Project:** B2B Website for "Contech Concrete and Allied Industries Pvt. Ltd."
**Primary Product:** Hume Pipes
**Target Audience:** Civil Contractors, Procurement Managers, Site Engineers, Bulk B2B Buyers
**Sources:** `requirements.md` (PRD), `stitch_contech_b2b_infrastructure_portal/` (design prototypes + design system)

---

## 1. Architecture

```
┌─────────────┐   REST/ISR   ┌──────────────────┐        ┌──────────┐
│  Next.js    │──────────────▶ Payload CMS       │  SQLite │ media    │
│  (frontend) │   HTTP-only  │ (Express-based)   │────────▶ volume   │
│  SSR/ISR    │              │ REST API + /admin │        │ (images, │
│  Tailwind   │              │ collections       │        │  TDS PDF)│
│  Framer M.  │              └──────────────────┘        └──────────┘
└─────────────┘                      │
                                     │ SMTP (RFQ confirm) / Slack webhook (sales alert)
```

- **Frontend:** Next.js (React) with SSR/ISR for SEO optimization.
- **Styling:** Tailwind CSS + minimal Framer Motion.
- **CMS / Backend:** Payload CMS — an Express-based headless CMS. Its built-in Admin Panel fulfills the PRD's admin-dashboard requirement (RFQ pipeline + spec-table CMS). SQLite storage.
- **Infrastructure:** Docker Compose (next-app + payload-cms + nginx/caddy reverse proxy), SQLite on a volume, Tailscale VPN for zero-trust admin access.
- **Revalidation:** Static pages revalidate on-demand via a protected `POST /api/revalidate` when content is edited in Payload.
- **Media:** TDS PDFs and imagery stored on a Docker volume, served through Payload.

---

## 2. Design Theory — "Precision Industrial Core" elevated

The stitch design system is already built on the golden ratio; codify it explicitly as the design foundation.

### 2.1 Golden Ratio (φ = 1.618)

- **Spacing:** `xs 10 → sm 16 → md 26 → lg 42 → xl 68 → xxl 110` — exactly the φ series (16×1.618≈26 → 42 → 68 → 110). Expose as CSS tokens derived from `--phi` so no value is arbitrary.
- **Typography** (Inter): base **16px** body → φ → **26px** (headline-md) → **42px** (headline-lg) → **68px** (headline-xl) → **110px** (display). Line-height 16×1.618≈**26px**.
- **Grid:** container **1280px**; major sections use the **61.8/38.2 split** (stitch 62/38) for hero, product detail, QA, RFQ.
- **Optical center** at (61.8%, 38.2%): place hero CTA and primary image focal points there; use a golden-spiral overlay to anchor parallax focal points.
- **Motion durations** follow Fibonacci: 150 / 250 / 400 / 650 ms.

### 2.2 Color Theory — 60-30-10 with complementary contrast

| Token | Value | Role | Theory |
|---|---|---|---|
| Surface / white | `#FFFFFF` grays | 60% background | Sterile "clean slate" for technical data |
| Royal Blue | `#4169E1` | 30% primary | Trust, authority, stability (B2B credibility) |
| Amber | `#F59E0B` | 10% CTA only | Safety-signal urgency; near-complementary to blue |
| Deep Slate | `#1E293B` | text / headers | Blueprint "heavy ink" |
| Slate Gray | `#475569` | metadata | Lower hierarchy |

- Blue↔amber is a **safety-industry pairing** (engineering authority + hazard/action) — on-brand for construction.
- Strictly **AA contrast**: amber always carries Deep Slate text; blue carries white. Error red `#ba1a1a` reserved for validation only.
- **Shapes stay 0px sharp; depth via 1px/2px borders; zero shadows** (per `precision_industrial_core/DESIGN.md`).

### 2.3 Motion & Effects System (stitch + parallax)

- **Lenis smooth scroll** (inertia easing) as the base feel.
- **Parallax layers** via Framer Motion `useScroll` / `useTransform` (transform-only, GPU-friendly): hero factory image scrolls slower; TDS-download and spec sheets drift at mid-speed; stats counter at normal speed.
- **Scroll-triggered reveals:** fade + 16px slide + blur with staggered children (`whileInView`).
- **Animated counters** for capacity stats (500+ units/day) with spring easing.
- **Marquee** trust bar (NHAI, L&T, CPWD, Tata) — CSS animation, pauses on hover.
- **Tab transitions** via `AnimatePresence` on NP2/NP3/NP4 product views.
- **Industrial progress indicators:** amber loading bars per DESIGN.md.
- **Micro-interactions:** button hover = 2px inset border or ±10% brightness (no shadows); card hover = border shifts to royal blue; spec-table row highlight.
- **`prefers-reduced-motion`:** disable parallax, marquee, and heavy reveals; honor system settings.

---

## 3. Pages & Sitemap

1. **Home** — parallax hero (62/38), trust marquee, capacity stats, product-class cards, QA teaser, blog teaser, RFQ CTA.
2. **Products** — NP2/NP3/NP4 tabs, dense spec tables (internal dia / wall thickness / length / weight / joint type), horizontal-scroll on mobile (PRD), filters by diameter/class/joint, frictionless TDS PDF download, FAQ block.
3. **Quality Assurance** — three-edge bearing & hydrostatic tests (62/38 alternating), IS 458 compliance, certifications.
4. **RFQ Portal** — corporate details, dynamic line-item builder ("50× NP3 600mm"), mandatory delivery-site logistics field, trust sidebar.
5. **Blog** — index (featured + grid, tags, pagination), post detail (author bio, FAQ, related posts, read time), tag/category archives, author pages, RSS feed.
6. **Glossary** — hume-pipe/construction terms (feeds `DefinedTerm` schema, highly LLM-citable).
7. **Admin** (Payload `/admin`, Tailscale-only) + Privacy / Legal / 404.

---

## 4. CMS — Payload Collections (SQLite)

- `users` — admin auth (email/password, role gates).
- `media` — images + TDS PDF uploads.
- `productClasses` (NP2/NP3/NP4) + `products` — diameter, wall thickness, length, weight, joint type, PDF link → drives spec tables without hardcoding.
- `rfqs` — company, PAN/VAT, contact, project type, `lineItems[]`, delivery site, **status workflow (Pending → Quoted → Closed)**, internal notes, timestamps.
- `blogPosts` — title, slug, excerpt, cover, rich-text body with custom blocks, author, tags, categories, status, publishedAt, SEO fields (title/desc/OG), `dateModified` auto-update.
- `authors` — name, title, bio, engineering credentials, photo, `sameAs[]` (LinkedIn etc.).
- `tags` / `categories`, `glossaryTerms`, `settings` (certifications, contact, trust logos, hero copy).
- **Rich-text blocks:** spec-table block, FAQ block, stat-with-source, callout, quote, image, PDF-link.

---

## 5. Blog System

- SSR/ISR pages; static generation at build + on-demand revalidation on publish.
- Listing with featured post, pagination, tag/category archives, author pages.
- RSS feed at `/blog/feed.xml`, breadcrumbs, estimated read time, related posts.
- Editor: Payload rich text (Lexical) with custom blocks (spec table, FAQ, stat, callout, quote, image, PDF link).
- **~10 seed articles** targeting buyer queries (see Section 6, AEO/GEO content).

---

## 6. SEO / AEO / GEO Strategy (2026 research-informed)

### 6.1 Technical SEO
- Next.js SSR; dynamic `sitemap.xml`; `robots.txt` **explicitly allowing** `ChatGPT-User`, `OAI-SearchBot`, `Google-Extended`, `PerplexityBot`.
- Canonical URLs; semantic HTML + clean H1→H2→H3 hierarchy (68.7% of AI-cited pages use strict hierarchy).
- Core Web Vitals passes; mobile-first; image alt text + dimensions.
- Per-page metadata via Next.js Metadata API (title/desc/OG/Twitter), dynamic for products and blog.

### 6.2 AEO (Answer Engine Optimization)
- **Answer-first structure:** every question-headed H2 opens with a 40–60 word direct answer (44% of LLM citations come from the first 30% of a page).
- FAQ blocks (highest citation probability ~81%); spec tables / stats with sources (2.5–3.4× citation rate vs narrative).
- Definition-first glossary terms; question-based H2/H3 headings.

### 6.3 GEO (Generative Engine Optimization)
- Entity consistency: identical company name/description everywhere (site, listings, trade media).
- Original proprietary data (factory output, test results) with named-source attribution.
- Third-party presence plan: industry listings, trade publications, compare articles, case studies.
- Monthly monitoring of AI answers (ChatGPT, Perplexity, Gemini, AI Overviews).

### 6.4 Structured Data (JSON-LD)
- `Organization` anchor with stable `@id` + `sameAs` (home page).
- `Article` + `Person` + `Organization` `@graph` on blog posts (~1.8× citation lift).
- `FAQPage` on genuine Q&A only — Google deprecated its visible rich result May 2026, but the Q&A format still aids engines; never stuff.
- `Product`, `BreadcrumbList`, `SiteNavigationElement`, `DefinedTermSet` (glossary).
- Always include `datePublished` + `dateModified` (freshness signal).

### 6.5 E-E-A-T
- Named engineer-authors with credentials; visible ISO / government compliance badges; test reports; last-updated dates.

### 6.6 Seed Content Topics
NP2 vs NP3 vs NP4 hume pipes · hume pipe weight chart · IS 458:2003 explained · how to specify drainage pipes · socket-and-spigot vs flush joints · bulk pipe transport/logistics · glossary terms.

---

## 7. API Surface

- **Public (Payload REST):**
  - `GET /api/products?class=&diameter=&joint=` — products filtered by class/diameter/joint.
  - `GET /api/products/[id]` — single product spec.
  - `GET /api/blog/posts`, `GET /api/blog/posts/[slug]` — blog content.
  - `POST /api/rfq` — submit RFQ: validate payload, trigger sales alert, dispatch automated confirmation email.
- **Next.js revalidation:** `POST /api/revalidate` (protected, internal network).
- **Admin:** Payload Admin Panel — product/spec CMS, blog CMS, media, RFQ status workflow, users.
- **Auth:** Payload local auth for `/admin`; Tailscale protects the admin network; API keys for revalidate.

---

## 8. Infrastructure & Deployment

- **Docker Compose:** `next-app` (frontend), `payload-cms` (Express + SQLite), `nginx`/`caddy` (reverse proxy + TLS), SQLite + media volumes.
- **Tailscale:** admin dashboard and database not exposed publicly; reachable via tailnet only.
- **Email:** transactional RFQ confirmation via SMTP (Nodemailer); sales team alert via email + optional Slack webhook.
- **Open items to confirm during build:** one vs three containers; Nginx vs Caddy; Slack webhook for sales alerts.

---

## 9. Implementation Phases

1. **Scaffold** — monorepo (Next.js + Payload), Tailwind config from design tokens, `--phi` scale, shared TypeScript types.
2. **Core pages** — Home, Products, QA, RFQ ported from stitch HTML (SSR).
3. **Motion system** — Lenis + parallax + reveals + marquee + counters + reduced-motion.
4. **Payload CMS** — collections, admin dashboard, seed spec data.
5. **Blog** — full system + ~10 seed articles.
6. **SEO/AEO/GEO layer** — metadata, sitemap, robots, schema, FAQ blocks, glossary.
7. **RFQ engine** — validation, line items, logistics, SMTP confirmation + sales alert, admin pipeline.
8. **Deploy** — Docker Compose (next + payload + nginx), Tailscale for admin, SQLite volume; Lighthouse + Rich Results validation pass.
