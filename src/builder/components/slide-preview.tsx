import { Suspense } from "react";
import { SlideScaler } from "@/core/slide-scaler";
import { useSlidePreview } from "../hooks/use-slide-preview";
import { PreviewErrorBoundary } from "./preview-error-boundary";

interface SlidePreviewProps {
  fileKey: string;
  slideNumber: number;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function SlidePreview({ fileKey, slideNumber, containerRef }: SlidePreviewProps) {
  const { component: Component, version } = useSlidePreview(fileKey, slideNumber);

  if (!Component) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-400 text-sm">
        Select a slide to preview
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center text-neutral-400 text-sm">
          Loading slide...
        </div>
      }
    >
      <PreviewErrorBoundary resetKey={version}>
        <div ref={containerRef} className="flex-1 flex items-center justify-center overflow-hidden p-4">
          <SlideScaler key={version}>
            <Component />
          </SlideScaler>
        </div>
      </PreviewErrorBoundary>
    </Suspense>
  );
}
