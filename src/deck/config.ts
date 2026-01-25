import { type ComponentType, lazy } from "react";

export interface SlideConfig {
  id: string;
  title: string;
  shortTitle: string;
}

/**
 * Lazy loaders for slide components - components load on-demand
 * This prevents bundling all slides into the initial chunk
 */
const slideLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  "01-title": () =>
    import("./slides/01-title").then((m) => ({ default: m.Slide01Title })),
  "02-intro": () =>
    import("./slides/02-intro").then((m) => ({ default: m.Slide02Intro })),
  "03-problem": () =>
    import("./slides/03-problem").then((m) => ({ default: m.Slide03Problem })),
  "04-features": () =>
    import("./slides/04-features").then((m) => ({ default: m.Slide04Features })),
  "05-stats": () =>
    import("./slides/05-stats").then((m) => ({ default: m.Slide05Stats })),
  "06-timeline": () =>
    import("./slides/06-timeline").then((m) => ({ default: m.Slide06Timeline })),
  "07-comparison": () =>
    import("./slides/07-comparison").then((m) => ({ default: m.Slide07Comparison })),
  "08-quote": () =>
    import("./slides/08-quote").then((m) => ({ default: m.Slide08Quote })),
  "09-closing": () =>
    import("./slides/09-closing").then((m) => ({ default: m.Slide09Closing })),
  "10-fullscreen": () =>
    import("./slides/10-fullscreen").then((m) => ({ default: m.Slide10Fullscreen })),
  "11-gallery": () =>
    import("./slides/11-gallery").then((m) => ({ default: m.Slide11Gallery })),
  "12-mobile": () =>
    import("./slides/12-mobile").then((m) => ({ default: m.Slide12Mobile })),
  "13-browser": () =>
    import("./slides/13-browser").then((m) => ({ default: m.Slide13Browser })),
  "14-team": () =>
    import("./slides/14-team").then((m) => ({ default: m.Slide14Team })),
  "15-partners": () =>
    import("./slides/15-partners").then((m) => ({ default: m.Slide15Partners })),
  "16-process": () =>
    import("./slides/16-process").then((m) => ({ default: m.Slide16Process })),
  "17-showcase": () =>
    import("./slides/17-showcase").then((m) => ({ default: m.Slide17Showcase })),
};

// Cache for loaded components (bypasses lazy entirely once loaded)
const loadedComponentCache = new Map<string, ComponentType>();

// Cache for loading promises
const loadingPromiseCache = new Map<string, Promise<{ default: ComponentType }>>();

// Cache for lazy components (fallback for not-yet-loaded)
const lazyComponentCache = new Map<string, ComponentType>();

function startLoading(fileKey: string): Promise<{ default: ComponentType }> {
  const existing = loadingPromiseCache.get(fileKey);
  if (existing) return existing;

  const loader = slideLoaders[fileKey];
  if (!loader) {
    const resolved = Promise.resolve({
      default: (() => null) as ComponentType,
    });
    loadedComponentCache.set(fileKey, () => null);
    return resolved;
  }

  const promise = loader().then((result) => {
    loadedComponentCache.set(fileKey, result.default);
    return result;
  });

  loadingPromiseCache.set(fileKey, promise);
  return promise;
}

/**
 * Get component for a slide file key
 * Returns the actual component if already loaded, otherwise a lazy wrapper
 */
function getComponent(fileKey: string): ComponentType {
  // If already loaded, return directly (no Suspense needed)
  const loaded = loadedComponentCache.get(fileKey);
  if (loaded) return loaded;

  // Otherwise return lazy component
  const cachedLazy = lazyComponentCache.get(fileKey);
  if (cachedLazy) return cachedLazy;

  const LazyComponent = lazy(() => startLoading(fileKey));
  lazyComponentCache.set(fileKey, LazyComponent);
  return LazyComponent;
}

interface SlideConfigInternal extends SlideConfig {
  fileKey: string;
}

const SLIDE_CONFIG_INTERNAL: SlideConfigInternal[] = [
  { id: "title", fileKey: "01-title", title: "Title Slide", shortTitle: "Title" },
  { id: "intro", fileKey: "02-intro", title: "Introduction", shortTitle: "Intro" },
  { id: "problem", fileKey: "03-problem", title: "Before & After", shortTitle: "Problem" },
  { id: "features", fileKey: "04-features", title: "Key Features", shortTitle: "Features" },
  { id: "stats", fileKey: "05-stats", title: "Impact Metrics", shortTitle: "Stats" },
  { id: "timeline", fileKey: "06-timeline", title: "Project Timeline", shortTitle: "Timeline" },
  { id: "comparison", fileKey: "07-comparison", title: "Feature Matrix", shortTitle: "Compare" },
  { id: "quote", fileKey: "08-quote", title: "Testimonial", shortTitle: "Quote" },
  { id: "closing", fileKey: "09-closing", title: "Closing Number", shortTitle: "Close" },
  { id: "fullscreen", fileKey: "10-fullscreen", title: "Fullscreen Image", shortTitle: "Hero" },
  { id: "gallery", fileKey: "11-gallery", title: "Photo Gallery", shortTitle: "Gallery" },
  { id: "mobile", fileKey: "12-mobile", title: "Mobile Mockup", shortTitle: "Mobile" },
  { id: "browser", fileKey: "13-browser", title: "Browser Mockup", shortTitle: "Browser" },
  { id: "team", fileKey: "14-team", title: "Team Members", shortTitle: "Team" },
  { id: "partners", fileKey: "15-partners", title: "Tech Stack", shortTitle: "Stack" },
  { id: "process", fileKey: "16-process", title: "Process Cards", shortTitle: "Process" },
  { id: "showcase", fileKey: "17-showcase", title: "Three-Up Showcase", shortTitle: "Showcase" },
];

// Export public config without internal fileKey
export const SLIDE_CONFIG: SlideConfig[] = SLIDE_CONFIG_INTERNAL.map(
  ({ fileKey, ...rest }) => rest
);

export const TOTAL_SLIDES = SLIDE_CONFIG.length;

/**
 * Preload a slide's chunk by triggering the dynamic import
 * Call this to warm the cache before navigation
 */
export function preloadSlide(slideNumber: number): void {
  const index = slideNumber - 1;
  if (index >= 0 && index < SLIDE_CONFIG_INTERNAL.length) {
    const fileKey = SLIDE_CONFIG_INTERNAL[index].fileKey;
    startLoading(fileKey);
  }
}

/**
 * Get slide component by number (1-based index)
 * Returns the component directly if preloaded, or a lazy wrapper if not
 */
export function getSlideComponent(slideNumber: number): ComponentType {
  const index = slideNumber - 1;
  if (index >= 0 && index < SLIDE_CONFIG_INTERNAL.length) {
    return getComponent(SLIDE_CONFIG_INTERNAL[index].fileKey);
  }
  return getComponent(SLIDE_CONFIG_INTERNAL[0].fileKey);
}

export function getSlideConfig(slideNumber: number): SlideConfig | undefined {
  return SLIDE_CONFIG[slideNumber - 1];
}

export const SLIDES_NAV = SLIDE_CONFIG.map((slide, index) => ({
  number: index + 1,
  title: slide.title,
  shortTitle: slide.shortTitle,
}));
