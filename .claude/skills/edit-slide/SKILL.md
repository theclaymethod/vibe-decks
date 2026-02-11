# Edit Slide Skill

Modify an existing slide's content, layout, or design.

## Auto-invoke triggers
- "edit slide"
- "change slide"
- "modify slide"
- "update slide content"
- "update slide"

## Workflow

### Step 1: Identify Slide
Ask which slide to edit by:
- Number (e.g., "slide 5")
- Name (e.g., "stats")
- ID from config

If ambiguous, list slides and ask user to choose.

### Step 2: Read Current Slide
Read the slide file at `src/deck/slides/NN-name.tsx` and understand:
- Current structure and components used
- Whether it uses a template wrapper or composes directly from the design system

### Step 3: Make Changes

Follow the user's prompt. You have full freedom to restructure the slide.

**If the slide currently wraps a template** (e.g., `<StatCardsTemplate .../>`) and the user's request can't be served by changing its props — replace the template with direct design system composition. Templates are convenience wrappers, not constraints.

**Design system primitives** (import from `@/design-system`):

| Category | Components |
|----------|------------|
| **Layout** | `SlideContainer`, `TwoColumnLayout`, `GridSection`, `CenterContent`, `Container`, `HeaderBar`, `Divider` |
| **Typography** | `HeroTitle`, `SectionHeader`, `Eyebrow`, `BodyText`, `MonoText`, `TechCode`, `SectionMarker`, `Quote`, `ListItem`, `PipeList`, `Label`, `CategoryLabel`, `SlideNumber` |
| **Cards** | `FeatureCard`, `StatCard`, `QuoteCard`, `InfoCard`, `ProcessCard` |
| **Decorative** | `IndustrialIcon`, `IconRow`, `LogoMark`, `CategoryGrid`, `FeatureBlock`, `CrosshairMark`, `RuleGrid` |

**CSS variables** (via `style={{}}`, NOT Tailwind color classes):
- Text: `var(--color-text-primary)`, `var(--color-text-secondary)`, `var(--color-text-muted)`
- Backgrounds: `var(--color-bg-primary)`, `var(--color-bg-secondary)`, `var(--color-yellow)`
- Borders: `var(--color-border)`, `var(--color-border-light)`
- Fonts: `var(--font-heading)`, `var(--font-body)`, `var(--font-mono)`

**Key rules:**
- Always keep `<SlideContainer mode={mode}>` as the root wrapper
- Use `style={{}}` with CSS variables for colors, NOT Tailwind color utilities
- You can use Tailwind for spacing, layout, sizing — just not for colors
- If the user asks for a simple prop change (text, number, etc.), just change the prop — don't restructure
- If the user asks for layout/structural changes that a template can't accommodate, break out of the template and compose from the design system directly
- Study the existing template in `src/templates/` if you need to understand the current component's API

### Step 4: Verify
Run `pnpm build` if structural changes were made.

## Examples

### Simple content change
User: "Change the main stat on slide 5 to 150%"
→ Just update the prop value. Don't touch the structure.

### Structural change
User: "Add a chart next to the stats on slide 5"
→ The StatCardsTemplate can't do this. Replace it with direct composition:
```tsx
import { SlideContainer, SectionHeader, StatCard, Eyebrow } from "@/design-system";

export function Slide05Stats() {
  return (
    <SlideContainer mode="white">
      <TwoColumnLayout
        left={/* stats */}
        right={/* chart */}
        ratio="1:1"
      />
    </SlideContainer>
  );
}
```

### Config change
User: "Change slide 8 title to 'Customer Stories'"
→ Update `title` and optionally `shortTitle` in the config entry in `src/deck/config.ts`.
