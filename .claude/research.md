# Research: Builder / Deck Separation

## Overview

Vibe Decks is a slide deck builder + presentation system. Currently it's a single TanStack Router app where both the builder UI and the deck presentation share the same Vite build, route tree, and deploy target. The builder server (Claude CLI proxy) already runs as a separate Node.js process, but the React frontend is monolithic.

## Architecture

### Current Process Model

`pnpm dev` (`scripts/dev.ts`) spawns two processes:
1. **Vite dev server** — serves the entire React app (both builder + deck routes)
2. **Builder server** (`scripts/builder-server.ts`) — Node.js HTTP server on a separate port

Vite proxies `/api/*` to the builder server via config:
```ts
// vite.config.ts
proxy: process.env.BUILDER_PORT
  ? { "/api": { target: `http://localhost:${process.env.BUILDER_PORT}` } }
  : undefined,
```

### Key Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Single Vite config for entire app. Uses cloudflare plugin, tanstackStart, React |
| `wrangler.jsonc` | Cloudflare Workers deploy. Entry: `src/entry.ts` |
| `src/entry.ts` | TanStack Start server entry (just re-exports) |
| `deck.config.ts` | Top-level config: title, auth, dimensions, fonts |
| `scripts/dev.ts` | Dev orchestrator: finds ports, spawns Vite + builder server, writes `.dev-ports` |
| `scripts/builder-server.ts` | Node.js HTTP API for Claude CLI, git, assets (~980 lines) |
| `src/routes/__root.tsx` | Root layout: HTML shell, CSS/fonts, uses `deckConfig` |
| `src/routes/index.tsx` | `/` redirects to `/deck/1` |
| `tsconfig.json` | Single tsconfig, `@/*` maps to `./src/*` |
| `package.json` | Single package, all deps combined |

### Route Structure

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/routes/index.tsx` | Redirect to `/deck/1` |
| `/deck/` | `src/routes/deck/index.tsx` | Redirect to `/deck/1` |
| `/deck/$slide` | `src/routes/deck/$slide.tsx` | Presentation view (1-indexed) |
| `/builder/` | `src/routes/builder/index.tsx` | Slide grid + deck management |
| `/builder/$fileKey` | `src/routes/builder/$fileKey.tsx` | Edit/create single slide |
| `/builder/designer` | `src/routes/builder/designer.tsx` | Design system editor |
| `/builder/create-design-system` | `src/routes/builder/create-design-system.tsx` | Design system wizard |

### Module Map

```
src/
├── routes/          # TanStack file-based routes (auto-generates routeTree.gen.ts)
│   ├── __root.tsx   # SHARED — HTML shell, loads theme
│   ├── index.tsx    # DECK — redirect
│   ├── deck/        # DECK-ONLY routes
│   └── builder/     # BUILDER-ONLY routes
├── core/            # DECK RUNTIME — presentation infrastructure
│   ├── deck-layout.tsx    # Wraps slides: nav + scaler + auth + mobile check
│   ├── slide-scaler.tsx   # CSS transform scaling to fit viewport
│   ├── slide-nav.tsx      # Left sidebar navigation
│   ├── keyboard-nav.ts    # Arrow/space/number key handling
│   ├── auth-gate.tsx      # Password protection
│   ├── mobile-blocker.tsx # Blocks mobile devices
│   └── index.ts           # Barrel exports
├── deck/            # SHARED — slide content
│   ├── config.ts          # Slide registry, lazy loading, SLIDE_CONFIG
│   ├── slides/*.tsx        # 18 slide component files
│   ├── theme.css           # CSS custom properties
│   └── custom-fonts.css    # Auto-generated @font-face rules
├── templates/       # SHARED — 21 reusable slide templates
├── design-system/   # SHARED — base UI primitives (typography, cards, etc.)
├── builder/         # BUILDER-ONLY — all builder UI
│   ├── components/        # 20+ components (canvas, chat, previews, etc.)
│   ├── hooks/             # 12 hooks (generation, editing, thumbnails, etc.)
│   ├── types.ts
│   ├── prompt-builder.ts
│   └── canvas-capture.ts
├── lib/
│   └── utils.ts     # SHARED — cn() utility
├── app.css          # SHARED — tailwind + theme imports
└── entry.ts         # SSR entry for Cloudflare Workers
```

### Data Flow

**Deck Presentation:**
```
URL /deck/3 → $slide route → parseInt(3) → getSlideComponent(3)
→ SLIDE_CONFIG[2].fileKey → "03-intro"
→ lazy(() => import("./slides/03-intro")) → React.Suspense
→ DeckLayout wraps: SlideNav + SlideScaler + slide content
→ keyboard-nav listens for arrow keys → navigate to /deck/N
```

**Builder Edit Flow:**
```
URL /builder/03-intro → $fileKey route → BuilderLayout
→ EditView: resolveEditInfo("03-intro") finds slide in SLIDE_CONFIG
→ Left: SlidePreview renders actual slide component via useSlidePreview
→ Right: EditSidebar with chat → user types message
→ handleSendMessage → generation.edit() → fetch POST /api/edit
→ Vite proxy → builder-server → spawns `claude -p "..." --dangerously-skip-permissions`
→ SSE stream back → updates chat messages
→ Vite HMR picks up file changes from Claude's edits
```

**Thumbnail Generation (builder only):**
```
ThumbnailProvider mounts hidden div off-screen
→ For each slide in SLIDE_CONFIG:
  → loadSlideComponent(fileKey) → dynamically imports slide
  → createRoot() → flushSync render into hidden container
  → toPng() via html-to-image at 0.5x → cache as data URL
→ SlideThumb components read from cache
```

## Existing Patterns

### How Builder Previews Slides
The builder renders slides **inline** (same React tree, not iframes):
- `SlidePreview` component in `src/builder/components/slide-preview.tsx`
- Uses `SlideScaler` from `@/core` to scale 1920x1080 slides to fit
- Components are loaded via `loadSlideComponent()` from `@/deck/config`
- HMR works because Vite watches the same source files

### API Boundary
The builder server exposes these endpoints (all dev-only, proxied via Vite):
- `POST /api/generate` — create new slide via Claude
- `POST /api/edit` — edit existing slide via Claude (supports session resume)
- `POST /api/edit-design-system` — edit design system via Claude
- `POST /api/apply-design-system` — rewrite slide with design system primitives
- `POST /api/create-design-system` — generate new design system
- `POST /api/assess-design-system` — evaluate design system alignment
- `POST /api/generate-palette` — generate color palette
- `POST /api/deck-chat` — deck management chat (reorder, delete, etc.)
- `GET/POST/DELETE /api/assets/*` — asset CRUD
- `GET /api/design-brief` — read design brief
- `GET /api/git/status`, `POST /api/git/push`, `POST /api/git/revert` — git ops

### Cross-Boundary Dependencies

**Builder → Deck** (heavy):
- `@/deck/config` — SLIDE_CONFIG, TOTAL_SLIDES, loadSlideComponent, getSlideComponent, invalidateSlideCache
- `@/core` — SlideScaler (for preview), possibly other core components
- `@/templates` — template listing for prompt generation
- `@/design-system` — design system showcase
- `deck.config.ts` — dimensions for thumbnail capture

**Deck → Builder** (minimal, dev-only):
- `src/routes/deck/$slide.tsx` has a `{import.meta.env.DEV && ...}` block that renders a `<Link to="/builder/$fileKey">` Edit button
- This is the ONLY dependency from deck code to builder code
- It's already gated behind `import.meta.env.DEV`

### Framework Details
- **TanStack Start** with `@tanstack/react-start` — SSR framework
- **TanStack Router** with file-based routing — auto-generates `routeTree.gen.ts`
- **Cloudflare Workers** as deploy target via `@cloudflare/vite-plugin`
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **Motion** (framer-motion successor) for animations
- **Konva** + **react-konva** for canvas-based wireframe tool in builder
- **maplibre-gl** for map rendering in slides
- **html-to-image** for thumbnail capture

## Edge Cases & Invariants

### The Root Layout Problem
`__root.tsx` loads `deckConfig` for title and Google Fonts URL. Both builder and deck need this. If separated, each app needs its own root layout that loads the same theme/fonts.

### HMR-Driven Workflow
The builder's core value proposition is: Claude edits slide files → Vite HMR updates the preview instantly. For this to work, the builder's Vite instance must be watching the same `src/deck/slides/` directory. If the builder is a separate Vite app, it needs to import from the same source files.

### Thumbnail Capture Imports All Slides
`use-thumbnail-cache.tsx` imports `loadSlideComponent` which can load ANY slide. This means the builder needs access to the full slide registry and all slide source files.

### Production Build Size
Currently, builder code IS bundled into the production Cloudflare Workers deploy. Since all routes are in one app, the builder routes and their dependencies (Konva, dnd-kit, etc.) ship to production even though they're only used in dev. This is the main motivation for separation — keeping the deployed deck lean.

### The Builder Server is Already Isolated
`scripts/builder-server.ts` is pure Node.js, no React, no Vite. It communicates via HTTP. This piece needs zero changes for separation — it stays as-is.

## Findings

### What Ships to Production That Shouldn't
Looking at `package.json`, these are builder-only dependencies that currently ship:
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` — drag-and-drop for slide reordering
- `konva`, `react-konva` — wireframe canvas
- `html-to-image` — thumbnail generation
- `react-grab` — element grabbing in preview

These add significant bundle weight. The entire `src/builder/` directory (~40 files) also gets bundled.

### Monorepo vs. Two Apps vs. Conditional Loading

Three main approaches to separation:

1. **Monorepo with shared packages** — pnpm workspaces, `packages/shared`, `apps/deck`, `apps/builder`
2. **Two Vite configs, one repo** — `vite.config.deck.ts` and `vite.config.builder.ts`, same source tree
3. **Route-level code splitting** — keep one app but ensure builder routes/deps are tree-shaken from production build

### Current Dev-Only Gating
The Edit button in `$slide.tsx` already uses `import.meta.env.DEV`. However, route files in `src/routes/builder/` are always included in the route tree regardless of environment — TanStack Router's file-based routing doesn't support conditional routes.

### Deployment Concern
The wrangler config points to `src/entry.ts` which re-exports TanStack Start's server entry. Both apps would need their own entry points and wrangler configs (or the builder simply doesn't deploy to Cloudflare at all — it's dev-only).
