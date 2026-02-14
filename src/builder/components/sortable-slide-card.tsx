import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { SlideConfig } from "@/deck/config";
import { SlideThumb } from "./slide-thumb";

interface SortableSlideCardProps {
  slide: SlideConfig;
  index: number;
  managementMode: boolean;
  isPending: boolean;
  isLocked: boolean;
  onDelete: (fileKey: string) => void;
}

export function SortableSlideCard({
  slide,
  index,
  managementMode,
  isPending,
  isLocked,
  onDelete,
}: SortableSlideCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: slide.fileKey,
    disabled: !managementMode || isLocked,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const displayNumber = String(index + 1).padStart(2, "0");

  if (!managementMode) {
    return (
      <Link
        to="/builder/$fileKey"
        params={{ fileKey: slide.fileKey }}
        className="group block border border-neutral-200 rounded-lg bg-white hover:border-neutral-400 hover:shadow-sm transition-all overflow-hidden"
      >
        <SlideThumb fileKey={slide.fileKey} />
        <div className="px-3 py-2.5">
          <p className="text-sm font-medium text-neutral-800 truncate">
            {slide.title}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="text-xs text-neutral-400">
              {slide.fileKey}.tsx
            </p>
            {slide.isExample && (
              <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
                Example
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative border rounded-lg bg-white transition-all",
        isDragging
          ? "border-orange-500 shadow-lg opacity-80 z-10"
          : "border-neutral-200",
        isPending && "opacity-60",
        isLocked && "pointer-events-none opacity-50"
      )}
    >
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg z-20">
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
            Moving...
          </span>
        </div>
      )}

      <div className="relative">
        <SlideThumb fileKey={slide.fileKey} />
        <div
          {...attributes}
          {...listeners}
          className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing rounded-tl-lg hover:bg-neutral-200/50 transition-colors z-10"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-neutral-400">
            <circle cx="4" cy="2" r="1" fill="currentColor" />
            <circle cx="8" cy="2" r="1" fill="currentColor" />
            <circle cx="4" cy="6" r="1" fill="currentColor" />
            <circle cx="8" cy="6" r="1" fill="currentColor" />
            <circle cx="4" cy="10" r="1" fill="currentColor" />
            <circle cx="8" cy="10" r="1" fill="currentColor" />
          </svg>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(slide.fileKey);
          }}
          disabled={isLocked}
          className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded bg-white/80 border border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-300 hover:bg-red-50 transition-colors z-10"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 2l6 6M8 2l-6 6" />
          </svg>
        </button>
      </div>

      <div className="px-3 py-2.5">
        <p className="text-sm font-medium text-neutral-800 truncate">
          {slide.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-xs text-neutral-400">
            {slide.fileKey}.tsx
          </p>
          {slide.isExample && (
            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
              Example
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
