import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { DeckLayout } from "@/core";
import { getSlideComponent, preloadSlide, SLIDES_NAV, SLIDE_CONFIG, TOTAL_SLIDES } from "@/deck/config";

export const Route = createFileRoute("/deck/$slide")({
  component: SlideRoute,
  beforeLoad: ({ params }) => {
    const slideNum = parseInt(params.slide, 10);
    if (isNaN(slideNum) || slideNum < 1 || slideNum > TOTAL_SLIDES) {
      throw redirect({ to: "/deck/$slide", params: { slide: "1" } });
    }
  },
});

function SlideRoute() {
  const { slide } = Route.useParams();
  const currentSlide = parseInt(slide, 10);
  const SlideComponent = getSlideComponent(currentSlide);

  // Preload adjacent slides (runs during render, not after)
  preloadSlide(currentSlide - 1);
  preloadSlide(currentSlide + 1);
  preloadSlide(currentSlide + 2);
  preloadSlide(currentSlide + 3);

  const fileKey = SLIDE_CONFIG[currentSlide - 1]?.fileKey;

  return (
    <DeckLayout currentSlide={currentSlide} slides={SLIDES_NAV}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full w-full">
            <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
          </div>
        }
      >
        <SlideComponent />
      </Suspense>
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
    </DeckLayout>
  );
}
