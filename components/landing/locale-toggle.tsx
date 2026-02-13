"use client";

import { useI18n, type Locale } from "@/lib/i18n";

const labels: Record<Locale, string> = { en: "EN", pt: "PT" };

export function LocaleToggle() {
  const { locale, setLocale } = useI18n();
  const next: Locale = locale === "en" ? "pt" : "en";

  return (
    <button
      onClick={() => setLocale(next)}
      className="text-muted-foreground hover:text-foreground rounded-md border border-border px-2.5 py-1 text-xs font-medium transition-colors"
    >
      {labels[locale]}
    </button>
  );
}
