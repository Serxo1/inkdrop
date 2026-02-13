interface Step {
  title: string;
  description: string;
}

interface Feature {
  title: string;
  description: string;
}

interface UploadFeature {
  title: string;
  description: string;
}

export interface Translations {
  header: { howItWorks: string; github: string; openTool: string };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    upload: string;
    viewGithub: string;
  };
  howItWorks: { title: string; subtitle: string; steps: [Step, Step, Step] };
  features: {
    title: string;
    items: [Feature, Feature, Feature, Feature];
  };
  cta: { title: string; subtitle: string; button: string };
  footer: { madeBy: string; polyaxis: string; license: string };
  upload: {
    title: string;
    subtitle: string;
    dropTitle: string;
    dropOr: string;
    browseFiles: string;
    hint: string;
    invalidFile: string;
    fileTooLarge: string;
    features: [UploadFeature, UploadFeature, UploadFeature];
  };
  tool: {
    untitledProject: string;
    save: string;
    export: string;
    layers: string;
    pathCount: string;
    fill: string;
    stroke: string;
    opacity: string;
    width: string;
    emptyCanvas: string;
    tools: {
      select: string;
      pan: string;
      brush: string;
      bucket: string;
      eyedropper: string;
      zoomIn: string;
      zoomOut: string;
    };
  };
  gallery: {
    title: string;
    subtitle: string;
    projectCount: string;
    open: string;
    download: string;
    delete: string;
    deleteConfirm: string;
    emptyTitle: string;
    emptySubtitle: string;
    uploadSvg: string;
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  };
}

export const en: Translations = {
  header: {
    howItWorks: "How it works",
    github: "GitHub",
    openTool: "Open tool",
  },
  hero: {
    badge: "100% free, no catch",
    title: "Your SVGs are boring.\nLet's fix that.",
    subtitle:
      "Drop an SVG, click on any path, pick a color. That's it.\nNo sign-up, no backend, no tracking. Just vibes and vectors.",
    upload: "Upload your SVG",
    viewGithub: "View on GitHub",
  },
  howItWorks: {
    title: "Dead simple. Like, really.",
    subtitle:
      "Three steps. No tutorial needed. Your grandma could do this.",
    steps: [
      {
        title: "Drop your SVG",
        description:
          "Drag it in or click to browse.\nWe accept any .svg file up to 5MB.",
      },
      {
        title: "Go wild with colors",
        description:
          "Click on any path and pick a color.\nFill, stroke, opacity — it's all there.",
      },
      {
        title: "Download & flex",
        description:
          "Export your masterpiece as SVG.\nSave to browser for later, too.",
      },
    ],
  },
  features: {
    title: "Why you'll like this",
    items: [
      {
        title: "No backend. Zero.",
        description:
          "Everything runs in your browser. Your files never leave your machine. Promise.",
      },
      {
        title: "Save with SQLite",
        description:
          "Projects are saved right in your browser. Come back tomorrow, your work is still there.",
      },
      {
        title: "Open source, obviously",
        description:
          "MIT license. Fork it, break it, improve it. PRs welcome, bugs expected.",
      },
      {
        title: "Fast as heck",
        description:
          "No server roundtrips. Instant color changes. Your SVG, your CPU, your speed.",
      },
    ],
  },
  cta: {
    title: "Stop staring at black SVGs.",
    subtitle:
      "Seriously, go color something. It's free and takes 10 seconds.",
    button: "Start coloring — it's free",
  },
  footer: {
    madeBy: "Made with caffeine by",
    polyaxis: "Polyaxis",
    license: "MIT License — do whatever you want",
  },
  upload: {
    title: "Color your SVGs",
    subtitle:
      "Upload an SVG file and paint each path with the color you want. Free, open-source, no backend.",
    dropTitle: "Drag & drop your SVG here",
    dropOr: "or",
    browseFiles: "Browse files",
    hint: "Supports .svg files up to 5MB",
    invalidFile: "Please upload a valid .svg file",
    fileTooLarge: "File is too large. Max 5MB.",
    features: [
      {
        title: "Paint paths",
        description: "Click any path and pick a color",
      },
      {
        title: "Save locally",
        description: "Projects saved in your browser with SQLite",
      },
      {
        title: "Export SVG",
        description: "Download your colored SVG anytime",
      },
    ],
  },
  tool: {
    untitledProject: "Untitled Project",
    save: "Save",
    export: "Export",
    layers: "Layers",
    pathCount: "paths",
    fill: "Fill",
    stroke: "Stroke",
    opacity: "Opacity",
    width: "Width",
    emptyCanvas: "SVG canvas",
    tools: {
      select: "Select",
      pan: "Pan",
      brush: "Brush",
      bucket: "Fill",
      eyedropper: "Eyedropper",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
    },
  },
  gallery: {
    title: "Gallery",
    subtitle: "Your saved masterpieces",
    projectCount: "projects",
    open: "Open",
    download: "Download",
    delete: "Delete",
    deleteConfirm: "Are you sure you want to delete this project?",
    emptyTitle: "No projects yet",
    emptySubtitle: "Upload an SVG to get started",
    uploadSvg: "Upload SVG",
    justNow: "just now",
    minutesAgo: "min ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",
  },
};
