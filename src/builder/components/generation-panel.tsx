import { useState } from "react";
import { cn } from "@/lib/utils";
import type { GenerationStatus } from "../types";

interface GenerationPanelProps {
  generatedPrompt: string;
  status: GenerationStatus;
  error: string | null;
  onGenerate: (prompt: string, imageDataUrl?: string) => void;
  onCancel: () => void;
  captureImage?: () => string | undefined;
}

const STATUS_LABELS: Record<GenerationStatus, string> = {
  idle: "Ready",
  generating: "Generating...",
  complete: "Complete",
  error: "Error",
};

export function GenerationPanel({
  generatedPrompt,
  status,
  error,
  onGenerate,
  onCancel,
  captureImage,
}: GenerationPanelProps) {
  const [promptExpanded, setPromptExpanded] = useState(false);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Generation
      </h3>

      <div>
        <button
          onClick={() => setPromptExpanded((p) => !p)}
          className="text-xs text-neutral-500 hover:text-neutral-700 flex items-center gap-1"
        >
          <span className="text-[10px]">{promptExpanded ? "▼" : "▶"}</span>
          Generated Prompt
        </button>
        {promptExpanded && (
          <pre className="mt-1 p-2 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
            {generatedPrompt || "(empty — add boxes and fill in prompts)"}
          </pre>
        )}
      </div>

      <div className="flex gap-2">
        {status === "generating" ? (
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-3 rounded text-xs font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
          >
            Cancel
          </button>
        ) : (
          <button
            onClick={() => onGenerate(generatedPrompt, captureImage?.())}
            disabled={!generatedPrompt.trim()}
            className={cn(
              "flex-1 py-2 px-3 rounded text-xs font-medium transition-colors",
              generatedPrompt.trim()
                ? "bg-neutral-900 text-white hover:bg-neutral-800"
                : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            )}
          >
            Generate Slide
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            status === "idle" && "bg-neutral-300",
            status === "generating" && "bg-amber-400 animate-pulse",
            status === "complete" && "bg-green-500",
            status === "error" && "bg-red-500"
          )}
        />
        <span className="text-xs text-neutral-500">
          {STATUS_LABELS[status]}
        </span>
      </div>

      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
