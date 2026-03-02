"use client";

import { useI18n } from "@/lib/i18n";

export function UseCases() {
  const { t } = useI18n();

  return (
    <section className="w-full max-w-2xl mt-16">
      <h2 className="text-center text-xl font-bold tracking-tight">
        {t.uploadUseCases.title}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {t.uploadUseCases.items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-background p-5"
          >
            <h3 className="text-[13px] font-semibold">{item.title}</h3>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
