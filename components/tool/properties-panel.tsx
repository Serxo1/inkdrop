"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { SvgLayer, SvgTransform, LayerGroup } from "@/lib/svg-parser";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FolderIcon,
  FolderOpenIcon,
  PlusSignIcon,
  ArrowRight01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";

interface PropertiesPanelProps {
  layers: SvgLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onBatchUpdateFill: (ids: string[], color: string) => void;
  onBatchUpdateStroke: (ids: string[], color: string) => void;
  onBatchUpdateStrokeWidth: (ids: string[], width: string) => void;
  onBatchUpdateOpacity: (ids: string[], opacity: string) => void;
  onBatchUpdateTransform: (updates: Array<{ id: string; transform: SvgTransform }>) => void;
  groups: LayerGroup[];
  onCreateGroup: (name: string) => string;
  onRenameGroup: (groupId: string, name: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onMoveToGroup: (layerId: string, groupId: string | null) => void;
  onToggleGroupCollapse: (groupId: string) => void;
}

interface ContextMenuState {
  x: number;
  y: number;
  type: "layer" | "group";
  targetId: string;
}

const panelSmInputClass =
  "h-7 w-full rounded border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
const panelTextInputClass =
  "h-8 flex-1 rounded-md border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

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
  onBatchUpdateFill,
  onBatchUpdateStroke,
  onBatchUpdateStrokeWidth,
  onBatchUpdateOpacity,
  onBatchUpdateTransform,
  groups,
  onCreateGroup,
  onRenameGroup,
  onDeleteGroup,
  onMoveToGroup,
  onToggleGroupCollapse,
}: PropertiesPanelProps) {
  const { t } = useI18n();
  const fillColorRef = useRef<HTMLInputElement>(null);
  const strokeColorRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [moveSubmenuOpen, setMoveSubmenuOpen] = useState(false);
  const submenuTriggerRef = useRef<HTMLDivElement>(null);
  const submenuContentRef = useRef<HTMLDivElement>(null);
  const submenuCloseTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [renamingGroupId, setRenamingGroupId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null);
  const [dragOverUngrouped, setDragOverUngrouped] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // O(1) layer lookups by id
  const layerMap = useMemo(() => new Map(layers.map((l) => [l.id, l])), [layers]);

  // Reverse lookup: layerId → groupId (also gives us the set of grouped ids)
  const layerToGroupMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of groups) {
      for (const lid of g.layerIds) map.set(lid, g.id);
    }
    return map;
  }, [groups]);

  const ungroupedLayers = useMemo(
    () => layers.filter((l) => !layerToGroupMap.has(l.id)),
    [layers, layerToGroupMap]
  );

  // The "active layers" are either the single selected layer or all layers in the selected group.
  const selectedGroup = selectedGroupId
    ? groups.find((g) => g.id === selectedGroupId) ?? null
    : null;

  const activeLayers = useMemo(() => {
    if (selectedGroup) {
      return selectedGroup.layerIds
        .map((id) => layerMap.get(id))
        .filter(Boolean) as SvgLayer[];
    }
    if (selectedLayerId) {
      const l = layerMap.get(selectedLayerId);
      return l ? [l] : [];
    }
    return [];
  }, [selectedGroup, selectedLayerId, layerMap]);

  const activeIds = useMemo(() => activeLayers.map((l) => l.id), [activeLayers]);
  const activeLayerIds = useMemo(() => new Set(activeIds), [activeIds]);

  // Representative layer for displaying values (first in selection)
  const displayLayer = activeLayers[0] ?? null;
  const hasSelection = activeLayers.length > 0;
  const isGroupSelection = selectedGroup !== null && activeLayers.length > 1;

  // Single-pass shared value computation across active layers
  const { sharedFill, sharedStroke, sharedStrokeWidth, sharedOpacity } = useMemo(() => {
    if (activeLayers.length === 0)
      return { sharedFill: null, sharedStroke: null, sharedStrokeWidth: null, sharedOpacity: null };
    const first = activeLayers[0];
    let fill: string | null = first.fill;
    let stroke: string | null = first.stroke;
    let strokeWidth: string | null = first.strokeWidth;
    let opacity: string | null = first.opacity;
    for (let i = 1; i < activeLayers.length; i++) {
      const l = activeLayers[i];
      if (fill !== null && l.fill !== fill) fill = null;
      if (stroke !== null && l.stroke !== stroke) stroke = null;
      if (strokeWidth !== null && l.strokeWidth !== strokeWidth) strokeWidth = null;
      if (opacity !== null && l.opacity !== opacity) opacity = null;
    }
    return { sharedFill: fill, sharedStroke: stroke, sharedStrokeWidth: strokeWidth, sharedOpacity: opacity };
  }, [activeLayers]);

  const displayFill = sharedFill ?? displayLayer?.fill ?? "";
  const displayStroke = sharedStroke ?? displayLayer?.stroke ?? "";
  const displayStrokeWidth = sharedStrokeWidth ?? displayLayer?.strokeWidth ?? "1";
  const displayOpacity = sharedOpacity ?? displayLayer?.opacity ?? "1";
  const opacityPercent = Math.round(parseFloat(displayOpacity) * 100);

  // Close context menu on outside click or escape
  const contextMenuOpen = contextMenu !== null;
  useEffect(() => {
    if (!contextMenuOpen) return;
    function handleClick() { setContextMenu(null); setMoveSubmenuOpen(false); }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setContextMenu(null); setMoveSubmenuOpen(false); }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [contextMenuOpen]);

  // Safe triangle: when the submenu is open, track mouse globally and only
  // close when the cursor leaves the trigger, the submenu, AND the triangle
  // connecting them (the "prediction cone").
  useEffect(() => {
    if (!moveSubmenuOpen) return;

    function isInsideRect(
      mx: number, my: number,
      r: DOMRect, pad: number
    ) {
      return (
        mx >= r.left - pad && mx <= r.right + pad &&
        my >= r.top - pad && my <= r.bottom + pad
      );
    }

    function pointInTriangle(
      px: number, py: number,
      ax: number, ay: number,
      bx: number, by: number,
      cx: number, cy: number
    ) {
      const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
      const d2 = (px - cx) * (by - cy) - (bx - cx) * (py - cy);
      const d3 = (px - ax) * (cy - ay) - (cx - ax) * (py - ay);
      return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
    }

    function onMove(e: MouseEvent) {
      const trig = submenuTriggerRef.current?.getBoundingClientRect();
      const sub = submenuContentRef.current?.getBoundingClientRect();
      if (!trig || !sub) return;

      const mx = e.clientX;
      const my = e.clientY;
      const PAD = 5;

      // 1. Inside the trigger row
      if (isInsideRect(mx, my, trig, PAD)) {
        clearTimeout(submenuCloseTimerRef.current);
        return;
      }

      // 2. Inside the submenu panel
      if (isInsideRect(mx, my, sub, PAD)) {
        clearTimeout(submenuCloseTimerRef.current);
        return;
      }

      // 3. Inside the safe triangle connecting the trigger's near edge
      //    to the submenu's near corners (works for both left/right)
      const subIsLeft = sub.right <= trig.left;
      const apexX = subIsLeft ? trig.left : trig.right;
      const apexY = (trig.top + trig.bottom) / 2;
      const nearX = subIsLeft ? sub.right : sub.left;

      if (
        pointInTriangle(
          mx, my,
          apexX, apexY,
          nearX, sub.top - PAD,
          nearX, sub.bottom + PAD
        )
      ) {
        clearTimeout(submenuCloseTimerRef.current);
        return;
      }

      // Outside all safe zones → close after a tiny debounce
      clearTimeout(submenuCloseTimerRef.current);
      submenuCloseTimerRef.current = setTimeout(() => {
        setMoveSubmenuOpen(false);
      }, 60);
    }

    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
      clearTimeout(submenuCloseTimerRef.current);
    };
  }, [moveSubmenuOpen]);

  function handleTransformField(field: keyof SvgTransform, value: string) {
    if (!hasSelection) return;
    const num = parseFloat(value);
    if (isNaN(num)) return;
    onBatchUpdateTransform(
      activeLayers.map((l) => ({ id: l.id, transform: { ...l.transform, [field]: num } }))
    );
  }

  // Select a group (and deselect any individual layer)
  const handleSelectGroup = useCallback(
    (groupId: string) => {
      setSelectedGroupId(groupId);
      onSelectLayer(null);
    },
    [onSelectLayer]
  );

  // Select an individual layer (and deselect any group)
  const handleSelectLayerLocal = useCallback(
    (layerId: string) => {
      setSelectedGroupId(null);
      onSelectLayer(layerId);
    },
    [onSelectLayer]
  );

  const handleNewFolder = useCallback(() => {
    const id = onCreateGroup(t.tool.folderName);
    setRenamingGroupId(id);
    setRenameValue(t.tool.folderName);
  }, [onCreateGroup, t.tool.folderName]);

  const handleLayerContextMenu = useCallback(
    (e: React.MouseEvent, layerId: string) => {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        type: "layer",
        targetId: layerId,
      });
      setMoveSubmenuOpen(false);
    },
    []
  );

  const handleGroupContextMenu = useCallback(
    (e: React.MouseEvent, groupId: string) => {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        type: "group",
        targetId: groupId,
      });
      setMoveSubmenuOpen(false);
    },
    []
  );

  const startRename = useCallback(
    (groupId: string) => {
      const group = groups.find((g) => g.id === groupId);
      if (!group) return;
      setRenamingGroupId(groupId);
      setRenameValue(group.name);
    },
    [groups]
  );

  const commitRename = useCallback(() => {
    if (renamingGroupId && renameValue.trim()) {
      onRenameGroup(renamingGroupId, renameValue.trim());
    }
    setRenamingGroupId(null);
  }, [renamingGroupId, renameValue, onRenameGroup]);

  // --- Drag & Drop ---
  const dragGhostRef = useRef<HTMLDivElement | null>(null);

  // Cleanup ghost on unmount (handles edge case: tab switch during drag)
  useEffect(() => {
    return () => {
      if (dragGhostRef.current) {
        dragGhostRef.current.remove();
        dragGhostRef.current = null;
      }
    };
  }, []);

  const handleDragStart = useCallback(
    (e: React.DragEvent, layerId: string) => {
      e.dataTransfer.setData("text/plain", layerId);
      e.dataTransfer.effectAllowed = "move";

      // Create a custom drag ghost from just this row
      const el = e.currentTarget as HTMLElement;
      const ghost = el.cloneNode(true) as HTMLDivElement;
      ghost.style.position = "absolute";
      ghost.style.top = "-9999px";
      ghost.style.left = "-9999px";
      ghost.style.width = `${el.offsetWidth}px`;
      ghost.style.pointerEvents = "none";
      document.body.appendChild(ghost);
      dragGhostRef.current = ghost;

      e.dataTransfer.setDragImage(ghost, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    if (dragGhostRef.current) {
      document.body.removeChild(dragGhostRef.current);
      dragGhostRef.current = null;
    }
    setDragOverGroupId(null);
    setDragOverUngrouped(false);
  }, []);

  const handleGroupDragOver = useCallback(
    (e: React.DragEvent, groupId: string) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = "move";
      setDragOverGroupId(groupId);
      setDragOverUngrouped(false);
    },
    []
  );

  const handleGroupDragLeave = useCallback(
    (e: React.DragEvent) => {
      // Only reset if we're actually leaving the folder row,
      // not just moving between its child elements
      const related = e.relatedTarget as Node | null;
      if (related && e.currentTarget.contains(related)) return;
      setDragOverGroupId(null);
    },
    []
  );

  const handleGroupDrop = useCallback(
    (e: React.DragEvent, groupId: string) => {
      e.preventDefault();
      e.stopPropagation();
      const layerId = e.dataTransfer.getData("text/plain");
      if (layerId) onMoveToGroup(layerId, groupId);
      setDragOverGroupId(null);
    },
    [onMoveToGroup]
  );

  const handleUngroupedDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverUngrouped(true);
  }, []);

  const handleUngroupedDragLeave = useCallback(
    (e: React.DragEvent) => {
      const related = e.relatedTarget as Node | null;
      if (related && e.currentTarget.contains(related)) return;
      setDragOverUngrouped(false);
    },
    []
  );

  const handleUngroupedDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const layerId = e.dataTransfer.getData("text/plain");
      if (layerId) onMoveToGroup(layerId, null);
      setDragOverUngrouped(false);
    },
    [onMoveToGroup]
  );

  // Find which group a layer belongs to — O(1) via precomputed map
  const getLayerGroupId = useCallback(
    (layerId: string) => layerToGroupMap.get(layerId) ?? null,
    [layerToGroupMap]
  );

  // --- Render a layer row ---
  function renderLayerRow(layer: SvgLayer, indent: boolean) {
    return (
      <button
        key={layer.id}
        draggable
        onDragStart={(e) => handleDragStart(e, layer.id)}
        onDragEnd={handleDragEnd}
        onClick={() => handleSelectLayerLocal(layer.id)}
        onContextMenu={(e) => handleLayerContextMenu(e, layer.id)}
        className={cn(
          "flex h-8 items-center gap-2 rounded px-2 text-left transition-colors",
          indent && "ml-5",
          activeLayerIds.has(layer.id)
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
    );
  }

  // --- Render a folder row ---
  function renderGroupRow(group: LayerGroup) {
    const groupLayers = group.layerIds
      .map((id) => layerMap.get(id))
      .filter(Boolean) as SvgLayer[];

    return (
      <div key={group.id}>
        <div
          className={cn(
            "flex h-8 cursor-pointer items-center gap-1.5 rounded px-2 transition-colors hover:bg-muted/50",
            selectedGroupId === group.id && "bg-primary/10",
            dragOverGroupId === group.id &&
              "ring-2 ring-primary/50 bg-primary/5"
          )}
          onClick={() => handleSelectGroup(group.id)}
          onContextMenu={(e) => handleGroupContextMenu(e, group.id)}
          onDragOver={(e) => handleGroupDragOver(e, group.id)}
          onDragLeave={handleGroupDragLeave}
          onDrop={(e) => handleGroupDrop(e, group.id)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onToggleGroupCollapse(group.id); }}
            className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground"
          >
            <HugeiconsIcon
              icon={group.collapsed ? ArrowRight01Icon : ArrowDown01Icon}
              strokeWidth={2}
              className="size-3"
            />
          </button>
          <HugeiconsIcon
            icon={group.collapsed ? FolderIcon : FolderOpenIcon}
            strokeWidth={2}
            className="size-3.5 shrink-0 text-muted-foreground"
          />
          {renamingGroupId === group.id ? (
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setRenamingGroupId(null);
              }}
              className="h-6 flex-1 rounded border border-border bg-background px-1.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="flex-1 truncate text-xs font-medium text-foreground"
              onDoubleClick={() => startRename(group.id)}
            >
              {group.name}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground">
            {groupLayers.length}
          </span>
        </div>

        {/* Nested layers */}
        {!group.collapsed && (
          <div className="flex flex-col gap-0.5">
            {groupLayers.map((layer) => renderLayerRow(layer, true))}
          </div>
        )}
      </div>
    );
  }

  // --- Context menu rendering ---
  const contextMenuRef = useRef<HTMLDivElement>(null);

  function renderContextMenu() {
    if (!contextMenu) return null;

    // Clamp so the menu doesn't overflow the viewport
    const MENU_W = 190;
    const MENU_H_EST = 120;
    const vw = typeof window !== "undefined" ? window.innerWidth : 1000;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const x = Math.min(contextMenu.x, vw - MENU_W - 8);
    const y = Math.min(contextMenu.y, vh - MENU_H_EST - 8);

    // Check if submenu should flip left
    const submenuFlipLeft = x + MENU_W + 168 > vw;

    const menuStyle: React.CSSProperties = {
      position: "fixed",
      left: x,
      top: y,
      zIndex: 9999,
    };

    const itemClass =
      "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground";

    if (contextMenu.type === "layer") {
      const layerGroupId = getLayerGroupId(contextMenu.targetId);

      return (
        <div
          ref={contextMenuRef}
          style={menuStyle}
          className="min-w-[180px] rounded-md border border-border bg-popover p-1 shadow-md"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Move to folder submenu */}
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(submenuCloseTimerRef.current);
              setMoveSubmenuOpen(true);
            }}
          >
            <div ref={submenuTriggerRef} className={cn(itemClass, "cursor-default")}>
              <HugeiconsIcon icon={FolderIcon} strokeWidth={2} className="size-4" />
              <span className="flex-1">{t.tool.moveToFolder}</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className={cn("size-3.5", submenuFlipLeft && "rotate-180")}
              />
            </div>

            {moveSubmenuOpen && (
              <div
                ref={submenuContentRef}
                className="absolute top-0 min-w-[160px] rounded-md border border-border bg-popover p-1 shadow-md"
                style={submenuFlipLeft ? { right: "100%", marginRight: 4 } : { left: "100%", marginLeft: 4 }}
              >
                {groups.map((g) => (
                  <button
                    key={g.id}
                    className={itemClass}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      onMoveToGroup(contextMenu.targetId, g.id);
                      setContextMenu(null);
                    }}
                  >
                    <HugeiconsIcon icon={FolderIcon} strokeWidth={2} className="size-3.5" />
                    <span className="truncate">{g.name}</span>
                  </button>
                ))}
                {groups.length > 0 && (
                  <div className="-mx-1 my-1 h-px bg-border" />
                )}
                <button
                  className={itemClass}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    const id = onCreateGroup(t.tool.folderName);
                    onMoveToGroup(contextMenu.targetId, id);
                    setContextMenu(null);
                  }}
                >
                  <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-3.5" />
                  <span>{t.tool.newFolder}</span>
                </button>
              </div>
            )}
          </div>

          {/* Remove from folder (only if in a group) */}
          {layerGroupId && (
            <button
              className={itemClass}
              onMouseDown={(e) => {
                e.stopPropagation();
                onMoveToGroup(contextMenu.targetId, null);
                setContextMenu(null);
              }}
            >
              <span className="size-4" />
              <span>{t.tool.removeFromFolder}</span>
            </button>
          )}

          <div className="-mx-1 my-1 h-px bg-border" />

          {/* New folder with this layer */}
          <button
            className={itemClass}
            onMouseDown={(e) => {
              e.stopPropagation();
              const id = onCreateGroup(t.tool.folderName);
              onMoveToGroup(contextMenu.targetId, id);
              setContextMenu(null);
            }}
          >
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-4" />
            <span>{t.tool.newFolderWith}</span>
          </button>
        </div>
      );
    }

    // Group context menu
    return (
      <div
        ref={contextMenuRef}
        style={menuStyle}
        className="min-w-[160px] rounded-md border border-border bg-popover p-1 shadow-md"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          className={itemClass}
          onMouseDown={(e) => {
            e.stopPropagation();
            startRename(contextMenu.targetId);
            setContextMenu(null);
          }}
        >
          {t.tool.renameFolder}
        </button>
        <button
          className={itemClass}
          onMouseDown={(e) => {
            e.stopPropagation();
            const group = groups.find((g) => g.id === contextMenu.targetId);
            if (group) {
              group.layerIds.forEach((lid) => onMoveToGroup(lid, null));
            }
            onDeleteGroup(contextMenu.targetId);
            setContextMenu(null);
          }}
        >
          {t.tool.ungroupAll}
        </button>
        <div className="-mx-1 my-1 h-px bg-border" />
        <button
          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
          onMouseDown={(e) => {
            e.stopPropagation();
            onDeleteGroup(contextMenu.targetId);
            setContextMenu(null);
          }}
        >
          {t.tool.deleteFolder}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className="relative flex w-[280px] flex-col overflow-y-auto border-l border-border bg-background"
    >
      {/* Layers Section */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
            {t.tool.layers}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">
              {layers.length} {t.tool.pathCount}
            </span>
            <button
              onClick={handleNewFolder}
              title={t.tool.newFolder}
              className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-3.5" />
            </button>
          </div>
        </div>

        <div
          className={cn(
            "flex max-h-[280px] flex-col gap-0.5 overflow-y-auto",
            dragOverUngrouped && "ring-2 ring-primary/20 rounded"
          )}
          onDragOver={handleUngroupedDragOver}
          onDragLeave={handleUngroupedDragLeave}
          onDrop={handleUngroupedDrop}
        >
          {/* Render groups first */}
          {groups.map((group) => renderGroupRow(group))}

          {/* Render ungrouped layers */}
          {ungroupedLayers.map((layer) => renderLayerRow(layer, false))}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Fill Section */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
            {t.tool.fill}
          </span>
          {isGroupSelection && sharedFill === null && (
            <span className="text-[10px] italic text-muted-foreground">{t.tool.mixed}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fillColorRef.current?.click()}
            className="relative h-8 w-8 shrink-0 rounded-md border border-border"
            style={{
              backgroundColor:
                displayFill && displayFill !== "none"
                  ? displayFill
                  : "transparent",
            }}
          >
            <input
              ref={fillColorRef}
              type="color"
              value={toHex(displayFill || "#000000")}
              onChange={(e) => onBatchUpdateFill(activeIds, e.target.value)}
              disabled={!hasSelection}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              tabIndex={-1}
            />
          </button>
          <input
            type="text"
            value={displayFill}
            onChange={(e) => onBatchUpdateFill(activeIds, e.target.value)}
            disabled={!hasSelection}
            placeholder="#000000"
            className={panelTextInputClass}
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
                const val = (parseInt(e.target.value) / 100).toString();
                onBatchUpdateOpacity(activeIds, val);
              }}
              disabled={!hasSelection}
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
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
            {t.tool.stroke}
          </span>
          {isGroupSelection && sharedStroke === null && (
            <span className="text-[10px] italic text-muted-foreground">{t.tool.mixed}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => strokeColorRef.current?.click()}
            className="relative h-8 w-8 shrink-0 rounded-md border border-border"
            style={{
              backgroundColor:
                displayStroke && displayStroke !== "none"
                  ? displayStroke
                  : "transparent",
            }}
          >
            <input
              ref={strokeColorRef}
              type="color"
              value={toHex(displayStroke || "#000000")}
              onChange={(e) => onBatchUpdateStroke(activeIds, e.target.value)}
              disabled={!hasSelection}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              tabIndex={-1}
            />
          </button>
          <input
            type="text"
            value={displayStroke}
            onChange={(e) => onBatchUpdateStroke(activeIds, e.target.value)}
            disabled={!hasSelection}
            placeholder="none"
            className={panelTextInputClass}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{t.tool.width}</span>
          <input
            type="text"
            value={displayStrokeWidth}
            onChange={(e) => onBatchUpdateStrokeWidth(activeIds, e.target.value)}
            disabled={!hasSelection}
            className={cn(panelSmInputClass, "w-16")}
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
              value={displayLayer ? Math.round(displayLayer.transform.x) : 0}
              onChange={(e) => handleTransformField("x", e.target.value)}
              disabled={!hasSelection}
              className={panelSmInputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground">Y</span>
            <input
              type="number"
              step="1"
              value={displayLayer ? Math.round(displayLayer.transform.y) : 0}
              onChange={(e) => handleTransformField("y", e.target.value)}
              disabled={!hasSelection}
              className={panelSmInputClass}
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
                  displayLayer
                    ? Math.round(displayLayer.transform.rotation)
                    : 0
                }
                onChange={(e) => handleTransformField("rotation", e.target.value)}
                disabled={!hasSelection}
                className={panelSmInputClass}
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
                  displayLayer
                    ? Math.round(displayLayer.transform.scaleX * 100)
                    : 100
                }
                onChange={(e) => {
                  const pct = parseFloat(e.target.value);
                  if (isNaN(pct) || !hasSelection) return;
                  const s = pct / 100;
                  onBatchUpdateTransform(
                    activeLayers.map((l) => ({ id: l.id, transform: { ...l.transform, scaleX: s, scaleY: s } }))
                  );
                }}
                disabled={!hasSelection}
                className={panelSmInputClass}
              />
              <span className="text-[10px] text-muted-foreground">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu Overlay */}
      {renderContextMenu()}
    </div>
  );
});
