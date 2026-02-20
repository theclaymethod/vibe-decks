import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type Konva from "konva";
import { SLIDE_CONFIG, TOTAL_SLIDES } from "@/deck/config";
import { AssetBrowser } from "./asset-browser";
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
import { GitStatusIndicator } from "./git-status-indicator";
import { usePdfExport } from "../hooks/use-pdf-export";

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
  const navigate = useNavigate();
  const editSlide = useMemo(() => resolveEditInfo(fileKey), [fileKey]);
  const [assetBrowserOpen, setAssetBrowserOpen] = useState(false);

  const slideIndex = useMemo(
    () => SLIDE_CONFIG.findIndex((s) => s.fileKey === fileKey),
    [fileKey]
  );
  const hasPrev = slideIndex > 0;
  const hasNext = slideIndex >= 0 && slideIndex < SLIDE_CONFIG.length - 1;

  const goToPrev = () => {
    if (hasPrev) {
      navigate({
        to: "/builder/$fileKey",
        params: { fileKey: SLIDE_CONFIG[slideIndex - 1].fileKey },
      });
    }
  };
  const goToNext = () => {
    if (hasNext) {
      navigate({
        to: "/builder/$fileKey",
        params: { fileKey: SLIDE_CONFIG[slideIndex + 1].fileKey },
      });
    }
  };

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
  const pdfExport = usePdfExport();

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
    <div className="h-screen flex flex-col bg-neutral-50">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-200 bg-white shrink-0">
        <Link
          to="/builder"
          className="flex items-center gap-1.5 px-2 py-1.5 -ml-1 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L2 8l4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.5 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-xs font-medium">All Slides</span>
        </Link>

        <div className="w-px h-4 bg-neutral-200" />

        <div className="flex items-center gap-0.5">
          <button
            onClick={goToPrev}
            disabled={!hasPrev}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-default rounded transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <select
            value={fileKey}
            onChange={(e) => {
              navigate({
                to: "/builder/$fileKey",
                params: { fileKey: e.target.value },
              });
            }}
            className="px-2 py-1 border border-neutral-200 rounded text-sm bg-white hover:border-neutral-300 focus:border-neutral-400 outline-none cursor-pointer"
          >
            {SLIDE_CONFIG.map((slide, i) => (
              <option key={slide.fileKey} value={slide.fileKey}>
                {String(i + 1).padStart(2, "0")} — {slide.title}
              </option>
            ))}
          </select>

          <button
            onClick={goToNext}
            disabled={!hasNext}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-default rounded transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <span className="text-xs text-neutral-300 tabular-nums">
          {slideIndex + 1}/{SLIDE_CONFIG.length}
        </span>

        <div className="ml-auto flex items-center gap-1">
          <GitStatusIndicator />
          <button
            onClick={pdfExport.isExporting ? pdfExport.cancel : pdfExport.exportPdf}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-colors",
              pdfExport.isExporting
                ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
            )}
          >
            {pdfExport.isExporting ? (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="animate-spin">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28 10" />
                </svg>
                <span className="text-xs font-medium tabular-nums">
                  {pdfExport.progress?.current}/{pdfExport.progress?.total}
                </span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 11v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs font-medium">PDF</span>
              </>
            )}
          </button>
          <button
            onClick={() => setAssetBrowserOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <circle cx="5.5" cy="6.5" r="1.25" stroke="currentColor" strokeWidth="1.1"/>
              <path d="M2 11l3.5-3 2.5 2 3-3.5L14 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium">Assets</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
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

      <AssetBrowser open={assetBrowserOpen} onClose={() => setAssetBrowserOpen(false)} />
    </div>
  );
}
