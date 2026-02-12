import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { AssistantContent } from "./assistant-content";
import type { ChatMessage } from "../types";

interface DeckChatThreadProps {
  messages: ChatMessage[];
  isGenerating: boolean;
  onSend: (text: string) => void;
  onClear: () => void;
}

function isLastAssistant(messages: ChatMessage[], idx: number, isGenerating: boolean): boolean {
  for (let j = idx + 1; j < messages.length; j++) {
    if (messages[j].role === "user") return false;
  }
  return !isGenerating;
}

export function DeckChatThread({
  messages,
  isGenerating,
  onSend,
  onClear,
}: DeckChatThreadProps) {
  const [input, setInput] = useState("");
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

  const submitInput = useCallback(() => {
    const text = input.trim();
    if (!text || isGenerating) return;
    setInput("");
    onSend(text);
  }, [input, isGenerating, onSend]);

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
          Deck Chat
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
            Reorder, add, or manage slides...
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

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-neutral-200 bg-neutral-50 p-2 focus-within:border-neutral-400 transition-colors"
      >
        <textarea
          ref={textareaRef}
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isGenerating ? "Processing..." : "e.g. Move slide 5 to position 2"}
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
