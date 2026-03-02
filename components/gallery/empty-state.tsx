"use client";

import { useI18n } from "@/lib/i18n";
import { FolderOpen } from "lucide-react";
import Link from "next/link";

export function EmptyState() {
  const { t } = useI18n();

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex flex-col items-center justify-center py-16">
        <FolderOpen className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">{t.gallery.emptyTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.gallery.emptySubtitle}
        </p>
        <Link
          href="/upload"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80"
        >
          {t.gallery.uploadSvg}
        </Link>
      </div>

      <section className="w-full max-w-4xl pb-16">
        <h2 className="text-center text-xl font-bold tracking-tight">
          {t.gallery.whyUseTitle}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.gallery.whyUseItems.map((item, i) => (
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
    </div>
  );
}
