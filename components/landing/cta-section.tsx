"use client";

import { useI18n } from "@/lib/i18n";
import { Upload } from "lucide-react";

export function CtaSection() {
  const { t } = useI18n();

  return (
    <section className="flex flex-col items-center px-6 py-20 md:py-24">
      <h2 className="text-center text-3xl font-extrabold tracking-tight md:text-4xl">
        {t.cta.title}
      </h2>
      <p className="mt-4 text-center text-base text-muted-foreground md:text-lg">
        {t.cta.subtitle}
      </p>
      <a
        href="/tool"
        className="mt-8 flex h-[52px] items-center gap-2 rounded-[10px] bg-primary px-8 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Upload className="h-5 w-5" />
        {t.cta.button}
      </a>
    </section>
  );
}
