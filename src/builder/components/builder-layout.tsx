import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type Konva from "konva";
import { SLIDE_CONFIG, TOTAL_SLIDES } from "@/deck/config";
import { useCanvasBoxes } from "../hooks/use-canvas-boxes";
import { usePromptGenerator } from "../hooks/use-prompt-generator";
import { useGeneration } from "../hooks/use-generation";
import { useEditSession } from "../hooks/use-edit-session";
import { useGrab } from "../hooks/use-grab";
import { useResizable } from "../hooks/use-resizable";
import { useAssets } from "../hooks/use-assets";
import { captureStageAsDataUrl } from "../canvas-capture";
import { Canvas } from "./canvas";
import { BoxProperties } from "./box-properties";
import { PromptPanel } from "./prompt-panel";
import { GenerationPanel } from "./generation-panel";
import { GenerationOutput } from "./generation-output";
import { SlidePreview } from "./slide-preview";
import { EditSidebar } from "./edit-sidebar";

interface BuilderLayoutProps {
  fileKey: string;
}

function resolveEditInfo(fileKey: string) {
  const index = SLIDE_CONFIG.findIndex((s) => s.fileKey === fileKey);
  if (index !== -1) {
    const slide = SLIDE_CONFIG[index];
    return {
      slideNumber: index + 1,
      fileKey: slide.fileKey,
      filePath: `src/deck/slides/${slide.fileKey}.tsx`,
      title: slide.title,
    };
  }
  const slideNumber = parseInt(fileKey.slice(0, 2), 10) || 0;
  return {
    slideNumber,
    fileKey,
    filePath: `src/deck/slides/${fileKey}.tsx`,
    title: fileKey,
  };
}

export function BuilderLayout({ fileKey }: BuilderLayoutProps) {
  if (fileKey === "new") {
    return <CreateView />;
  }
  return <EditView fileKey={fileKey} />;
}

function CreateView() {
  const navigate = useNavigate();
  const stageRef = useRef<Konva.Stage>(null);
  const sidebar = useResizable({
    defaultWidth: 320,
    minWidth: 280,
    maxWidthPercent: 0.5,
    storageKey: "builder-create-sidebar-width",
  });

  const {
    boxes,
    selectedBoxId,
    selectedBox,
    addBox,
    selectBox,
    moveBox,
    resizeBox,
    updateBox,
    deleteBox,
  } = useCanvasBoxes();

  const [layoutPrompt, setLayoutPrompt] = useState("");
  const [contentPrompt, setContentPrompt] = useState("");
  const [templateHint, setTemplateHint] = useState("");
  const [slideName, setSlideName] = useState("");
  const [slidePosition, setSlidePosition] = useState(TOTAL_SLIDES + 1);
  const [slideMode, setSlideMode] = useState<"light" | "dark" | "cream">("light");

  const generatedPrompt = usePromptGenerator({
    boxes,
    layoutPrompt,
    contentPrompt,
    templateHint,
    slideName,
    slidePosition,
    mode: slideMode,
  });

  const generation = useGeneration();

  const renameBox = useCallback(
    (id: string, label: string) => updateBox(id, { label }),
    [updateBox]
  );

  const captureImage = useCallback(() => {
    if (boxes.length === 0) return undefined;
    return captureStageAsDataUrl(stageRef.current);
  }, [boxes]);

  useEffect(() => {
    if (generation.status !== "complete") return;

    const output = generation.output;
    const fileKeyMatch = output.match(/(\d{2}-[\w-]+)\.tsx/);
    if (fileKeyMatch) {
      navigate({
        to: "/builder/$fileKey",
        params: { fileKey: fileKeyMatch[1] },
      });
    }
  }, [generation.status, generation.output, navigate]);

  return (
    <div className="h-screen flex bg-neutral-50">
      <div className="flex-1 flex items-center justify-center p-4">
        {generation.status === "idle" ? (
          <Canvas
            boxes={boxes}
            selectedBoxId={selectedBoxId}
            onAddBox={addBox}
            onSelectBox={selectBox}
            onMoveBox={moveBox}
            onResizeBox={resizeBox}
            onRenameBox={renameBox}
            onDeleteBox={deleteBox}
            stageRef={stageRef}
          />
        ) : (
          <GenerationOutput
            output={generation.output}
            status={generation.status}
          />
        )}
      </div>

      <div
        className="border-l border-neutral-200 bg-white overflow-y-auto p-4 space-y-6 relative"
        style={{ width: sidebar.width }}
      >
        <div
          onMouseDown={sidebar.handleMouseDown}
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1 cursor-col-resize z-10",
            sidebar.isResizing ? "bg-orange-500" : "hover:bg-neutral-300"
          )}
        />
        {selectedBox && (
          <>
            <BoxProperties
              box={selectedBox}
              onUpdate={updateBox}
              onDelete={deleteBox}
            />
            <hr className="border-neutral-100" />
          </>
        )}

        <PromptPanel
          layoutPrompt={layoutPrompt}
          contentPrompt={contentPrompt}
          templateHint={templateHint}
          slideName={slideName}
          slidePosition={slidePosition}
          mode={slideMode}
          onLayoutPromptChange={setLayoutPrompt}
          onContentPromptChange={setContentPrompt}
          onTemplateHintChange={setTemplateHint}
          onSlideNameChange={setSlideName}
          onSlidePositionChange={setSlidePosition}
          onModeChange={setSlideMode}
        />

        <hr className="border-neutral-100" />

        <GenerationPanel
          generatedPrompt={generatedPrompt}
          status={generation.status}
          error={generation.error}
          onGenerate={generation.generate}
          onCancel={generation.cancel}
          captureImage={captureImage}
        />
      </div>
    </div>
  );
}

function EditView({ fileKey }: { fileKey: string }) {
  const editSlide = useMemo(() => resolveEditInfo(fileKey), [fileKey]);

  const sidebar = useResizable({
    defaultWidth: 320,
    minWidth: 280,
    maxWidthPercent: 0.5,
    storageKey: "builder-edit-sidebar-width",
  });

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const { grabbedContext, clearContext } = useGrab({
    containerRef: previewContainerRef,
    enabled: true,
  });

  const { upload: uploadAsset } = useAssets();

  const generation = useGeneration();
  const { edit: editSlideViaChat } = generation;

  const editSession = useEditSession(editSlide.fileKey);
  const {
    messages: editMessages,
    sessionId: editSessionId,
    addUserMessage,
    addAssistantMessage,
    updateMessage,
    setSessionId,
    clearHistory,
  } = editSession;

  const activeAssistantMsgId = useRef<string | null>(null);
  const sessionIdRef = useRef(editSessionId);
  sessionIdRef.current = editSessionId;

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

      editSlideViaChat(
        prompt,
        editSlide.filePath,
        sessionIdRef.current,
        (sid) => {
          setSessionId(sid);
        }
      );
    },
    [editSlide, addUserMessage, addAssistantMessage, setSessionId, editSlideViaChat, grabbedContext, clearContext]
  );

  const handleSendWithImage = useCallback(
    async (text: string, file: File) => {
      try {
        const asset = await uploadAsset(file);
        const prompt = `[Uploaded Image: ${asset.path}]\n\n${text}`;
        handleSendMessage(prompt);
      } catch {
        handleSendMessage(text);
      }
    },
    [uploadAsset, handleSendMessage]
  );

  return (
    <div className="h-screen flex bg-neutral-50">
      <SlidePreview
        fileKey={editSlide.fileKey}
        slideNumber={editSlide.slideNumber}
        containerRef={previewContainerRef}
      />

      <EditSidebar
        selectedFileKey={editSlide.fileKey}
        messages={editMessages}
        status={generation.status}
        onSendMessage={handleSendMessage}
        onSendWithImage={handleSendWithImage}
        onClearHistory={clearHistory}
        grabbedContext={grabbedContext}
        onDismissContext={clearContext}
        width={sidebar.width}
        isResizing={sidebar.isResizing}
        onResizeMouseDown={sidebar.handleMouseDown}
      />
    </div>
  );
}
