"use client";

import { useI18n } from "@/lib/i18n";
import { formatRelativeTime } from "@/lib/relative-time";
import { exportProjectAsSvg, type SavedProject } from "@/lib/storage";
import { Download, ExternalLink, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: SavedProject;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const { t } = useI18n();
  const router = useRouter();

  const relativeTime = formatRelativeTime(project.updatedAt, {
    justNow: t.gallery.justNow,
    minutesAgo: t.gallery.minutesAgo,
    hoursAgo: t.gallery.hoursAgo,
    daysAgo: t.gallery.daysAgo,
  });

  function handleOpen() {
    sessionStorage.setItem("inkdrop-upload", project.svgContent);
    sessionStorage.setItem("inkdrop-project-id", project.id);
    router.push("/tool");
  }

  function handleDownload() {
    exportProjectAsSvg(project);
  }

  function handleDelete() {
    if (window.confirm(t.gallery.deleteConfirm)) {
      onDelete(project.id);
    }
  }

  return (
    <div className="group overflow-hidden rounded-xl border border-border transition-colors hover:border-primary/50">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-muted/30 p-6">
        <div
          className="flex h-full w-full items-center justify-center [&>svg]:max-h-full [&>svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: project.thumbnail }}
        />
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handleOpen}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-background px-3 text-xs font-medium text-foreground transition-opacity hover:opacity-80"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t.gallery.open}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-80"
          >
            <Download className="h-3.5 w-3.5" />
            {t.gallery.download}
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-destructive/10 px-3 text-xs text-destructive transition-opacity hover:opacity-80"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="truncate text-sm font-medium">{project.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {project.fileName}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{relativeTime}</span>
        </div>
      </div>
    </div>
  );
}
