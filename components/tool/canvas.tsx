"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { sanitizeSvg } from "@/lib/svg-sanitizer";
import type { ToolType } from "./toolbar";
import { PathOverlay } from "./path-overlay";

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
  onPathUpdate?: (elementId: string, newD: string) => void;
  onPathUpdateEnd?: () => void;
  onZoom?: (delta: number) => void;
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
  pen: "crosshair",
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
  onPathUpdate,
  onPathUpdateEnd,
  onZoom,
}: CanvasProps) {
  const { t } = useI18n();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cmd/Ctrl + scroll wheel zoom
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || !onZoom) return;

    function handleWheel(e: WheelEvent) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        onZoom!(e.deltaY > 0 ? -25 : 25);
      }
    }

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [onZoom]);

  // Pan state
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });

  // Drag-to-move state
  const isDragging = useRef(false);
  const dragTargetId = useRef<string | null>(null);
  const dragLastPos = useRef({ x: 0, y: 0 });
  const dragCTMInverse = useRef<DOMMatrix | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (activeTool === "pan") {
        isPanning.current = true;
        panStart.current = { x: e.clientX, y: e.clientY };
        offsetStart.current = { ...offset };
        e.preventDefault();
        return;
      }

      // Pen tool: click to select path (no drag-to-move)
      if (activeTool === "pen") {
        const target = e.target as Element;
        const shape = findShapeElement(target, containerRef.current);
        if (shape) {
          onSelectLayer(shape.id);
        } else {
          onSelectLayer(null);
        }
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

          // Get the element's CTM inverse to properly convert screen deltas
          // to element-local coordinate deltas (handles ancestor transforms like scale/rotate)
          dragCTMInverse.current = null;
          if (shape instanceof SVGGraphicsElement) {
            const ctm = shape.getScreenCTM();
            if (ctm) dragCTMInverse.current = ctm.inverse();
          }

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
        const screenDx = e.clientX - dragLastPos.current.x;
        const screenDy = e.clientY - dragLastPos.current.y;
        dragLastPos.current = { x: e.clientX, y: e.clientY };

        let dx: number, dy: number;
        const m = dragCTMInverse.current;
        if (m) {
          // Use inverse CTM to convert screen delta to element-local delta
          // This properly handles ancestor transforms (scale, rotate, etc.)
          dx = m.a * screenDx + m.c * screenDy;
          dy = m.b * screenDx + m.d * screenDy;
        } else {
          // Fallback: simple zoom-based conversion
          const scale = zoom / 100;
          dx = screenDx / scale;
          dy = screenDy / scale;
        }
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
      if (isDragging.current || isPanning.current) return;

      const target = e.target as Element;
      const shape = findShapeElement(target, containerRef.current);

      switch (activeTool) {
        case "select": {
          if (!shape) onSelectLayer(null);
          break;
        }
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

  // Sanitize once when content changes, not on every render
  const sanitizedSvg = useMemo(
    () => (svgContent ? sanitizeSvg(svgContent) : ""),
    [svgContent]
  );

  const svgWithStyles = sanitizedSvg
    ? buildStyledSvg(sanitizedSvg, selectedLayerId)
    : "";

  const cursor =
    isPanning.current
      ? "grabbing"
      : isDragging.current
        ? "move"
        : TOOL_CURSORS[activeTool] || "default";

  const showOverlay =
    activeTool === "pen" &&
    selectedLayerId &&
    onPathUpdate &&
    onPathUpdateEnd;

  return (
    <div
      ref={wrapperRef}
      className="relative flex flex-1 items-center justify-center overflow-hidden bg-muted/30"
      style={{ cursor }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {svgContent ? (
        <div
          className="flex items-center justify-center p-8"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom / 100})`,
          }}
          onClick={handleCanvasClick}
        >
          {/* Relative wrapper so overlay aligns with SVG */}
          <div className="relative">
            <div
              ref={containerRef}
              dangerouslySetInnerHTML={{ __html: svgWithStyles }}
            />
            {showOverlay && (
              <PathOverlay
                svgContent={svgContent}
                selectedLayerId={selectedLayerId}
                zoom={zoom}
                onPathUpdate={onPathUpdate}
                onPathUpdateEnd={onPathUpdateEnd}
              />
            )}
          </div>
        </div>
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
