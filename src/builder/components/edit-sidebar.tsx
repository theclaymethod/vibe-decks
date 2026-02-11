import { cn } from "@/lib/utils";
import type { GenerationStatus, ChatMessage, GrabbedContext } from "../types";
import { SlidePicker } from "./slide-picker";
import { ChatThread } from "./chat-thread";

interface EditSidebarProps {
  selectedFileKey: string;
  messages: ChatMessage[];
  status: GenerationStatus;
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
  grabbedContext?: GrabbedContext | null;
  onDismissContext?: () => void;
  width: number;
  isResizing: boolean;
  onResizeMouseDown: (e: React.MouseEvent) => void;
}

const STATUS_LABELS: Record<GenerationStatus, string> = {
  idle: "Ready",
  generating: "Generating...",
  complete: "Complete",
  error: "Error",
};

export function EditSidebar({
  selectedFileKey,
  messages,
  status,
  onSendMessage,
  onClearHistory,
  grabbedContext,
  onDismissContext,
  width,
  isResizing,
  onResizeMouseDown,
}: EditSidebarProps) {
  return (
    <div
      className="border-l border-neutral-200 bg-white flex flex-col p-4 relative"
      style={{ width }}
    >
      <div
        onMouseDown={onResizeMouseDown}
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 cursor-col-resize z-10 group",
          isResizing ? "bg-indigo-400" : "hover:bg-neutral-300"
        )}
      />
      <SlidePicker selectedFileKey={selectedFileKey} />

      <hr className="border-neutral-100 my-4" />

      <ChatThread
        messages={messages}
        isGenerating={status === "generating"}
        onSend={onSendMessage}
        onClear={onClearHistory}
        grabbedContext={grabbedContext}
        onDismissContext={onDismissContext}
      />

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
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
    </div>
  );
}
