# Product Requirements Document (PRD)
**Project:** B2B Website for "Contech Concrete and Allied Industries Pvt. Ltd."
**Primary Product:** Hume Pipes
**Target Audience:** Civil Contractors, Procurement Managers, Site Engineers, Bulk B2B Buyers

---

## 1. Project Overview
The objective is to build a full-stack B2B web platform optimized for lead generation and technical specification distribution. Unlike a standard e-commerce store, this platform facilitates complex bulk orders and caters to civil engineering standards. The core conversion metric is the submission of a highly qualified Request for Quote (RFQ) that includes transport logistics.

## 2. Technology Stack
*   **Frontend:** Next.js (React) for Server-Side Rendering (SEO optimization).
*   **Styling:** Tailwind CSS with minimal Framer Motion for professional transitions.
*   **Backend:** Node.js (Express or NestJS framework).
*   **Database:** SQLite for data (clients, quotes, specifications).
*   **Infrastructure:** Linux VPS (e.g., Contabo), containerized with Docker.
*   **Security:** Tailscale VPN for zero-trust mesh access to the admin dashboard and database.

---

## 3. Core Pages & Sitemap
1.  **Home:**
    *   Focus: Manufacturing capacity, factory location, trust signals.
    *   Elements: ISO certifications, government compliance badges, notable infrastructure projects supplied.
2.  **Products (Hume Pipes):**
    *   Organization: Categorized by load classes (NP2, NP3, NP4).
    *   Data: Dense specification tables (internal diameter, wall thickness, weight, joint types like Socket & Spigot vs. Flush).
    *   Assets: Instantly downloadable PDF Technical Data Sheets (TDS).
3.  **Quality Assurance & Testing:**
    *   Details on internal testing facilities (three-edge bearing tests, hydrostatic pressure tests).
4.  **Request for Quote (RFQ) Portal:**
    *   The primary conversion point (details in Section 4).

---

## 4. Functional Requirements

### 4.1. The RFQ Engine
The standard "Contact Us" form is insufficient. The RFQ flow must capture logistical and technical data required for accurate bulk pricing.
*   **Client Information Fields:** Company Name, PAN/VAT Number, Contact Person, Project Type (e.g., highway, residential).
*   **Dynamic Product Selector:** Users must be able to compile a multi-item list (e.g., "50x NP3 600mm", "100x NP2 300mm").
*   **Logistics Module:** Mandatory "Delivery Site Location" field to calculate heavy-freight transport costs.

### 4.2. Backend API Architecture
*   `GET /api/products`: Retrieve product specs, filterable by diameter, class, and joint type.
*   `POST /api/rfq`: Submit quotes, validate payload, trigger sales team alerts, and dispatch automated confirmation emails to the client.
*   **Admin API Routes:** Protected endpoints for managing the product catalog, updating TDS PDFs, and processing RFQs.

### 4.3. Admin Dashboard
*   Secure login via VPN network (Tailscale).
*   Interface to track RFQ statuses (Pending, Quoted, Closed).
*   Content Management System (CMS) for updating specification tables without hardcoding.

---

## 5. Non-Functional Requirements & UX Constraints
*   **Mobile-First Specifications:** Spec tables must utilize horizontal scrolling and remain highly readable on mobile devices to accommodate site engineers accessing the site from the field.
*   **Frictionless Downloads:** Technical PDFs must be available without requiring a login or email gate, preventing friction for engineers drafting tenders.
*   **Admin Usability:** The backend dashboard must be highly responsive and intuitive to prevent the sales team from reverting to offline Excel sheets.
