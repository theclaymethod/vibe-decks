import { useRef, useState, useCallback } from "react";
import type { GenerationState } from "../types";

const SERVER_URL = "http://localhost:3333";

interface StreamCallbacks {
  onText: (text: string) => void;
  onSession?: (sessionId: string) => void;
  onDone: () => void;
  onError: (message: string) => void;
}

function shortPath(p: unknown): string {
  const s = String(p);
  const i = s.indexOf("src/");
  return i >= 0 ? s.slice(i) : s;
}

function formatAskUserQuestion(input: Record<string, unknown>): string {
  const questions = input.questions as Array<{
    question: string;
    options: Array<{ label: string; description?: string }>;
  }>;
  if (!Array.isArray(questions)) return "[Question]";

  const parts: string[] = [];
  for (const q of questions) {
    parts.push(`[Question] ${q.question}`);
    if (Array.isArray(q.options)) {
      for (const opt of q.options) {
        const desc = opt.description ? ` - ${opt.description}` : "";
        parts.push(`[Option] ${opt.label}${desc}`);
      }
    }
  }
  return parts.join("\n");
}

function formatToolUse(name: string, input: Record<string, unknown>): string {
  switch (name) {
    case "Read":
      return `[Read] ${shortPath(input.file_path)}`;
    case "Edit":
      return `[Edit] ${shortPath(input.file_path)}`;
    case "Write":
      return `[Write] ${shortPath(input.file_path)}`;
    case "Bash":
      return `[Bash] ${String(input.command).slice(0, 120)}`;
    case "Glob":
      return `[Glob] ${input.pattern}`;
    case "Grep":
      return `[Grep] ${input.pattern}`;
    case "AskUserQuestion":
      return formatAskUserQuestion(input);
    case "EnterPlanMode":
      return "[Plan] Preparing implementation plan...";
    default:
      return `[${name}]`;
  }
}

function formatToolResult(content: unknown): string {
  if (typeof content === "string") {
    const trimmed = content.trim();
    if (trimmed.length <= 200) return trimmed;
    return trimmed.slice(0, 200) + "...";
  }
  if (Array.isArray(content)) {
    const textBlocks = content.filter(
      (b: Record<string, unknown>) => b.type === "text"
    );
    if (textBlocks.length > 0) {
      const text = String(textBlocks[0].text).trim();
      if (text.length <= 200) return text;
      return text.slice(0, 200) + "...";
    }
  }
  return "";
}

async function readSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  callbacks: StreamCallbacks
): Promise<void> {
  const decoder = new TextDecoder();
  let buffer = "";
  const seenToolUseIds = new Set<string>();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6);

      try {
        const parsed = JSON.parse(data);

        if (parsed.type === "session" && parsed.sessionId) {
          callbacks.onSession?.(parsed.sessionId);
          continue;
        }

        if (parsed.type === "done") {
          callbacks.onDone();
          return;
        }

        if (parsed.type === "error") {
          callbacks.onError(parsed.message);
          return;
        }

        if (parsed.type === "assistant" && parsed.message?.content) {
          for (const block of parsed.message.content) {
            if (block.type === "text") {
              callbacks.onText(block.text);
            } else if (block.type === "tool_use") {
              if (block.id && seenToolUseIds.has(block.id)) continue;
              if (block.id) seenToolUseIds.add(block.id);
              callbacks.onText("\n" + formatToolUse(block.name, block.input) + "\n");
            }
          }
        }

        if (parsed.type === "tool" && parsed.content != null) {
          const summary = formatToolResult(parsed.content);
          if (summary && summary.length <= 300) {
            callbacks.onText(summary + "\n");
          }
        }

        if (parsed.type === "content_block_delta" && parsed.delta?.text) {
          callbacks.onText(parsed.delta.text);
        }

        if (parsed.type === "result") {
          callbacks.onDone();
          return;
        }
      } catch {
        // non-JSON line from SSE, skip
      }
    }
  }
}

export function useGeneration() {
  const [state, setState] = useState<GenerationState>({
    status: "idle",
    output: "",
    error: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const streamRequest = useCallback(
    async (
      url: string,
      body: Record<string, unknown>,
      onSession?: (sessionId: string) => void
    ) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState({ status: "generating", output: "", error: null });

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.text();
          setState({ status: "error", output: "", error: err });
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setState({ status: "error", output: "", error: "No response body" });
          return;
        }

        let fullOutput = "";

        await readSSEStream(reader, {
          onText: (text) => {
            fullOutput += text;
            setState((s) => ({ ...s, output: fullOutput }));
          },
          onSession,
          onDone: () => {
            setState((s) => ({ ...s, status: "complete" }));
          },
          onError: (message) => {
            setState((s) => ({ ...s, status: "error", error: message }));
          },
        });

        setState((s) => ({
          ...s,
          status: s.status === "generating" ? "complete" : s.status,
        }));
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setState({
          status: "error",
          output: "",
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    },
    []
  );

  const generate = useCallback(
    async (prompt: string, imageDataUrl?: string) => {
      await streamRequest(`${SERVER_URL}/api/generate`, {
        prompt,
        image: imageDataUrl,
      });
    },
    [streamRequest]
  );

  const edit = useCallback(
    async (
      prompt: string,
      filePath: string,
      sessionId: string | null,
      onSession: (sessionId: string) => void
    ) => {
      await streamRequest(
        `${SERVER_URL}/api/edit`,
        { prompt, filePath, sessionId },
        onSession
      );
    },
    [streamRequest]
  );

  const editDesignSystem = useCallback(
    async (
      prompt: string,
      sessionId: string | null,
      onSession: (sessionId: string) => void
    ) => {
      await streamRequest(
        `${SERVER_URL}/api/edit-design-system`,
        { prompt, sessionId },
        onSession
      );
    },
    [streamRequest]
  );

  const applyDesignSystem = useCallback(
    async (fileKey: string, onSession?: (sessionId: string) => void) => {
      await streamRequest(
        `${SERVER_URL}/api/apply-design-system`,
        { fileKey },
        onSession
      );
    },
    [streamRequest]
  );

  const createDesignSystem = useCallback(
    async (
      body: { description: string; urls?: string[]; images?: string[]; imagePaths?: string[]; planOnly?: boolean },
      onSession?: (sessionId: string) => void
    ) => {
      await streamRequest(
        `${SERVER_URL}/api/create-design-system`,
        body,
        onSession
      );
    },
    [streamRequest]
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setState((s) => ({
      ...s,
      status: s.status === "generating" ? "idle" : s.status,
    }));
  }, []);

  return { ...state, generate, edit, editDesignSystem, applyDesignSystem, createDesignSystem, cancel };
}
