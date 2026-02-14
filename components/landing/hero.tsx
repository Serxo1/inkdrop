"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Github, Upload } from "lucide-react";

function BrowserMockup() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="mt-14 w-full max-w-5xl px-4 md:mt-16 md:px-0">
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-2xl shadow-black/10 dark:shadow-black/30">
        {/* Title bar */}
        <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/50 px-4">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
          <div className="ml-3 flex h-6 flex-1 items-center justify-center rounded-md bg-background/60 px-3">
            <span className="text-[11px] text-muted-foreground">inkdrop.app/tool</span>
          </div>
          <div className="w-14" />
        </div>
        {/* Screenshot */}
        <div className="w-full">
          {mounted ? (
            <Image
              src={
                resolvedTheme === "dark"
                  ? "/images/hero/dark-hero.png"
                  : "/images/hero/light-hero.png"
              }
              alt="Inkdrop tool preview"
              width={1920}
              height={1080}
              className="block h-auto w-full"
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
            />
          ) : (
            <Image
              src="/images/hero/light-hero.png"
              alt="Inkdrop tool preview"
              width={1920}
              height={1080}
              className="block h-auto w-full"
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
            />
          )}
        </div>
      </div>
    </div>
  );
}

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
          href="https://github.com/Serxo1/inkdrop"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center gap-2 rounded-[10px] border border-border px-7 text-[15px] font-medium transition-colors hover:bg-muted"
        >
          <Github className="h-[18px] w-[18px]" />
          {t.hero.viewGithub}
        </a>
      </div>

      <BrowserMockup />
    </section>
  );
}
