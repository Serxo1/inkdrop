"use client";

import { useCallback, useRef } from "react";
import { ImageIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { ToolType } from "./toolbar";

interface CanvasProps {
  svgContent: string;
  selectedLayerId: string | null;
  activeTool: ToolType;
  zoom: number;
  onSelectLayer: (id: string | null) => void;
}

export function Canvas({
  svgContent,
  selectedLayerId,
  activeTool,
  zoom,
  onSelectLayer,
}: CanvasProps) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (activeTool !== "select") return;

      const target = e.target as Element;

      // Check if the clicked element is a shape element
      const shapeTags = ["path", "rect", "circle", "ellipse", "polygon", "line"];
      if (shapeTags.includes(target.tagName.toLowerCase()) && target.id) {
        onSelectLayer(target.id);
        return;
      }

      // Check parent elements (for elements inside groups)
      let parent = target.parentElement;
      while (parent && parent !== containerRef.current) {
        if (shapeTags.includes(parent.tagName.toLowerCase()) && parent.id) {
          onSelectLayer(parent.id);
          return;
        }
        parent = parent.parentElement;
      }

      // Clicked on empty space - deselect
      onSelectLayer(null);
    },
    [activeTool, onSelectLayer]
  );

  // Build the SVG with selection highlighting via CSS
  const svgWithStyles = svgContent
    ? buildStyledSvg(svgContent, selectedLayerId)
    : "";

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-muted/30">
      {svgContent ? (
        <div
          ref={containerRef}
          className="flex items-center justify-center p-8"
          style={{ transform: `scale(${zoom / 100})` }}
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

/**
 * Inject a <style> block into the SVG to highlight the selected element
 * and make all shapes have a pointer cursor when using the select tool.
 */
function buildStyledSvg(
  svgContent: string,
  selectedLayerId: string | null
): string {
  // Add a style element for selection highlighting
  const selectionStyle = selectedLayerId
    ? `<style>
        path, rect, circle, ellipse, polygon, line { cursor: pointer; }
        #${CSS.escape(selectedLayerId)} {
          outline: 2px solid #E11D48;
          outline-offset: 1px;
          filter: drop-shadow(0 0 3px rgba(225, 29, 72, 0.4));
        }
      </style>`
    : `<style>
        path, rect, circle, ellipse, polygon, line { cursor: pointer; }
      </style>`;

  // Insert the style right after the opening <svg> tag
  return svgContent.replace(/(<svg[^>]*>)/i, `$1${selectionStyle}`);
}
