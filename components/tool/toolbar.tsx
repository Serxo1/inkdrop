"use client";

import { useRef } from "react";
import {
  MousePointer2,
  Hand,
  Paintbrush,
  PaintBucket,
  Pipette,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export type ToolType =
  | "select"
  | "pan"
  | "brush"
  | "bucket"
  | "eyedropper"
  | "zoomIn"
  | "zoomOut";

type ToolLabelKey =
  | "select"
  | "pan"
  | "brush"
  | "bucket"
  | "eyedropper"
  | "zoomIn"
  | "zoomOut";

interface ToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
}

interface ToolDef {
  id: ToolType;
  icon: LucideIcon;
  labelKey: ToolLabelKey;
  shortcut: string;
}

const tools: ToolDef[] = [
  { id: "select", icon: MousePointer2, labelKey: "select", shortcut: "V" },
  { id: "pan", icon: Hand, labelKey: "pan", shortcut: "H" },
  { id: "brush", icon: Paintbrush, labelKey: "brush", shortcut: "B" },
  { id: "bucket", icon: PaintBucket, labelKey: "bucket", shortcut: "G" },
];

const secondaryTools: ToolDef[] = [
  { id: "eyedropper", icon: Pipette, labelKey: "eyedropper", shortcut: "I" },
  { id: "zoomIn", icon: ZoomIn, labelKey: "zoomIn", shortcut: "+" },
  { id: "zoomOut", icon: ZoomOut, labelKey: "zoomOut", shortcut: "-" },
];

export function Toolbar({
  activeTool,
  onToolChange,
  selectedColor,
  onColorChange,
}: ToolbarProps) {
  const { t } = useI18n();
  const colorInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex w-12 flex-col items-center gap-1 border-r border-border bg-background py-3">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolChange(tool.id)}
          title={`${t.tool.tools[tool.labelKey]} (${tool.shortcut})`}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
            activeTool === tool.id
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          )}
        >
          <tool.icon size={18} />
        </button>
      ))}

      {/* Separator */}
      <div className="mx-auto my-1 h-px w-6 bg-border" />

      {secondaryTools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolChange(tool.id)}
          title={`${t.tool.tools[tool.labelKey]} (${tool.shortcut})`}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
            activeTool === tool.id
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          )}
        >
          <tool.icon size={18} />
        </button>
      ))}

      {/* Separator */}
      <div className="mx-auto my-1 h-px w-6 bg-border" />

      {/* Active color swatch */}
      <button
        onClick={() => colorInputRef.current?.click()}
        className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:border-foreground/30"
        title="Active color"
      >
        <span
          className="h-5 w-5 rounded-sm border border-border"
          style={{ backgroundColor: selectedColor }}
        />
        <input
          ref={colorInputRef}
          type="color"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          tabIndex={-1}
        />
      </button>
    </div>
  );
}
