"use client";

import { useI18n } from "@/lib/i18n";
import { InkdropLogo } from "@/components/inkdrop-logo";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border px-6 py-8 md:px-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        {/* Top row */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <InkdropLogo size={24} />
            <span className="text-sm font-semibold">Inkdrop</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.header.github}
            </a>
            <a
              href="#how-it-works"
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.header.howItWorks}
            </a>
            <a
              href="mailto:suporte@polyaxis.com.br"
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              suporte@polyaxis.com.br
            </a>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground/70">
            {t.footer.madeBy}{" "}
            <a
              href="https://www.polyaxis.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              {t.footer.polyaxis}
            </a>{" "}
            — www.polyaxis.com.br
          </p>
          <p className="text-xs text-muted-foreground/70">
            {t.footer.license}
          </p>
        </div>
      </div>
    </footer>
  );
}
