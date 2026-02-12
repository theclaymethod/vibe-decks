import { useRef, useEffect } from "react";
import { AssistantContent } from "./assistant-content";
import type { GenerationStatus } from "../types";

interface GenerationOutputProps {
  output: string;
  status: GenerationStatus;
}

export function GenerationOutput({ output, status }: GenerationOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [output]);

  return (
    <div className="w-full h-full flex flex-col">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-6"
      >
        {output ? (
          <div className="text-xs leading-relaxed text-neutral-700">
            <AssistantContent
              text={output}
              isStreaming={status === "generating"}
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-sm">Starting generation...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
