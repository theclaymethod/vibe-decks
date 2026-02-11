import { useRef, useState, useLayoutEffect, useCallback, useEffect } from "react";
import { Stage, Layer, Rect, Line, Text, Group, Transformer } from "react-konva";
import type Konva from "konva";
import { deckConfig } from "../../../deck.config";
import type { CanvasBox } from "../types";
import { MIN_BOX_WIDTH, MIN_BOX_HEIGHT } from "../types";

const { width: W, height: H } = deckConfig.design;

interface EditingState {
  boxId: string;
  screenX: number;
  screenY: number;
  screenWidth: number;
  screenHeight: number;
}

interface CanvasProps {
  boxes: CanvasBox[];
  selectedBoxId: string | null;
  onAddBox: (x: number, y: number) => void;
  onSelectBox: (id: string | null) => void;
  onMoveBox: (id: string, x: number, y: number) => void;
  onResizeBox: (id: string, width: number, height: number) => void;
  onRenameBox?: (id: string, label: string) => void;
  onDeleteBox?: (id: string) => void;
  stageRef?: React.RefObject<Konva.Stage | null>;
}

function KonvaBox({
  box,
  selected,
  editing,
  onSelect,
  onMove,
  onResize,
  onDblClick,
}: {
  box: CanvasBox;
  selected: boolean;
  editing: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onDblClick: (box: CanvasBox) => void;
}) {
  const groupRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!selected || !trRef.current || !groupRef.current) return;
    trRef.current.nodes([groupRef.current]);
    trRef.current.getLayer()?.batchDraw();
  }, [selected]);

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target;
      onMove(box.id, Math.round(node.x()), Math.round(node.y()));
    },
    [box.id, onMove]
  );

  const handleTransformEnd = useCallback(() => {
    const node = groupRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    const newWidth = Math.max(MIN_BOX_WIDTH, Math.round(box.width * scaleX));
    const newHeight = Math.max(MIN_BOX_HEIGHT, Math.round(box.height * scaleY));

    onMove(box.id, Math.round(node.x()), Math.round(node.y()));
    onResize(box.id, newWidth, newHeight);
  }, [box.id, box.width, box.height, onMove, onResize]);

  const dragBound = useCallback(
    (pos: { x: number; y: number }) => ({
      x: Math.max(0, Math.min(W - box.width, pos.x)),
      y: Math.max(0, Math.min(H - box.height, pos.y)),
    }),
    [box.width, box.height]
  );

  return (
    <>
      <Group
        ref={groupRef}
        x={box.x}
        y={box.y}
        draggable
        dragBoundFunc={dragBound}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onClick={() => onSelect(box.id)}
        onTap={() => onSelect(box.id)}
        onDblClick={() => onDblClick(box)}
        onDblTap={() => onDblClick(box)}
      >
        <Rect
          width={box.width}
          height={box.height}
          fill={box.color + "33"}
          stroke={selected ? "#3b82f6" : box.color + "80"}
          strokeWidth={selected ? 3 : 2}
          cornerRadius={6}
        />
        <Text
          text={box.label}
          width={box.width}
          height={box.height}
          align="center"
          verticalAlign="middle"
          fontSize={28}
          fontStyle="bold"
          fill={box.color}
          ellipsis
          wrap="none"
          padding={8}
          visible={!editing}
        />
        <Text
          text={box.type}
          x={box.width - 8}
          y={8}
          align="right"
          fontSize={18}
          fill={box.color}
          opacity={0.7}
          offsetX={0}
          ref={(node) => {
            if (node) node.offsetX(node.width());
          }}
        />
      </Group>

      {selected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          enabledAnchors={[
            "top-left",
            "top-center",
            "top-right",
            "middle-left",
            "middle-right",
            "bottom-left",
            "bottom-center",
            "bottom-right",
          ]}
          boundBoxFunc={(_oldBox, newBox) => ({
            ...newBox,
            width: Math.max(MIN_BOX_WIDTH, newBox.width),
            height: Math.max(MIN_BOX_HEIGHT, newBox.height),
          })}
          borderStroke="#3b82f6"
          anchorFill="#3b82f6"
          anchorStroke="#ffffff"
          anchorSize={10}
          anchorCornerRadius={2}
        />
      )}
    </>
  );
}

const GRID_FRACTIONS = [0.25, 0.5, 0.75];

export function Canvas({
  boxes,
  selectedBoxId,
  onAddBox,
  onSelectBox,
  onMoveBox,
  onResizeBox,
  onRenameBox,
  onDeleteBox,
  stageRef: externalStageRef,
}: CanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const internalStageRef = useRef<Konva.Stage>(null);
  const stageRef = externalStageRef ?? internalStageRef;
  const [scale, setScale] = useState<number | null>(null);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const parent = wrapperRef.current.parentElement;
    if (!parent) return;

    const calculate = () => {
      const padding = 32;
      const s = Math.min(
        (parent.clientWidth - padding) / W,
        (parent.clientHeight - padding) / H
      );
      setScale(s);
    };

    calculate();
    const ro = new ResizeObserver(calculate);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    if (!selectedBoxId || !onDeleteBox) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editing) return;
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        onDeleteBox(selectedBoxId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBoxId, editing, onDeleteBox]);

  const commitEdit = useCallback(
    (value: string) => {
      if (!editing || !onRenameBox) return;
      const trimmed = value.trim();
      if (trimmed) onRenameBox(editing.boxId, trimmed);
      setEditing(null);
    },
    [editing, onRenameBox]
  );

  const cancelEdit = useCallback(() => setEditing(null), []);

  const handleBoxDblClick = useCallback(
    (box: CanvasBox) => {
      if (!onRenameBox || !stageRef.current) return;
      const container = stageRef.current.container().getBoundingClientRect();
      const s = scale ?? 1;
      setEditing({
        boxId: box.id,
        screenX: container.left + box.x * s,
        screenY: container.top + box.y * s,
        screenWidth: box.width * s,
        screenHeight: box.height * s,
      });
    },
    [onRenameBox, scale, stageRef]
  );

  const isBackgroundHit = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const target = e.target;
    return target === target.getStage() || target.name() === "bg";
  }, []);

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (isBackgroundHit(e)) onSelectBox(null);
    },
    [onSelectBox, isBackgroundHit]
  );

  const handleStageDblClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isBackgroundHit(e)) return;
      const stage = e.target.getStage();
      if (!stage) return;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const x = Math.round(pointer.x / (scale ?? 1));
      const y = Math.round(pointer.y / (scale ?? 1));
      onAddBox(
        Math.max(0, Math.min(W - 300, x - 150)),
        Math.max(0, Math.min(H - 200, y - 100))
      );
    },
    [onAddBox, scale, isBackgroundHit]
  );

  const editingBox = editing ? boxes.find((b) => b.id === editing.boxId) : null;

  return (
    <div
      ref={wrapperRef}
      className="flex items-center justify-center h-full w-full"
    >
      {scale && (
        <>
          <Stage
            ref={stageRef}
            width={W * scale}
            height={H * scale}
            scaleX={scale}
            scaleY={scale}
            onClick={handleStageClick}
            onDblClick={handleStageDblClick}
          >
            <Layer>
              <Rect name="bg" width={W} height={H} fill="#ffffff" />

              {GRID_FRACTIONS.map((f) => (
                <Line
                  key={`v-${f}`}
                  points={[W * f, 0, W * f, H]}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                  dash={[8, 8]}
                />
              ))}
              {GRID_FRACTIONS.map((f) => (
                <Line
                  key={`h-${f}`}
                  points={[0, H * f, W, H * f]}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                  dash={[8, 8]}
                />
              ))}

              {boxes.length === 0 && (
                <Text
                  text="Double-click to add a box"
                  x={0}
                  y={H / 2 - 15}
                  width={W}
                  align="center"
                  fontSize={30}
                  fill="#d4d4d4"
                />
              )}

              {boxes.map((box) => (
                <KonvaBox
                  key={box.id}
                  box={box}
                  selected={box.id === selectedBoxId}
                  editing={editing?.boxId === box.id}
                  onSelect={onSelectBox}
                  onMove={onMoveBox}
                  onResize={onResizeBox}
                  onDblClick={handleBoxDblClick}
                />
              ))}
            </Layer>
          </Stage>

          {editing && editingBox && (
            <input
              ref={inputRef}
              defaultValue={editingBox.label}
              style={{
                position: "fixed",
                left: editing.screenX,
                top: editing.screenY,
                width: editing.screenWidth,
                height: editing.screenHeight,
                fontSize: 28 * (scale ?? 1),
                fontWeight: 700,
                color: editingBox.color,
                textAlign: "center",
                background: "transparent",
                border: "none",
                borderRadius: 0,
                outline: "none",
                zIndex: 10,
                padding: 0,
                caretColor: editingBox.color,
              }}
              onBlur={(e) => commitEdit(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitEdit(e.currentTarget.value);
                if (e.key === "Escape") cancelEdit();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
