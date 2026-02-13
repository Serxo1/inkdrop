"use client";

import { useI18n } from "@/lib/i18n";
import { FolderOpen } from "lucide-react";
import Link from "next/link";

export function EmptyState() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center py-20">
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
  );
}
