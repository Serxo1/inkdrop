import type { Translations } from "./en";

export const pt: Translations = {
  header: {
    howItWorks: "Como funciona",
    gallery: "Galeria",
    github: "GitHub",
    openTool: "Abrir tool",
  },
  hero: {
    badge: "Grátis pra sempre, open source",
    title: "Edite SVGs\ncomo se deve.",
    subtitle:
      "Recolora paths, ajuste curvas, mova camadas. Tudo no browser.\nSem conta. Sem backend. Sem enrolação.",
    upload: "Abrir o editor",
    viewGithub: "Ver no GitHub",
  },
  howItWorks: {
    title: "Simples demais. Sério.",
    subtitle:
      "Três passos. Sem tutorial. Até sua avó consegue.",
    steps: [
      {
        title: "Jogue qualquer SVG",
        description:
          "Arraste pra dentro. Ícones, ilustrações, logos —\nqualquer .svg de até 5MB.",
      },
      {
        title: "Faça do seu jeito",
        description:
          "Escolha cores, ajuste curvas bezier, mova shapes.\nPen tool, conta-gotas, atalhos de teclado — tudo ali.",
      },
      {
        title: "Exporte e mande ver",
        description:
          "Baixe seu SVG ou salve no browser.\nVolte amanhã, tá tudo lá.",
      },
    ],
  },
  features: {
    title: "Feito diferente",
    items: [
      {
        title: "Roda local",
        description:
          "Seus arquivos nunca saem da sua máquina. Sem uploads, sem servidores, sem rastreamento. Ponto.",
      },
      {
        title: "Salva no browser",
        description:
          "Projetos persistem no armazenamento local. Fecha a aba, reabre semana que vem — tudo lá.",
      },
      {
        title: "Teclado primeiro",
        description:
          "Space pra arrastar, P pra caneta, Cmd+K pros atalhos. Parece uma ferramenta de design de verdade.",
      },
      {
        title: "Feedback instantâneo",
        description:
          "Sem loading. Mudança de cor, edição de paths, undo/redo — tudo na hora.",
      },
    ],
  },
  cta: {
    title: "Seus SVGs merecem mais.",
    subtitle:
      "Para de abrir o Figma só pra trocar uma cor. Aqui leva 10 segundos.",
    button: "Começar a editar — é grátis",
  },
  footer: {
    madeBy: "Feito com cafeína por",
    polyaxis: "Polyaxis",
    license: "Licença MIT — faça o que quiser",
  },
  upload: {
    title: "Colora seus SVGs",
    subtitle:
      "Suba um arquivo SVG e pinte cada path com a cor que quiser. Grátis, open-source, sem backend.",
    dropTitle: "Arraste e solte seu SVG aqui",
    dropOr: "ou",
    browseFiles: "Procurar arquivos",
    hint: "Aceita arquivos .svg de até 5MB",
    invalidFile: "Por favor, envie um arquivo .svg válido",
    fileTooLarge: "Arquivo muito grande. Máximo 5MB.",
    features: [
      {
        title: "Pinte paths",
        description: "Clique em qualquer path e escolha uma cor",
      },
      {
        title: "Salve localmente",
        description: "Projetos salvos no browser com SQLite",
      },
      {
        title: "Exporte SVG",
        description: "Baixe seu SVG colorido a qualquer momento",
      },
    ],
  },
  tool: {
    untitledProject: "Projeto sem título",
    save: "Salvar",
    export: "Exportar",
    undo: "Desfazer",
    redo: "Refazer",
    reset: "Resetar",
    randomize: "Aleatório",
    palettes: {
      random: "Aleatório",
      pastel: "Pastel",
      sunset: "Pôr do sol",
      ocean: "Oceano",
      forest: "Floresta",
      neon: "Neon",
      earth: "Terra",
      candy: "Doce",
      monochrome: "Monocromático",
      retro: "Retrô",
      aurora: "Aurora",
    },
    layers: "Camadas",
    pathCount: "paths",
    fill: "Preenchimento",
    stroke: "Contorno",
    opacity: "Opacidade",
    width: "Largura",
    transform: "Transformar",
    rotation: "Rotação",
    scale: "Escala",
    emptyCanvas: "Canvas SVG",
    tools: {
      select: "Selecionar",
      pan: "Mover",
      pen: "Caneta",
      bucket: "Balde",
      eyedropper: "Conta-gotas",
      zoomIn: "Mais zoom",
      zoomOut: "Menos zoom",
    },
    shortcutLabels: {
      title: "Atalhos de teclado",
      sectionTools: "Ferramentas",
      sectionNavigation: "Navegacao",
      sectionActions: "Acoes",
      select: "Ferramenta selecao",
      pan: "Ferramenta arrastar",
      pen: "Ferramenta caneta",
      bucket: "Ferramenta balde",
      eyedropper: "Conta-gotas",
      holdPan: "Segurar para arrastar",
      zoomIn: "Mais zoom",
      zoomOut: "Menos zoom",
      zoomScroll: "Zoom com scroll",
      zoomReset: "Resetar zoom",
      undo: "Desfazer",
      redo: "Refazer",
      save: "Salvar",
      duplicate: "Duplicar camada",
      delete: "Excluir camada",
      shortcuts: "Atalhos",
    },
  },
  gallery: {
    title: "Galeria",
    subtitle: "Suas obras-primas salvas",
    projectCount: "projetos",
    open: "Abrir",
    download: "Baixar",
    delete: "Excluir",
    deleteConfirm: "Tem certeza que quer excluir este projeto?",
    emptyTitle: "Nenhum projeto ainda",
    emptySubtitle: "Suba um SVG para começar",
    uploadSvg: "Subir SVG",
    justNow: "agora mesmo",
    minutesAgo: "min atrás",
    hoursAgo: "horas atrás",
    daysAgo: "dias atrás",
  },
};
