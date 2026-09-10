# Execution Log

## Initial Setup
- Initialized a new Node.js project.
- Installed necessary dependencies: express, better-sqlite3, ejs, uuid, body-parser.

## Server & Database
- Created `db/database.js` with SQLite schema for users, products, blogs, and enquiries.
- Created `server.js` with Express setup and routes for frontend navigation.

## Views & Design
- Created EJS layout partials (`header.ejs`, `footer.ejs`) using Tailwind CSS.
- Applied design system (colors, typography, golden ratio spacing) from `design.md`.
- Implemented `index.ejs`, `about.ejs`, `products.ejs`, `technology.ejs`, and `blogs.ejs` based on content from `content.md`.

## Phase 1 - Fix Blockers (make it runnable)
- Added `views/blog-single.ejs` (article render + back link).
- Added `views/404.ejs` custom error page.
- Added `db/seed.js` - seeds 11 IS 458:2003 product rows, 2 blog posts, and an admin user (admin@contech.com.np / Contech#2026, printed at first seed).
- Added SQLite-backed session store (`db/session-store.js`), avoiding extra deps.
- Fixed `package.json`: `main` -> `server.js`, added `start`, `dev`, `seed` scripts.
- Created `public/` assets: `logo.svg`, `robots.txt` (allows AI bots).
- Port fixed: server now respects `PORT` env (3000 is environment-owned).

## Phase 2 - Enquiry Form & API Hardening
- Added multi-step quotation form (`views/partials/enquiry-form.ejs`, 3 steps) on home `#quote` section and new `/contact` page.
- Hardened `POST /api/enquire`: Zod validation (400 with field-level issues), `express-rate-limit` (10/15min per IP).
- Added `views/contact.ejs`.

## Phase 3 - Admin Panel
- Session auth: `POST /admin/login`, `POST /admin/logout`, `requireAuth` middleware, bcryptjs password hashing.
- `GET /admin/dashboard` - enquiry counts by status + recent enquiries + quick actions.
- Blog CRUD: list / create / edit / delete at `/admin/blogs` (+ auto-slugify).
- Product CRUD: list / add / inline edit / delete at `/admin/products`.
- Enquiries: `/admin/enquiries` with status filter tabs + inline status update (pending -> reviewed -> contacted).
- Flash messages for admin feedback; dedicated admin layout partials.

## Phase 4 - SEO/AEO
- Per-page meta (title/description/OG) via `partials/header.ejs`; blog-single injects blog metadata.
- JSON-LD `@graph` on home (Organization + Product) and products pages.
- `public/robots.txt` allows ChatGPT-User/OAI-SearchBot class bots (no restrictive disallow).

## Verification
- All public routes, blog single, contact, admin login/dashboard/blogs/products/enquiries return 200.
- Enquiry API accepts valid submissions (200) and rejects invalid ones (400).
- Unauthenticated admin routes redirect to `/admin/login`.
- Test data cleaned after smoke tests.

## Phase 2A - Security & Hygiene
- Removed `connect-sqlite3` (unused); evicted the `sqlite3` -> `node-gyp` -> `tar` chain. `npm audit` now reports 0 vulnerabilities.
- Installed `helmet` (security headers + CSP) and `sanitize-html`.
- CSP: `script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com` (inline retained for Tailwind CDN runtime, documented tradeoff), `img-src` allows Unsplash, `formAction 'self'`, `frameAncestors 'none'`.
- Moved inline JS to external files: `public/tailwind-config.js`, `public/admin-config.js`, `public/enquiry-form.js`.
- CSRF protection: session-backed token (`ensureCsrf`/`verifyCsrf`) on all `/admin` routes; `_csrf` hidden field added to login, logout, blog create/edit/delete, product add/edit/delete, enquiry status forms. 403 on missing/mismatched token.
- Replaced product-delete `onclick` hack with a proper POST-to-delete form (also CSP-safe).
- Body parser limits (200kb), `dotenv` loaded, `SESSION_SECRET` from env with insecure-default warning.
- Blog content sanitized at render via `res.locals.sanitizeHtml` (allowlist); verified `<script>`, inline handlers, and `javascript:` hrefs stripped.

## Phase 2B - Content Completeness
- New `/quality` page: QA pipeline (Raw Material Examination -> In-Process QC -> Final Testing) + Three Edge Bearing Load Test + Hydro Test, with BreadcrumbList JSON-LD. Added to nav + footer.
- `/technology` vibro casting matrix completed to all 13 points from `content.md`.
- FAQ blocks (answer-first, `<details>`, no FAQ schema) on `/products` (5 spec-focused Q&A) and home (4 Q&A) via reusable `partials/faq.ejs`.
- New `config/site.js` centralizes company name, address, phone, email placeholders (info@contech.com.np / +977 1-XXXXXXX); footer + contact page now render from it.
- Added `.env.example` (PORT, SESSION_SECRET).

## Phase 3C - Media Handling
- Installed `multer`. New `lib/upload.js`: disk storage to `public/uploads/`, uuid filenames (no user-controlled names), jpeg/png/webp/gif only (SVG rejected), 5MB limit, `removeUpload()` cleanup helper that only ever deletes under `/uploads/`.
- Idempotent migration in `db/database.js`: `products.image TEXT` added via PRAGMA check + ALTER (existing DB upgraded on boot).
- Admin blog form: file upload (`featured_image_file`) with live preview + existing URL fallback; product forms: `image` upload with thumbnails in the admin list (product images are admin-only; public `/products` stays a spec table).
- Forms switched to `enctype="multipart/form-data"`; multer parses fields + `_csrf`.
- CSRF fix: `verifyCsrf` moved from a global `/admin` guard to per-route (after the body parser for that request), because multipart bodies are parsed by multer inside the route - the global guard saw an empty `req.body` on multipart forms. Login/logout/delete/status (urlencoded) run `verifyCsrf` after `bodyParser`.
- Graceful `uploadErrorHandler`: rejected files redirect back with a flash instead of a raw 500.
- CSP gained `blob:` in `imgSrc` (for client-side image preview). `public/uploads/` added to `.gitignore`.
- Storage strategy: local disk under `public/uploads`; for Docker deployments mount a persistent volume there; S3 integration left as a future option.

## Phase 3D - Email Notifications
- Installed `nodemailer`. New `lib/mailer.js`: SMTP config from env (`SMTP_HOST/PORT/SECURE/USER/PASS/FROM`, `ADMIN_EMAIL`). Without `SMTP_HOST` it logs the email to console only and never throws (matches the committed CMS project's behaviour).
- `POST /api/enquire`: fire-and-forget (non-blocking, errors logged) client confirmation + admin alert on submission.
- `/admin/enquiries/:id/status`: when marked `contacted`, auto-sends the client a follow-up email.
- `.env.example` documents the SMTP block.

## Phase E - Admin UX: Enquiries Pipeline
- Enquiries list (`/admin/enquiries`) now supports: pagination (20/page, `page` param), free-text search (`q` across client_name/company_name/email/phone/message, combined with the status filter), "Showing X-Y of Z" counter, prev/next + numbered pages with filter state preserved, and a no-results empty state.
- Search box (GET form) above the status tabs; tabs now preserve `q`; `Clear` link resets search.
- New detail view `GET /admin/enquiries/:id` (`views/admin/enquiry-detail.ejs`): full enquiry card (client, company, mailto email, phone, pipe type/qty, full message, received time, status badge), status-change form (redirects back to the detail page), quick actions (manual mailto with prefilled subject, tel: link). Missing id -> flash + redirect to list.
- List rows: client name and message link to the detail view carrying a `returnTo` param that restores the originating list filter state; dashboard "Recent Enquiries" also link to detail.
- `redirect` hidden field validated to `/admin/enquiries*` on the status POST (prevents open-redirect via that param). `listQueryString` helper exposed via `res.locals` for view use.
- Verified with 25 seeded enquiries: page 1 (20 rows) + page 2 (5 rows), page numbers/prev/next correct, search filters correctly, status+search combo, detail renders full message, status update from detail redirects back to detail, bad `redirect` rejected. Test rows and temp scripts removed; server process killed; `npm audit` still 0.

## Phase F - Tests & Deploy Prep
- Testability refactor: `db/database.js` honors `DB_PATH` env override; `server.js` guards `app.listen` behind `require.main === module` and exports the app; enquiry rate limiter is bypassed when `NODE_ENV=test`.
- Added `supertest` (dev dep). New `test/app.test.js` (16 tests, `node:test` runner) boots the app against a throwaway SQLite DB in the OS temp dir (cleaned up after):
  - Public routes 200; 404 page; blog-single render + 404; sanitize-html strips `<script>`.
  - Enquiry API: valid submit inserts a row + fires emails (console fallback), invalid submit -> 400 with field issues.
  - Auth: unauthenticated /admin redirects to login; login flow via CSRF token; POST without CSRF -> 403.
  - Enquiries: pagination (Page 1/2 of 2), search, detail view, missing id redirect, status update -> contacted fires follow-up email, evil `redirect` param rejected.
  - Blog and product create/edit/delete round trips (incl. slug auto-generation); non-image upload rejected (Referer-based redirect).
  - `robots.txt` explicitly allows ChatGPT-User / OAI-SearchBot / PerplexityBot.
- `npm test` = `node --test test/`. All 16 pass.
- Deploy prep: `Dockerfile` (node:22-bookworm-slim, `npm ci --omit=dev`, uploads + db volumes), `.dockerignore`, `docker-compose.yml` (ports 3000, named volumes for `public/uploads` + `db`, env passthrough incl. SMTP), `README.md` (quick start, scripts, env vars, email behaviour, admin routes, project layout, conventions).
- `public/robots.txt` now carries explicit AI/answer-engine crawler allows (was implicit `Allow: /`).

## Phase G - HTML Email Templates
- New `lib/email-templates.js`: email-safe table layout (inline styles, web-safe fonts, brand header `#4169E1`, amber CTA), escaping of all user content, plain-text + HTML for each message.
- Three templates: client confirmation (enquiry summary table + contact footer), admin alert (summary + "Open in admin panel" button linking to `/admin/enquiries/:id` via `SITE_URL`), contacted follow-up.
- `server.js` email functions now delegate to the templates (`formatEnquiry` dead code removed); `.env.example` documents `SITE_URL` and `DB_PATH`.
- Unit test verifies templates produce matching text + HTML and that raw `<script>`/user HTML is escaped out of emails.