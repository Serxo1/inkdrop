"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  parsePath,
  getAnchorPoints,
  updateAnchorPosition,
  updateHandlePosition,
  serializePath,
  type PathCommand,
} from "@/lib/path-parser";
import { parseTransform } from "@/lib/svg-parser";

interface PathOverlayProps {
  svgContent: string;
  selectedLayerId: string;
  zoom: number;
  onPathUpdate: (elementId: string, newD: string) => void;
  onPathUpdateEnd: () => void;
}

const ANCHOR_PX = 8;
const HANDLE_PX = 6;
const STROKE_PX = 1.5;
const DASH_PX = 1;
const ACCENT = "#3B82F6";

export function PathOverlay({
  svgContent,
  selectedLayerId,
  zoom,
  onPathUpdate,
  onPathUpdateEnd,
}: PathOverlayProps) {
  const overlayRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{
    type: "anchor" | "handleIn" | "handleOut";
    commandIndex: number;
    commands: PathCommand[];
    elementId: string;
  } | null>(null);

  // Pixel-to-viewBox ratio for constant-size points
  const [pxRatio, setPxRatio] = useState(1);

  const pathData = useMemo(() => {
    if (!svgContent || !selectedLayerId) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgEl = doc.querySelector("svg");
    const el = doc.getElementById(selectedLayerId);
    if (!el || !svgEl || el.tagName.toLowerCase() !== "path") return null;

    const d = el.getAttribute("d");
    if (!d) return null;

    const commands = parsePath(d);
    const anchors = getAnchorPoints(commands);

    const viewBox = svgEl.getAttribute("viewBox") || "0 0 100 100";
    const transform = parseTransform(el);

    return { commands, anchors, viewBox, transform };
  }, [svgContent, selectedLayerId]);

  // Measure the actual pixel-to-SVG-unit ratio after render
  useEffect(() => {
    const svg = overlayRef.current;
    if (!svg) return;
    const ctm = svg.getScreenCTM();
    if (ctm) setPxRatio(1 / Math.abs(ctm.a));
  }, [pathData, zoom]);

  // Convert screen coords to SVG viewBox coords (minus element transform)
  const screenToSvg = useCallback(
    (clientX: number, clientY: number) => {
      const svg = overlayRef.current;
      if (!svg || !pathData) return { x: 0, y: 0 };

      const ctm = svg.getScreenCTM();
      if (!ctm) return { x: 0, y: 0 };

      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const svgPt = pt.matrixTransform(ctm.inverse());

      return {
        x: svgPt.x - pathData.transform.x,
        y: svgPt.y - pathData.transform.y,
      };
    },
    [pathData]
  );

  const handleMouseDown = useCallback(
    (
      e: React.MouseEvent,
      type: "anchor" | "handleIn" | "handleOut",
      commandIndex: number
    ) => {
      e.stopPropagation();
      e.preventDefault();
      if (!pathData) return;

      dragRef.current = {
        type,
        commandIndex,
        commands: pathData.commands,
        elementId: selectedLayerId,
      };
    },
    [pathData, selectedLayerId]
  );

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragRef.current) return;
      e.preventDefault();

      const { type, commandIndex, commands, elementId } = dragRef.current;
      const newPos = screenToSvg(e.clientX, e.clientY);

      let updated: PathCommand[];
      if (type === "anchor") {
        updated = updateAnchorPosition(commands, commandIndex, newPos);
      } else {
        updated = updateHandlePosition(
          commands,
          commandIndex,
          type === "handleIn" ? "in" : "out",
          newPos
        );
      }

      dragRef.current = { ...dragRef.current, commands: updated };
      onPathUpdate(elementId, serializePath(updated));
    }

    function onMouseUp() {
      if (dragRef.current) {
        dragRef.current = null;
        onPathUpdateEnd();
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [screenToSvg, onPathUpdate, onPathUpdateEnd]);

  if (!pathData) return null;

  const { anchors, transform } = pathData;

  // Sizes in viewBox units so they appear constant on screen
  const aSize = ANCHOR_PX * pxRatio;
  const hSize = HANDLE_PX * pxRatio;
  const strokeW = STROKE_PX * pxRatio;
  const dashW = DASH_PX * pxRatio;
  const dashGap = 3 * pxRatio;

  return (
    <svg
      ref={overlayRef}
      viewBox={pathData.viewBox}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ overflow: "visible" }}
    >
      <g transform={`translate(${transform.x}, ${transform.y})`}>
        {anchors.map((anchor, i) => {
          const { x, y } = anchor.position;

          return (
            <g key={`a-${i}`}>
              {/* Handle In */}
              {anchor.handleIn && (
                <>
                  <line
                    x1={x}
                    y1={y}
                    x2={anchor.handleIn.x}
                    y2={anchor.handleIn.y}
                    stroke={ACCENT}
                    strokeWidth={dashW}
                    strokeDasharray={`${dashGap} ${dashGap}`}
                    pointerEvents="none"
                  />
                  <circle
                    cx={anchor.handleIn.x}
                    cy={anchor.handleIn.y}
                    r={hSize / 2}
                    fill="white"
                    stroke={ACCENT}
                    strokeWidth={strokeW}
                    className="pointer-events-auto cursor-move"
                    onMouseDown={(e) =>
                      handleMouseDown(e, "handleIn", anchor.commandIndex)
                    }
                  />
                </>
              )}

              {/* Handle Out */}
              {anchor.handleOut && (
                <>
                  <line
                    x1={x}
                    y1={y}
                    x2={anchor.handleOut.x}
                    y2={anchor.handleOut.y}
                    stroke={ACCENT}
                    strokeWidth={dashW}
                    strokeDasharray={`${dashGap} ${dashGap}`}
                    pointerEvents="none"
                  />
                  <circle
                    cx={anchor.handleOut.x}
                    cy={anchor.handleOut.y}
                    r={hSize / 2}
                    fill="white"
                    stroke={ACCENT}
                    strokeWidth={strokeW}
                    className="pointer-events-auto cursor-move"
                    onMouseDown={(e) =>
                      handleMouseDown(e, "handleOut", anchor.commandIndex)
                    }
                  />
                </>
              )}

              {/* Anchor point (square) */}
              <rect
                x={x - aSize / 2}
                y={y - aSize / 2}
                width={aSize}
                height={aSize}
                fill="white"
                stroke={ACCENT}
                strokeWidth={strokeW}
                className="pointer-events-auto cursor-move"
                onMouseDown={(e) =>
                  handleMouseDown(e, "anchor", anchor.commandIndex)
                }
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
