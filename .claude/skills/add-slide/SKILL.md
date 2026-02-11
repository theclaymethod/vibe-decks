# Add Slide Skill

Add a new slide to the deck — built from the design system, driven by the user's prompt.

## Auto-invoke triggers
- "add a slide"
- "create new slide"
- "insert slide"
- "new slide"

## Workflow

### Step 1: Gather Information
Ask the user for:
1. **Position**: Slide number (1-based) or "end" for last position
2. **Slide name**: kebab-case name (e.g., "our-mission")
3. **What they want**: The content, layout, and feel of the slide

### Step 2: Design the Slide

**Build from the design system, not from templates.** Templates exist as reference examples — they show _one way_ to compose the design system components. Your job is to compose a slide that best serves the user's prompt.

**Design system primitives** (import from `@/design-system`):

| Category | Components |
|----------|------------|
| **Layout** | `SlideContainer`, `TwoColumnLayout`, `GridSection`, `CenterContent`, `Container`, `HeaderBar`, `Divider` |
| **Typography** | `HeroTitle`, `SectionHeader`, `Eyebrow`, `BodyText`, `MonoText`, `TechCode`, `SectionMarker`, `Quote`, `ListItem`, `PipeList`, `Label`, `CategoryLabel`, `SlideNumber` |
| **Cards** | `FeatureCard`, `StatCard`, `QuoteCard`, `InfoCard`, `ProcessCard` |
| **Decorative** | `IndustrialIcon`, `IconRow`, `LogoMark`, `CategoryGrid`, `FeatureBlock`, `CrosshairMark`, `RuleGrid` |
| **Types** | `SlideMode` ("dark" \| "yellow" \| "white"), `IconSymbol` |

**CSS variables** (via `style={{}}`, NOT Tailwind color classes):
- Text: `var(--color-text-primary)`, `var(--color-text-secondary)`, `var(--color-text-muted)`
- Backgrounds: `var(--color-bg-primary)`, `var(--color-bg-secondary)`, `var(--color-yellow)`
- Borders: `var(--color-border)`, `var(--color-border-light)`
- Fonts: `var(--font-heading)`, `var(--font-body)`, `var(--font-mono)`

**Animations** (import from `motion/react`):
- Use `motion.div` with `variants` for staggered reveals
- Common pattern: `containerVariants` (stagger children) + `itemVariants` (fade + slide)

**Key rules:**
- Always wrap in `<SlideContainer mode={mode}>` — this sets up 1920x1080 padding and theme variables
- Use the design system components for text/layout, not raw HTML elements
- Use `style={{}}` with CSS variables for colors, NOT Tailwind color utilities (Tailwind colors won't respect the theme mode)
- You can use Tailwind for spacing, layout, sizing — just not for colors
- Study an existing template in `src/templates/` if you need to see how a similar layout is composed
- Prioritize matching what the user asked for over reusing a template's structure

**When to use a template vs. composing from scratch:**
- If the user's request maps cleanly to a template → use the template (it's well-tested)
- If the user wants something custom, a different layout, or a mix of elements → compose from the design system directly
- If the user explicitly names a template → use it

### Step 3: Create Slide File
Create `src/deck/slides/NN-{name}.tsx`:

```tsx
import { motion } from "motion/react";
import { SlideContainer, /* other design system imports */ } from "@/design-system";
// Only import from @/templates if you're actually using a full template

export function SlideNNCamelCase() {
  return (
    <SlideContainer mode="white">
      {/* Compose freely from design system primitives */}
    </SlideContainer>
  );
}
```

**Naming conventions:**
- Filename: `NN-kebab-case.tsx` (e.g., `05-our-mission.tsx`)
- Export: `SlideNNCamelCase` (e.g., `Slide05OurMission`)
- NN is zero-padded 2-digit number

### Step 4: Register in config.ts
Add to `src/deck/config.ts`:

1. Add a loader entry in `slideLoaders`:
```typescript
"NN-name": () =>
  import("./slides/NN-name").then((m) => ({ default: m.SlideNNCamelCase })),
```

2. Add config entry in `SLIDE_CONFIG_INTERNAL` at the correct position:
```typescript
{ id: "name", fileKey: "NN-name", title: "Full Title", shortTitle: "Short" },
```

### Step 5: Renumber if Inserting
If inserting in the middle (not at end):
1. Rename all subsequent slide files (increment their NN prefix)
2. Update all loader keys and import paths in config.ts
3. Update all component names in both slide files and config.ts
4. Update all config entries (fileKey values)

### Step 6: Verify
Run `pnpm build` to ensure no errors.
