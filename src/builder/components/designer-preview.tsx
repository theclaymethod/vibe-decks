import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { deckConfig } from "../../../deck.config";
import { PreviewErrorBoundary } from "./preview-error-boundary";

const DESIGN_WIDTH = deckConfig.design.width;

export function DesignerPreview() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);
  const [version, setVersion] = useState(0);
  const [Showcase, setShowcase] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import("@/design-system/showcase").then((m) => {
      setShowcase(() => m.DesignSystemShowcase);
    });
  }, []);

  useEffect(() => {
    if (!import.meta.hot) return;

    const handler = (payload: { updates: Array<{ path: string }> }) => {
      const changed = payload.updates.some((u) => u.path.includes("design-system"));
      if (!changed) return;

      import("@/design-system/showcase").then((m) => {
        setShowcase(() => m.DesignSystemShowcase);
        setVersion((v) => v + 1);
      });
    };

    import.meta.hot.on("vite:afterUpdate", handler);
    return () => {
      import.meta.hot?.off("vite:afterUpdate", handler);
    };
  }, []);

  const updateScale = useCallback(() => {
    if (!wrapperRef.current) return;
    const padding = 32;
    const availableWidth = wrapperRef.current.clientWidth - padding;
    setScale(availableWidth / DESIGN_WIDTH);
  }, []);

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(wrapperRef.current);
    return () => resizeObserver.disconnect();
  }, [updateScale]);

  useLayoutEffect(() => {
    if (!contentRef.current || !scale) return;

    const updateHeight = () => {
      const contentHeight = contentRef.current?.scrollHeight ?? 0;
      setScaledHeight(contentHeight * scale);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [scale, version, Showcase]);

  return (
    <div className="flex-1 overflow-y-auto p-4" ref={wrapperRef}>
      {scale && Showcase && (
        <PreviewErrorBoundary resetKey={version}>
          <div style={{ height: scaledHeight, position: "relative" }}>
            <div
              ref={contentRef}
              key={version}
              style={{
                width: DESIGN_WIDTH,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <Showcase />
            </div>
          </div>
        </PreviewErrorBoundary>
      )}
    </div>
  );
}
