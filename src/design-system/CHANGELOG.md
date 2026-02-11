# Design System Changelog

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
