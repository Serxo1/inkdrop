"use client";

import { useI18n } from "@/lib/i18n";
import { FolderOpen, Github } from "lucide-react";
import { LocaleToggle } from "./locale-toggle";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { InkdropLogo } from "@/components/inkdrop-logo";

export function Header() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-background/80 px-8 backdrop-blur-lg md:px-20">
      <div className="flex items-center gap-2.5">
        <InkdropLogo size={28} />
        <span className="text-lg font-bold tracking-tight">Inkdrop</span>
      </div>

      <nav className="flex items-center gap-6">
        <a
          href="#how-it-works"
          className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
        >
          {t.header.howItWorks}
        </a>
        <a
          href="/gallery"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <FolderOpen className="h-4 w-4" />
          <span className="hidden sm:inline">{t.header.gallery}</span>
        </a>
        <a
          href="https://github.com/Serxo1/inkdrop"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Github className="h-4 w-4" />
          <span className="hidden sm:inline">{t.header.github}</span>
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
    </header>
  );
}
