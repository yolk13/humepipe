# Contech Hume Pipes — B2B Industrial Portal

B2B website for **Contech Concrete and Allied Industries Pvt. Ltd.** — a hume-pipe manufacturer targeting civil contractors, procurement managers, and site engineers. Core conversion metric is **RFQ submission** (dynamic line items + mandatory delivery-site logistics field).

- **Stack:** Next.js 16 (App Router, Turbopack, SSR/ISR) + Payload CMS 3 (Express + SQLite) + Tailwind CSS v4 + Framer Motion + Lenis
- **Monorepo:** npm workspaces, single root lockfile

## Architecture

```
┌─────────────┐   REST / ISR   ┌──────────────────┐   SQLite
│  Next.js    │────────────────▶ Payload CMS      │──────────▶ contech.db
│  (web)      │   HTTP-only    │  REST + /admin   │   media/
└─────────────┘                └──────────────────┘
   :3002                            :3001
```

The Payload Admin Panel doubles as the PRD admin dashboard (RFQ pipeline + spec-table CMS). Not an e-commerce store.

## Workspaces

| Package | Path | Role |
|---|---|---|
| `web` | `web/` | Next.js 16 marketing site (port **3002**) |
| `cms` | `cms/` | Payload CMS 3 admin + REST API (port **3001**) |
| `@contech/shared` | `packages/shared` | Shared TS types (product specs, RFQ, blog) |

## Getting Started

Requires Node >= 20.9.

```bash
npm install
npm run dev
```

- Web: http://localhost:3002
- CMS admin: http://localhost:3001/admin

> Port 3000 is occupied by an environment-owned process — never assume 3000.

## Scripts (run from root)

| Command | Purpose |
|---|---|
| `npm run dev` | Parallel dev servers (web + cms) |
| `npm run build` | Build web, then cms |
| `npm run lint` | ESLint (web) |
| `npm run typecheck` | Typecheck shared package |

After editing Payload collections, regenerate types:

```bash
npm run generate:types --workspace cms
npm run generate:importmap --workspace cms
```

## Seed Data

The SQLite DB is not committed. To recreate it (e.g. after adding a collection on Windows, which breaks dev-schema push):

```bash
# stop CMS servers, delete cms/contech.db
cd cms
npm run generate:types
npx tsx scripts/seed-products.ts
```

## Docs

- `requirements.md` — PRD (source of truth for product/site requirements)
- `plan.md` — system design & implementation phases
- `stitch_contech_b2b_infrastructure_portal/` — design prototypes (code.html) + design system (DESIGN.md)
