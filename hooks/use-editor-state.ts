"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  type LayerGroup,
} from "@/lib/svg-parser";
import { saveProject, updateProject, getProject } from "@/lib/storage";
import { exportSvg, copySvgCode, type ExportFormat } from "@/lib/svg-export";
import type { ColorPalette } from "@/lib/color-palettes";
import type { ToolType } from "@/components/tool/toolbar";

const UPLOAD_KEY = "inkdrop-upload";
const PROJECT_ID_KEY = "inkdrop-project-id";
const GROUPS_KEY = "inkdrop-groups";

interface HistoryEntry {
  svgContent: string;
  layers: SvgLayer[];
}

export function useEditorState(deps: {
  addRecentColor: (color: string) => void;
  selectedColor: string;
  setActiveTool: (tool: ToolType) => void;
  defaultProjectName: string;
}) {
  const { addRecentColor, selectedColor, setActiveTool, defaultProjectName } = deps;

  const [svgContent, setSvgContent] = useState("");
  const [layers, setLayers] = useState<SvgLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [fileName, setFileName] = useState("my-icon.svg");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState(defaultProjectName);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);
  const [groups, setGroups] = useState<LayerGroup[]>([]);

  // History for undo/redo
  const historyRef = useRef<HistoryEntry[]>([]);
  const historyIndexRef = useRef(-1);
  const [, forceUpdate] = useState(0);

  // Original SVG for reset
  const originalSvgRef = useRef<string>("");

  // Refs for latest values — avoids stale closures in high-frequency handlers (drag, pen tool)
  const svgContentRef = useRef(svgContent);
  const layersRef = useRef(layers);
  svgContentRef.current = svgContent;
  layersRef.current = layers;

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  function pushHistory(svg: string, newLayers: SvgLayer[]) {
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push({ svgContent: svg, layers: newLayers });
    historyIndexRef.current = historyRef.current.length - 1;
    forceUpdate((n) => n + 1);
  }

  function applyChange(newSvg: string, newLayers: SvgLayer[]) {
    pushHistory(newSvg, newLayers);
    setSvgContent(newSvg);
    setLayers(newLayers);
  }

  // Load from sessionStorage after mount
  useEffect(() => {
    try {
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

      const storedGroups = sessionStorage.getItem(GROUPS_KEY);
      if (storedGroups) {
        try { setGroups(JSON.parse(storedGroups)); } catch { /* ignore */ }
      }
    } catch {
      // Silently continue — the app works fine without stored data
    }
  }, []);

  const handleSelectLayer = useCallback((id: string | null) => {
    setSelectedLayerId(id);
  }, []);

  // Generic attribute update handler
  const handleUpdateAttribute = useCallback(
    (id: string, attribute: string, field: string, value: string) => {
      const updated = updateSvgElement(svgContent, id, attribute, value);
      const newLayers = layers.map((l) =>
        l.id === id ? { ...l, [field]: value } : l
      );
      applyChange(updated, newLayers);
      if (attribute === "fill" || attribute === "stroke") addRecentColor(value);
    },
    [svgContent, layers, addRecentColor]
  );

  const handleUpdateFill = useCallback(
    (id: string, color: string) => {
      handleUpdateAttribute(id, "fill", "fill", color);
    },
    [handleUpdateAttribute]
  );

  const handleUpdateStroke = useCallback(
    (id: string, color: string) => {
      handleUpdateAttribute(id, "stroke", "stroke", color);
    },
    [handleUpdateAttribute]
  );

  const handleUpdateStrokeWidth = useCallback(
    (id: string, width: string) => {
      handleUpdateAttribute(id, "stroke-width", "strokeWidth", width);
    },
    [handleUpdateAttribute]
  );

  const handleUpdateOpacity = useCallback(
    (id: string, opacity: string) => {
      handleUpdateAttribute(id, "opacity", "opacity", opacity);
    },
    [handleUpdateAttribute]
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

  // --- Batch handlers: apply the same change to multiple layers in one pass ---

  const handleBatchUpdateAttribute = useCallback(
    (ids: string[], attribute: string, field: string, value: string) => {
      let svg = svgContentRef.current;
      for (const id of ids) {
        svg = updateSvgElement(svg, id, attribute, value);
      }
      const idSet = new Set(ids);
      const newLayers = layersRef.current.map((l) =>
        idSet.has(l.id) ? { ...l, [field]: value } : l
      );
      applyChange(svg, newLayers);
      if (attribute === "fill" || attribute === "stroke") addRecentColor(value);
    },
    [addRecentColor]
  );

  const handleBatchUpdateFill = useCallback(
    (ids: string[], color: string) =>
      handleBatchUpdateAttribute(ids, "fill", "fill", color),
    [handleBatchUpdateAttribute]
  );

  const handleBatchUpdateStroke = useCallback(
    (ids: string[], color: string) =>
      handleBatchUpdateAttribute(ids, "stroke", "stroke", color),
    [handleBatchUpdateAttribute]
  );

  const handleBatchUpdateStrokeWidth = useCallback(
    (ids: string[], width: string) =>
      handleBatchUpdateAttribute(ids, "stroke-width", "strokeWidth", width),
    [handleBatchUpdateAttribute]
  );

  const handleBatchUpdateOpacity = useCallback(
    (ids: string[], opacity: string) =>
      handleBatchUpdateAttribute(ids, "opacity", "opacity", opacity),
    [handleBatchUpdateAttribute]
  );

  const handleBatchUpdateTransform = useCallback(
    (updates: Array<{ id: string; transform: SvgTransform }>) => {
      let svg = svgContentRef.current;
      for (const { id, transform } of updates) {
        svg = updateSvgTransform(svg, id, transform);
      }
      const updateMap = new Map(updates.map((u) => [u.id, u.transform]));
      const newLayers = layersRef.current.map((l) =>
        updateMap.has(l.id)
          ? { ...l, transform: updateMap.get(l.id)! }
          : l
      );
      applyChange(svg, newLayers);
    },
    []
  );

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
    [svgContent, layers, selectedColor, addRecentColor]
  );

  // Eyedropper
  const handleEyedrop = useCallback(
    (elementId: string) => {
      const color = getElementFill(svgContent, elementId);
      deps.setActiveTool("select");
      addRecentColor(color);
      return color;
    },
    [svgContent, addRecentColor, deps.setActiveTool]
  );

  // Drag-to-move: uses refs to always read latest state (avoids stale closure during rapid moves)
  const handleDragMove = useCallback(
    (elementId: string, dx: number, dy: number) => {
      const currentLayers = layersRef.current;
      const currentSvg = svgContentRef.current;
      const layer = currentLayers.find((l) => l.id === elementId);
      if (!layer) return;
      const newTransform: SvgTransform = {
        ...layer.transform,
        x: layer.transform.x + dx,
        y: layer.transform.y + dy,
      };
      const updated = updateSvgTransform(currentSvg, elementId, newTransform);
      const newLayers = currentLayers.map((l) =>
        l.id === elementId ? { ...l, transform: newTransform } : l
      );
      // Don't push to history during drag (too many entries) - just update state
      setSvgContent(updated);
      setLayers(newLayers);
    },
    []
  );

  // Called on drag end to commit to history
  const handleDragEnd = useCallback(() => {
    pushHistory(svgContentRef.current, layersRef.current);
  }, []);

  // Pen tool: update path `d` attribute during drag (no history push) — uses ref for latest svg
  const handlePathUpdate = useCallback(
    (elementId: string, newD: string) => {
      const updated = updateSvgPathD(svgContentRef.current, elementId, newD);
      setSvgContent(updated);
    },
    []
  );

  // Pen tool: commit path change to history
  const handlePathUpdateEnd = useCallback(() => {
    pushHistory(svgContentRef.current, layersRef.current);
  }, []);

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
    exportSvg({ svgContent, fileName, format: "svg" });
  }, [svgContent, fileName]);

  const handleExportAs = useCallback(
    (format: ExportFormat) => {
      if (!svgContent) return;
      exportSvg({ svgContent, fileName, format });
    },
    [svgContent, fileName]
  );

  const handleCopySvg = useCallback(async () => {
    if (!svgContent) return;
    const ok = await copySvgCode(svgContent);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [svgContent]);

  // Persist groups to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
    } catch { /* ignore */ }
  }, [groups]);

  // --- Group handlers ---

  const handleCreateGroup = useCallback(
    (name: string) => {
      const group: LayerGroup = {
        id: `group-${Date.now().toString(36)}`,
        name,
        layerIds: [],
        collapsed: false,
      };
      setGroups((prev) => [...prev, group]);
      return group.id;
    },
    []
  );

  const handleRenameGroup = useCallback(
    (groupId: string, name: string) => {
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, name } : g))
      );
    },
    []
  );

  const handleDeleteGroup = useCallback(
    (groupId: string) => {
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
    },
    []
  );

  const handleMoveToGroup = useCallback(
    (layerId: string, groupId: string | null) => {
      setGroups((prev) => {
        // Remove layer from any existing group
        let next = prev.map((g) => ({
          ...g,
          layerIds: g.layerIds.filter((id) => id !== layerId),
        }));
        // Add to target group
        if (groupId) {
          next = next.map((g) =>
            g.id === groupId
              ? { ...g, layerIds: [...g.layerIds, layerId] }
              : g
          );
        }
        return next;
      });
    },
    []
  );

  const handleToggleGroupCollapse = useCallback(
    (groupId: string) => {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId ? { ...g, collapsed: !g.collapsed } : g
        )
      );
    },
    []
  );

  // Zoom handler (for canvas scroll wheel)
  const handleZoom = useCallback((delta: number) => {
    setZoom((prev) => Math.max(25, Math.min(400, prev + delta)));
  }, []);

  return {
    // State
    svgContent,
    layers,
    selectedLayerId,
    zoom,
    setZoom,
    fileName,
    projectName,
    setProjectName,
    saved,
    copied,
    selectedPalette,
    setSelectedPalette,
    groups,
    canUndo,
    canRedo,

    // Handlers
    handleSelectLayer,
    handleUpdateFill,
    handleUpdateStroke,
    handleUpdateStrokeWidth,
    handleUpdateOpacity,
    handleUpdateTransform,
    handleBucketFill,
    handleEyedrop,
    handleDragMove,
    handleDragEnd,
    handlePathUpdate,
    handlePathUpdateEnd,
    handleDeleteLayer,
    handleDuplicateLayer,
    handleUndo,
    handleRedo,
    handleReset,
    handleRandomize,
    handleSave,
    handleExport,
    handleExportAs,
    handleCopySvg,
    handleZoom,
    handleBatchUpdateFill,
    handleBatchUpdateStroke,
    handleBatchUpdateStrokeWidth,
    handleBatchUpdateOpacity,
    handleBatchUpdateTransform,
    handleCreateGroup,
    handleRenameGroup,
    handleDeleteGroup,
    handleMoveToGroup,
    handleToggleGroupCollapse,
  };
}
