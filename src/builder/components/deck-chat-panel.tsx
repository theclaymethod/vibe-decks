import { cn } from "@/lib/utils";
import { useResizable } from "../hooks/use-resizable";
import { DeckChatThread } from "./deck-chat-thread";
import type { ChatMessage, GenerationStatus } from "../types";

const STATUS_LABELS: Record<GenerationStatus, string> = {
  idle: "Ready",
  generating: "Working...",
  complete: "Complete",
  error: "Error",
};

interface DeckChatPanelProps {
  messages: ChatMessage[];
  status: GenerationStatus;
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
}

export function DeckChatPanel({
  messages,
  status,
  onSendMessage,
  onClearHistory,
}: DeckChatPanelProps) {
  const { width, isResizing, handleMouseDown } = useResizable({
    defaultWidth: 320,
    minWidth: 280,
    maxWidthPercent: 0.45,
    storageKey: "deck-panel-width",
  });

  return (
    <div
      className="border-l border-neutral-200 bg-white flex flex-col p-4 relative shrink-0 h-screen sticky top-0"
      style={{ width }}
    >
      <div
        onMouseDown={handleMouseDown}
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 cursor-col-resize z-10 group",
          isResizing ? "bg-orange-500" : "hover:bg-neutral-300"
        )}
      />

      <DeckChatThread
        messages={messages}
        isGenerating={status === "generating"}
        onSend={onSendMessage}
        onClear={onClearHistory}
      />

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            status === "idle" && "bg-neutral-300",
            status === "generating" && "bg-orange-500 animate-pulse",
            status === "complete" && "bg-green-500",
            status === "error" && "bg-red-500"
          )}
        />
        <span className="text-xs text-neutral-500">
          {STATUS_LABELS[status]}
        </span>
      </div>
    </div>
  );
}
