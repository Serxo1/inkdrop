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

interface FaqItem {
  question: string;
  answer: string;
}

interface UseCase {
  title: string;
  description: string;
}

export interface Translations {
  header: { howItWorks: string; gallery: string; github: string; openTool: string };
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
    exportAs: string;
    exportFormats: {
      svg: string;
      png: string;
      jpeg: string;
      webp: string;
      copySvg: string;
    };
    undo: string;
    redo: string;
    reset: string;
    randomize: string;
    palettes: {
      random: string;
      pastel: string;
      sunset: string;
      ocean: string;
      forest: string;
      neon: string;
      earth: string;
      candy: string;
      monochrome: string;
      retro: string;
      aurora: string;
    };
    layers: string;
    pathCount: string;
    fill: string;
    stroke: string;
    opacity: string;
    width: string;
    transform: string;
    rotation: string;
    scale: string;
    emptyCanvas: string;
    tools: {
      select: string;
      pan: string;
      pen: string;
      bucket: string;
      eyedropper: string;
      zoomIn: string;
      zoomOut: string;
    };
    newFolder: string;
    renameFolder: string;
    deleteFolder: string;
    ungroupAll: string;
    moveToFolder: string;
    removeFromFolder: string;
    newFolderWith: string;
    folderName: string;
    shortcutLabels: Record<string, string>;
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
    whyUseTitle: string;
    whyUseItems: [UseCase, UseCase, UseCase, UseCase];
  };
  faq: {
    title: string;
    subtitle: string;
    items: [FaqItem, FaqItem, FaqItem, FaqItem, FaqItem, FaqItem, FaqItem, FaqItem];
  };
  uploadUseCases: {
    title: string;
    items: [UseCase, UseCase, UseCase, UseCase, UseCase, UseCase];
  };
}

export const en: Translations = {
  header: {
    howItWorks: "How it works",
    gallery: "Gallery",
    github: "GitHub",
    openTool: "Open tool",
  },
  hero: {
    badge: "Free forever, open source",
    title: "Edit SVGs\nlike you mean it.",
    subtitle:
      "Recolor paths, reshape curves, move layers around. All in your browser.\nNo account. No backend. No BS.",
    upload: "Open the editor",
    viewGithub: "View on GitHub",
  },
  howItWorks: {
    title: "Dead simple. Like, really.",
    subtitle:
      "Three steps. No tutorial needed. Your grandma could do this.",
    steps: [
      {
        title: "Drop any SVG",
        description:
          "Drag it in. We handle icons, illustrations, logos —\nanything .svg up to 5MB.",
      },
      {
        title: "Make it yours",
        description:
          "Pick colors, tweak bezier curves, move shapes around.\nPen tool, eyedropper, keyboard shortcuts — it's all there.",
      },
      {
        title: "Export & ship",
        description:
          "Download your SVG or save it to your browser.\nCome back tomorrow, it's still there.",
      },
    ],
  },
  features: {
    title: "Built different",
    items: [
      {
        title: "Runs locally",
        description:
          "Your files never leave your machine. No uploads, no servers, no tracking. Period.",
      },
      {
        title: "Saves in your browser",
        description:
          "Projects persist in local storage. Close the tab, reopen next week — everything's there.",
      },
      {
        title: "Keyboard-first",
        description:
          "Space to pan, P for pen, Cmd+K for shortcuts. Feels like a real design tool.",
      },
      {
        title: "Instant feedback",
        description:
          "No loading spinners. Color changes, path edits, undo/redo — all instant.",
      },
    ],
  },
  cta: {
    title: "Your SVGs deserve better.",
    subtitle:
      "Stop opening Figma for a color change. It takes 10 seconds here.",
    button: "Start editing — it's free",
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
    exportAs: "Export as",
    exportFormats: {
      svg: "SVG file",
      png: "PNG image",
      jpeg: "JPEG image",
      webp: "WebP image",
      copySvg: "Copy SVG code",
    },
    undo: "Undo",
    redo: "Redo",
    reset: "Reset",
    randomize: "Randomize",
    palettes: {
      random: "Random",
      pastel: "Pastel",
      sunset: "Sunset",
      ocean: "Ocean",
      forest: "Forest",
      neon: "Neon",
      earth: "Earth",
      candy: "Candy",
      monochrome: "Monochrome",
      retro: "Retro",
      aurora: "Aurora",
    },
    layers: "Layers",
    pathCount: "paths",
    fill: "Fill",
    stroke: "Stroke",
    opacity: "Opacity",
    width: "Width",
    transform: "Transform",
    rotation: "Rotation",
    scale: "Scale",
    newFolder: "New folder",
    renameFolder: "Rename folder",
    deleteFolder: "Delete folder",
    ungroupAll: "Ungroup all",
    moveToFolder: "Move to folder",
    removeFromFolder: "Remove from folder",
    newFolderWith: "New folder with this layer",
    folderName: "Folder",
    emptyCanvas: "SVG canvas",
    tools: {
      select: "Select",
      pan: "Pan",
      pen: "Pen",
      bucket: "Fill",
      eyedropper: "Eyedropper",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
    },
    shortcutLabels: {
      title: "Keyboard shortcuts",
      sectionTools: "Tools",
      sectionNavigation: "Navigation",
      sectionActions: "Actions",
      select: "Select tool",
      pan: "Pan tool",
      pen: "Pen tool",
      bucket: "Fill tool",
      eyedropper: "Eyedropper",
      holdPan: "Hold to pan",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      zoomScroll: "Zoom with scroll",
      zoomReset: "Reset zoom",
      undo: "Undo",
      redo: "Redo",
      save: "Save",
      duplicate: "Duplicate layer",
      delete: "Delete layer",
      shortcuts: "Shortcuts",
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
    whyUseTitle: "What can you do with Inkdrop?",
    whyUseItems: [
      {
        title: "Recolor icons",
        description: "Change icon colors to match your brand palette in seconds — no design software needed.",
      },
      {
        title: "Customize illustrations",
        description: "Swap colors in complex illustrations to fit dark mode, seasonal themes, or client preferences.",
      },
      {
        title: "Prepare design system assets",
        description: "Generate color variants of SVG components for use across your design system or component library.",
      },
      {
        title: "Export clean SVG",
        description: "Download optimized SVG files ready to drop into any web project, app, or document.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    subtitle: "Everything you need to know about Inkdrop.",
    items: [
      {
        question: "What is Inkdrop?",
        answer: "Inkdrop is a free, browser-based SVG editor that lets you recolor paths, adjust bezier curves, move layers, and export clean SVG files. It runs entirely in your browser — no account, no installation, and no backend required.",
      },
      {
        question: "Is Inkdrop free to use?",
        answer: "Yes, completely free. Inkdrop is open source under the MIT license. You can use it for personal and commercial projects without any cost or attribution requirement.",
      },
      {
        question: "Do my files get uploaded to a server?",
        answer: "No. Your SVG files never leave your device. All processing happens locally in your browser. We do not store, track, or transmit your files in any way.",
      },
      {
        question: "What SVG files are supported?",
        answer: "Inkdrop supports any valid SVG file up to 5MB. This includes icons, illustrations, logos, and diagrams exported from tools like Figma, Illustrator, Sketch, or hand-coded SVGs.",
      },
      {
        question: "How do I save my work?",
        answer: "Click the Save button or press Cmd/Ctrl+S to save your project to your browser's local storage. Your projects persist between sessions — close the tab and come back later and everything will still be there.",
      },
      {
        question: "Can I edit individual paths and curves?",
        answer: "Yes. Use the pen tool (shortcut: P) to edit bezier curves and anchor points on any path. You can also select, move, scale, and rotate individual layers independently.",
      },
      {
        question: "Can I undo changes?",
        answer: "Yes. Inkdrop has full undo/redo support. Press Cmd/Ctrl+Z to undo and Cmd/Ctrl+Shift+Z to redo. You can step back through your entire edit history.",
      },
      {
        question: "Which browsers are supported?",
        answer: "Inkdrop works in all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience we recommend a Chromium-based browser (Chrome or Edge) on desktop.",
      },
    ],
  },
  uploadUseCases: {
    title: "What people use Inkdrop for",
    items: [
      {
        title: "Dark mode icon variants",
        description: "Quickly generate light and dark variants of any icon set by swapping fill colors in bulk.",
      },
      {
        title: "Brand color updates",
        description: "Rebrand SVG assets after a color palette change without opening Figma or Illustrator.",
      },
      {
        title: "Illustration theming",
        description: "Apply seasonal or campaign-specific color themes to multi-layered SVG illustrations.",
      },
      {
        title: "UI component assets",
        description: "Create color variants of SVG components for use in design systems and component libraries.",
      },
      {
        title: "Logo customization",
        description: "Produce color-accurate logo files for different backgrounds — white, black, or branded.",
      },
      {
        title: "Print & export prep",
        description: "Adjust SVG colors to match CMYK requirements or specific Pantone values before export.",
      },
    ],
  },
};
