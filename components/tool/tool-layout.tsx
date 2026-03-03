"use client";

import { useCallback, useRef, useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useRecentColors } from "@/hooks/use-recent-colors";
import { useEditorState } from "@/hooks/use-editor-state";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { AdSlot } from "@/components/ad-slot";
import { EditorHeader } from "./editor-header";
import { Toolbar, type ToolType } from "./toolbar";
import { Canvas } from "./canvas";
import { PropertiesPanel } from "./properties-panel";
import { ShortcutsDialog } from "./shortcuts-dialog";

export function ToolLayout() {
  const { t } = useI18n();
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [selectedColor, setSelectedColor] = useState("#E11D48");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showProperties, setShowProperties] = useState(false);

  // Space-hold temporary pan
  const toolBeforeSpaceRef = useRef<ToolType | null>(null);

  const { recentColors, addRecentColor } = useRecentColors();

  const editor = useEditorState({
    addRecentColor,
    selectedColor,
    setActiveTool,
    defaultProjectName: t.tool.untitledProject,
  });

  // Wrap eyedrop to also set the selected color
  const handleEyedrop = useCallback(
    (elementId: string) => {
      const color = editor.handleEyedrop(elementId);
      setSelectedColor(color);
    },
    [editor.handleEyedrop]
  );

  const handleToolChange = useCallback((tool: ToolType) => {
    if (tool === "zoomIn") {
      editor.setZoom((prev) => Math.min(prev + 25, 400));
      return;
    }
    if (tool === "zoomOut") {
      editor.setZoom((prev) => Math.max(prev - 25, 25));
      return;
    }
    setActiveTool(tool);
  }, [editor.setZoom]);

  const handleToggleShortcuts = useCallback(() => setShowShortcuts((prev) => !prev), []);

  useKeyboardShortcuts({
    onUndo: editor.handleUndo,
    onRedo: editor.handleRedo,
    onSave: editor.handleSave,
    onDeleteLayer: editor.handleDeleteLayer,
    onDuplicateLayer: editor.handleDuplicateLayer,
    onToggleShortcuts: handleToggleShortcuts,
    onSetZoom: editor.setZoom,
    onSetActiveTool: setActiveTool,
    toolBeforeSpaceRef,
  });

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader
        fileName={editor.fileName}
        projectName={editor.projectName}
        onProjectNameChange={editor.setProjectName}
        canUndo={editor.canUndo}
        canRedo={editor.canRedo}
        onUndo={editor.handleUndo}
        onRedo={editor.handleRedo}
        onReset={editor.handleReset}
        onRandomize={editor.handleRandomize}
        onSave={editor.handleSave}
        onExport={editor.handleExport}
        onExportAs={editor.handleExportAs}
        onCopySvg={editor.handleCopySvg}
        saved={editor.saved}
        copied={editor.copied}
        selectedPalette={editor.selectedPalette}
        onSelectPalette={editor.setSelectedPalette}
        onToggleProperties={() => setShowProperties((v) => !v)}
      />

      {/* Body */}
      <div className="relative flex flex-1 overflow-hidden">
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
          svgContent={editor.svgContent}
          selectedLayerId={editor.selectedLayerId}
          activeTool={activeTool}
          zoom={editor.zoom}
          onSelectLayer={editor.handleSelectLayer}
          onBucketFill={editor.handleBucketFill}
          onEyedrop={handleEyedrop}
          onDragMove={editor.handleDragMove}
          onDragEnd={editor.handleDragEnd}
          onPathUpdate={editor.handlePathUpdate}
          onPathUpdateEnd={editor.handlePathUpdateEnd}
          onZoom={editor.handleZoom}
        />

        {/* Desktop: always visible properties panel */}
        <div className="hidden md:block">
          <PropertiesPanel
            layers={editor.layers}
            selectedLayerId={editor.selectedLayerId}
            onSelectLayer={(id) => editor.handleSelectLayer(id)}
            onUpdateFill={editor.handleUpdateFill}
            onUpdateStroke={editor.handleUpdateStroke}
            onUpdateStrokeWidth={editor.handleUpdateStrokeWidth}
            onUpdateOpacity={editor.handleUpdateOpacity}
            onUpdateTransform={editor.handleUpdateTransform}
            onBatchUpdateFill={editor.handleBatchUpdateFill}
            onBatchUpdateStroke={editor.handleBatchUpdateStroke}
            onBatchUpdateStrokeWidth={editor.handleBatchUpdateStrokeWidth}
            onBatchUpdateOpacity={editor.handleBatchUpdateOpacity}
            onBatchUpdateTransform={editor.handleBatchUpdateTransform}
            groups={editor.groups}
            onCreateGroup={editor.handleCreateGroup}
            onRenameGroup={editor.handleRenameGroup}
            onDeleteGroup={editor.handleDeleteGroup}
            onMoveToGroup={editor.handleMoveToGroup}
            onToggleGroupCollapse={editor.handleToggleGroupCollapse}
          />
        </div>

        {/* Mobile: slide-over properties panel */}
        {showProperties && (
          <div className="absolute inset-y-0 right-0 z-40 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/30"
              onClick={() => setShowProperties(false)}
            />
            <div className="relative flex flex-col border-l border-border bg-background shadow-xl">
              <button
                onClick={() => setShowProperties(false)}
                className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X size={15} />
              </button>
              <PropertiesPanel
                layers={editor.layers}
                selectedLayerId={editor.selectedLayerId}
                onSelectLayer={(id) => editor.handleSelectLayer(id)}
                onUpdateFill={editor.handleUpdateFill}
                onUpdateStroke={editor.handleUpdateStroke}
                onUpdateStrokeWidth={editor.handleUpdateStrokeWidth}
                onUpdateOpacity={editor.handleUpdateOpacity}
                onUpdateTransform={editor.handleUpdateTransform}
                onBatchUpdateFill={editor.handleBatchUpdateFill}
                onBatchUpdateStroke={editor.handleBatchUpdateStroke}
                onBatchUpdateStrokeWidth={editor.handleBatchUpdateStrokeWidth}
                onBatchUpdateOpacity={editor.handleBatchUpdateOpacity}
                onBatchUpdateTransform={editor.handleBatchUpdateTransform}
                groups={editor.groups}
                onCreateGroup={editor.handleCreateGroup}
                onRenameGroup={editor.handleRenameGroup}
                onDeleteGroup={editor.handleDeleteGroup}
                onMoveToGroup={editor.handleMoveToGroup}
                onToggleGroupCollapse={editor.handleToggleGroupCollapse}
              />
            </div>
          </div>
        )}
      </div>

      {/* Ad: slim bottom bar — stays out of the editor workspace */}
      <div className="flex shrink-0 items-center justify-center border-t border-border bg-background px-2 py-1.5">
        <AdSlot id="2568832595" size="banner" className="h-[50px]" />
      </div>

      <ShortcutsDialog
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
