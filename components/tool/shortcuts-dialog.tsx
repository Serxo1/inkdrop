"use client";

import { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { useI18n } from "@/lib/i18n";
import { useModKey } from "@/lib/utils";

interface ShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
}

interface ShortcutRow {
  keys: string[][];
  labelKey: string;
}

function buildShortcuts(mod: string) {
  const tools: ShortcutRow[] = [
    { keys: [["V"]], labelKey: "select" },
    { keys: [["H"]], labelKey: "pan" },
    { keys: [["P"]], labelKey: "pen" },
    { keys: [["G"]], labelKey: "bucket" },
    { keys: [["I"]], labelKey: "eyedropper" },
  ];

  const nav: ShortcutRow[] = [
    { keys: [["Space"]], labelKey: "holdPan" },
    { keys: [[mod, "+"]], labelKey: "zoomIn" },
    { keys: [[mod, "\u2212"]], labelKey: "zoomOut" },
    { keys: [[mod, "0"]], labelKey: "zoomReset" },
    { keys: [[mod, "Scroll"]], labelKey: "zoomScroll" },
  ];

  const actions: ShortcutRow[] = [
    { keys: [[mod, "Z"]], labelKey: "undo" },
    { keys: [[mod, "\u21E7", "Z"]], labelKey: "redo" },
    { keys: [[mod, "S"]], labelKey: "save" },
    { keys: [[mod, "D"]], labelKey: "duplicate" },
    { keys: [["Del"]], labelKey: "delete" },
    { keys: [[mod, "K"]], labelKey: "shortcuts" },
  ];

  return { tools, nav, actions };
}

export function ShortcutsDialog({ open, onClose }: ShortcutsDialogProps) {
  const { t } = useI18n();
  const mod = useModKey();

  const { tools, nav, actions } = useMemo(() => buildShortcuts(mod), [mod]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const labels = t.tool.shortcutLabels;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold text-foreground">
            {labels.title}
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-5 py-4">
          <ShortcutSection title={labels.sectionTools} rows={tools} labels={labels} />
          <ShortcutSection title={labels.sectionNavigation} rows={nav} labels={labels} />
          <ShortcutSection title={labels.sectionActions} rows={actions} labels={labels} />
        </div>
      </div>
    </div>
  );
}

function ShortcutSection({
  title,
  rows,
  labels,
}: {
  title: string;
  rows: ShortcutRow[];
  labels: Record<string, string>;
}) {
  return (
    <div>
      <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div
            key={row.labelKey}
            className="flex items-center justify-between rounded-md px-1 py-1"
          >
            <span className="text-[13px] text-foreground">
              {labels[row.labelKey] || row.labelKey}
            </span>
            <div className="flex items-center gap-1">
              {row.keys.map((combo, ci) => (
                <span key={ci} className="flex items-center gap-0.5">
                  {combo.map((k) => (
                    <Kbd key={k}>{k}</Kbd>
                  ))}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
