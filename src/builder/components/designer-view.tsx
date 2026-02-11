import { useCallback, useEffect, useRef, useState } from "react";
import { useGeneration } from "../hooks/use-generation";
import { useEditSession } from "../hooks/use-edit-session";
import { useGrab } from "../hooks/use-grab";
import { useResizable } from "../hooks/use-resizable";
import { EditSidebar } from "./edit-sidebar";
import { DesignerPreview } from "./designer-preview";
import { DesignBriefModal } from "./design-brief-modal";

const FILE_KEY = "design-system";

export function DesignerView() {
  const sidebar = useResizable({
    defaultWidth: 320,
    minWidth: 280,
    maxWidthPercent: 0.5,
    storageKey: "builder-designer-sidebar-width",
  });

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const { grabbedContext, clearContext } = useGrab({
    containerRef: previewContainerRef,
    enabled: true,
  });

  const [briefOpen, setBriefOpen] = useState(false);
  const [briefContent, setBriefContent] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3333/api/design-brief")
      .then((r) => r.json())
      .then((data: { content: string | null }) => setBriefContent(data.content))
      .catch(() => {});
  }, []);

  const generation = useGeneration();
  const { editDesignSystem } = generation;

  const editSession = useEditSession(FILE_KEY);
  const {
    messages,
    sessionId,
    addUserMessage,
    addAssistantMessage,
    updateMessage,
    setSessionId,
    clearHistory,
  } = editSession;

  const activeAssistantMsgId = useRef<string | null>(null);
  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  useEffect(() => {
    const msgId = activeAssistantMsgId.current;
    if (!msgId) return;

    if (generation.output) {
      updateMessage(msgId, { text: generation.output });
    }

    if (generation.status === "complete" || generation.status === "error") {
      updateMessage(msgId, {
        text: generation.output || "(no response)",
        status: generation.status === "error" ? "error" : "complete",
      });
      activeAssistantMsgId.current = null;
    }
  }, [generation.output, generation.status, updateMessage]);

  const handleSendMessage = useCallback(
    (text: string) => {
      let prompt = text;
      if (grabbedContext) {
        const loc = grabbedContext.lineNumber
          ? `${grabbedContext.filePath}:${grabbedContext.lineNumber}`
          : grabbedContext.filePath;
        addUserMessage(`[${grabbedContext.componentName} — ${loc}]\n${text}`);
        prompt = `[Selected Element]\nComponent: ${grabbedContext.componentName}\nFile: ${loc}\nHTML:\n${grabbedContext.htmlFrame}\n\n${text}`;
        clearContext();
      } else {
        addUserMessage(text);
      }

      const assistantMsg = addAssistantMessage(sessionIdRef.current ?? "");
      activeAssistantMsgId.current = assistantMsg.id;

      editDesignSystem(prompt, sessionIdRef.current, (sid) => {
        setSessionId(sid);
      });
    },
    [addUserMessage, addAssistantMessage, setSessionId, editDesignSystem, grabbedContext, clearContext]
  );

  return (
    <div className="h-screen flex bg-neutral-50">
      <DesignerPreview />

      <EditSidebar
        selectedFileKey={FILE_KEY}
        messages={messages}
        status={generation.status}
        onSendMessage={handleSendMessage}
        onClearHistory={clearHistory}
        grabbedContext={grabbedContext}
        onDismissContext={clearContext}
        width={sidebar.width}
        isResizing={sidebar.isResizing}
        onResizeMouseDown={sidebar.handleMouseDown}
        onOpenBrief={briefContent ? () => setBriefOpen(true) : undefined}
      />

      <DesignBriefModal
        open={briefOpen}
        content={briefContent}
        onClose={() => setBriefOpen(false)}
      />
    </div>
  );
}
