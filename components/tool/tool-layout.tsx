"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Download,
  FolderOpen,
  RotateCcw,
  Save,
  Shuffle,
  Undo2,
  Redo2,
  Check,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  parseSvg,
  updateSvgElement,
  updateSvgTransform,
  updateSvgPathD,
  deleteSvgElement,
  duplicateSvgElement,
  getElementFill,
  randomizeColors,
  type SvgLayer,
  type SvgTransform,
} from "@/lib/svg-parser";
import { saveProject, updateProject, getProject } from "@/lib/storage";
import { COLOR_PALETTES, type ColorPalette } from "@/lib/color-palettes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Toolbar, type ToolType } from "./toolbar";
import { Canvas } from "./canvas";
import { PropertiesPanel } from "./properties-panel";
import { ShortcutsDialog } from "./shortcuts-dialog";
import { InkdropLogo } from "@/components/inkdrop-logo";

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
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Space-hold temporary pan
  const toolBeforeSpaceRef = useRef<ToolType | null>(null);

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

  // Bucket fill: apply selectedColor
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

  // Pen tool: update path `d` attribute during drag (no history push)
  const handlePathUpdate = useCallback(
    (elementId: string, newD: string) => {
      const updated = updateSvgPathD(svgContent, elementId, newD);
      setSvgContent(updated);
    },
    [svgContent]
  );

  // Pen tool: commit path change to history
  const handlePathUpdateEnd = useCallback(() => {
    pushHistory(svgContent, layers);
  }, [svgContent, layers]);

  // Delete selected layer
  const handleDeleteLayer = useCallback(() => {
    if (!selectedLayerId || !svgContent) return;
    const { svg, layers: newLayers } = deleteSvgElement(svgContent, selectedLayerId);
    applyChange(svg, newLayers);
    setSelectedLayerId(null);
  }, [svgContent, selectedLayerId]);

  // Duplicate selected layer
  const handleDuplicateLayer = useCallback(() => {
    if (!selectedLayerId || !svgContent) return;
    const { svg, layers: newLayers, newId } = duplicateSvgElement(svgContent, selectedLayerId);
    if (newId) {
      applyChange(svg, newLayers);
      setSelectedLayerId(newId);
    }
  }, [svgContent, selectedLayerId]);

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
    const { svg, layers: newLayers } = randomizeColors(
      svgContent,
      selectedPalette?.colors
    );
    applyChange(svg, newLayers);
  }, [svgContent, selectedPalette]);

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

  // Zoom handler (for canvas scroll wheel)
  const handleZoom = useCallback((delta: number) => {
    setZoom((prev) => Math.max(25, Math.min(400, prev + delta)));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const mod = e.ctrlKey || e.metaKey;

      // Cmd/Ctrl combos
      if (mod) {
        if (e.shiftKey && e.key.toLowerCase() === "z") {
          e.preventDefault();
          handleRedo();
          return;
        }
        if (e.key.toLowerCase() === "z") {
          e.preventDefault();
          handleUndo();
          return;
        }
        if (e.key.toLowerCase() === "s") {
          e.preventDefault();
          handleSave();
          return;
        }
        if (e.key.toLowerCase() === "k") {
          e.preventDefault();
          setShowShortcuts((prev) => !prev);
          return;
        }
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          setZoom((prev) => Math.min(prev + 25, 400));
          return;
        }
        if (e.key === "-") {
          e.preventDefault();
          setZoom((prev) => Math.max(prev - 25, 25));
          return;
        }
        if (e.key === "0") {
          e.preventDefault();
          setZoom(100);
          return;
        }
        if (e.key.toLowerCase() === "d") {
          e.preventDefault();
          handleDuplicateLayer();
          return;
        }
        return;
      }

      // Delete/Backspace to delete selected layer
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        handleDeleteLayer();
        return;
      }

      // Space hold → temporary pan
      if (e.key === " " && !e.repeat) {
        e.preventDefault();
        setActiveTool((current) => {
          if (current !== "pan") {
            toolBeforeSpaceRef.current = current;
          }
          return "pan";
        });
        return;
      }

      switch (e.key.toLowerCase()) {
        case "v":
          setActiveTool("select");
          break;
        case "h":
          setActiveTool("pan");
          break;
        case "g":
          setActiveTool("bucket");
          break;
        case "p":
          setActiveTool("pen");
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

    function onKeyUp(e: KeyboardEvent) {
      if (e.key === " " && toolBeforeSpaceRef.current !== null) {
        setActiveTool(toolBeforeSpaceRef.current);
        toolBeforeSpaceRef.current = null;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [handleSave, handleUndo, handleRedo, handleDeleteLayer, handleDuplicateLayer]);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
        {/* Left: Logo + Gallery + Undo/Redo */}
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2 pr-3">
            <InkdropLogo size={28} />
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
          <div className="flex items-center">
            <button
              onClick={handleRandomize}
              title={t.tool.randomize}
              className="inline-flex h-8 items-center gap-1.5 rounded-l-md px-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Shuffle size={14} />
              <span className="hidden md:inline">
                {selectedPalette
                  ? t.tool.palettes[selectedPalette.id as keyof typeof t.tool.palettes]
                  : t.tool.randomize}
              </span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex h-8 items-center rounded-r-md px-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ChevronDown size={12} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setSelectedPalette(null)}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-1">
                    <Shuffle size={12} className="text-muted-foreground" />
                  </div>
                  <span className="flex-1">{t.tool.palettes.random}</span>
                  {!selectedPalette && <Check size={14} className="text-foreground" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {COLOR_PALETTES.map((palette) => (
                  <DropdownMenuItem
                    key={palette.id}
                    onClick={() => setSelectedPalette(palette)}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-0.5">
                      {palette.colors.slice(0, 5).map((color, i) => (
                        <span
                          key={i}
                          className="inline-block h-3 w-3 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="flex-1">
                      {t.tool.palettes[palette.id as keyof typeof t.tool.palettes]}
                    </span>
                    {selectedPalette?.id === palette.id && (
                      <Check size={14} className="text-foreground" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <AnimatedThemeToggler className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-[15px]" />

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
          onShowShortcuts={() => setShowShortcuts(true)}
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
          onPathUpdate={handlePathUpdate}
          onPathUpdateEnd={handlePathUpdateEnd}
          onZoom={handleZoom}
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

      <ShortcutsDialog
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
