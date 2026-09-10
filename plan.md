# System Specification & Architecture: Contech Concrete CMS

## 1. Architectural Overview
*   **Backend**: Node.js with Express.js.
*   **Database**: SQLite (via `better-sqlite3` or `Sequelize` ORM).
*   **Frontend Showcase**: Server-Side Rendered (EJS/Pug) or decoupled static frontend consuming REST APIs. SSR is recommended for superior out-of-the-box SEO/AEO optimization for B2B product catalogs.
*   **Admin Panel**: Protected route cluster within Express, utilizing session-based authentication for content management.

## 2. Database Schema (SQLite)

### Table: `users` (Admin access)
*   `id` (PK, UUID)
*   `email` (VARCHAR, UNIQUE)
*   `password_hash` (VARCHAR)
*   `role` (VARCHAR) - default: 'admin'

### Table: `products`
*   `id` (PK, UUID)
*   `internal_diameter` (INTEGER)
*   `min_thickness` (INTEGER)
*   `effective_length` (REAL)
*   `load_crack` (REAL)
*   `ultimate_load` (REAL)
*   `type` (VARCHAR) - e.g., 'NP3', 'NP4'

### Table: `blogs`
*   `id` (PK, UUID)
*   `title` (VARCHAR)
*   `slug` (VARCHAR, UNIQUE) - Critical for SEO
*   `content` (TEXT) - Stored as HTML or Markdown from WYSIWYG editor
*   `meta_title` (VARCHAR) - For GEO/SEO
*   `meta_description` (VARCHAR)
*   `featured_image` (VARCHAR) - file path
*   `published_at` (DATETIME)

### Table: `enquiries` (Quotations & Contact)
*   `id` (PK, UUID)
*   `client_name` (VARCHAR)
*   `company_name` (VARCHAR)
*   `email` (VARCHAR)
*   `phone` (VARCHAR)
*   `pipe_type` (VARCHAR)
*   `quantity` (INTEGER)
*   `message` (TEXT)
*   `status` (VARCHAR) - 'pending', 'reviewed', 'contacted'
*   `created_at` (DATETIME)

## 3. Core API / Routing Controllers

### Public Routes (Frontend)
*   `GET /` - Home page, rendering company intro, highlights, CTA.
*   `GET /about` - Vision, Mission, Board of Directors.
*   `GET /products` - Full technical specifications table, dynamic rendering from `products` table.
*   `GET /technology` - Vibro casting and batching plant details.
*   `GET /blogs` - List of published articles.
*   `GET /blogs/:slug` - Individual article rendering with metadata injection.
*   `POST /api/enquire` - Form submission endpoint. Includes basic rate-limiting and validation (e.g., Joi/Zod) to prevent spam.

### Protected Routes (CMS Admin)
*   `POST /admin/login` - Authenticate and establish session.
*   `GET /admin/dashboard` - Overview of recent enquiries and blog stats.
*   `CRUD /admin/blogs` - Manage articles.
*   `CRUD /admin/products` - Update specification tables if standards change.
*   `GET /admin/enquiries` - View and update status of client requests.

## 4. Technical Edge Cases & Flaws to Address
1.  **SQLite Concurrency**: SQLite writes lock the entire database. For a low-traffic B2B site, this is generally fine, but if the site is subjected to a spam bot attack on the quotation form, the database could lock up. Implement strict rate-limiting on the `/api/enquire` route. Enable WAL (Write-Ahead Logging) mode in SQLite to allow simultaneous readers and writers.
2.  **File Storage**: Storing images (blogs, product catalogs) locally on the server file system makes containerized scaling difficult and risks data loss during server rebuilds. Define a clear strategy for persistent volumes if deploying via Docker, or configure an S3-compatible object storage service integration for media uploads.
3.  **SEO/AEO Strategy**: Ensure all dynamic routes (`/blogs/:slug`) populate server-side metadata tags (Open Graph, schema.org JSON-LD). Search engines and AI overviews rely heavily on structured data, especially for manufacturing specifications and product tables.
