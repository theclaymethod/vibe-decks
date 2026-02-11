import { useEffect, useRef, useState, useCallback } from "react";
import type { GrabbedContext } from "../types";

interface UseGrabOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  enabled: boolean;
}

const COMPONENT_LINE_RE = /^\s*in\s+(\S+)\s+\(at\s+(.+?)(?::(\d+)(?::(\d+))?)?\)/;

function parseGrabContent(raw: string): GrabbedContext {
  const lines = raw.split("\n");
  const htmlLines: string[] = [];
  let componentName = "";
  let filePath = "";
  let lineNumber: number | null = null;
  let columnNumber: number | null = null;

  for (const line of lines) {
    const match = line.match(COMPONENT_LINE_RE);
    if (match) {
      if (!componentName) {
        componentName = match[1];
        filePath = match[2];
        lineNumber = match[3] ? parseInt(match[3], 10) : null;
        columnNumber = match[4] ? parseInt(match[4], 10) : null;
      }
    } else {
      htmlLines.push(line);
    }
  }

  return {
    componentName: componentName || "Unknown",
    filePath,
    lineNumber,
    columnNumber,
    htmlFrame: htmlLines.join("\n").trim(),
    rawContent: raw,
  };
}

export function useGrab({ containerRef, enabled }: UseGrabOptions): {
  grabbedContext: GrabbedContext | null;
  clearContext: () => void;
} {
  const [grabbedContext, setGrabbedContext] = useState<GrabbedContext | null>(null);
  const apiRef = useRef<{ dispose: () => void } | null>(null);

  const clearContext = useCallback(() => setGrabbedContext(null), []);

  useEffect(() => {
    if (!enabled) {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
      return;
    }

    let disposed = false;

    import("react-grab/core").then(({ init }) => {
      if (disposed) return;

      const api = init({ enabled: true });
      apiRef.current = api;

      api.registerPlugin({
        name: "builder-grab",
        hooks: {
          onCopySuccess: (_elements: Element[], content: string) => {
            const parsed = parseGrabContent(content);
            setGrabbedContext(parsed);
          },
        },
      });
    });

    return () => {
      disposed = true;
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [enabled]);

  return { grabbedContext, clearContext };
}
