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
    mixed: string;
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
  legal: {
    privacy: {
      title: string;
      lastUpdated: string;
      intro: string;
      sections: {
        title: string;
        content: string;
      }[];
    };
    terms: {
      title: string;
      lastUpdated: string;
      intro: string;
      sections: {
        title: string;
        content: string;
      }[];
    };
    about: {
      title: string;
      subtitle: string;
      mission: { title: string; content: string };
      howItWorks: { title: string; content: string };
      openSource: { title: string; content: string };
      team: { title: string; content: string };
    };
    contact: {
      title: string;
      subtitle: string;
      email: { title: string; description: string };
      github: { title: string; description: string };
      response: string;
    };
    cookieConsent: {
      message: string;
      accept: string;
      decline: string;
      learnMore: string;
    };
  };
  footerLinks: {
    privacy: string;
    terms: string;
    about: string;
    contact: string;
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
    mixed: "mixed",
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
  legal: {
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: March 4, 2025",
      intro: "Inkdrop (\"we\", \"us\", or \"our\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.",
      sections: [
        {
          title: "Information We Collect",
          content: "Inkdrop is a client-side application. Your SVG files are processed entirely in your browser and are never uploaded to our servers. We do not collect, store, or have access to any files you edit.\n\nWe may collect anonymous usage data through Google Analytics, including pages visited, time spent on pages, browser type, device type, and approximate geographic location. This data is used solely to improve our service."
        },
        {
          title: "Google AdSense",
          content: "We use Google AdSense to display advertisements. Google AdSense may use cookies and web beacons to serve ads based on your prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet.\n\nYou may opt out of personalized advertising by visiting Google's Ads Settings (https://www.google.com/settings/ads)."
        },
        {
          title: "Cookies",
          content: "We use cookies for the following purposes:\n\n• Essential cookies: To remember your language preference and theme setting.\n• Analytics cookies: Google Analytics uses cookies to collect anonymous usage data.\n• Advertising cookies: Google AdSense uses cookies to serve relevant ads.\n\nYou can control cookies through your browser settings. Disabling cookies may affect some features of the website."
        },
        {
          title: "Local Storage",
          content: "We use your browser's local storage to save your projects and preferences. This data remains on your device and is never transmitted to our servers. You can clear this data at any time through your browser settings."
        },
        {
          title: "Third-Party Services",
          content: "We use the following third-party services:\n\n• Google Analytics: For anonymous website usage analytics.\n• Google AdSense: For displaying advertisements.\n\nThese services may collect information as described in their respective privacy policies."
        },
        {
          title: "Data Security",
          content: "Since Inkdrop processes all files locally in your browser, your data remains under your control. We do not have access to your files or projects. We implement reasonable security measures to protect the limited data we do collect through analytics."
        },
        {
          title: "Children's Privacy",
          content: "Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13."
        },
        {
          title: "Changes to This Policy",
          content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Last updated\" date."
        },
        {
          title: "Contact Us",
          content: "If you have any questions about this Privacy Policy, please contact us at suporte@polyaxis.com.br."
        }
      ]
    },
    terms: {
      title: "Terms of Service",
      lastUpdated: "Last updated: March 4, 2025",
      intro: "By accessing and using Inkdrop, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our service.",
      sections: [
        {
          title: "Service Description",
          content: "Inkdrop is a free, open-source, browser-based SVG editor. The tool allows you to recolor paths, edit curves, manage layers, and export SVG files. All processing occurs locally in your browser."
        },
        {
          title: "Use License",
          content: "Inkdrop is released under the MIT License. You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the conditions of the MIT License."
        },
        {
          title: "User Responsibilities",
          content: "You are responsible for:\n\n• Any content you upload, edit, or create using Inkdrop.\n• Ensuring you have the rights to edit any SVG files you use.\n• Using the service in compliance with applicable laws.\n• Maintaining backups of your work."
        },
        {
          title: "Intellectual Property",
          content: "You retain all rights to the SVG files you edit with Inkdrop. We do not claim any ownership over your content. The Inkdrop brand, logo, and website design are property of Polyaxis."
        },
        {
          title: "Disclaimer of Warranties",
          content: "Inkdrop is provided \"as is\" without warranty of any kind, express or implied. We do not guarantee that the service will be uninterrupted, error-free, or free of harmful components."
        },
        {
          title: "Limitation of Liability",
          content: "In no event shall Inkdrop, Polyaxis, or its contributors be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the service."
        },
        {
          title: "Advertisements",
          content: "Inkdrop displays advertisements through Google AdSense. By using our service, you acknowledge that ads may be displayed during your use of the tool."
        },
        {
          title: "Changes to Terms",
          content: "We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to this page. Continued use of the service after changes constitutes acceptance of the new terms."
        },
        {
          title: "Contact",
          content: "For questions about these Terms of Service, contact us at suporte@polyaxis.com.br."
        }
      ]
    },
    about: {
      title: "About Inkdrop",
      subtitle: "A free SVG editor that respects your privacy.",
      mission: {
        title: "Our Mission",
        content: "We believe editing SVGs shouldn't require expensive software, accounts, or uploading your files to someone else's server. Inkdrop was built to be the fastest, simplest way to recolor and edit SVGs — entirely in your browser."
      },
      howItWorks: {
        title: "How It Works",
        content: "Inkdrop runs 100% in your browser. Your files are never uploaded to any server. When you save a project, it's stored in your browser's local storage. When you export, the file is generated on your machine. No backend, no database, no tracking of your files."
      },
      openSource: {
        title: "Open Source",
        content: "Inkdrop is open source under the MIT License. You can inspect the code, contribute, or fork it for your own projects. We believe in transparency and community-driven development."
      },
      team: {
        title: "Built by Polyaxis",
        content: "Inkdrop is developed and maintained by Polyaxis, a software studio based in Brazil. We build tools that are useful, beautiful, and respectful of user privacy."
      }
    },
    contact: {
      title: "Contact Us",
      subtitle: "Have a question, suggestion, or found a bug? We'd love to hear from you.",
      email: {
        title: "Email",
        description: "For general inquiries and support, reach out to us directly."
      },
      github: {
        title: "GitHub",
        description: "Found a bug or want to request a feature? Open an issue on our GitHub repository."
      },
      response: "We typically respond within 48 hours."
    },
    cookieConsent: {
      message: "We use cookies for analytics and to show relevant ads. Your SVG files are never uploaded or tracked.",
      accept: "Accept",
      decline: "Decline",
      learnMore: "Learn more"
    }
  },
  footerLinks: {
    privacy: "Privacy",
    terms: "Terms",
    about: "About",
    contact: "Contact",
  },
};
