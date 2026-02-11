import { useState, useCallback, useEffect, useRef } from "react";

interface UseResizableOptions {
  defaultWidth: number;
  minWidth: number;
  maxWidthPercent: number;
  storageKey: string;
}

interface UseResizableReturn {
  width: number;
  isResizing: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
}

function readStoredWidth(key: string, fallback: number): number {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!Number.isNaN(parsed) && parsed > 0) return parsed;
    }
  } catch {
    // localStorage unavailable
  }
  return fallback;
}

export function useResizable({
  defaultWidth,
  minWidth,
  maxWidthPercent,
  storageKey,
}: UseResizableOptions): UseResizableReturn {
  const [width, setWidth] = useState(() =>
    readStoredWidth(storageKey, defaultWidth)
  );
  const [isResizing, setIsResizing] = useState(false);
  const startRef = useRef({ x: 0, width: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startRef.current = { x: e.clientX, width };
      setIsResizing(true);
    },
    [width]
  );

  useEffect(() => {
    if (!isResizing) return;

    const onMouseMove = (e: MouseEvent) => {
      const maxWidth = window.innerWidth * maxWidthPercent;
      const delta = startRef.current.x - e.clientX;
      const next = Math.round(
        Math.max(minWidth, Math.min(maxWidth, startRef.current.width + delta))
      );
      setWidth(next);
    };

    const onMouseUp = () => {
      setIsResizing(false);
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizing, minWidth, maxWidthPercent]);

  useEffect(() => {
    if (isResizing) return;
    try {
      localStorage.setItem(storageKey, String(width));
    } catch {
      // localStorage unavailable
    }
  }, [width, isResizing, storageKey]);

  return { width, isResizing, handleMouseDown };
}
