# Plan: Separate Builder from Deck

## Goal

Split the monolithic Vite app into two independent apps — the **deck** (deployed presentation) and the **builder** (dev-only editing tool) — so the production build ships zero builder code while both apps share the same slide source for live preview.

## Approach

- **Deck** stays as the TanStack Start app (SSR, Cloudflare Workers) at project root. Builder routes are removed; route tree regenerates with only deck routes.
- **Builder** becomes a standalone Vite SPA (TanStack Router, client-side only) in `apps/builder/`. No SSR, no Cloudflare — it's a dev tool.
- **Shared source** (`src/deck/`, `src/core/`, `src/templates/`, `src/design-system/`, `src/builder/`, `src/lib/`) stays at `src/`. Both apps import via the `@/` path alias.
- **Dev script** starts three processes: deck Vite, builder Vite, builder API server.
- **Production build** (`pnpm build`) only touches the deck. Builder code is not bundled.

### Why the builder is a plain SPA (not TanStack Start)

The builder doesn't need SSR — it's a local dev tool that will never be deployed. Using plain TanStack Router (without Start) means:
- No server entry point, no Cloudflare plugin
- Simpler `index.html` → `main.tsx` → `RouterProvider` bootstrap
- The `@tanstack/router-plugin/vite` handles file-based routing identically

### How live preview works across two Vite apps

Both Vite instances watch the same `src/deck/slides/` directory. When Claude edits a slide file:
1. The deck's Vite detects the change → HMR in the deck preview
2. The builder's Vite also detects the change → HMR in the builder preview

The builder's `useSlidePreview` hook uses `import.meta.hot.on("vite:afterUpdate", ...)` which fires on the builder's own Vite HMR channel. Since both Vite instances watch the same source files, HMR works independently in each.

## Directory Structure After

```
vibe-decks/
├── src/                              # SHARED source (both apps import from here)
│   ├── deck/                         # Slide content, config, theme
│   ├── core/                         # Presentation runtime (scaler, nav, auth)
│   ├── templates/                    # 21 slide templates
│   ├── design-system/                # UI primitives
│   ├── builder/                      # Builder components + hooks
│   ├── lib/                          # Utilities (cn)
│   ├── app.css                       # Tailwind + theme imports
│   ├── routes/                       # DECK routes only
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   └── deck/
│   │       ├── index.tsx
│   │       └── $slide.tsx
│   ├── router.tsx                    # Deck router (unchanged)
│   ├── routeTree.gen.ts              # Deck route tree (auto-regenerated)
│   └── entry.ts                      # Deck SSR entry (unchanged)
├── apps/
│   └── builder/                      # BUILDER app (dev-only SPA)
│       ├── index.html                # SPA entry
│       ├── main.tsx                  # React bootstrap
│       ├── router.tsx                # Builder router
│       ├── routeTree.gen.ts          # Builder route tree (auto-generated)
│       ├── vite.config.ts            # Builder Vite config
│       ├── tsconfig.json             # Extends root, overrides @/ alias
│       └── routes/                   # Builder routes
│           ├── __root.tsx
│           ├── index.tsx
│           └── builder/
│               ├── index.tsx
│               ├── $fileKey.tsx
│               ├── designer.tsx
│               └── create-design-system.tsx
├── scripts/
│   ├── dev.ts                        # Starts deck + builder + API server
│   └── builder-server.ts             # Claude proxy (unchanged)
├── vite.config.ts                    # Deck Vite config (simplified)
├── wrangler.jsonc                    # Deploys deck only (unchanged)
├── deck.config.ts                    # Shared config (unchanged)
├── tsconfig.json                     # Root tsconfig (unchanged)
└── package.json                      # Updated scripts
```

## Changes

### 1. Create builder app shell

#### `apps/builder/index.html` — SPA entry point

**New file.**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Vibe Decks Builder</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
```

#### `apps/builder/main.tsx` — React bootstrap

**New file.** Loads shared CSS, Google Fonts (from `deckConfig`), and mounts the router.

```tsx
import "@/app.css";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { deckConfig } from "../../deck.config";
import { getRouter } from "./router";

function loadGoogleFonts() {
  if (document.querySelector('link[data-builder-fonts]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = deckConfig.theme.googleFontsUrl;
  link.dataset.builderFonts = "";
  document.head.appendChild(link);
}

const router = getRouter();

function App() {
  useEffect(loadGoogleFonts, []);
  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

#### `apps/builder/router.tsx` — TanStack Router (client-only)

**New file.** Same pattern as deck's `src/router.tsx` but uses the builder's route tree.

```tsx
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
  return router;
};
```

#### `apps/builder/vite.config.ts` — Builder Vite config

**New file.** Key differences from deck config: no Cloudflare plugin, no TanStack Start, uses `@tanstack/router-plugin/vite` directly.

```ts
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "path";

const SHARED_SRC = resolve(__dirname, "../../src");
const BUILDER_PORT = Number(process.env.BUILDER_PORT) || 3333;

export default defineConfig({
  root: __dirname,
  publicDir: resolve(__dirname, "../../public"),
  plugins: [
    TanStackRouterVite({
      routesDirectory: resolve(__dirname, "routes"),
      generatedRouteTree: resolve(__dirname, "routeTree.gen.ts"),
    }),
    viteTsConfigPaths({
      projects: [resolve(__dirname, "tsconfig.json")],
    }),
    tailwindcss(),
    viteReact(),
  ],
  resolve: {
    alias: {
      "@/": SHARED_SRC + "/",
    },
  },
  server: {
    watch: {
      ignored: ["**/routeTree.gen.ts"],
    },
    proxy: {
      "/api": {
        target: `http://localhost:${BUILDER_PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: resolve(__dirname, "dist"),
    minify: "esbuild",
    target: "esnext",
  },
});
```

#### `apps/builder/tsconfig.json` — Extends root, overrides path alias

**New file.**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["../../src/*"]
    }
  },
  "include": [
    "./**/*.ts",
    "./**/*.tsx",
    "../../src/**/*.ts",
    "../../src/**/*.tsx",
    "../../deck.config.ts"
  ]
}
```

#### `apps/builder/routes/__root.tsx` — Builder root layout

**New file.** Simpler than the deck root — no SSR `head()` API, just renders an outlet.

```tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}
```

#### `apps/builder/routes/index.tsx` — Redirect to /builder/

**New file.**

```tsx
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/builder" });
  },
  component: () => null,
});
```

#### `apps/builder/routes/builder/index.tsx` — Slide grid (moved)

**Moved from** `src/routes/builder/index.tsx`. Content is identical — all imports resolve via `@/` which points to `../../src/`.

#### `apps/builder/routes/builder/$fileKey.tsx` — Slide editor (moved)

**Moved from** `src/routes/builder/$fileKey.tsx`. Content is identical.

#### `apps/builder/routes/builder/designer.tsx` — Design system editor (moved)

**Moved from** `src/routes/builder/designer.tsx`. Content is identical.

#### `apps/builder/routes/builder/create-design-system.tsx` — Wizard (moved)

**Moved from** `src/routes/builder/create-design-system.tsx`. Content is identical.

---

### 2. Clean up deck app

#### Delete `src/routes/builder/` directory

Remove the entire directory. TanStack Router will regenerate `src/routeTree.gen.ts` without builder routes on next dev start.

**Files deleted:**
- `src/routes/builder/index.tsx`
- `src/routes/builder/$fileKey.tsx`
- `src/routes/builder/designer.tsx`
- `src/routes/builder/create-design-system.tsx`

#### Update `src/routes/deck/$slide.tsx` — Edit button links to external builder

**Before:**
```tsx
import { createFileRoute, redirect, Link } from "@tanstack/react-router";
// ...
{import.meta.env.DEV && fileKey && (
  <Link
    to="/builder/$fileKey"
    params={{ fileKey }}
    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-full shadow-lg hover:bg-neutral-700 transition-colors"
  >
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    Edit
  </Link>
)}
```

**After:**
```tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
// ...
{import.meta.env.DEV && import.meta.env.VITE_BUILDER_URL && fileKey && (
  <a
    href={`${import.meta.env.VITE_BUILDER_URL}/builder/${fileKey}`}
    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-full shadow-lg hover:bg-neutral-700 transition-colors"
  >
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    Edit
  </a>
)}
```

The `VITE_BUILDER_URL` env var is set by the dev script. In production builds, both `import.meta.env.DEV` and `VITE_BUILDER_URL` are falsy, so this entire block is tree-shaken.

#### Simplify `vite.config.ts` — Remove builder proxy

**Before:**
```ts
server: {
  watch: {
    ignored: ["**/routeTree.gen.ts"],
  },
  proxy: process.env.BUILDER_PORT
    ? {
        "/api": {
          target: `http://localhost:${process.env.BUILDER_PORT}`,
          changeOrigin: true,
        },
      }
    : undefined,
},
```

**After:**
```ts
server: {
  watch: {
    ignored: ["**/routeTree.gen.ts"],
  },
},
```

The deck makes no API calls. The proxy was only needed because builder frontend code ran in the same Vite app.

---

### 3. Update dev infrastructure

#### `scripts/dev.ts` — Start three processes

**Modified.** Adds builder Vite dev server as a third process, passes `VITE_BUILDER_URL` to the deck.

```ts
import { createServer } from "node:net";
import { spawn, type ChildProcess } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync, unlinkSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const BUILDER_APP = resolve(PROJECT_ROOT, "apps/builder");
const PORTS_FILE = resolve(PROJECT_ROOT, ".dev-ports");

function findFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, () => {
      const addr = server.address();
      if (!addr || typeof addr === "string") {
        reject(new Error("Failed to get port"));
        return;
      }
      const port = addr.port;
      server.close(() => resolve(port));
    });
    server.on("error", reject);
  });
}

async function main(): Promise<void> {
  const deckPort = await findFreePort();
  const builderVitePort = await findFreePort();
  const builderApiPort = await findFreePort();

  const baseEnv = {
    ...process.env,
    BUILDER_PORT: String(builderApiPort),
  };

  writeFileSync(
    PORTS_FILE,
    JSON.stringify({
      deck: deckPort,
      builder: builderVitePort,
      api: builderApiPort,
    })
  );

  const builderApi = spawn("tsx", ["scripts/builder-server.ts"], {
    cwd: PROJECT_ROOT,
    env: baseEnv,
    stdio: "inherit",
  });

  const deck = spawn(
    "npx",
    ["vite", "dev", "--port", String(deckPort)],
    {
      cwd: PROJECT_ROOT,
      env: {
        ...baseEnv,
        VITE_BUILDER_URL: `http://localhost:${builderVitePort}`,
      },
      stdio: "inherit",
    }
  );

  const builderVite = spawn(
    "npx",
    ["vite", "dev", "--port", String(builderVitePort)],
    {
      cwd: BUILDER_APP,
      env: baseEnv,
      stdio: "inherit",
    }
  );

  const children: ChildProcess[] = [builderApi, deck, builderVite];

  function cleanup(): void {
    for (const child of children) {
      child.kill();
    }
    try {
      unlinkSync(PORTS_FILE);
    } catch {}
  }

  process.on("SIGINT", () => {
    cleanup();
    process.exit();
  });

  process.on("SIGTERM", () => {
    cleanup();
    process.exit();
  });

  for (const child of children) {
    child.on("exit", (code) => {
      if (code !== null && code !== 0) {
        cleanup();
        process.exit(code);
      }
    });
  }
}

main();
```

#### Update `.dev-ports` format

**Before:** `{ "vite": PORT, "builder": PORT }`
**After:** `{ "deck": PORT, "builder": PORT, "api": PORT }`

Where `deck` is the deck Vite port, `builder` is the builder Vite port, `api` is the builder API server port.

#### Update `.gitignore` — Add builder route tree

Add:
```
apps/builder/routeTree.gen.ts
```

---

### 4. Update package.json scripts

**Before:**
```json
"scripts": {
  "dev": "tsx scripts/dev.ts",
  "build": "vite build",
  "serve": "vite preview",
  "preview": "pnpm run build && vite preview",
  "deploy": "vite build && wrangler deploy"
}
```

**After:**
```json
"scripts": {
  "dev": "tsx scripts/dev.ts",
  "dev:deck": "npx vite dev",
  "build": "vite build",
  "serve": "vite preview",
  "preview": "pnpm run build && vite preview",
  "deploy": "vite build && wrangler deploy"
}
```

`dev:deck` is a convenience for starting just the deck without the builder (e.g., for production preview). The main `dev` command starts everything.

---

### 5. Add Vite env type declaration

**New file:** `src/vite-env.d.ts` (or update existing)

Declare the `VITE_BUILDER_URL` env var for TypeScript:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILDER_URL?: string;
}
```

---

## Considerations

### Bundle size improvement
Builder-only dependencies that no longer ship to production:
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` (drag-and-drop)
- `konva`, `react-konva` (wireframe canvas)
- `html-to-image` (thumbnail capture)
- `react-grab` (element selection)
- `maplibre-gl` (if only used in builder previews — check if any deployed slides use it)
- All 40+ files in `src/builder/`

These still need to be in `dependencies` (not `devDependencies`) because the builder Vite app imports them at dev time and Vite needs to resolve them. But they're tree-shaken out of the deck's production build since no deck code imports them.

### Route type safety
Both apps generate separate `routeTree.gen.ts` files that augment `@tanstack/react-router`. TypeScript merges both augmentations, so both apps see a superset of routes. This is harmless — the deck never links to builder routes (uses `<a>` not `<Link>`), and the builder never links to deck routes.

### HMR across apps
Both Vite instances independently watch `src/`. When a slide file changes:
- The deck's HMR updates the presentation view
- The builder's HMR updates the preview and triggers `useSlidePreview`'s version bump

The builder server (`scripts/builder-server.ts`) is unchanged — it spawns Claude processes that edit `src/deck/slides/` files directly. Both Vite instances pick up the changes.

### Cloudflare Workers deploy
Unchanged. `wrangler.jsonc` points to `src/entry.ts`, which uses TanStack Start's server entry, which uses the deck-only route tree. Builder code is completely absent from the production bundle.

### The builder routes keep the `/builder/` prefix
The builder app's routes are nested under `routes/builder/` to preserve the exact URL paths (`/builder/`, `/builder/$fileKey`, etc.). This means zero changes to `<Link>` calls in `src/builder/` components — they all already use `to="/builder/..."` patterns and continue to work.

### `@tanstack/router-plugin` is already a dependency
Looking at `package.json`, `@tanstack/router-plugin` is already listed (it's used by `@tanstack/react-start` internally). The builder's Vite config imports `TanStackRouterVite` from it directly — no new dependency needed.

### CLAUDE.md updates needed
The Playwright/browser preview section references `.dev-ports` format and port names. This needs updating to reflect the new `{ deck, builder, api }` format.

## Tasks

### Phase 1: Create builder app shell
- [x] Create `apps/builder/` directory
- [x] Create `apps/builder/index.html`
- [x] Create `apps/builder/main.tsx`
- [x] Create `apps/builder/router.tsx`
- [x] Create `apps/builder/vite.config.ts`
- [x] Create `apps/builder/tsconfig.json`
- [x] Create `apps/builder/routes/__root.tsx`
- [x] Create `apps/builder/routes/index.tsx`
- [x] Move `src/routes/builder/index.tsx` → `apps/builder/routes/builder/index.tsx`
- [x] Move `src/routes/builder/$fileKey.tsx` → `apps/builder/routes/builder/$fileKey.tsx`
- [x] Move `src/routes/builder/designer.tsx` → `apps/builder/routes/builder/designer.tsx`
- [x] Move `src/routes/builder/create-design-system.tsx` → `apps/builder/routes/builder/create-design-system.tsx`
- [x] Verify builder app starts: `cd apps/builder && BUILDER_PORT=3333 npx vite dev`

### Phase 2: Clean up deck app
- [x] Delete `src/routes/builder/` directory
- [x] Update `src/routes/deck/$slide.tsx` — replace `<Link>` with `<a>` for Edit button
- [x] Remove `Link` import if no longer used
- [x] Remove builder proxy from `vite.config.ts`
- [x] Add `src/vite-env.d.ts` with `VITE_BUILDER_URL` type
- [x] Verify deck starts standalone: `npx vite dev`
- [x] Verify `pnpm build` succeeds with no builder code in output

### Phase 3: Update dev infrastructure
- [x] Rewrite `scripts/dev.ts` to start three processes
- [x] Update `.dev-ports` format to `{ deck, builder, api }`
- [x] Update `.gitignore` with `apps/builder/routeTree.gen.ts`
- [x] Update `package.json` scripts
- [x] Verify `pnpm dev` starts all three processes
- [x] Verify builder preview works (renders slides, HMR updates)
- [x] Verify builder API works (edit slide via chat, see changes)
- [x] Verify Edit button on deck links to builder

### Phase 4: Update documentation
- [x] Update CLAUDE.md — new port format, new dev commands, updated project structure
- [x] Update Playwright/browser preview instructions in CLAUDE.md

---

*Ready for your review. Add any inline notes and I'll update the plan accordingly.*
