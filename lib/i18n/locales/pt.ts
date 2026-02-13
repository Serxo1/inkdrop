import type { Translations } from "./en";

export const pt: Translations = {
  header: {
    howItWorks: "Como funciona",
    github: "GitHub",
    openTool: "Abrir tool",
  },
  hero: {
    badge: "100% grátis, sem pegadinha",
    title: "Seus SVGs estão sem graça.\nBora resolver isso.",
    subtitle:
      "Joga um SVG, clica no path, escolhe a cor. Só isso.\nSem cadastro, sem backend, sem rastreamento. Só cores e vetores.",
    upload: "Suba seu SVG",
    viewGithub: "Ver no GitHub",
  },
  howItWorks: {
    title: "Simples demais. Sério.",
    subtitle:
      "Três passos. Sem tutorial. Até sua avó consegue.",
    steps: [
      {
        title: "Jogue seu SVG",
        description:
          "Arraste ou clique pra procurar.\nAceitamos qualquer .svg de até 5MB.",
      },
      {
        title: "Solte as cores",
        description:
          "Clique em qualquer path e escolha uma cor.\nFill, stroke, opacidade — tudo ali.",
      },
      {
        title: "Baixe e mostre pro mundo",
        description:
          "Exporte sua obra-prima em SVG.\nSalve no browser pra depois também.",
      },
    ],
  },
  features: {
    title: "Por que você vai curtir",
    items: [
      {
        title: "Sem backend. Zero.",
        description:
          "Tudo roda no seu navegador. Seus arquivos nunca saem da sua máquina. Prometemos.",
      },
      {
        title: "Salva com SQLite",
        description:
          "Projetos salvos direto no browser. Volta amanhã, tá tudo lá.",
      },
      {
        title: "Open source, claro",
        description:
          "Licença MIT. Forka, quebra, melhora. PRs são bem-vindos, bugs esperados.",
      },
      {
        title: "Rápido pra caramba",
        description:
          "Sem roundtrip pro servidor. Mudança de cor instantânea. Seu SVG, seu CPU, sua velocidade.",
      },
    ],
  },
  cta: {
    title: "Para de encarar SVGs pretos.",
    subtitle:
      "Sério, vai colorir alguma coisa. É grátis e leva 10 segundos.",
    button: "Começar a colorir — é grátis",
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
    layers: "Camadas",
    pathCount: "paths",
    fill: "Preenchimento",
    stroke: "Contorno",
    opacity: "Opacidade",
    width: "Largura",
    emptyCanvas: "Canvas SVG",
    tools: {
      select: "Selecionar",
      pan: "Mover",
      brush: "Pincel",
      bucket: "Balde",
      eyedropper: "Conta-gotas",
      zoomIn: "Mais zoom",
      zoomOut: "Menos zoom",
    },
  },
} as const;
