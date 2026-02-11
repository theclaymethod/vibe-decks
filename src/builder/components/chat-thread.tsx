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
    <div className="mb-3 rounded-xl bg-blue-50 border-2 border-blue-300 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-blue-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-500 shrink-0">
            Selected
          </span>
          <span className="text-sm font-semibold text-blue-900 truncate">
            {context.componentName}
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="shrink-0 ml-2 w-6 h-6 flex items-center justify-center rounded-md text-blue-400 hover:text-blue-700 hover:bg-blue-200 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 2l8 8M10 2l-8 8" />
          </svg>
        </button>
      </div>
      {location && (
        <div className="px-4 py-1.5 text-xs font-mono text-blue-600 truncate">
          {location}
        </div>
      )}
      {context.htmlFrame && (
        <pre className="px-4 py-2 text-xs font-mono text-blue-700/80 leading-relaxed whitespace-pre-wrap overflow-hidden max-h-24 border-t border-blue-200">
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
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-neutral-600">Edit this slide</p>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed max-w-[200px]">
              Describe what you'd like to change, or grab an element from the preview.
            </p>
          </div>
        )}
        {messages.map((msg, idx) =>
          msg.role === "user" ? (
            <div
              key={msg.id}
              className="text-xs leading-relaxed rounded-lg px-3 py-2 max-w-[90%] ml-auto bg-neutral-900 text-white whitespace-pre-wrap"
            >
              {msg.text}
            </div>
          ) : (
            <div
              key={msg.id}
              className="text-xs leading-relaxed rounded-lg px-3 py-2 max-w-[95%] mr-auto bg-neutral-50 border border-neutral-200 text-neutral-700"
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
        <div className="mb-2 rounded-xl bg-emerald-50 border-2 border-emerald-300 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={pendingImage.preview}
                alt=""
                className="w-8 h-8 rounded object-cover shrink-0"
              />
              <span className="text-xs font-medium text-emerald-800 truncate">
                {pendingImage.file.name}
              </span>
            </div>
            <button
              onClick={() => {
                URL.revokeObjectURL(pendingImage.preview);
                setPendingImage(null);
              }}
              className="shrink-0 ml-2 w-6 h-6 flex items-center justify-center rounded-md text-emerald-400 hover:text-emerald-700 hover:bg-emerald-200 transition-colors"
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
        className="flex gap-2"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("image/"));
          if (file) attachImage(file);
        }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={(e) => {
            const file = Array.from(e.clipboardData.files).find((f) => f.type.startsWith("image/"));
            if (file) attachImage(file);
          }}
          placeholder={isGenerating ? "Generating..." : "Enter to send · Shift+Enter for newline"}
          disabled={isGenerating}
          className="flex-1 px-2 py-1.5 border border-neutral-200 rounded text-sm bg-white focus:border-neutral-400 outline-none disabled:opacity-50 resize-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className={cn(
            "px-3 py-1.5 rounded text-xs font-medium transition-colors self-end",
            input.trim() && !isGenerating
              ? "bg-neutral-900 text-white hover:bg-neutral-800"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
          )}
        >
          Send
        </button>
      </form>
    </div>
  );
}
