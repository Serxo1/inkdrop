"use client";

import Link from "next/link";
import {
  ChevronDown,
  ClipboardCopy,
  Download,
  FileImage,
  FileCode2,
  FolderOpen,
  Layers,
  RotateCcw,
  Save,
  Shuffle,
  Undo2,
  Redo2,
  Check,
} from "lucide-react";
import type { ExportFormat } from "@/lib/svg-export";
import { useI18n } from "@/lib/i18n";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { COLOR_PALETTES, type ColorPalette } from "@/lib/color-palettes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { InkdropLogo } from "@/components/inkdrop-logo";

interface EditorHeaderProps {
  fileName: string;
  projectName: string;
  onProjectNameChange: (name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onRandomize: () => void;
  onSave: () => void;
  onExport: () => void;
  onExportAs: (format: ExportFormat) => void;
  onCopySvg: () => void;
  saved: boolean;
  copied: boolean;
  selectedPalette: ColorPalette | null;
  onSelectPalette: (palette: ColorPalette | null) => void;
  onToggleProperties: () => void;
}

export function EditorHeader({
  fileName,
  projectName,
  onProjectNameChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onRandomize,
  onSave,
  onExport,
  onExportAs,
  onCopySvg,
  saved,
  copied,
  selectedPalette,
  onSelectPalette,
  onToggleProperties,
}: EditorHeaderProps) {
  const { t } = useI18n();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-2 sm:h-14 sm:px-4">
      {/* Left: Logo + Gallery + Undo/Redo */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        <Link href="/" className="flex items-center gap-1.5 pr-1 sm:gap-2 sm:pr-3">
          <InkdropLogo size={24} className="sm:h-7 sm:w-7" />
          <span className="hidden text-sm font-bold text-foreground sm:inline">Inkdrop</span>
        </Link>
        <Link
          href="/gallery"
          className="hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
        >
          <FolderOpen size={14} />
          {t.gallery.title}
        </Link>

        <div className="mx-1 h-5 w-px bg-border sm:mx-2" />

        <button
          onClick={onUndo}
          disabled={!canUndo}
          title={`${t.tool.undo} (Ctrl+Z)`}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
        >
          <Undo2 size={15} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title={`${t.tool.redo} (Ctrl+Shift+Z)`}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
        >
          <Redo2 size={15} />
        </button>
      </div>

      {/* Center: File name + Project name */}
      <div className="hidden items-center gap-1.5 sm:flex">
        <span className="text-[13px] text-muted-foreground">{fileName}</span>
        <span className="text-[13px] text-muted-foreground">&mdash;</span>
        <input
          type="text"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          className="bg-transparent text-[13px] font-medium text-foreground outline-none"
        />
      </div>

      {/* Right: Reset + Randomize + Save + Export */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        <button
          onClick={onReset}
          title={t.tool.reset}
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:px-2.5"
        >
          <RotateCcw size={14} />
          <span className="hidden lg:inline">{t.tool.reset}</span>
        </button>
        <div className="flex items-center">
          <button
            onClick={onRandomize}
            title={t.tool.randomize}
            className="inline-flex h-8 items-center gap-1.5 rounded-l-md px-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:px-2.5"
          >
            <Shuffle size={14} />
            <span className="hidden lg:inline">
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
                onClick={() => onSelectPalette(null)}
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
                  onClick={() => onSelectPalette(palette)}
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

        <AnimatedThemeToggler className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex [&_svg]:size-[15px]" />

        <div className="mx-0.5 h-5 w-px bg-border sm:mx-1" />

        <button
          onClick={onSave}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2 text-[13px] text-foreground transition-colors hover:bg-muted sm:px-3.5"
        >
          <Save size={14} />
          <span className="hidden sm:inline">{saved ? "Saved!" : t.tool.save}</span>
        </button>
        <div className="flex items-center">
          <button
            onClick={onExport}
            className="inline-flex h-8 items-center gap-1.5 rounded-l-md bg-primary px-2 text-[13px] text-primary-foreground transition-colors hover:bg-primary/90 sm:px-3.5"
          >
            <Download size={14} />
            <span className="hidden sm:inline">{t.tool.export}</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex h-8 items-center rounded-r-md border-l border-primary-foreground/20 bg-primary px-1.5 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ChevronDown size={12} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => onExportAs("svg")}
                className="flex items-center gap-2"
              >
                <FileCode2 size={14} className="text-muted-foreground" />
                {t.tool.exportFormats.svg}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExportAs("png")}
                className="flex items-center gap-2"
              >
                <FileImage size={14} className="text-muted-foreground" />
                {t.tool.exportFormats.png}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExportAs("jpeg")}
                className="flex items-center gap-2"
              >
                <FileImage size={14} className="text-muted-foreground" />
                {t.tool.exportFormats.jpeg}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExportAs("webp")}
                className="flex items-center gap-2"
              >
                <FileImage size={14} className="text-muted-foreground" />
                {t.tool.exportFormats.webp}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onCopySvg}
                className="flex items-center gap-2"
              >
                <ClipboardCopy size={14} className="text-muted-foreground" />
                {copied ? "Copied!" : t.tool.exportFormats.copySvg}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile: toggle properties panel */}
        <button
          onClick={onToggleProperties}
          title={t.tool.layers}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
        >
          <Layers size={15} />
        </button>
      </div>
    </header>
  );
}
