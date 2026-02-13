"use client";

import { useCallback, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { ToolType } from "./toolbar";

interface CanvasProps {
  svgContent: string;
  selectedLayerId: string | null;
  activeTool: ToolType;
  zoom: number;
  onSelectLayer: (id: string | null) => void;
  onBucketFill: (elementId: string) => void;
  onEyedrop: (elementId: string) => void;
  onDragMove: (elementId: string, dx: number, dy: number) => void;
  onDragEnd: () => void;
}

const SHAPE_TAGS = new Set([
  "path",
  "rect",
  "circle",
  "ellipse",
  "polygon",
  "line",
]);

function findShapeElement(
  target: Element,
  container: HTMLElement | null
): Element | null {
  let el: Element | null = target;
  while (el && el !== container) {
    if (SHAPE_TAGS.has(el.tagName.toLowerCase()) && el.id) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

const TOOL_CURSORS: Record<string, string> = {
  select: "default",
  pan: "grab",
  brush: "crosshair",
  bucket: "crosshair",
  eyedropper: "crosshair",
  zoomIn: "zoom-in",
  zoomOut: "zoom-out",
};

export function Canvas({
  svgContent,
  selectedLayerId,
  activeTool,
  zoom,
  onSelectLayer,
  onBucketFill,
  onEyedrop,
  onDragMove,
  onDragEnd,
}: CanvasProps) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan state
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });

  // Drag-to-move state
  const isDragging = useRef(false);
  const dragTargetId = useRef<string | null>(null);
  const dragLastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (activeTool === "pan") {
        isPanning.current = true;
        panStart.current = { x: e.clientX, y: e.clientY };
        offsetStart.current = { ...offset };
        e.preventDefault();
        return;
      }

      // Select tool: start drag-to-move on shapes
      if (activeTool === "select") {
        const target = e.target as Element;
        const shape = findShapeElement(target, containerRef.current);
        if (shape) {
          isDragging.current = true;
          dragTargetId.current = shape.id;
          dragLastPos.current = { x: e.clientX, y: e.clientY };
          onSelectLayer(shape.id);
          e.preventDefault();
        }
      }
    },
    [activeTool, offset, onSelectLayer]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isPanning.current) {
        const dx = e.clientX - panStart.current.x;
        const dy = e.clientY - panStart.current.y;
        setOffset({
          x: offsetStart.current.x + dx,
          y: offsetStart.current.y + dy,
        });
        return;
      }

      if (isDragging.current && dragTargetId.current) {
        const scale = zoom / 100;
        const dx = (e.clientX - dragLastPos.current.x) / scale;
        const dy = (e.clientY - dragLastPos.current.y) / scale;
        dragLastPos.current = { x: e.clientX, y: e.clientY };
        onDragMove(dragTargetId.current, dx, dy);
      }
    },
    [zoom, onDragMove]
  );

  const handleMouseUp = useCallback(() => {
    if (isPanning.current) {
      isPanning.current = false;
    }
    if (isDragging.current) {
      isDragging.current = false;
      dragTargetId.current = null;
      onDragEnd();
    }
  }, [onDragEnd]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Don't fire click after a drag
      if (isDragging.current || isPanning.current) return;

      const target = e.target as Element;
      const shape = findShapeElement(target, containerRef.current);

      switch (activeTool) {
        case "select": {
          if (!shape) onSelectLayer(null);
          break;
        }
        case "brush":
        case "bucket": {
          if (shape) onBucketFill(shape.id);
          break;
        }
        case "eyedropper": {
          if (shape) onEyedrop(shape.id);
          break;
        }
      }
    },
    [activeTool, onSelectLayer, onBucketFill, onEyedrop]
  );

  const svgWithStyles = svgContent
    ? buildStyledSvg(svgContent, selectedLayerId)
    : "";

  const cursor =
    isPanning.current
      ? "grabbing"
      : isDragging.current
        ? "move"
        : TOOL_CURSORS[activeTool] || "default";

  return (
    <div
      className="relative flex flex-1 items-center justify-center overflow-hidden bg-muted/30"
      style={{ cursor }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {svgContent ? (
        <div
          ref={containerRef}
          className="flex items-center justify-center p-8"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom / 100})`,
          }}
          onClick={handleCanvasClick}
          dangerouslySetInnerHTML={{ __html: svgWithStyles }}
        />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <ImageIcon size={48} className="text-muted-foreground/40" />
          <span className="text-sm text-muted-foreground">
            {t.tool.emptyCanvas}
          </span>
        </div>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-3 left-3 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">
        {zoom}%
      </div>
    </div>
  );
}

function buildStyledSvg(
  svgContent: string,
  selectedLayerId: string | null
): string {
  const selectionStyle = selectedLayerId
    ? `<style>
        path, rect, circle, ellipse, polygon, line { cursor: inherit; }
        #${CSS.escape(selectedLayerId)} {
          outline: 2px solid #E11D48;
          outline-offset: 1px;
          filter: drop-shadow(0 0 3px rgba(225, 29, 72, 0.4));
        }
      </style>`
    : `<style>
        path, rect, circle, ellipse, polygon, line { cursor: inherit; }
      </style>`;

  return svgContent.replace(/(<svg[^>]*>)/i, `$1${selectionStyle}`);
}
