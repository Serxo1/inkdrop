"use client";

import { useEffect } from "react";
import type { ToolType } from "@/components/tool/toolbar";

export function useKeyboardShortcuts(actions: {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onDeleteLayer: () => void;
  onDuplicateLayer: () => void;
  onToggleShortcuts: () => void;
  onSetZoom: (fn: (prev: number) => number) => void;
  onSetActiveTool: (tool: ToolType | ((prev: ToolType) => ToolType)) => void;
  toolBeforeSpaceRef: React.MutableRefObject<ToolType | null>;
}) {
  const {
    onUndo,
    onRedo,
    onSave,
    onDeleteLayer,
    onDuplicateLayer,
    onToggleShortcuts,
    onSetZoom,
    onSetActiveTool,
    toolBeforeSpaceRef,
  } = actions;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const mod = e.ctrlKey || e.metaKey;

      // Cmd/Ctrl combos
      if (mod) {
        if (e.shiftKey && e.key.toLowerCase() === "z") {
          e.preventDefault();
          onRedo();
          return;
        }
        if (e.key.toLowerCase() === "z") {
          e.preventDefault();
          onUndo();
          return;
        }
        if (e.key.toLowerCase() === "s") {
          e.preventDefault();
          onSave();
          return;
        }
        if (e.key.toLowerCase() === "k") {
          e.preventDefault();
          onToggleShortcuts();
          return;
        }
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          onSetZoom((prev) => Math.min(prev + 25, 400));
          return;
        }
        if (e.key === "-") {
          e.preventDefault();
          onSetZoom((prev) => Math.max(prev - 25, 25));
          return;
        }
        if (e.key === "0") {
          e.preventDefault();
          onSetZoom(() => 100);
          return;
        }
        if (e.key.toLowerCase() === "d") {
          e.preventDefault();
          onDuplicateLayer();
          return;
        }
        return;
      }

      // Delete/Backspace to delete selected layer
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onDeleteLayer();
        return;
      }

      // Space hold -> temporary pan
      if (e.key === " " && !e.repeat) {
        e.preventDefault();
        onSetActiveTool((current) => {
          if (current !== "pan") {
            toolBeforeSpaceRef.current = current;
          }
          return "pan";
        });
        return;
      }

      switch (e.key.toLowerCase()) {
        case "v":
          onSetActiveTool("select");
          break;
        case "h":
          onSetActiveTool("pan");
          break;
        case "g":
          onSetActiveTool("bucket");
          break;
        case "p":
          onSetActiveTool("pen");
          break;
        case "i":
          onSetActiveTool("eyedropper");
          break;
        case "=":
        case "+":
          onSetZoom((prev) => Math.min(prev + 25, 400));
          break;
        case "-":
          onSetZoom((prev) => Math.max(prev - 25, 25));
          break;
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      if (e.key === " " && toolBeforeSpaceRef.current !== null) {
        onSetActiveTool(toolBeforeSpaceRef.current);
        toolBeforeSpaceRef.current = null;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [
    onSave,
    onUndo,
    onRedo,
    onDeleteLayer,
    onDuplicateLayer,
    onToggleShortcuts,
    onSetZoom,
    onSetActiveTool,
    toolBeforeSpaceRef,
  ]);
}
