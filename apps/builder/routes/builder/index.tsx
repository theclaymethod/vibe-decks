import { useState, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { SLIDE_CONFIG } from "@/deck/config";
import { useApplyDesignSystem } from "@/builder/hooks/use-apply-design-system";
import { useDeckChat } from "@/builder/hooks/use-deck-chat";
import { useDeckOperations } from "@/builder/hooks/use-deck-operations";
import { ApplyOverlay, SlideCardCheckbox } from "@/builder/components/apply-overlay";
import { DeckChatPanel } from "@/builder/components/deck-chat-panel";
import { SortableSlideGrid } from "@/builder/components/sortable-slide-grid";
import { SlideThumb } from "@/builder/components/slide-thumb";
import { ThumbnailProvider } from "@/builder/hooks/use-thumbnail-cache";
import { GitStatusIndicator } from "@/builder/components/git-status-indicator";

const PANEL_STATE_KEY = "deck-panel-open";

function readPanelState(): boolean {
  try {
    return localStorage.getItem(PANEL_STATE_KEY) === "true";
  } catch {
    return false;
  }
}

function savePanelState(open: boolean): void {
  try {
    localStorage.setItem(PANEL_STATE_KEY, String(open));
  } catch {
    // localStorage unavailable
  }
}

export const Route = createFileRoute("/builder/")({
  component: BuilderIndex,
});

function BuilderIndex() {
  const apply = useApplyDesignSystem();
  const isSelecting = apply.phase === "selecting";
  const [panelOpen, setPanelOpen] = useState(readPanelState);
  const deckChat = useDeckChat();

  const togglePanel = useCallback(() => {
    setPanelOpen((prev) => {
      const next = !prev;
      savePanelState(next);
      return next;
    });
  }, []);

  const handleReorder = useCallback(
    (fromPos: number, toPos: number, slide: { title: string; fileKey: string }) => {
      deckChat.sendMessage(
        `Move slide ${String(fromPos).padStart(2, "0")}-${slide.fileKey.replace(/^\d+-/, "")} from position ${fromPos} to position ${toPos}. Execute immediately without asking for confirmation.`
      );
    },
    [deckChat]
  );

  const handleDelete = useCallback(
    (fileKey: string, title: string) => {
      deckChat.sendMessage(`Delete slide "${title}" (${fileKey})`);
    },
    [deckChat]
  );

  const deckOps = useDeckOperations(handleReorder, handleDelete);

  const managementMode = panelOpen && !isSelecting;

  const onGridReorder = useCallback(
    (activeFileKey: string, overFileKey: string) => {
      deckOps.handleReorder(activeFileKey, overFileKey, SLIDE_CONFIG);
    },
    [deckOps]
  );

  const onGridDelete = useCallback(
    (fileKey: string) => {
      deckOps.handleDelete(fileKey, SLIDE_CONFIG);
    },
    [deckOps]
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-200 bg-white shrink-0">
        <h1 className="text-sm font-semibold text-neutral-900">Slides</h1>
        <span className="text-xs text-neutral-300 tabular-nums">{SLIDE_CONFIG.length}</span>

        <div className="w-px h-4 bg-neutral-200 mx-1" />

        <button
          onClick={togglePanel}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors",
            panelOpen
              ? "bg-neutral-900 text-white hover:bg-neutral-800"
              : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
          )}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          {panelOpen ? "Close Manager" : "Manage Deck"}
        </button>

        <Link
          to="/builder/designer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
          Design System
        </Link>

        {apply.phase === "idle" && (
          <button
            onClick={apply.enterSelecting}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M4 8h8M8 4v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            Apply Design System
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <GitStatusIndicator />
          <Link
            to="/builder/create-design-system"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            New Design System
          </Link>
          <Link
            to="/builder/$fileKey"
            params={{ fileKey: "new" }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-md hover:bg-neutral-800 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            New Slide
          </Link>
        </div>
      </div>

      <ThumbnailProvider>
      <div className="flex flex-1 min-h-0">
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {isSelecting ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
              {SLIDE_CONFIG.map((slide, i) => (
                <div
                  key={slide.fileKey}
                  className="relative cursor-pointer"
                  onClick={() => apply.toggleSlide(slide.fileKey)}
                >
                  <SlideCardCheckbox
                    fileKey={slide.fileKey}
                    checked={apply.selectedSlides.has(slide.fileKey)}
                    onToggle={apply.toggleSlide}
                  />
                  <div
                    className={`block border rounded-lg bg-white transition-all overflow-hidden ${
                      apply.selectedSlides.has(slide.fileKey)
                        ? "border-neutral-900 ring-2 ring-neutral-900/20"
                        : "border-neutral-200 hover:border-neutral-400 hover:shadow-sm"
                    }`}
                  >
                    <SlideThumb fileKey={slide.fileKey} />
                    <div className="px-3 py-2.5">
                      <p className="text-sm font-medium text-neutral-800 truncate">
                        {slide.title}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {slide.fileKey}.tsx
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SortableSlideGrid
              managementMode={managementMode}
              isLocked={deckOps.isLocked}
              pendingFileKey={deckOps.pendingOperation?.fileKey ?? null}
              onReorder={onGridReorder}
              onDelete={onGridDelete}
            />
          )}
        </div>

        <ApplyOverlay apply={apply} />
      </div>

      {panelOpen && (
        <DeckChatPanel
          messages={deckChat.messages}
          status={deckChat.status}
          onSendMessage={deckChat.sendMessage}
          onClearHistory={deckChat.clearHistory}
        />
      )}
      </div>
      </ThumbnailProvider>
    </div>
  );
}
