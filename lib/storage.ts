export interface SavedProject {
  id: string;
  name: string;
  fileName: string;
  svgContent: string;
  thumbnail: string;
  updatedAt: number;
  createdAt: number;
}

const STORAGE_KEY = "inkdrop-projects";

function readProjects(): SavedProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item: unknown): item is SavedProject =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).id === "string" &&
        typeof (item as Record<string, unknown>).svgContent === "string"
    );
  } catch {
    return [];
  }
}

function writeProjects(projects: SavedProject[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getProjects(): SavedProject[] {
  return readProjects().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getProject(id: string): SavedProject | null {
  const projects = readProjects();
  return projects.find((p) => p.id === id) ?? null;
}

export function saveProject(
  project: Omit<SavedProject, "id" | "createdAt" | "updatedAt">
): SavedProject {
  const now = Date.now();
  const newProject: SavedProject = {
    ...project,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  const projects = readProjects();
  projects.push(newProject);
  writeProjects(projects);
  return newProject;
}

export function updateProject(
  id: string,
  data: Partial<SavedProject>
): SavedProject | null {
  const projects = readProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const updated: SavedProject = {
    ...projects[index],
    ...data,
    id: projects[index].id,
    createdAt: projects[index].createdAt,
    updatedAt: Date.now(),
  };
  projects[index] = updated;
  writeProjects(projects);
  return updated;
}

export function deleteProject(id: string): void {
  const projects = readProjects();
  writeProjects(projects.filter((p) => p.id !== id));
}

export function exportProjectAsSvg(project: SavedProject): void {
  const blob = new Blob([project.svgContent], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = project.fileName || `${project.name}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
