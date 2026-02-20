import { useState, useCallback, useRef } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";
import { SLIDE_CONFIG, loadSlideComponent } from "@/deck/config";
import { deckConfig } from "../../../deck.config";

const { width: W, height: H } = deckConfig.design;
const ANIMATION_SETTLE_MS = 1000;

interface PdfExportProgress {
  current: number;
  total: number;
}

interface PdfExportState {
  exportPdf: () => void;
  cancel: () => void;
  isExporting: boolean;
  progress: PdfExportProgress | null;
}

export function usePdfExport(): PdfExportState {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<PdfExportProgress | null>(null);
  const cancelledRef = useRef(false);

  const exportPdf = useCallback(async () => {
    if (isExporting) return;

    setIsExporting(true);
    cancelledRef.current = false;

    const host = document.createElement("div");
    host.style.cssText = "position:fixed;left:-9999px;top:0;pointer-events:none";
    document.body.appendChild(host);

    const total = SLIDE_CONFIG.length;
    const images: string[] = [];

    try {
      for (let i = 0; i < total; i++) {
        if (cancelledRef.current) return;

        setProgress({ current: i + 1, total });
        const slide = SLIDE_CONFIG[i];

        const container = document.createElement("div");
        container.style.cssText = `width:${W}px;height:${H}px;overflow:hidden`;
        host.appendChild(container);

        const Component = await loadSlideComponent(slide.fileKey);
        const root = createRoot(container);
        flushSync(() => root.render(<Component />));
        await new Promise((r) => setTimeout(r, ANIMATION_SETTLE_MS));

        if (cancelledRef.current) {
          root.unmount();
          container.remove();
          return;
        }

        const dataUrl = await toJpeg(container, {
          width: W,
          height: H,
          pixelRatio: 1,
          skipFonts: true,
          quality: 0.85,
        });

        images.push(dataUrl);
        root.unmount();
        container.remove();
      }

      if (cancelledRef.current) return;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [W, H],
        hotfixes: ["px_scaling"],
      });

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage([W, H], "landscape");
        pdf.addImage(images[i], "JPEG", 0, 0, W, H);
      }

      const title = deckConfig.title || "presentation";
      const safeName = title.replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "deck";
      pdf.save(`${safeName}.pdf`);
    } finally {
      host.remove();
      setIsExporting(false);
      setProgress(null);
    }
  }, [isExporting]);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
  }, []);

  return { exportPdf, cancel, isExporting, progress };
}
