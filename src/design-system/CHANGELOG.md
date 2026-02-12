# Design System Changelog

## 2026-02-11 — Regenerate design system: Ember Luxe + Editorial + Sharp & Technical

Complete design system regeneration with new visual identity.

**Color Palette — "Ember Luxe"**
- Primary scale: #1a0a0a (deep black), #4a1215, #8b2520, #c4452a (ember), #e8825a
- Accent: #f5c16c (golden)
- Warm off-white: #faf5f0, secondary bg: #f0e8e0
- Text hierarchy uses warm brown tones (#3d1f1a, #7a5c55) instead of neutral grays
- "Yellow" mode now renders as ember red (#c4452a) — mode name kept for backward compatibility

**Typography — "Editorial"**
- Heading: Playfair Display (elegant serif, mixed case — no longer all-caps)
- Body: Source Serif Pro (readable serif, magazine feel)
- Mono: IBM Plex Mono (technical precision)
- Eyebrow, Label, TechCode, CategoryLabel now use mono font for technical contrast

**Look & Feel — "Sharp & Technical"**
- All border-radius values set to 0 (--radius-sm, --radius-md, --radius-lg all 0)
- Snappier animations: tighter durations (0.25–0.35s), sharp easing [0.4, 0, 0.2, 1]
- PulseRing and HoverCard use square geometry instead of rounded
- HarveyBall and ProgressRing backgrounds use square frames
- Sparkline endpoints use square markers instead of circles
- Smaller hover lifts (-3/-6/-10 vs -4/-8/-12) for more controlled feel

**Component Changes**
- `StatCard` — added golden accent bar below value
- `ProcessCard` — step number uses accent color
- `QuoteCard` — italic serif styling, smaller quote text
- `ShineBorder` — default glow color changed to `var(--color-accent)`
- `PulseRing` — default color changed to `var(--color-accent)`, square shape
- `PipeList` — separator changed from "|" to "/"
- `Label` — "primary" variant uses accent gold instead of yellow
- `Tabs` — active indicator uses accent color
- `QuoteCarousel` — active dot uses accent color
- `HoverCaption` — overlay uses warm dark (#1a0a0a at 90%) instead of pure black

**Showcase**
- All 14 sections updated with Ember Luxe palette, editorial copy, and serif typography references
- Color swatches reflect new palette values
- TypeSpecimen labels reference Playfair Display / Source Serif Pro / IBM Plex Mono

## 2026-02-11 — Increase ShineBorder default radius

- **Changed** `ShineBorder` default `radius` from 300 to 500 for a larger, more visible glow effect

## 2026-02-11 — Add data visualization and advanced interactions

- **Added** `data-viz.tsx` — six data visualization primitives: ProgressRing, AnimatedCounter, TrendIndicator, Sparkline, HarveyBall, MagnitudeBar
- **Added** to `interactions.tsx` — ShineBorder (mouse-tracking glow border), PulseRing (expanding ring indicator), QuoteCarousel (auto-rotating quotes), Tabs (panel switcher), Tooltip (hover context), SkeletonBlock (loading placeholder)
- **Added** `pathDrawVariants` to `animations.ts` for SVG path drawing animations
- **Added** showcase sections 12-14: Data Visualization, Tabs & Carousels, Effects & Utilities
- All data-viz components use CSS variables for color mode compatibility
- Extracted patterns from whoop-1 deck and re-implemented with pure SVG (no external chart dependencies)

## 2026-02-11 — Add interaction layer

- **Added** `animations.ts` — shared motion variant presets (fadeIn, slideUp, slideLeft, scaleIn, stagger container factory, hover presets) extracted from template patterns
- **Added** `interactions.tsx` — six composable wrapper components: AccordionItem, ExpandableCard, HoverCard, HoverCaption, AnimatedEntry, StaggerContainer
- **Added** CSS variables to `theme.css`: duration tokens, easing curves, shadow scale (sm/md/lg/xl), border radius scale (sm/md/lg)
- **Added** showcase sections 9-11: Interactive Primitives, Expandable Patterns, Hover & Caption
- Interactive elements follow "relaxed rules" — shadows and soft radii permitted to signal interactivity
- Exported all new components and animation presets from `index.ts`

## 2026-02-11 — Replace SVG decorative elements with React/CSS components

- **Removed** `WireframeBox` and `IsometricGrid` (complex SVG components)
- **Replaced** `CrosshairMark` — print registration mark with crosshair lines, corner ticks, center ring and dot. Proportions scale with sm/md/lg sizes.
- **Replaced** `DotGrid` → `RuleGrid` — engineering graph paper with major/minor ruled lines. Configurable `divisions` and `majorEvery` interval.
- Updated `showcase.tsx`, `index.ts`, skill docs, and agent docs
- No actual slides were affected (components only used in showcase)
