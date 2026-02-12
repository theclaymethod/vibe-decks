import { cn } from "@/lib/utils";
import { SLIDE_CONFIG } from "@/deck/config";
import type { useApplyDesignSystem } from "../hooks/use-apply-design-system";

type ApplyHook = ReturnType<typeof useApplyDesignSystem>;

interface ApplyOverlayProps {
  apply: ApplyHook;
}

function SelectingOverlay({ apply }: ApplyOverlayProps) {
  const allFileKeys = SLIDE_CONFIG.map((s) => s.fileKey);

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={apply.cancel} />
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-600">
            {apply.selectedSlides.size} of {allFileKeys.length} selected
          </span>
          <button
            onClick={() => apply.selectAll(allFileKeys)}
            className="text-xs text-neutral-500 hover:text-neutral-800 underline"
          >
            Select All
          </button>
          <button
            onClick={apply.deselectAll}
            className="text-xs text-neutral-500 hover:text-neutral-800 underline"
          >
            Deselect All
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={apply.cancel}
            className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900"
          >
            Cancel
          </button>
          <button
            onClick={apply.applyToSlides}
            disabled={apply.selectedSlides.size === 0}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              apply.selectedSlides.size > 0
                ? "bg-neutral-900 text-white hover:bg-neutral-800"
                : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            )}
          >
            Apply Design System
          </button>
        </div>
      </div>
    </>
  );
}

function ApplyingOverlay({ apply }: ApplyOverlayProps) {
  const total = apply.slideStatuses.size;
  const done = Array.from(apply.slideStatuses.values()).filter(
    (s) => s === "done" || s === "error"
  ).length;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" />
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-neutral-800">
            Applying design system... ({done}/{total})
          </span>
          <button
            onClick={apply.cancel}
            className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50"
          >
            Cancel
          </button>
        </div>
        <div className="flex gap-1.5">
          {Array.from(apply.slideStatuses.entries()).map(([fk, status]) => (
            <div
              key={fk}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                status === "pending" && "bg-neutral-200",
                status === "processing" && "bg-orange-500 animate-pulse",
                status === "done" && "bg-green-500",
                status === "error" && "bg-red-500"
              )}
              title={`${fk}: ${status}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function ReviewingOverlay({ apply }: ApplyOverlayProps) {
  const doneCount = Array.from(apply.slideStatuses.values()).filter(
    (s) => s === "done"
  ).length;
  const errorCount = Array.from(apply.slideStatuses.values()).filter(
    (s) => s === "error"
  ).length;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" />
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-800">
            <span className="font-medium">Complete.</span>{" "}
            {doneCount} updated{errorCount > 0 && `, ${errorCount} failed`}.
          </div>
          <button
            onClick={apply.finishReview}
            className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}

export function ApplyOverlay({ apply }: ApplyOverlayProps) {
  if (apply.phase === "selecting") return <SelectingOverlay apply={apply} />;
  if (apply.phase === "applying") return <ApplyingOverlay apply={apply} />;
  if (apply.phase === "reviewing") return <ReviewingOverlay apply={apply} />;
  return null;
}

export function SlideCardCheckbox({
  fileKey,
  checked,
  onToggle,
}: {
  fileKey: string;
  checked: boolean;
  onToggle: (fileKey: string) => void;
}) {
  return (
    <div
      className="absolute top-2 right-2 z-10"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(fileKey);
      }}
    >
      <div
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer",
          checked
            ? "bg-neutral-900 border-neutral-900"
            : "bg-white border-neutral-300 hover:border-neutral-500"
        )}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </div>
  );
}
