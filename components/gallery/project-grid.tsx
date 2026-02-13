"use client";

import type { SavedProject } from "@/lib/storage";
import { ProjectCard } from "./project-card";

interface ProjectGridProps {
  projects: SavedProject[];
  onDelete: (id: string) => void;
}

export function ProjectGrid({ projects, onDelete }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onDelete={onDelete} />
      ))}
    </div>
  );
}
