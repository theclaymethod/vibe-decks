import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { AssistantContent } from "./assistant-content";
import type { ChatMessage, GrabbedContext } from "../types";

interface PendingImage {
  file: File;
  preview: string;
}

interface ChatThreadProps {
  messages: ChatMessage[];
  isGenerating: boolean;
  onSend: (text: string) => void;
  onSendWithImage?: (text: string, file: File) => void;
  onClear: () => void;
  grabbedContext?: GrabbedContext | null;
  onDismissContext?: () => void;
}

function GrabbedContextChip({
  context,
  onDismiss,
}: {
  context: GrabbedContext;
  onDismiss: () => void;
}) {
  const location = context.lineNumber
    ? `${context.filePath}:${context.lineNumber}`
    : context.filePath;

  return (
    <div className="mb-3 rounded-xl bg-neutral-50 border-2 border-neutral-300 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 shrink-0">
            Selected
          </span>
          <span className="text-sm font-semibold text-neutral-900 truncate">
            {context.componentName}
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="shrink-0 ml-2 w-6 h-6 flex items-center justify-center rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 2l8 8M10 2l-8 8" />
          </svg>
        </button>
      </div>
      {location && (
        <div className="px-4 py-1.5 text-xs font-mono text-neutral-600 truncate">
          {location}
        </div>
      )}
      {context.htmlFrame && (
        <pre className="px-4 py-2 text-xs font-mono text-neutral-500 leading-relaxed whitespace-pre-wrap overflow-hidden max-h-24 border-t border-neutral-200">
          {context.htmlFrame}
        </pre>
      )}
    </div>
  );
}

function isLastAssistant(messages: ChatMessage[], idx: number, isGenerating: boolean): boolean {
  for (let j = idx + 1; j < messages.length; j++) {
    if (messages[j].role === "user") return false;
  }
  return !isGenerating;
}

export function ChatThread({
  messages,
  isGenerating,
  onSend,
  onSendWithImage,
  onClear,
  grabbedContext,
  onDismissContext,
}: ChatThreadProps) {
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!grabbedContext || !onDismissContext) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismissContext();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [grabbedContext, onDismissContext]);

  const attachImage = useCallback((file: File) => {
    setPendingImage({ file, preview: URL.createObjectURL(file) });
  }, []);

  const submitInput = useCallback(() => {
    const text = input.trim();
    if (!text || isGenerating) return;
    setInput("");

    if (pendingImage && onSendWithImage) {
      const file = pendingImage.file;
      URL.revokeObjectURL(pendingImage.preview);
      setPendingImage(null);
      onSendWithImage(text, file);
    } else {
      onSend(text);
    }
  }, [input, isGenerating, onSend, onSendWithImage, pendingImage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitInput();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInput();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Chat
        </h3>
        {messages.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 mb-3 min-h-0"
      >
        {messages.length === 0 && (
          <div className="flex-1" />
        )}
        {messages.length === 0 && (
          <p className="text-sm text-neutral-400 px-1 pb-2">
            Ask anything about this slide...
          </p>
        )}
        {messages.map((msg, idx) =>
          msg.role === "user" ? (
            <div
              key={msg.id}
              className="text-sm leading-relaxed rounded-lg px-3 py-2 max-w-[90%] ml-auto bg-neutral-900 text-white whitespace-pre-wrap"
            >
              {msg.text}
            </div>
          ) : (
            <div
              key={msg.id}
              className="text-sm leading-relaxed px-1 max-w-[95%] mr-auto text-neutral-700"
            >
              <AssistantContent
                text={msg.text}
                isStreaming={msg.status === "streaming"}
                isActionable={isLastAssistant(messages, idx, isGenerating)}
                onSelectOption={(label) => {
                  if (!isGenerating) onSend(label);
                }}
              />
            </div>
          )
        )}
      </div>

      {grabbedContext && onDismissContext && (
        <GrabbedContextChip context={grabbedContext} onDismiss={onDismissContext} />
      )}

      {pendingImage && (
        <div className="mb-2 rounded-xl bg-neutral-50 border-2 border-neutral-300 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={pendingImage.preview}
                alt=""
                className="w-8 h-8 rounded object-cover shrink-0"
              />
              <span className="text-xs font-medium text-neutral-800 truncate">
                {pendingImage.file.name}
              </span>
            </div>
            <button
              onClick={() => {
                URL.revokeObjectURL(pendingImage.preview);
                setPendingImage(null);
              }}
              className="shrink-0 ml-2 w-6 h-6 flex items-center justify-center rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 2l8 8M10 2l-8 8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-neutral-200 bg-neutral-50 p-2 focus-within:border-neutral-400 transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("image/"));
          if (file) attachImage(file);
        }}
      >
        <textarea
          ref={textareaRef}
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={(e) => {
            const file = Array.from(e.clipboardData.files).find((f) => f.type.startsWith("image/"));
            if (file) attachImage(file);
          }}
          placeholder={isGenerating ? "Generating..." : "Enter to send · Shift+Enter for newline"}
          disabled={isGenerating}
          className="w-full bg-transparent text-sm outline-none disabled:opacity-50 resize-none placeholder:text-neutral-400"
        />
        <div className="flex justify-end mt-1">
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className={cn(
              "w-7 h-7 flex items-center justify-center rounded-lg transition-colors",
              input.trim() && !isGenerating
                ? "bg-neutral-900 text-white hover:bg-neutral-800"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
