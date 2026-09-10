# Contech Concrete — Marketing Site + Admin (Express draft)

Standalone Express + EJS implementation of the Contech Concrete B2B site: product spec tables,
blog, RFQ enquiry pipeline, and a full admin panel. SQLite-backed, no build step.

> This folder (`new plan/`) is an earlier Express-era draft. The committed architecture is the
> Payload CMS + Next.js workspaces at the repo root (`web/` + `cms/`). This draft is kept runnable
> for reference — see the root `AGENTS.md`.

## Requirements

- Node.js 20+ (tested on 22/25)
- `npm` (a single `npm install` here — this folder has its own `package-lock.json`)

## Quick start

```bash
npm install
cp .env.example .env   # then set SESSION_SECRET at minimum
npm run seed           # creates db/contech.db + admin user + 11 products + 2 blogs
npm run dev            # http://localhost:3000 (use PORT=3100 if 3000 is taken)
```

Seeded admin login (printed once at seed):

```
Email:    admin@contech.com.np
Password: Contech#2026
```

**Change this password after first login.**

## Scripts

| Command            | Description                                         |
| ------------------ | --------------------------------------------------- |
| `npm run dev`      | Run with file-watch reload (`node --watch`)         |
| `npm start`        | Run in production mode                              |
| `npm run seed`     | Idempotently seed products, blogs, admin user       |
| `npm test`         | Run the `node:test` + supertest suite (isolated temp DB) |

The server honors the `PORT` env var (3000 is environment-owned on dev machines — use 3001+).

## Environment variables

See `.env.example` for the full list. Key ones:

| Variable         | Purpose                                                              |
| ---------------- | -------------------------------------------------------------------- |
| `PORT`           | HTTP port (default 3000)                                             |
| `SESSION_SECRET` | **Required in production.** Session signing secret                   |
| `SMTP_HOST`      | SMTP server. If unset, emails are logged to console only            |
| `SMTP_USER/PASS` | SMTP credentials                                                     |
| `SMTP_FROM`      | Sender address (`Contech Concrete <info@contech.com.np>` by default) |
| `ADMIN_EMAIL`    | Receives new-enquiry admin alerts                                    |
| `SITE_URL`       | Public site URL (used in admin alert email links)                    |
| `DB_PATH`        | SQLite file override (used by tests)                                 |

## Email notifications

Without `SMTP_HOST`, every email (client confirmation, admin alert, contacted follow-up) is
logged to the console in a readable format — useful for local development and tests. Configure
`SMTP_HOST` to actually deliver.

## Admin panel

| Route                      | Purpose                                  |
| -------------------------- | ---------------------------------------- |
| `/admin/dashboard`         | Counts, recent enquiries, quick actions  |
| `/admin/blogs`             | Blog CRUD (+ featured image upload)      |
| `/admin/products`          | Product spec CRUD (+ image upload)       |
| `/admin/enquiries`         | Enquiry pipeline: search, status filter, pagination |
| `/admin/enquiries/:id`     | Enquiry detail + status change           |

Security: session auth (bcrypt), CSRF tokens on all admin POSTs, Helmet CSP, `sanitize-html` on
blog render, uploads restricted to image MIME types (5 MB), rate-limited enquiry API.

## Tests

```bash
npm test
```

The suite (`test/app.test.js`) boots the app against a throwaway SQLite DB in the OS temp dir
and covers: public routes, blog rendering + sanitization, enquiry API validation, auth + CSRF,
enquiry list pagination/search/detail, status updates, blog/product CRUD round trips, upload
rejection, and robots.txt AI-crawler allowances.

## Docker

```bash
docker compose up --build
```

Volumes persist `public/uploads` (product/blog images) and `db/contech.db`. Set secrets via a
`.env` file (docker compose reads it automatically) or the `environment` block.

## Project layout

```
server.js            Express app (routes, auth, CSRF, CSP, emails) — exports the app for tests
db/database.js       SQLite schema + idempotent migrations (DB_PATH override)
db/seed.js           Idempotent seed (products, blogs, admin user)
db/session-store.js  SQLite-backed express-session store
lib/upload.js        Multer config + upload cleanup
lib/mailer.js        SMTP transport + console fallback
config/site.js       Company/contact details
views/               Public + admin EJS views
public/              Tailwind (CDN), robots.txt, uploads/
test/app.test.js     node:test + supertest suite
```

## Notes / conventions

- Golden-ratio spacing, sharp corners, borders-not-shadows, royal blue `#4169E1` + amber CTA.
- `robots.txt` explicitly allows AI/answer-engine crawlers (ChatGPT-User, OAI-SearchBot,
  Google-Extended, PerplexityBot) for AEO/GEO.
- Blog content is sanitized at render; email clients get plain-text fallbacks.
