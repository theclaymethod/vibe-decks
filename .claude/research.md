# Research: Example Slides vs User Slides & Onboarding

## Overview

pls-fix is a slide deck template system where users create presentations via an AI-powered builder UI and Claude Code CLI skills. The system has a design system (63 components), 21 templates, and 18 pre-made slides that serve as examples. There is currently **no distinction between example slides and user slides**, and **no onboarding flow** for new users starting a deck from scratch.

## Architecture

### Key Files

| File | Purpose |
|------|---------|
| `src/deck/config.ts` | Slide registry: lazy loaders, config array, cache management |
| `src/deck/theme.css` | CSS custom properties for colors, fonts, spacing, 3 modes (white/dark/yellow) |
| `src/deck/slides/*.tsx` | 18 individual slide files (all example content) |
| `deck.config.ts` | Top-level config: title ("My Presentation"), auth, dimensions, fonts |
| `apps/builder/routes/index.tsx` | Root redirect to `/builder` |
| `apps/builder/routes/builder/index.tsx` | Grid overview of all slides (header bar + sortable grid) |
| `apps/builder/routes/builder/$fileKey.tsx` | Single slide editor (create or edit) |
| `apps/builder/routes/builder/designer.tsx` | Design system preview + chat editing |
| `apps/builder/routes/builder/create-design-system.tsx` | Design system creation wizard |
| `src/builder/components/design-system-wizard.tsx` | 7-step wizard UI (references -> palette -> typography -> personality -> plan -> execute -> complete) |
| `src/builder/components/builder-layout.tsx` | Routes between CreateView (canvas + prompt, when fileKey="new") and EditView (preview + chat) |
| `src/design-system/showcase.tsx` | Brand bible / design system showcase component (~1155 lines, 14 sections) |
| `src/templates/index.ts` | 21 template exports (FeatureGrid, StatCards, Timeline, etc.) |
| `scripts/dev.ts` | Starts deck + builder + API on dynamic ports, writes `.dev-ports` |
| `scripts/builder-server.ts` | Claude Code proxy API for all builder operations |
| `.claude/skills/add-slide/SKILL.md` | Skill for creating new slides (from design system primitives) |
| `.claude/skills/create-design-system/SKILL.md` | Skill for generating design system from intent |

### Key Abstractions

**Slide Registry** (`src/deck/config.ts`): Three-tier lazy loading with `slideLoaders` (dynamic imports), `SLIDE_CONFIG_INTERNAL` (metadata array), and component caches. The `SlideConfig` interface has `id`, `title`, `shortTitle`, `fileKey` — no "isExample" or category flag.

**Design System Wizard** (`design-system-wizard.tsx`): A standalone 7-step wizard at `/builder/create-design-system`. Steps: references (images + URLs), palette (presets + AI generation), typography (4 presets + custom fonts), personality (4 options), plan (AI-generated review), execute (generates files), complete (links to designer). Fully functional and mature.

**Builder Index** (`apps/builder/routes/builder/index.tsx`): Header bar with "Manage Deck", "Design System", "Apply Design System", "New Design System", "New Slide" buttons. Below: sortable grid of all slides or design-system-apply selection mode. Deck chat panel toggleable. No empty state or welcome screen.

**Builder Layout** (`builder-layout.tsx`): When `fileKey === "new"` renders `CreateView` (Konva canvas wireframe tool + prompt panel + generation panel). Otherwise renders `EditView` (live slide preview + chat sidebar with session persistence).

### Data Flow

**First-time user experience (current):**
1. `pnpm dev` starts 3 processes, prints deck + builder URLs
2. Open builder URL -> `apps/builder/routes/index.tsx` redirects to `/builder`
3. `/builder` renders `BuilderIndex` -> sees 18 pre-made slides in a grid
4. No guidance on what to do. User must figure out the workflow themselves.

**Slide editing flow:**
1. Click any slide in grid -> `/builder/{fileKey}` -> `EditView`
2. Left: live slide preview rendered via `SlidePreview` + `SlideScaler`
3. Right: chat sidebar with `EditSidebar` -> user types instructions
4. POST `/api/edit` -> builder-server spawns `claude -p "..." --dangerously-skip-permissions`
5. Claude edits slide file -> Vite HMR updates preview live

**Design system creation flow:**
1. Click "New Design System" -> `/builder/create-design-system`
2. Step through 7-step wizard (references, palette, typography, personality)
3. "Generate Plan" -> POST `/api/create-design-system` with `planOnly: true`
4. Review plan -> "Generate Design System" -> POST with `planOnly: false`
5. Completes -> links to designer view and slide grid

## Existing Patterns

### Current Slide Content

All 18 slides contain realistic-looking example content. None are blank templates:

| Slide | Content Description |
|-------|-------------------|
| `01-title` | "Project Name", "Product Overview", "Your Name", "January 2024" |
| `02-problem` | Before/after comparison with placeholder lists |
| `03-intro` | Two-column with Unsplash image, "Solving real problems..." |
| `04-features` | 3 feature cards: Easy Integration, Real-time Analytics, Enterprise Security |
| `05-stats` | 3 stat cards: 10K+ Users, 98% Satisfaction, 2.5x ROI |
| `06-timeline` | 4 phases: Discovery, Design, Development, Launch |
| `07-comparison` | Standard vs Premium feature matrix |
| `08-quote` | 2 testimonial panels with background images |
| `09-closing` | SF map with score markers + "200%" big number |
| `10-fullscreen` | Full-bleed Unsplash image with text overlay |
| `11-gallery` | 6 portfolio items with hover captions |
| `12-mobile` | iPhone mockup with custom map UI |
| `13-browser` | Browser frame with dashboard screenshot |
| `14-team` | 4 team members with names + headshots |
| `15-partners` | 6 tech stack cards (React, TypeScript, Tailwind, etc.) |
| `16-process` | 3 process cards: Discovery, Design, Build |
| `17-showcase` | 3 project case studies |
| `18-text-4` | Ada Lovelace bio in accent cards |

### Slide Composition Patterns

**Pattern A: Template-based** (minority — some slides use templates from `@/templates`):
```tsx
import { StatCardsTemplate } from "@/templates";
export function Slide05Stats() {
  return <StatCardsTemplate mode="dark" stats={[...]} />;
}
```

**Pattern B: Design-system-composed** (majority — compose directly from `@/design-system`):
```tsx
import { SlideContainer, Eyebrow, HeroTitle, ... } from "@/design-system";
export function Slide01Title() {
  return (
    <SlideContainer mode="yellow">
      {/* Free composition from primitives */}
    </SlideContainer>
  );
}
```

The add-slide skill explicitly prefers Pattern B: "Build from the design system, not from templates. Templates exist as reference examples."

### Naming Convention

Strict, enforced throughout codebase:
- Filename: `NN-kebab-case.tsx` (e.g., `05-stats.tsx`)
- Export: `SlideNNCamelCase` (e.g., `Slide05Stats`)
- FileKey: `NN-kebab-case` (URL param and config key)
- Config ID: `kebab-case` (no number prefix)
- Slide number: 1-indexed, zero-padded

### Registration

Every slide needs entries in two places within `config.ts`:
1. `slideLoaders` record: `"NN-name": () => import("./slides/NN-name").then(m => ({default: m.SlideNNCamelCase}))`
2. `SLIDE_CONFIG_INTERNAL` array: `{ id: "name", fileKey: "NN-name", title: "...", shortTitle: "..." }`

### Builder Header Bar Structure

The `/builder` index page header contains (left to right):
- "Slides" label + count badge
- "Manage Deck" toggle (opens deck chat panel for reorder/delete)
- "Design System" link (-> `/builder/designer`)
- "Apply Design System" button (enters selection mode)
- *(spacer)*
- Git status indicator
- "New Design System" link (-> `/builder/create-design-system`)
- "New Slide" button (-> `/builder/new`)

## Edge Cases & Invariants

### No Empty State Handling

`BuilderIndex` directly renders `SLIDE_CONFIG.map(...)`. If config were empty, it'd show an empty grid with header buttons but no content, no guidance. `TOTAL_SLIDES` would be 0, and CreateView's default `slidePosition` would be 1.

### Slide Deletion Cascading

Removing slides triggers renumbering of all subsequent slides (file renames, config updates, export renames). Clearing all 18 example slides would be extremely tedious.

### Templates Not Exposed in Builder UI

The 21 templates are importable in code but never shown to users in the builder. There's no "pick a template" step in any flow. The CreateView has a canvas wireframe tool + text prompts — not template selection.

### Design System Wizard is Disconnected

The wizard lives at `/builder/create-design-system` as a standalone route. After completion it links to `/builder/designer` (showcase preview) or `/builder` (slide grid). It's not connected to any slide creation flow or onboarding sequence.

### deck.config.ts Has Default Values

```typescript
title: "My Presentation",
subtitle: "A pls-fix Template",
auth: { enabled: false, password: "secret123" },
```

No onboarding step prompts the user to customize these.

## Findings

### Finding 1: Zero Differentiation Between Example and User Slides

The `SlideConfig` interface has no mechanism to flag a slide as "example" vs "user-created". All 18 slides are structurally identical in the registry. There's no way to:
- Filter or hide example slides
- Bulk-remove examples to start fresh
- Reset back to examples
- Visually distinguish them in the grid

### Finding 2: No Onboarding Exists

A new user opening the builder for the first time sees 18 slides and must figure out the workflow independently. The intended user journey (from README context) seems to be:
1. Create a design system (colors, typography, personality)
2. Apply it to slides or create new ones
3. Edit slides via chat

But none of this is presented as a guided flow.

### Finding 3: The Design System Wizard is the Closest Thing to Onboarding

The wizard at `/builder/create-design-system` already has a polished multi-step flow with presets, AI generation, plan review, and execution. It's the natural first step but isn't presented as such.

### Finding 4: No "Start Fresh" Mechanism

There's no button or flow to clear example slides and start with an empty deck. The renumbering cascade makes manual deletion painful. A "clear all and start fresh" action would need to:
1. Delete all files in `src/deck/slides/`
2. Clear `slideLoaders` and `SLIDE_CONFIG_INTERNAL` in `config.ts`
3. Reset `deck.config.ts` to defaults

### Finding 5: Template Catalog Could Power Slide Creation

The 21 templates cover common presentation patterns (title, hero, stats, quote, timeline, comparison, etc.). If exposed as a browsable catalog during onboarding, users could select template types and fill in their content — a much more guided experience than the current canvas wireframe tool.
