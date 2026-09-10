# UI/UX & Design Theory Specification: Contech Concrete

Canonical system: **Precision Industrial Core** (see `stitch_contech_b2b_infrastructure_portal/precision_industrial_core/DESIGN.md`).
This draft implements the same tokens in the Express/EJS app.

## 1. Color Theory Application
The palette is engineered for industrial reliability, structural integrity, and precise engineering. Color psychology maps to strength, trust, and safety signalling.

*   **Brand Color (Trust & Authority)**: Royal Blue (`#4169E1`)
    *   Usage: Primary navigation, footer backgrounds, primary headings (H1), primary buttons, table headers (admin), key structural accents.
*   **Action Color (CTAs Only)**: Amber / Safety Orange (`#F59E0B`)
    *   Usage: CTA buttons ("Request Quotation", submit actions) and critical status highlights. Paired with Deep Slate text for contrast (≈4.8:1). Never used for body headings.
*   **Text & Structure Colors**:
    *   Deep Slate (`#1E293B`) for headings and heavy data (H2/H3, table data).
    *   Slate Gray (`#475569`) for body copy and metadata.
*   **Neutral Backgrounds**:
    *   Off-White/Concrete Grey (`#F9F9F9`) for alternating sections.
    *   Pure White (`#FFFFFF`) for content cards.
    *   Border Color (`#E2E8F0`) for 1px structural separators.

## 2. Golden Ratio (1:1.618) Integration

### Layout Structure
*   **Hero Section**: Split screen. 62% (1.618) dedicated to the primary visual, 38% (1) dedicated to the headline, subheadline, and primary CTA.
*   **Two-Column Layouts (Blog or About Us)**: Main content ~61.8%; context block ~38.2%.
*   **Whitespace**: Margins and padding pull from the φ scale (10px, 16px, 26px, 42px, 68px, 110px). Tailwind default spacing is preserved (so `py-16` = 4rem); φ-specific tokens are named `26/42/68/110`.

### Typography Scale (Base 16px, Inter)
Using a modular scale based on the Golden Ratio:
*   **Base Body Size**: 16px (1rem), line height 1.618 for readability.
*   **H4 / Labels**: 26px; uppercase kicker labels use 12px, +0.05em letter-spacing.
*   **H3 (Section Headers)**: 26px.
*   **H2 (Section Titles)**: 42px.
*   **H1 (Page Titles / Hero)**: 68px, reserved for major page titles.
*   Typeface: **Inter** (loaded via Google Fonts).

## 3. UI Component Directives
*   **Navigation**: Sticky header. Clear "Request Quote" button in amber with deep slate text. Mobile menu (hamburger) with full route list.
*   **Elevation**: Depth is communicated with 1px borders (`#E2E8F0`) and tonal stacking — **not shadows**.
*   **Corners**: Sharp (0px) for structural elements, in keeping with the concrete-and-steel language.
*   **Data Tables (Indian Standard Specs)**: Zebra striping for readability. Deep Slate header with white text. Sticky first column on mobile. Visible `<caption>` metadata for screen readers.
*   **Enquiry / Quotation Form**: Minimalist input fields with bottom borders (Material Design style). Multi-step form (Step 1: Contact Info -> Step 2: Pipe Specifications -> Step 3: Notes & Confirm) with client-side per-step validation. Includes internal diameter select and a **mandatory delivery-site field**.
*   **Image Treatment**: Local SVG/CANVAS-based product visuals preferred over external stock imagery; no aggressive compression on product detail.

## 4. Accessibility Baseline (WCAG AA)
*   Text on white vs Royal Blue: ≈5.5:1 (passes). Amber CTAs with Deep Slate text: ≈4.8:1.
*   No teal-on-white text; no white-on-orange text.
*   Visible `focus-visible` rings everywhere `outline-none` is used.
*   `aria-live` on form status; `aria-current` on wizard steps; `aria-expanded` on mobile nav toggle.