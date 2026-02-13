"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Download, Save } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { parseSvg, updateSvgElement, type SvgLayer } from "@/lib/svg-parser";
import { Toolbar, type ToolType } from "./toolbar";
import { Canvas } from "./canvas";
import { PropertiesPanel } from "./properties-panel";

const STORAGE_KEY = "svgcolor-upload";
const SAVE_KEY = "svgcolor-save";

function loadInitialSvg(): { svg: string; layers: SvgLayer[] } {
  if (typeof window === "undefined") return { svg: "", layers: [] };
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return { svg: "", layers: [] };
  return parseSvg(stored);
}

function loadFileName(): string {
  if (typeof window === "undefined") return "my-icon.svg";
  return sessionStorage.getItem("svgcolor-filename") || "my-icon.svg";
}

export function ToolLayout() {
  const { t } = useI18n();
  const [{ svg: initialSvg, layers: initialLayers }] = useState(loadInitialSvg);
  const [svgContent, setSvgContent] = useState(initialSvg);
  const [layers, setLayers] = useState<SvgLayer[]>(initialLayers);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [zoom, setZoom] = useState(100);
  const [fileName] = useState(loadFileName);

  const handleSelectLayer = useCallback((id: string | null) => {
    setSelectedLayerId(id);
  }, []);

  const handleToolChange = useCallback(
    (tool: ToolType) => {
      setActiveTool(tool);

      // Handle zoom tools
      if (tool === "zoomIn") {
        setZoom((prev) => Math.min(prev + 25, 400));
        setActiveTool("select");
      } else if (tool === "zoomOut") {
        setZoom((prev) => Math.max(prev - 25, 25));
        setActiveTool("select");
      }
    },
    []
  );

  const handleUpdateFill = useCallback(
    (id: string, color: string) => {
      const updated = updateSvgElement(svgContent, id, "fill", color);
      setSvgContent(updated);
      setLayers((prev) =>
        prev.map((l) => (l.id === id ? { ...l, fill: color } : l))
      );
    },
    [svgContent]
  );

  const handleUpdateStroke = useCallback(
    (id: string, color: string) => {
      const updated = updateSvgElement(svgContent, id, "stroke", color);
      setSvgContent(updated);
      setLayers((prev) =>
        prev.map((l) => (l.id === id ? { ...l, stroke: color } : l))
      );
    },
    [svgContent]
  );

  const handleUpdateStrokeWidth = useCallback(
    (id: string, width: string) => {
      const updated = updateSvgElement(svgContent, id, "stroke-width", width);
      setSvgContent(updated);
      setLayers((prev) =>
        prev.map((l) => (l.id === id ? { ...l, strokeWidth: width } : l))
      );
    },
    [svgContent]
  );

  const handleUpdateOpacity = useCallback(
    (id: string, opacity: string) => {
      const updated = updateSvgElement(svgContent, id, "opacity", opacity);
      setSvgContent(updated);
    },
    [svgContent]
  );

  const handleSave = useCallback(() => {
    if (svgContent) {
      sessionStorage.setItem(SAVE_KEY, svgContent);
    }
  }, [svgContent]);

  const handleExport = useCallback(() => {
    if (!svgContent) return;

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [svgContent, fileName]);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-primary-foreground">S</span>
          </div>
          <span className="text-sm font-bold text-foreground">SVG Color</span>
        </Link>

        {/* Center: File name + Project name */}
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] text-muted-foreground">{fileName}</span>
          <span className="text-[13px] text-muted-foreground">&mdash;</span>
          <span className="text-[13px] font-medium text-foreground">
            {t.tool.untitledProject}
          </span>
        </div>

        {/* Right: Save + Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3.5 text-[13px] text-foreground transition-colors hover:bg-muted"
          >
            <Save size={14} />
            {t.tool.save}
          </button>
          <button
            onClick={handleExport}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3.5 text-[13px] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Download size={14} />
            {t.tool.export}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <Toolbar activeTool={activeTool} onToolChange={handleToolChange} />
        <Canvas
          svgContent={svgContent}
          selectedLayerId={selectedLayerId}
          activeTool={activeTool}
          zoom={zoom}
          onSelectLayer={handleSelectLayer}
        />
        <PropertiesPanel
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={(id) => handleSelectLayer(id)}
          onUpdateFill={handleUpdateFill}
          onUpdateStroke={handleUpdateStroke}
          onUpdateStrokeWidth={handleUpdateStrokeWidth}
          onUpdateOpacity={handleUpdateOpacity}
        />
      </div>
    </div>
  );
}
