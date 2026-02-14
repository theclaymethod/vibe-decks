# pls-fix - Claude Code Instructions

This is a slide deck template system designed to be built and customized with Claude Code.

## Quick Commands

| Command | Description |
|---------|-------------|
| `/add-slide` | Create a new slide |
| `/remove-slide` | Delete a slide |
| `/edit-slide` | Modify slide content |
| `/reorder-slide` | Move slide to new position |
| `/rename-slide` | Rename slide file/title |

## Project Structure

```
pls-fix/
├── src/                          # SHARED source (both apps import via @/)
│   ├── deck/                     # YOUR DECK CONTENT
│   │   ├── config.ts             # Slide registry (imports + SLIDE_CONFIG)
│   │   ├── theme.css             # CSS variables for colors/fonts
│   │   └── slides/               # Individual slide files
│   │       ├── 01-title.tsx
│   │       ├── 02-intro.tsx
│   │       └── ...
│   ├── templates/                # 21 pre-built slide templates
│   ├── design-system/            # Base UI components
│   ├── builder/                  # Builder components + hooks
│   ├── core/                     # Infrastructure (navigation, scaling)
│   └── routes/                   # DECK routes only (TanStack Start, SSR)
├── apps/
│   └── builder/                  # BUILDER app (dev-only SPA, no SSR)
│       ├── index.html            # SPA entry point
│       ├── main.tsx              # React bootstrap
│       ├── router.tsx            # TanStack Router (client-only)
│       ├── vite.config.ts        # Builder Vite config
│       └── routes/               # Builder routes (TanStack Router)
├── scripts/
│   ├── dev.ts                    # Starts deck + builder + API server
│   └── builder-server.ts         # Claude proxy for builder API
├── deck.config.ts                # Top-level config (auth, dimensions)
└── .claude/skills/               # Claude Code skills for slide management
```

## Key Files

### src/deck/config.ts
Central registry for all slides. Structure:
```typescript
import { Slide01Title } from "./slides/01-title";
// ... more imports

export const SLIDE_CONFIG: SlideConfig[] = [
  {
    id: "title",           // URL-safe identifier
    title: "Title Slide",  // Full title for sidebar
    shortTitle: "Title",   // Abbreviated for nav
    component: Slide01Title,
  },
  // ... more slides
];
```

### src/deck/slides/NN-name.tsx
Individual slide files. Naming convention:
- File: `NN-kebab-case.tsx` (e.g., `05-our-process.tsx`)
- Export: `SlideNNCamelCase` (e.g., `Slide05OurProcess`)

Basic structure:
```tsx
import { TemplateName } from "@/templates";

export function SlideNNName() {
  return (
    <TemplateName
      // template-specific props
    />
  );
}
```

### src/deck/theme.css
CSS custom properties for theming:
```css
:root {
  --color-primary: #ff6e41;
  --color-bg-light: #ffffff;
  --color-bg-dark: #1a1a1a;
  --font-heading: 'Bebas Neue', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

### deck.config.ts
Top-level configuration:
```typescript
export const deckConfig = {
  title: "Presentation Title",
  auth: { enabled: false, password: "" },
  design: { width: 1920, height: 1080 },
};
```

## Available Templates

| Template | Use Case |
|----------|----------|
| `TitleTemplate` | Opening slides, section headers |
| `HeroTemplate` | Bold statement with background image |
| `SplitContentTemplate` | Text + image side by side |
| `TwoColumnTemplate` | Two content areas |
| `StatCardsTemplate` | Key metrics (2-4 numbers) |
| `QuoteTemplate` | Testimonials, quotes |
| `BigNumberTemplate` | Single dramatic statistic |
| `FeatureGridTemplate` | Feature list with icons |
| `IconGridTemplate` | Icon-based grid |
| `TimelineTemplate` | Milestones, roadmaps |
| `ComparisonTableTemplate` | Feature matrix |
| `BeforeAfterTemplate` | Before/after comparison |
| `DiagramTemplate` | Custom diagrams |
| `FullscreenImageTemplate` | Full-bleed image |
| `PhotoGridTemplate` | Image gallery |
| `PhoneMockupTemplate` | Mobile app screenshots |
| `BrowserMockupTemplate` | Web app screenshots |
| `TeamTemplate` | Team member profiles |
| `LogoCloudTemplate` | Partner/client logos |
| `StackedCardsTemplate` | Process steps as cards |
| `ThreeUpTemplate` | Three-item showcase |

## Common Tasks

### Add a new slide
```
/add-slide
```
Or describe: "Add a quote slide after slide 5 called customer-testimonial"

### Change slide content
```
/edit-slide
```
Or describe: "Update slide 3 to show 500% instead of 250%"

### Reorder slides
```
/reorder-slide
```
Or describe: "Move slide 8 to position 3"

### Change theme colors
Edit `src/deck/theme.css` and modify the CSS variables.

### Add password protection
In `deck.config.ts`, set:
```typescript
auth: { enabled: true, password: "your-password" }
```

## Build & Deploy

```bash
pnpm install    # Install dependencies
pnpm dev        # Start all dev servers (deck + builder + API)
pnpm dev:deck   # Start deck Vite only (no builder)
pnpm build      # Build deck for production (no builder code)
pnpm preview    # Preview production build
```

Deploys to Cloudflare Workers via the deploy button or `wrangler deploy`. Only the deck is deployed — the builder is a dev-only tool.

## Playwright / Browser Preview

The dev server ports are **dynamic** (supports multiple worktrees). `pnpm dev` writes ports to `.dev-ports` in the project root:
```json
{ "deck": 51234, "builder": 51235, "api": 51236 }
```

**Before using Playwright MCP**, read `.dev-ports` to get the correct ports, then navigate to:
- Presentation view: `http://localhost:{deck}/deck/{slideNumber}` (1-indexed)
- Builder/editor view: `http://localhost:{builder}/builder/{fileKey}` (e.g., `01-title`)
- All slides grid: `http://localhost:{builder}/builder`
- Design system: `http://localhost:{builder}/builder/designer`

## Conventions

- Slide numbers are 1-indexed and zero-padded (01, 02, ... 17)
- All slides import templates from `@/templates`
- Template variants: `light`, `dark`, `cream`, `primary`
- Mode props control color schemes within templates

## Workflow Rules

- **Commit after every change.** Include the high-level user instructions in the commit message so the history is readable.
- **Do NOT push.** Pushes are manual — the user triggers them via the git status indicator in the builder header bar.
- **Revert on breakage.** At some point you WILL introduce a breaking change. When this happens, revert to the previous working commit rather than spending a lot of time debugging a broken path.
