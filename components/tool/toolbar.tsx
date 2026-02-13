"use client";

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
}

interface ToolDef {
  id: ToolType;
  icon: LucideIcon;
  labelKey: ToolLabelKey;
}

const tools: ToolDef[] = [
  { id: "select", icon: MousePointer2, labelKey: "select" },
  { id: "pan", icon: Hand, labelKey: "pan" },
  { id: "brush", icon: Paintbrush, labelKey: "brush" },
  { id: "bucket", icon: PaintBucket, labelKey: "bucket" },
];

const secondaryTools: ToolDef[] = [
  { id: "eyedropper", icon: Pipette, labelKey: "eyedropper" },
  { id: "zoomIn", icon: ZoomIn, labelKey: "zoomIn" },
  { id: "zoomOut", icon: ZoomOut, labelKey: "zoomOut" },
];

export function Toolbar({ activeTool, onToolChange }: ToolbarProps) {
  const { t } = useI18n();

  return (
    <div className="flex w-12 flex-col items-center gap-1 border-r border-border bg-background py-3">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolChange(tool.id)}
          title={t.tool.tools[tool.labelKey]}
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
          title={t.tool.tools[tool.labelKey]}
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
    </div>
  );
}
