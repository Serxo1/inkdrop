"use client";

import { EmptyState } from "@/components/gallery/empty-state";
import { ProjectGrid } from "@/components/gallery/project-grid";
import { Header } from "@/components/landing/header";
import { useI18n } from "@/lib/i18n";
import {
  deleteProject,
  getProjects,
  type SavedProject,
} from "@/lib/storage";
import { useCallback, useSyncExternalStore } from "react";

const emptyProjects: SavedProject[] = [];
let cachedProjects: SavedProject[] | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): SavedProject[] {
  if (cachedProjects === null) {
    cachedProjects = getProjects();
  }
  return cachedProjects;
}

function getServerSnapshot(): SavedProject[] {
  return emptyProjects;
}

function invalidateCache() {
  cachedProjects = null;
  cachedProjects = getProjects();
  listeners.forEach((l) => l());
}

export default function GalleryPage() {
  const { t } = useI18n();
  const projects = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleDelete = useCallback((id: string) => {
    deleteProject(id);
    invalidateCache();
  }, []);

  const mounted = typeof window !== "undefined";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="px-8 py-8 md:px-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {t.gallery.title}
            </h1>
            <p className="mt-1 text-muted-foreground">{t.gallery.subtitle}</p>
          </div>
          {mounted && projects.length > 0 && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs">
              {projects.length} {t.gallery.projectCount}
            </span>
          )}
        </div>
      </div>

      <div className="px-8 pb-16 md:px-20">
        {mounted && projects.length === 0 ? (
          <EmptyState />
        ) : (
          <ProjectGrid projects={projects} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
