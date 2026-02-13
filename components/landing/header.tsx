"use client";

import { useI18n } from "@/lib/i18n";
import { Github } from "lucide-react";
import { LocaleToggle } from "./locale-toggle";

export function Header() {
  const { t } = useI18n();

  return (
    <header className="flex h-16 w-full items-center justify-between px-8 md:px-20">
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-primary" />
        <span className="text-lg font-bold tracking-tight">SVG Color</span>
      </div>

      <nav className="flex items-center gap-6">
        <a
          href="#how-it-works"
          className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
        >
          {t.header.howItWorks}
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Github className="h-4 w-4" />
          <span className="hidden sm:inline">{t.header.github}</span>
        </a>
        <LocaleToggle />
        <a
          href="/tool"
          className="rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-80"
        >
          {t.header.openTool}
        </a>
      </nav>
    </header>
  );
}
