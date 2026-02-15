"use client";

import { memo, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { SvgLayer, SvgTransform } from "@/lib/svg-parser";

interface PropertiesPanelProps {
  layers: SvgLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onUpdateFill: (id: string, color: string) => void;
  onUpdateStroke: (id: string, color: string) => void;
  onUpdateStrokeWidth: (id: string, width: string) => void;
  onUpdateOpacity: (id: string, opacity: string) => void;
  onUpdateTransform: (id: string, transform: SvgTransform) => void;
}

function toHex(color: string): string {
  if (!color || color === "none") return "#000000";
  if (color.startsWith("#") && color.length === 7) return color;
  if (color.startsWith("#") && color.length === 4) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  return color;
}

export const PropertiesPanel = memo(function PropertiesPanel({
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateFill,
  onUpdateStroke,
  onUpdateStrokeWidth,
  onUpdateOpacity,
  onUpdateTransform,
}: PropertiesPanelProps) {
  const { t } = useI18n();
  const fillColorRef = useRef<HTMLInputElement>(null);
  const strokeColorRef = useRef<HTMLInputElement>(null);

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);
  const opacityPercent = selectedLayer
    ? Math.round(parseFloat(selectedLayer.opacity) * 100)
    : 100;

  function handleTransformField(
    field: keyof SvgTransform,
    value: string
  ) {
    if (!selectedLayerId || !selectedLayer) return;
    const num = parseFloat(value);
    if (isNaN(num)) return;
    onUpdateTransform(selectedLayerId, {
      ...selectedLayer.transform,
      [field]: num,
    });
  }

  return (
    <div className="flex w-[280px] flex-col overflow-y-auto border-l border-border bg-background">
      {/* Layers Section */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
            {t.tool.layers}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {layers.length} {t.tool.pathCount}
          </span>
        </div>

        <div className="flex max-h-[200px] flex-col gap-0.5 overflow-y-auto">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={cn(
                "flex h-8 items-center gap-2 rounded px-2 text-left transition-colors",
                selectedLayerId === layer.id
                  ? "bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-sm border border-border"
                style={{
                  backgroundColor:
                    layer.fill === "none" ? "transparent" : layer.fill,
                }}
              />
              <span className="truncate text-xs">{layer.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Fill Section */}
      <div className="flex flex-col gap-3 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
          {t.tool.fill}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fillColorRef.current?.click()}
            className="relative h-8 w-8 shrink-0 rounded-md border border-border"
            style={{
              backgroundColor:
                selectedLayer && selectedLayer.fill !== "none"
                  ? selectedLayer.fill
                  : "transparent",
            }}
          >
            <input
              ref={fillColorRef}
              type="color"
              value={toHex(selectedLayer?.fill || "#000000")}
              onChange={(e) => {
                if (selectedLayerId) onUpdateFill(selectedLayerId, e.target.value);
              }}
              disabled={!selectedLayer}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              tabIndex={-1}
            />
          </button>
          <input
            type="text"
            value={selectedLayer?.fill || ""}
            onChange={(e) => {
              if (selectedLayerId) onUpdateFill(selectedLayerId, e.target.value);
            }}
            disabled={!selectedLayer}
            placeholder="#000000"
            className="h-8 flex-1 rounded-md border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{t.tool.opacity}</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={opacityPercent}
              onChange={(e) => {
                if (selectedLayerId) {
                  onUpdateOpacity(
                    selectedLayerId,
                    (parseInt(e.target.value) / 100).toString()
                  );
                }
              }}
              disabled={!selectedLayer}
              className="h-1 w-20 accent-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="w-8 text-right text-xs text-muted-foreground">
              {opacityPercent}%
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Stroke Section */}
      <div className="flex flex-col gap-3 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
          {t.tool.stroke}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => strokeColorRef.current?.click()}
            className="relative h-8 w-8 shrink-0 rounded-md border border-border"
            style={{
              backgroundColor:
                selectedLayer && selectedLayer.stroke !== "none"
                  ? selectedLayer.stroke
                  : "transparent",
            }}
          >
            <input
              ref={strokeColorRef}
              type="color"
              value={toHex(selectedLayer?.stroke || "#000000")}
              onChange={(e) => {
                if (selectedLayerId) onUpdateStroke(selectedLayerId, e.target.value);
              }}
              disabled={!selectedLayer}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              tabIndex={-1}
            />
          </button>
          <input
            type="text"
            value={selectedLayer?.stroke || ""}
            onChange={(e) => {
              if (selectedLayerId) onUpdateStroke(selectedLayerId, e.target.value);
            }}
            disabled={!selectedLayer}
            placeholder="none"
            className="h-8 flex-1 rounded-md border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{t.tool.width}</span>
          <input
            type="text"
            value={selectedLayer?.strokeWidth || "1"}
            onChange={(e) => {
              if (selectedLayerId) onUpdateStrokeWidth(selectedLayerId, e.target.value);
            }}
            disabled={!selectedLayer}
            className="h-7 w-16 rounded border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Transform Section */}
      <div className="flex flex-col gap-3 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
          {t.tool.transform}
        </span>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground">X</span>
            <input
              type="number"
              step="1"
              value={selectedLayer ? Math.round(selectedLayer.transform.x) : 0}
              onChange={(e) => handleTransformField("x", e.target.value)}
              disabled={!selectedLayer}
              className="h-7 w-full rounded border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground">Y</span>
            <input
              type="number"
              step="1"
              value={selectedLayer ? Math.round(selectedLayer.transform.y) : 0}
              onChange={(e) => handleTransformField("y", e.target.value)}
              disabled={!selectedLayer}
              className="h-7 w-full rounded border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground">
              {t.tool.rotation}
            </span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                step="1"
                value={
                  selectedLayer
                    ? Math.round(selectedLayer.transform.rotation)
                    : 0
                }
                onChange={(e) => handleTransformField("rotation", e.target.value)}
                disabled={!selectedLayer}
                className="h-7 w-full rounded border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span className="text-[10px] text-muted-foreground">deg</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground">
              {t.tool.scale}
            </span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={
                  selectedLayer
                    ? Math.round(selectedLayer.transform.scaleX * 100)
                    : 100
                }
                onChange={(e) => {
                  const pct = parseFloat(e.target.value);
                  if (isNaN(pct) || !selectedLayerId || !selectedLayer) return;
                  const s = pct / 100;
                  onUpdateTransform(selectedLayerId, {
                    ...selectedLayer.transform,
                    scaleX: s,
                    scaleY: s,
                  });
                }}
                disabled={!selectedLayer}
                className="h-7 w-full rounded border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span className="text-[10px] text-muted-foreground">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
