# TODOs

## 1. Builder stability during file edits

### Problem

When Claude edits a slide or design system file, Vite's file watcher fires HMR immediately. The slide component re-renders with potentially broken/partial code, throwing a React render error. Because there is no error boundary anywhere in the component tree, the error propagates up and kills the entire builder UI — both the preview panel and the chat sidebar go white. A browser refresh recovers fully (chat history is persisted in localStorage), but the interruption breaks flow.

This affects both edit mode (`/builder/$fileKey`) and designer mode (`/builder/designer`). The slide grid on `/builder/` does not crash because it renders static thumbnails, not live HMR-aware components.

### Current Architecture (no protection)

- `SlidePreview` renders `<Component />` inside a `<Suspense>` wrapper — no error boundary
- `useSlidePreview` listens for `vite:afterUpdate`, invalidates the module cache, and bumps a version counter to force re-render
- `DesignerPreview` uses the same HMR pattern for design system files
- Neither component has any error catching — a throw during render kills the entire React tree

### Solution: React Error Boundary + HMR Auto-Recovery

Stay in the same React tree (no iframes). Wrap slide/design-system previews in an error boundary that catches render errors, shows a fallback, and auto-retries when HMR fires a new update.

**Approach:**
1. Create a `PreviewErrorBoundary` component (class component — React requires it for `getDerivedStateFromError`)
2. On error: render a fallback UI ("Preview updating...") instead of the slide
3. On next HMR event (`vite:afterUpdate`): reset the error boundary state, attempt re-render
4. If re-render succeeds: preview is restored automatically
5. If re-render fails: stay in fallback, wait for next HMR event

**Key behaviors:**
- Chat sidebar stays fully alive during preview errors — user can continue sending messages
- Preview auto-recovers without user intervention as soon as the file reaches a valid state
- Incremental preview updates still work (HMR events that don't error render normally)
- No server-side coordination needed — purely reactive on the client

### Files to Create

**`src/builder/components/preview-error-boundary.tsx`**
- Class component implementing `componentDidCatch` / `getDerivedStateFromError`
- Props: `children`, `onReset?: () => void`
- Exposes a `resetErrorBoundary()` method via ref or callback
- Fallback UI: centered message with a subtle loading indicator, styled to match the builder's dark chrome
- Auto-reset: listens for `vite:afterUpdate` via `import.meta.hot` and calls `resetErrorBoundary()` on any update

### Files to Modify

**`src/builder/components/slide-preview.tsx`**
- Wrap `<SlideScaler><Component /></SlideScaler>` in `<PreviewErrorBoundary>`
- Pass the HMR version as a `resetKey` prop so the boundary resets on version bumps

**`src/builder/components/designer-preview.tsx`**
- Wrap `<Showcase />` in `<PreviewErrorBoundary>`
- Same `resetKey` pattern using the existing `version` state

### What This Does NOT Do

- Does not suppress or debounce HMR — Vite's file watcher behavior is unchanged
- Does not coordinate with the builder-server (no "editing-started"/"editing-complete" signals)
- Does not use iframes or separate processes — stays in one React tree
- Does not prevent the error from happening — it catches and recovers from it

## 2. Asset management (images, files)

Upload images and other assets into `public/` for use in slides. Browse and reference them from the builder.

**Needs:**
- Upload endpoint on builder-server that writes to `public/assets/` (or similar)
- Asset browser UI in the builder — grid of thumbnails, copy path to clipboard
- Drag-and-drop support in the chat input or a dedicated upload zone
- Path references should be root-relative (`/assets/photo.jpg`) for use in slides
- Consider size limits, supported formats, and deduplication

## 3. Agent skills and subagents for critical actions

Each major builder action should have a dedicated agent or skill with domain-specific knowledge baked in.

**Existing:**
- `slide-readability-reviewer` — audits font sizes after slide changes
- `design-system-editor` — guides design system modifications with scaling rules
- `add-slide`, `edit-slide`, `remove-slide`, `reorder-slide`, `rename-slide` — user-invocable skills

**Needed:**
- **apply-design-system agent** — orchestrates batch slide rewrites, knows how to read CHANGELOG diff and map design changes to slide updates
- **slide-composer agent** — specialized for creating new slides from design system primitives, understands layout heuristics and component selection
- **asset-manager agent** — handles image uploads, optimization, and path resolution (depends on #2)
- **theme-editor agent** — focused on CSS variable changes in theme.css, understands mode propagation and contrast requirements
- **showcase-updater agent** — keeps the brand bible in sync after design system component changes, knows the brief structure and scaling rules
