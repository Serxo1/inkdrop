"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Download,
  FolderOpen,
  RotateCcw,
  Save,
  Shuffle,
  Undo2,
  Redo2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  parseSvg,
  updateSvgElement,
  updateSvgTransform,
  getElementFill,
  randomizeColors,
  type SvgLayer,
  type SvgTransform,
} from "@/lib/svg-parser";
import { saveProject, updateProject, getProject } from "@/lib/storage";
import { Toolbar, type ToolType } from "./toolbar";
import { Canvas } from "./canvas";
import { PropertiesPanel } from "./properties-panel";

const UPLOAD_KEY = "inkdrop-upload";
const PROJECT_ID_KEY = "inkdrop-project-id";
const MAX_RECENT_COLORS = 8;

interface HistoryEntry {
  svgContent: string;
  layers: SvgLayer[];
}

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
  const [recentColors, setRecentColors] = useState<string[]>([]);

  // History for undo/redo
  const historyRef = useRef<HistoryEntry[]>([]);
  const historyIndexRef = useRef(-1);
  const [, forceUpdate] = useState(0); // trigger re-render for undo/redo button states

  // Original SVG for reset
  const originalSvgRef = useRef<string>("");

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  function pushHistory(svg: string, newLayers: SvgLayer[]) {
    historyRef.current = historyRef.current.slice(
      0,
      historyIndexRef.current + 1
    );
    historyRef.current.push({ svgContent: svg, layers: newLayers });
    historyIndexRef.current = historyRef.current.length - 1;
    forceUpdate((n) => n + 1);
  }

  function applyChange(newSvg: string, newLayers: SvgLayer[]) {
    pushHistory(newSvg, newLayers);
    setSvgContent(newSvg);
    setLayers(newLayers);
  }

  function addRecentColor(color: string) {
    if (!color || color === "none") return;
    setRecentColors((prev) => {
      const filtered = prev.filter((c) => c !== color);
      return [color, ...filtered].slice(0, MAX_RECENT_COLORS);
    });
  }

  // Load from sessionStorage after mount
  useEffect(() => {
    const stored = sessionStorage.getItem(UPLOAD_KEY);
    if (stored) {
      const { svg, layers: parsed } = parseSvg(stored);
      setSvgContent(svg);
      setLayers(parsed);
      originalSvgRef.current = svg;
      historyRef.current = [{ svgContent: svg, layers: parsed }];
      historyIndexRef.current = 0;
      forceUpdate((n) => n + 1);
    }
    const storedName = sessionStorage.getItem("inkdrop-filename");
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

  const handleToolChange = useCallback((tool: ToolType) => {
    if (tool === "zoomIn") {
      setZoom((prev) => Math.min(prev + 25, 400));
      return;
    }
    if (tool === "zoomOut") {
      setZoom((prev) => Math.max(prev - 25, 25));
      return;
    }
    setActiveTool(tool);
  }, []);

  // Bucket/brush: apply selectedColor
  const handleBucketFill = useCallback(
    (elementId: string) => {
      const updated = updateSvgElement(svgContent, elementId, "fill", selectedColor);
      const newLayers = layers.map((l) =>
        l.id === elementId ? { ...l, fill: selectedColor } : l
      );
      applyChange(updated, newLayers);
      addRecentColor(selectedColor);
    },
    [svgContent, layers, selectedColor]
  );

  // Eyedropper
  const handleEyedrop = useCallback(
    (elementId: string) => {
      const color = getElementFill(svgContent, elementId);
      setSelectedColor(color);
      addRecentColor(color);
      setActiveTool("select");
    },
    [svgContent]
  );

  const handleUpdateFill = useCallback(
    (id: string, color: string) => {
      const updated = updateSvgElement(svgContent, id, "fill", color);
      const newLayers = layers.map((l) =>
        l.id === id ? { ...l, fill: color } : l
      );
      applyChange(updated, newLayers);
      addRecentColor(color);
    },
    [svgContent, layers]
  );

  const handleUpdateStroke = useCallback(
    (id: string, color: string) => {
      const updated = updateSvgElement(svgContent, id, "stroke", color);
      const newLayers = layers.map((l) =>
        l.id === id ? { ...l, stroke: color } : l
      );
      applyChange(updated, newLayers);
      addRecentColor(color);
    },
    [svgContent, layers]
  );

  const handleUpdateStrokeWidth = useCallback(
    (id: string, width: string) => {
      const updated = updateSvgElement(svgContent, id, "stroke-width", width);
      const newLayers = layers.map((l) =>
        l.id === id ? { ...l, strokeWidth: width } : l
      );
      applyChange(updated, newLayers);
    },
    [svgContent, layers]
  );

  const handleUpdateOpacity = useCallback(
    (id: string, opacity: string) => {
      const updated = updateSvgElement(svgContent, id, "opacity", opacity);
      const newLayers = layers.map((l) =>
        l.id === id ? { ...l, opacity } : l
      );
      applyChange(updated, newLayers);
    },
    [svgContent, layers]
  );

  const handleUpdateTransform = useCallback(
    (id: string, transform: SvgTransform) => {
      const updated = updateSvgTransform(svgContent, id, transform);
      const newLayers = layers.map((l) =>
        l.id === id ? { ...l, transform } : l
      );
      applyChange(updated, newLayers);
    },
    [svgContent, layers]
  );

  // Drag-to-move: called by canvas during drag
  const handleDragMove = useCallback(
    (elementId: string, dx: number, dy: number) => {
      const layer = layers.find((l) => l.id === elementId);
      if (!layer) return;
      const newTransform: SvgTransform = {
        ...layer.transform,
        x: layer.transform.x + dx,
        y: layer.transform.y + dy,
      };
      const updated = updateSvgTransform(svgContent, elementId, newTransform);
      const newLayers = layers.map((l) =>
        l.id === elementId ? { ...l, transform: newTransform } : l
      );
      // Don't push to history during drag (too many entries) — just update state
      setSvgContent(updated);
      setLayers(newLayers);
    },
    [svgContent, layers]
  );

  // Called on drag end to commit to history
  const handleDragEnd = useCallback(() => {
    pushHistory(svgContent, layers);
  }, [svgContent, layers]);

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const entry = historyRef.current[historyIndexRef.current];
    setSvgContent(entry.svgContent);
    setLayers(entry.layers);
    forceUpdate((n) => n + 1);
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const entry = historyRef.current[historyIndexRef.current];
    setSvgContent(entry.svgContent);
    setLayers(entry.layers);
    forceUpdate((n) => n + 1);
  }, []);

  const handleReset = useCallback(() => {
    if (!originalSvgRef.current) return;
    const { svg, layers: parsed } = parseSvg(originalSvgRef.current);
    applyChange(svg, parsed);
  }, []);

  const handleRandomize = useCallback(() => {
    if (!svgContent) return;
    const { svg, layers: newLayers } = randomizeColors(svgContent);
    applyChange(svg, newLayers);
  }, [svgContent]);

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
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleRedo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
        return;
      }

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
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave, handleUndo, handleRedo]);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
        {/* Left: Logo + Gallery + Undo/Redo */}
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2 pr-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-bold text-primary-foreground">I</span>
            </div>
            <span className="text-sm font-bold text-foreground">Inkdrop</span>
          </Link>
          <Link
            href="/gallery"
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <FolderOpen size={14} />
            {t.gallery.title}
          </Link>

          <div className="mx-2 h-5 w-px bg-border" />

          <button
            onClick={handleUndo}
            disabled={!canUndo}
            title={`${t.tool.undo} (Ctrl+Z)`}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
          >
            <Undo2 size={15} />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            title={`${t.tool.redo} (Ctrl+Shift+Z)`}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
          >
            <Redo2 size={15} />
          </button>
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

        {/* Right: Reset + Randomize + Save + Export */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            title={t.tool.reset}
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw size={14} />
            <span className="hidden md:inline">{t.tool.reset}</span>
          </button>
          <button
            onClick={handleRandomize}
            title={t.tool.randomize}
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Shuffle size={14} />
            <span className="hidden md:inline">{t.tool.randomize}</span>
          </button>

          <div className="mx-1 h-5 w-px bg-border" />

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
          onColorChange={(c) => {
            setSelectedColor(c);
            addRecentColor(c);
          }}
          recentColors={recentColors}
        />
        <Canvas
          svgContent={svgContent}
          selectedLayerId={selectedLayerId}
          activeTool={activeTool}
          zoom={zoom}
          onSelectLayer={handleSelectLayer}
          onBucketFill={handleBucketFill}
          onEyedrop={handleEyedrop}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        />
        <PropertiesPanel
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={(id) => handleSelectLayer(id)}
          onUpdateFill={handleUpdateFill}
          onUpdateStroke={handleUpdateStroke}
          onUpdateStrokeWidth={handleUpdateStrokeWidth}
          onUpdateOpacity={handleUpdateOpacity}
          onUpdateTransform={handleUpdateTransform}
        />
      </div>
    </div>
  );
}
