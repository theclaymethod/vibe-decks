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
}: EditSidebarProps) {
  return (
    <div className="w-80 border-l border-neutral-200 bg-white flex flex-col p-4">
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
