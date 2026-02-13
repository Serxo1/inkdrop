"use client";

import { useI18n } from "@/lib/i18n";
import { Github, Upload } from "lucide-react";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="flex flex-col items-center px-6 pb-16 pt-20 md:pt-28">
      <div className="mb-6 flex h-7 items-center gap-1.5 rounded-full bg-primary/10 px-3.5">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="text-xs font-medium text-primary">{t.hero.badge}</span>
      </div>

      <h1 className="max-w-2xl whitespace-pre-line text-center text-4xl font-extrabold leading-[1.05] tracking-tight md:text-[56px]">
        {t.hero.title}
      </h1>

      <p className="mt-6 max-w-lg whitespace-pre-line text-center text-base leading-relaxed text-muted-foreground md:text-lg">
        {t.hero.subtitle}
      </p>

      <div className="mt-8 flex items-center gap-3">
        <a
          href="/upload"
          className="flex h-12 items-center gap-2 rounded-[10px] bg-primary px-7 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Upload className="h-[18px] w-[18px]" />
          {t.hero.upload}
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center gap-2 rounded-[10px] border border-border px-7 text-[15px] font-medium transition-colors hover:bg-muted"
        >
          <Github className="h-[18px] w-[18px]" />
          {t.hero.viewGithub}
        </a>
      </div>
    </section>
  );
}
