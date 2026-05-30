---
name: Adverto
colors:
  surface: '#141313'
  surface-dim: '#141313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2b2a2a'
  surface-container-highest: '#353434'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c9c6c5'
  primary: '#c9c6c5'
  on-primary: '#313030'
  primary-container: '#0a0a0a'
  on-primary-container: '#7b7979'
  inverse-primary: '#5f5e5e'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#cac6c3'
  on-tertiary: '#32302f'
  tertiary-container: '#0b0a09'
  on-tertiary-container: '#7c7977'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c9c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e6e1df'
  tertiary-fixed-dim: '#cac6c3'
  on-tertiary-fixed: '#1d1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#141313'
  on-background: '#e5e2e1'
  surface-variant: '#353434'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The design system is engineered for a high-performance technical audience. It embodies a "Precision Engineering" aesthetic—drawing inspiration from developer-centric power tools. The brand personality is authoritative, sophisticated, and hyper-efficient. 

The visual style utilizes a **Dark-Mode-First** approach with **Glassmorphism** and **Minimalist** influences. It relies on deep blacks to create infinite depth, punctuated by razor-sharp borders and "laser-light" accents. The emotional response is one of total control and premium quality, where every pixel feels intentional and every interaction feels instantaneous.

## Colors

The palette is rooted in a pure dark spectrum. The primary background is a deep charcoal (#0A0A0A) which allows content to float in high contrast. 

- **Backgrounds:** Use #0A0A0A for the base layer. Higher elevation surfaces use #111111 or #161616.
- **Typography:** Use #FFFFFF for primary headings and #888888 for secondary/meta-text to maintain hierarchy without clutter.
- **Accents:** Electric Blue and Violet are used exclusively for highlights, active states, and data visualizations. 
- **Gradients:** Use a linear gradient (135deg) from Electric Blue to Violet for high-impact CTA surfaces and glowing border effects.

## Typography

This design system uses **Geist** for its structural purity and technical clarity. It is a font designed for precision. For technical data and small labels, **JetBrains Mono** is introduced to reinforce the developer-centric, technical feel.

- **Headlines:** Use tight letter-spacing (-0.02em to -0.04em) on larger sizes to create a sleek, "locked-in" look.
- **Body Text:** Maintain generous line-height (1.6) for readability against the dark background.
- **Labels:** Always uppercase when using JetBrains Mono to signify metadata or status indicators.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop to ensure data density remains manageable, transitioning to a **Fluid Grid** for mobile devices.

- **Grid:** A 12-column grid with 24px gutters.
- **Rhythm:** All spacing must be a multiple of 4px. Use "md" (24px) for most component grouping and "lg" (48px) for section vertical spacing.
- **Safe Areas:** On mobile, margins reduce to 16px to maximize screen real estate.
- **Alignment:** Content should be strictly aligned to the grid to maintain the "engineered" aesthetic.

## Elevation & Depth

Depth is not created through heavy shadows, but through **Tonal Layering** and **Glassmorphism**.

1. **Level 0 (Base):** #0A0A0A.
2. **Level 1 (Cards):** #111111 with a 1px solid border of #222222.
3. **Level 2 (Floating/Modals):** #161616 with a 1px border of #333333 and a subtle 20% opacity backdrop blur (12px).
4. **Accents:** Use a "Glow" effect for active states—a soft, 15px outer blur using the accent blue color at 10% opacity.

Avoid drop shadows with offsets. Instead, use centered, diffused glows that make elements appear as if they are emitting light rather than blocking it.

## Shapes

The shape language is "Soft-Technical." We avoid aggressive rounding to keep the UI looking professional and sharp. 

- **Components:** Standard buttons and input fields use a 0.25rem (4px) radius.
- **Containers:** Large cards and modals use 0.5rem (8px). 
- **Interactive States:** Use a hard-edged focus ring (2px solid #0070F3) with a 2px offset to maintain high visibility.

## Components

### Buttons
- **Primary:** Solid #FFFFFF background with #0A0A0A text. Hover state adds a subtle electric blue glow.
- **Secondary:** Transparent background with a 1px #222222 border. 
- **Ghost:** Transparent background, white text. No border until hover.

### Input Fields
- **Default:** Background #111111, Border #222222. 
- **Focus:** Border changes to #FFFFFF. Use JetBrains Mono for placeholder text to emphasize the technical nature.

### Cards
- **Base Card:** #111111 background, 1px #222222 border.
- **Feature Card:** Includes a top-border gradient (Blue to Violet) at 2px height to highlight premium features.

### Chips & Badges
- Small, uppercase JetBrains Mono text. Background is #161616 with a subtle border matching the status color (e.g., green for 'Success').

### Glow Indicators
- Use a 4px circular dot with a 12px outer blur for "Live" or "Active" statuses, utilizing the Electric Blue accent.