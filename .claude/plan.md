# Plan: Example Slide Differentiation & User Onboarding

## Goal

Distinguish pre-made example slides from user-created slides, and add an onboarding flow that guides new users through design system creation and deck setup before they encounter the raw slide grid.

## Approach

**Core insight**: The 18 shipped slides are examples, not the user's deck. Today, there's no distinction. We add an `isExample` flag to `SlideConfig`, gate first-time users through a welcome screen, connect the existing design system wizard to onboarding, and provide a "clear examples + start fresh" mechanism.

**State management**: Use localStorage for onboarding state (consistent with existing `deck-panel-open` pattern in `apps/builder/routes/builder/index.tsx:17-31`). Use config metadata for slide type (`isExample`). Use a new builder-server endpoint for bulk clearing.

**New user flow**:
1. Open builder → welcome screen (not the grid)
2. Welcome offers: "Create Your Design System" or "Explore Example Deck"
3. "Create Design System" → existing wizard → new completion step offers "Start Fresh" or "Apply to Examples"
4. "Start Fresh" → clears all example slides → empty state with "Create your first slide"
5. "Explore Example Deck" → grid with example badges, header "Clear Examples" button

## Changes

### 1. SlideConfig: Add `isExample` flag

**File:** `src/deck/config.ts`

Add optional `isExample` property. All 18 existing slides get `isExample: true`. New slides created by skills/builder default to `undefined` (falsy).

```typescript
// Before (line 3-8)
export interface SlideConfig {
  id: string;
  title: string;
  shortTitle: string;
  fileKey: string;
}

// After
export interface SlideConfig {
  id: string;
  title: string;
  shortTitle: string;
  fileKey: string;
  isExample?: boolean;
}
```

Each entry in `SLIDE_CONFIG_INTERNAL` (lines 102-121) gains `isExample: true`:

```typescript
// Before
{ id: "title", fileKey: "01-title", title: "Title Slide", shortTitle: "Title" },

// After
{ id: "title", fileKey: "01-title", title: "Title Slide", shortTitle: "Title", isExample: true },
```

Add a helper export after `TOTAL_SLIDES` (line 125):

```typescript
export const HAS_EXAMPLE_SLIDES = SLIDE_CONFIG.some((s) => s.isExample);
```

### 2. Welcome Screen Component

**New file:** `src/builder/components/welcome-screen.tsx`

A full-page welcome screen shown on first visit. Two CTAs:
- **"Create Your Design System"** → navigates to `/builder/create-design-system`
- **"Explore Example Deck"** → dismisses welcome, shows the grid

Uses localStorage (`pls-fix-onboarding-complete`) for persistence, matching the existing pattern of `deck-panel-open` in `apps/builder/routes/builder/index.tsx`.

```tsx
import { useNavigate } from "@tanstack/react-router";

const ONBOARDING_KEY = "pls-fix-onboarding-complete";

export function hasCompletedOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return false;
  }
}

export function completeOnboarding(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, "true");
  } catch {}
}

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const navigate = useNavigate();

  const handleCreateDesignSystem = () => {
    completeOnboarding();
    navigate({ to: "/builder/create-design-system" });
  };

  const handleExploreExamples = () => {
    completeOnboarding();
    onComplete();
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Welcome to pls-fix
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Build beautiful slide decks with AI. Start by creating a design system
            that defines your colors, typography, and visual personality — then
            create slides that use it.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleCreateDesignSystem}
            className="w-full px-6 py-3 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Create Your Design System
          </button>
          <button
            onClick={handleExploreExamples}
            className="w-full px-6 py-3 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Explore Example Deck
          </button>
        </div>

        <p className="text-xs text-neutral-400">
          The example deck shows what's possible. You can clear it anytime and start fresh.
        </p>
      </div>
    </div>
  );
}
```

### 3. Builder Index: Onboarding Gate + Empty State + Clear Examples

**File:** `apps/builder/routes/builder/index.tsx`

Three additions:

**A. Onboarding gate** — show `WelcomeScreen` if onboarding not completed:

```tsx
// New imports
import { WelcomeScreen, hasCompletedOnboarding } from "@/builder/components/welcome-screen";
import { HAS_EXAMPLE_SLIDES } from "@/deck/config";
import { useClearExamples } from "@/builder/hooks/use-clear-examples";

function BuilderIndex() {
  const [onboarded, setOnboarded] = useState(hasCompletedOnboarding);
  // ... existing state ...
  const { clearing, clearExamples } = useClearExamples();

  if (!onboarded) {
    return <WelcomeScreen onComplete={() => setOnboarded(true)} />;
  }

  // ... existing render ...
}
```

**B. "Clear Examples" button** in header bar, between "Apply Design System" and the spacer:

```tsx
{HAS_EXAMPLE_SLIDES && (
  <button
    onClick={() => {
      if (confirm("Clear all example slides? This will remove all 18 example slides so you can start fresh. This is committed to git and can be reverted.")) {
        clearExamples();
      }
    }}
    disabled={clearing}
    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
  >
    {clearing ? "Clearing..." : "Clear Examples"}
  </button>
)}
```

**C. Empty state** when `SLIDE_CONFIG.length === 0`, replacing the grid area inside the content div:

```tsx
{SLIDE_CONFIG.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-neutral-400">
        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
    <h2 className="text-sm font-medium text-neutral-800 mb-1">No slides yet</h2>
    <p className="text-xs text-neutral-500 mb-4 max-w-xs">
      Create your first slide to get started.
    </p>
    <Link
      to="/builder/$fileKey"
      params={{ fileKey: "new" }}
      className="px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors"
    >
      Create First Slide
    </Link>
  </div>
) : isSelecting ? (
  // existing selection grid...
) : (
  // existing SortableSlideGrid...
)}
```

### 4. Example Badge on Slide Cards

**File:** `src/builder/components/sortable-slide-card.tsx`

Add a subtle "Example" badge in the card footer when `slide.isExample` is true. This touches both the non-management mode (Link wrapper, line 44-61) and management mode (div wrapper, line 64-125) renders:

```tsx
// Replace the info section in both modes:
// Before (lines 52-58 non-management, 116-123 management):
<div className="px-3 py-2.5">
  <p className="text-sm font-medium text-neutral-800 truncate">
    {slide.title}
  </p>
  <p className="text-xs text-neutral-400 mt-0.5">
    {slide.fileKey}.tsx
  </p>
</div>

// After:
<div className="px-3 py-2.5">
  <p className="text-sm font-medium text-neutral-800 truncate">
    {slide.title}
  </p>
  <div className="flex items-center gap-1.5 mt-0.5">
    <p className="text-xs text-neutral-400">
      {slide.fileKey}.tsx
    </p>
    {slide.isExample && (
      <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
        Example
      </span>
    )}
  </div>
</div>
```

Also update the apply-design-system selection grid in `apps/builder/routes/builder/index.tsx` (lines 163-193) with the same badge pattern.

### 5. Clear Examples API + Hook

**File:** `scripts/builder-server.ts`

New endpoint `POST /api/clear-examples` added before the 404 handler (before line 977). Performs direct file operations — no Claude subprocess needed since this is deterministic:

1. Delete all `.tsx` files in `src/deck/slides/`
2. Rewrite `config.ts` with empty loaders/config (preserving all function signatures)
3. Git commit the change

The endpoint writes a complete, valid `config.ts` with empty `slideLoaders` and `SLIDE_CONFIG_INTERNAL`, but preserves all function signatures so the app compiles with 0 slides.

**New file:** `src/builder/hooks/use-clear-examples.ts`

```typescript
import { useState, useCallback } from "react";

interface UseClearExamplesReturn {
  clearing: boolean;
  clearExamples: () => Promise<void>;
}

export function useClearExamples(): UseClearExamplesReturn {
  const [clearing, setClearing] = useState(false);

  const clearExamples = useCallback(async () => {
    setClearing(true);
    try {
      const resp = await fetch("/api/clear-examples", { method: "POST" });
      if (!resp.ok) throw new Error("Failed to clear examples");
      window.location.reload();
    } catch (err) {
      console.error("Failed to clear examples:", err);
      setClearing(false);
    }
  }, []);

  return { clearing, clearExamples };
}
```

`window.location.reload()` is intentional — Vite HMR can't re-evaluate module-level exports in `config.ts` when the entire file is rewritten. A full reload is the simplest reliable approach.

### 6. Wizard Completion: Post-Onboarding Options

**File:** `src/builder/components/design-system-wizard.tsx`

Modify the `complete` step (lines 795-824) to offer different paths depending on whether example slides exist:

```tsx
// Add imports at top
import { HAS_EXAMPLE_SLIDES } from "@/deck/config";
import { useClearExamples } from "../hooks/use-clear-examples";

// Inside DesignSystemWizard():
const { clearing, clearExamples } = useClearExamples();

const handleStartFresh = async () => {
  await clearExamples();
};

// Replace the complete step buttons (lines 809-823):
{step === "complete" && (
  <div className="space-y-6 mt-8 text-center">
    {/* existing checkmark + title + description */}
    <div className="flex gap-3 justify-center">
      <button
        onClick={() => navigate({ to: "/builder/designer" })}
        className="px-6 py-2.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
      >
        Preview Design System
      </button>
      {HAS_EXAMPLE_SLIDES ? (
        <>
          <button
            onClick={handleStartFresh}
            disabled={clearing}
            className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {clearing ? "Clearing..." : "Start Fresh"}
          </button>
          <button
            onClick={() => navigate({ to: "/builder" })}
            className="px-6 py-2.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Keep Examples
          </button>
        </>
      ) : (
        <button
          onClick={() => navigate({ to: "/builder" })}
          className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Start Adding Slides
        </button>
      )}
    </div>
  </div>
)}
```

### 7. Deck Viewer: Handle Empty Deck

**File:** `src/routes/deck/$slide.tsx`

Add guard for when `TOTAL_SLIDES === 0`. The current redirect to slide 1 would render nothing useful:

```tsx
if (TOTAL_SLIDES === 0) {
  return (
    <div className="h-screen flex items-center justify-center bg-neutral-900 text-white">
      <p className="text-sm text-neutral-400">
        No slides yet. Open the builder to get started.
      </p>
    </div>
  );
}
```

**Files:** `src/routes/index.tsx` and `src/routes/deck/index.tsx`

These redirects assume at least 1 slide exists. Add a guard so they don't redirect to `/deck/1` when `TOTAL_SLIDES === 0`.

## Considerations

- **localStorage for onboarding state**: Doesn't survive across machines, but this is a dev-only tool running locally. If someone clones a fresh repo on a new machine, they'll see onboarding again — correct behavior.

- **`isExample` in config.ts**: Skills that create new slides (add-slide, remove-slide, reorder-slide) don't set `isExample`, so new slides default to `undefined` (falsy). No skill changes needed.

- **Clear examples is destructive**: Committed to git, recoverable via `git revert`. The UI confirms before clearing. The git status indicator in the header will show the commit.

- **`window.location.reload()` after clearing**: Vite HMR can handle individual file changes, but a full config.ts rewrite with all imports removed needs a fresh module evaluation. Reload is simplest.

- **No production impact**: `isExample`, `HAS_EXAMPLE_SLIDES`, onboarding gate, clear-examples API — all of this lives in builder-only code. The deployed deck is unaffected.

- **The empty config.ts template**: The clear-examples endpoint writes a complete, valid `config.ts` with all function signatures preserved. This ensures the deck viewer still compiles even with 0 slides.

## Tasks

### Phase 1: Data Model

- [x] Add `isExample?: boolean` to `SlideConfig` interface in `src/deck/config.ts`
- [x] Add `isExample: true` to all 18 entries in `SLIDE_CONFIG_INTERNAL`
- [x] Add `HAS_EXAMPLE_SLIDES` export to `src/deck/config.ts`

### Phase 2: Welcome Screen

- [x] Create `src/builder/components/welcome-screen.tsx` with onboarding state helpers + `WelcomeScreen` component
- [x] Wire into `apps/builder/routes/builder/index.tsx` — show welcome screen when not onboarded

### Phase 3: Example Badge + Grid Updates

- [x] Add "Example" badge to `src/builder/components/sortable-slide-card.tsx` (both render modes)
- [x] Add "Example" badge to apply-design-system selection grid in `apps/builder/routes/builder/index.tsx`
- [x] Add empty state to grid area when `SLIDE_CONFIG.length === 0`
- [x] Add "Clear Examples" button to header bar when `HAS_EXAMPLE_SLIDES`

### Phase 4: Clear Examples Backend

- [x] Add `POST /api/clear-examples` endpoint to `scripts/builder-server.ts`
- [x] Create `src/builder/hooks/use-clear-examples.ts` hook
- [x] Wire "Clear Examples" button with confirmation dialog in builder index

### Phase 5: Wizard Completion Integration

- [x] Modify wizard `complete` step in `design-system-wizard.tsx` — "Start Fresh" vs "Keep Examples"
- [x] Wire "Start Fresh" to clear-examples hook

### Phase 6: Edge Cases

- [x] Handle empty deck in `src/routes/deck/$slide.tsx`
- [x] Handle empty deck in deck redirects (`src/routes/index.tsx`, `src/routes/deck/index.tsx`)
- [x] Verify `pnpm build` passes with empty config

---

*Ready for your review. Add any inline notes and I'll update the plan accordingly.*
