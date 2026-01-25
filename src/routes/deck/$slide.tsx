import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { DeckLayout } from "@/core";
import { getSlideComponent, preloadSlide, SLIDES_NAV, TOTAL_SLIDES } from "@/deck/config";

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
    </DeckLayout>
  );
}
