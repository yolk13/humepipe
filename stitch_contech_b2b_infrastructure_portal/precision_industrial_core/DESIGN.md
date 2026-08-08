---
name: Precision Industrial Core
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#434654'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747685'
  outline-variant: '#c4c5d6'
  surface-tint: '#2854cc'
  primary: '#214fc7'
  on-primary: '#ffffff'
  primary-container: '#4169e1'
  on-primary-container: '#f8f7ff'
  inverse-primary: '#b6c4ff'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#4f5a6e'
  on-tertiary: '#ffffff'
  tertiary-container: '#677287'
  on-tertiary-container: '#f6f7ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#003baf'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 110px
    fontWeight: '700'
    lineHeight: 120px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Inter
    fontSize: 68px
    fontWeight: '700'
    lineHeight: 76px
    letterSpacing: -0.01em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 42px
    fontWeight: '700'
    lineHeight: 48px
  headline-lg:
    fontFamily: Inter
    fontSize: 42px
    fontWeight: '600'
    lineHeight: 52px
  headline-md:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  label-md:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.05em
spacing:
  xs: 10px
  sm: 16px
  md: 26px
  lg: 42px
  xl: 68px
  xxl: 110px
  container_max: 1280px
---

## Brand & Style

The design system is engineered for **Contech Concrete and Allied Industries**, prioritizing a visual language that mirrors industrial reliability, structural integrity, and high-precision engineering. The aesthetic is rooted in **Modern Industrial Minimalism**, characterized by architectural clarity and a "form follows function" philosophy.

The UI should evoke a sense of massive scale and unyielding strength. It utilizes a high-contrast environment to ensure absolute legibility for B2B stakeholders, procurement officers, and civil engineers. Visual weight is distributed to emphasize raw materials and technical specifications, ensuring the digital interface feels as grounded and permanent as the hume pipes the firm manufactures.

## Colors

The palette is strictly functional, drawing inspiration from technical blueprints and safety signaling.

- **Surface Strategy:** The primary background is a sterile, high-key White (#FFFFFF), providing a clean slate for technical data.
- **Brand Authority:** Royal Blue (#4169E1) is used for primary brand touchpoints, headers, and structural accents, conveying stability and professional heritage.
- **Safety Signal:** Amber/Safety Orange (#F59E0B) is reserved exclusively for high-priority actions and critical alerts, ensuring these elements "pop" against the cool blue and slate tones.
- **Typography & Borders:** Deep Slate (#1E293B) provides the heavy visual weight required for technical documentation, while Slate Gray (#475569) manages lower-hierarchy metadata.

## Typography

This design system employs a **Golden Ratio scale (1.618)** for all typographic relationships. This mathematical approach ensures harmony and architectural balance across all documentation levels.

- **Typeface:** Inter is utilized for its systematic, utilitarian clarity and exceptional legibility at small sizes in technical tables.
- **Hierarchy:** H1 and Display sizes are bold and imposing. Body text adheres to a comfortable 16px base with an expansive 26px line height to facilitate the reading of complex manufacturing specs.
- **Labels:** Small labels use a heavy weight and increased letter spacing to mimic engraved industrial plates or technical stamps.

## Layout & Spacing

The layout is governed by the same Golden Ratio logic used in the typography, creating a unified mathematical system.

- **Grid Model:** A 12-column grid is used for standard content, but major structural sections (Hero areas, Product Detail vs. Form) should utilize a **62/38 split**, mirroring the 1.618 ratio.
- **Spacing Rhythm:** All margins and paddings must be pulled from the defined scale (10, 16, 26, 42, 68, 110). Avoid intermediate values to maintain the rigid industrial rhythm.
- **Breakpoints:** 
  - **Desktop:** 1280px container with 42px outer margins.
  - **Tablet:** 768px with 26px margins; columns collapse to a single stack.
  - **Mobile:** 375px with 16px margins; typography scales down to mobile-specific tokens.

## Elevation & Depth

This design system avoids decorative shadows in favor of **Structural Layering** and **Low-contrast Outlines**.

- **Flat Depth:** Depth is communicated through 1px solid borders using the Deep Slate (#1E293B) or Border Color (#E2E8F0) rather than blurs.
- **High-Contrast Outlines:** Instead of shadows, use heavy 2px borders for active elements or "raised" sections to maintain a mechanical, blueprint-inspired feel.
- **Tonal Stacking:** For cards or containers, use subtle shifts in background color (e.g., White to a very light Slate) to indicate hierarchy.

## Shapes

The shape language is **Strictly Geometric and Sharp**. 

- **Corner Radius:** All elements default to **0px (Sharp)**. This reinforces the "concrete and steel" nature of the industry. 
- **Industrial Accents:** Where absolutely necessary for touch targets on mobile, a maximum radius of 2px may be applied to differentiate interactive surfaces from static structural containers.
- **Line Work:** Use vertical and horizontal lines to divide data, avoiding diagonal or organic shapes.

## Components

### Buttons
Buttons must feel heavy and mechanical.
- **Primary:** Royal Blue background, white text, 0px radius, 16px/26px padding. 
- **Action/CTA:** Amber background, Deep Slate text for maximum contrast.
- **State:** Hover states should not use shadows; instead, use a 2px inset border or a color shift of +/- 10% brightness.

### Technical Tables
Tables are the heart of the Contech interface.
- **Header:** Deep Slate background with white text.
- **Borders:** 1px solid Slate Gray for all internal cells.
- **Row Height:** 42px or 68px depending on data density.

### Input Fields
- **Border:** 1px solid Deep Slate.
- **Active State:** 2px solid Royal Blue.
- **Label:** Small, uppercase label-md positioned directly above the field.

### Cards
- **Border:** 1px solid Border Color (#E2E8F0).
- **Background:** White.
- **Content:** Header and Body separated by a horizontal rule. No shadows.

### Industrial Progress Indicators
Use the Safety Orange (#F59E0B) for status bars or loading states to indicate "Work in Progress" or "Factory Processing."