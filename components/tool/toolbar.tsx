"use client";

import { useRef } from "react";
import {
  MousePointer2,
  Hand,
  PaintBucket,
  Pipette,
  PenTool,
  ZoomIn,
  ZoomOut,
  Keyboard,
  type LucideIcon,
} from "lucide-react";
import { cn, useIsMac } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export type ToolType =
  | "select"
  | "pan"
  | "pen"
  | "bucket"
  | "eyedropper"
  | "zoomIn"
  | "zoomOut";

type ToolLabelKey =
  | "select"
  | "pan"
  | "pen"
  | "bucket"
  | "eyedropper"
  | "zoomIn"
  | "zoomOut";

interface ToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  recentColors: string[];
  onShowShortcuts?: () => void;
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
  { id: "pen", icon: PenTool, labelKey: "pen", shortcut: "P" },
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
  recentColors,
  onShowShortcuts,
}: ToolbarProps) {
  const { t } = useI18n();
  const isMac = useIsMac();
  const colorInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex w-12 flex-col items-center gap-1 border-r border-border bg-background py-3">
      {tools.map((tool) => (
        <ToolButton
          key={tool.id}
          tool={tool}
          active={activeTool === tool.id}
          label={t.tool.tools[tool.labelKey]}
          onClick={() => onToolChange(tool.id)}
        />
      ))}

      <div className="mx-auto my-1 h-px w-6 bg-border" />

      {secondaryTools.map((tool) => (
        <ToolButton
          key={tool.id}
          tool={tool}
          active={activeTool === tool.id}
          label={t.tool.tools[tool.labelKey]}
          onClick={() => onToolChange(tool.id)}
        />
      ))}

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

      {/* Recent colors */}
      {recentColors.length > 0 && (
        <div className="mt-1 grid grid-cols-2 gap-0.5">
          {recentColors.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className="h-4 w-4 rounded-sm border border-border transition-transform hover:scale-125"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}

      {/* Spacer + Shortcuts button at bottom */}
      <div className="mt-auto" />
      <Tooltip>
        <TooltipTrigger
          onClick={onShowShortcuts}
          className="flex flex-col items-center gap-1 rounded-md py-1.5 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        >
          <Keyboard size={16} />
          <span className="flex items-center gap-0.5">
            <Kbd className="h-4 min-w-4 text-[10px]">{isMac ? "\u2318" : "^"}</Kbd>
            <Kbd className="h-4 min-w-4 text-[10px]">K</Kbd>
          </span>
        </TooltipTrigger>
        <TooltipContent side="right">
          {t.tool.shortcutLabels.title}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function ToolButton({
  tool,
  active,
  label,
  onClick,
}: {
  tool: ToolDef;
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={onClick}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
          active
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        )}
      >
        <tool.icon size={18} />
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-2">
        <span>{label}</span>
        <Kbd>{tool.shortcut}</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}
