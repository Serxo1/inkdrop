"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Download, FolderOpen, Save } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  parseSvg,
  updateSvgElement,
  getElementFill,
  type SvgLayer,
} from "@/lib/svg-parser";
import { saveProject, updateProject, getProject } from "@/lib/storage";
import { Toolbar, type ToolType } from "./toolbar";
import { Canvas } from "./canvas";
import { PropertiesPanel } from "./properties-panel";

const UPLOAD_KEY = "svgcolor-upload";
const PROJECT_ID_KEY = "svgcolor-project-id";

export function ToolLayout() {
  const { t } = useI18n();
  const [svgContent, setSvgContent] = useState("");
  const [layers, setLayers] = useState<SvgLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [zoom, setZoom] = useState(100);
  const [fileName, setFileName] = useState("my-icon.svg");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState(t.tool.untitledProject);
  const [selectedColor, setSelectedColor] = useState("#E11D48");
  const [saved, setSaved] = useState(false);

  // Load from sessionStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const stored = sessionStorage.getItem(UPLOAD_KEY);
    if (stored) {
      const { svg, layers: parsed } = parseSvg(stored);
      setSvgContent(svg);
      setLayers(parsed);
    }
    const storedName = sessionStorage.getItem("svgcolor-filename");
    if (storedName) setFileName(storedName);

    const storedProjectId = sessionStorage.getItem(PROJECT_ID_KEY);
    if (storedProjectId) {
      setProjectId(storedProjectId);
      const project = getProject(storedProjectId);
      if (project) setProjectName(project.name);
    }
  }, []);

  const handleSelectLayer = useCallback((id: string | null) => {
    setSelectedLayerId(id);
  }, []);

  const handleToolChange = useCallback(
    (tool: ToolType) => {
      if (tool === "zoomIn") {
        setZoom((prev) => Math.min(prev + 25, 400));
        return;
      }
      if (tool === "zoomOut") {
        setZoom((prev) => Math.max(prev - 25, 25));
        return;
      }
      setActiveTool(tool);
    },
    []
  );

  // Bucket/brush: apply selectedColor to a path
  const handleBucketFill = useCallback(
    (elementId: string) => {
      const updated = updateSvgElement(svgContent, elementId, "fill", selectedColor);
      setSvgContent(updated);
      setLayers((prev) =>
        prev.map((l) => (l.id === elementId ? { ...l, fill: selectedColor } : l))
      );
    },
    [svgContent, selectedColor]
  );

  // Eyedropper: pick color from element
  const handleEyedrop = useCallback(
    (elementId: string) => {
      const color = getElementFill(svgContent, elementId);
      setSelectedColor(color);
      setActiveTool("select");
    },
    [svgContent]
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
      setLayers((prev) =>
        prev.map((l) => (l.id === id ? { ...l, opacity } : l))
      );
    },
    [svgContent]
  );

  const handleSave = useCallback(() => {
    if (!svgContent) return;

    if (projectId) {
      updateProject(projectId, {
        svgContent,
        thumbnail: svgContent,
        name: projectName,
      });
    } else {
      const project = saveProject({
        name: projectName,
        fileName,
        svgContent,
        thumbnail: svgContent,
      });
      setProjectId(project.id);
      sessionStorage.setItem(PROJECT_ID_KEY, project.id);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [svgContent, projectId, projectName, fileName]);

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

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.key.toLowerCase()) {
        case "v":
          setActiveTool("select");
          break;
        case "h":
          setActiveTool("pan");
          break;
        case "b":
          setActiveTool("brush");
          break;
        case "g":
          setActiveTool("bucket");
          break;
        case "i":
          setActiveTool("eyedropper");
          break;
        case "=":
        case "+":
          setZoom((prev) => Math.min(prev + 25, 400));
          break;
        case "-":
          setZoom((prev) => Math.max(prev - 25, 25));
          break;
        case "s":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleSave();
          }
          break;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave]);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
        {/* Left: Logo + Gallery */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-bold text-primary-foreground">S</span>
            </div>
            <span className="text-sm font-bold text-foreground">SVG Color</span>
          </Link>
          <Link
            href="/gallery"
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <FolderOpen size={14} />
            {t.gallery.title}
          </Link>
        </div>

        {/* Center: File name + Project name */}
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] text-muted-foreground">{fileName}</span>
          <span className="text-[13px] text-muted-foreground">&mdash;</span>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent text-[13px] font-medium text-foreground outline-none"
          />
        </div>

        {/* Right: Save + Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3.5 text-[13px] text-foreground transition-colors hover:bg-muted"
          >
            <Save size={14} />
            {saved ? "Saved!" : t.tool.save}
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
        <Toolbar
          activeTool={activeTool}
          onToolChange={handleToolChange}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />
        <Canvas
          svgContent={svgContent}
          selectedLayerId={selectedLayerId}
          activeTool={activeTool}
          zoom={zoom}
          onSelectLayer={handleSelectLayer}
          onBucketFill={handleBucketFill}
          onEyedrop={handleEyedrop}
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
