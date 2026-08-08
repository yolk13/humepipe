# AGENTS.md

## Repo state

npm-workspaces monorepo (single lockfile at root). Three workspaces:

- `web/` — **Next.js 16.3 marketing site** (App Router, Turbopack, Tailwind **v4**, Framer Motion, Lenis). SSR/ISR.
- `cms/` — **Payload CMS 3.87** (Express-based, SQLite) at `src/app/(payload)`. Its Admin Panel **is** the PRD admin dashboard. Runs on port **3001**.
- `packages/shared` — `@contech/shared` TS types (product specs, RFQ, blog). Exports raw TS; `web` transpiles it via `next.config` `transpilePackages`.

Source of truth for architecture: `plan.md` (phases) + `requirements.md` (PRD). Port page structure/copy from `stitch_contech_b2b_infrastructure_portal/` `code.html` files; treat `precision_industrial_core/DESIGN.md` tokens as canonical.

## Commands

Run everything from the root:

- `npm install` — single install, hoists to root `node_modules` (no nested `next` in `web/`/`cms/`).
- `npm run dev` — parallel dev servers: **web on 3002, cms on 3001** (explicit `-p` flags in workspace `package.json`; port 3000 is occupied by an environment-owned process — never assume 3000).
- `npm run build` — `web` then `cms`. **`next build` no longer runs lint** (Next 16 removed `next lint`; `lint` script is raw `eslint`).
- `npm run lint`, `npm run typecheck`.
- `npm run generate:types --workspace cms` and `generate:importmap` — re-run after editing Payload collections. `src/app/(payload)/admin/importMap.js` is **generated**; builds fail if it has no exports.

## Committed architecture (do not reverse without justification)

- **Payload Admin Panel = the admin dashboard** (RFQ pipeline + spec-table CMS). The backend is NOT a hand-rolled Express app.
- **Not an e-commerce store.** Core conversion metric is RFQ submission (dynamic line items + mandatory delivery-site logistics field), per `requirements.md` §4.1.
- Deploy (Docker/Tailscale) is deferred — local dev only this cycle.

## Next 16 gotchas (installed version differs from training data)

- `params` / `searchParams` / `cookies()` / `headers()` are **async-only** — `const { slug } = await props.params`. Use the `PageProps<'/route'>` type helpers.
- `revalidateTag(tag)` now requires a cacheLife profile arg, e.g. `revalidateTag('posts', 'max')`.
- Turbopack is default for dev and build; no `--turbopack` flag needed.
- `next/image`: use `images.remotePatterns` (not `domains`); `minimumCacheTTL` defaults to 4h.
- Full breaking-change list: `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`.

## Design conventions

- **Golden ratio:** spacing `10/16/26/42/68/110` (φ scale, Tailwind v4 `--spacing-*` tokens in `web/app/globals.css`), 62/38 grid splits, 1280px `container-max` utility, Fibonacci motion durations (150/250/400/650ms). Sharp 0px corners; **borders not shadows**.
- Colors: royal blue `#4169E1` primary (`royal`), amber `#F59E0B` **CTAs only** (`amber`), deep slate `#1e293b` text (`ink`/`slate-deep`). Honor `prefers-reduced-motion`.
- Mobile spec tables must be horizontally scrollable (`requirements.md` §5). TDS PDFs: frictionless download, no login/email gate.
- **AEO/GEO (2026):** answer-first sections (40–60 word direct answers under question-headed H2s), real FAQ blocks, JSON-LD `@graph` (Article+Person+Organization). robots.txt must allow `ChatGPT-User`, `OAI-SearchBot`, `Google-Extended`, `PerplexityBot`. Google deprecated FAQ rich-result display May 2026 — keep Q&A format, don't stuff FAQ schema.

## Gotchas

- Stitch `code.html` files use CDN Tailwind runtime + Material Symbols; port to Tailwind **v4** `@theme` tokens (not the v3 JS `tailwind.config`).
- `npm install` may print dependency audit warnings from Payload's transitive deps — known, review before `audit fix --force`.
- No commits yet; repo initialized on `main`.
- **Adding a new Payload collection breaks dev-schema push on the existing SQLite DB** (drizzle `__new_payload_locked_documents_rels` rebuild fails on Windows). Fix: stop CMS servers, delete `cms/contech.db`, then re-run `npm run generate:types --workspace cms` and `npx tsx scripts/seed-products.ts` (from `cms/`) to recreate the DB + seed the 21 product rows.
- **RFQ confirmation emails log to console only** until an SMTP transport is configured in `cms/src/payload.config.ts` (`email` block). The web `POST /api/rfq` route proxies to Payload REST (`CMS_URL`, default `http://localhost:3001`); web spec tables come from `GET /api/products` via `web/lib/product-catalog.ts` with a bundled seed fallback when the CMS is down.
