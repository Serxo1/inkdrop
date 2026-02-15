"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { FolderOpen, Github, Menu, X } from "lucide-react";
import { LocaleToggle } from "./locale-toggle";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { InkdropLogo } from "@/components/inkdrop-logo";

export function Header() {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg">
      <div className="flex h-16 w-full items-center justify-between px-5 sm:px-8 md:px-20">
        <div className="flex items-center gap-2.5">
          <InkdropLogo size={28} />
          <span className="text-lg font-bold tracking-tight">Inkdrop</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.header.howItWorks}
          </a>
          <a
            href="/gallery"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <FolderOpen className="h-4 w-4" />
            {t.header.gallery}
          </a>
          <a
            href="https://github.com/Serxo1/inkdrop"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            {t.header.github}
          </a>
          <LocaleToggle />
          <AnimatedThemeToggler className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-[18px]" />
          <a
            href="/upload"
            className="rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-80"
          >
            {t.header.openTool}
          </a>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <LocaleToggle />
          <AnimatedThemeToggler className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-[18px]" />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-down nav */}
      <nav
        className={`absolute left-0 right-0 top-16 z-50 flex flex-col gap-1 border-b border-border bg-background/95 px-5 pb-5 pt-3 backdrop-blur-lg transition-all duration-300 ease-out md:hidden ${
          mobileOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <a
          href="#how-it-works"
          onClick={() => setMobileOpen(false)}
          className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {t.header.howItWorks}
        </a>
        <a
          href="/gallery"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <FolderOpen className="h-4 w-4" />
          {t.header.gallery}
        </a>
        <a
          href="https://github.com/Serxo1/inkdrop"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Github className="h-4 w-4" />
          {t.header.github}
        </a>
        <a
          href="/upload"
          onClick={() => setMobileOpen(false)}
          className="mt-2 rounded-lg bg-foreground px-4 py-2.5 text-center text-[13px] font-medium text-background transition-opacity hover:opacity-80"
        >
          {t.header.openTool}
        </a>
      </nav>
    </header>
  );
}
