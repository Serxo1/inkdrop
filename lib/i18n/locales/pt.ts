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
    exportAs: "Exportar como",
    exportFormats: {
      svg: "Arquivo SVG",
      png: "Imagem PNG",
      jpeg: "Imagem JPEG",
      webp: "Imagem WebP",
      copySvg: "Copiar código SVG",
    },
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
    newFolder: "Nova pasta",
    renameFolder: "Renomear pasta",
    deleteFolder: "Excluir pasta",
    ungroupAll: "Desagrupar tudo",
    moveToFolder: "Mover para pasta",
    removeFromFolder: "Remover da pasta",
    newFolderWith: "Nova pasta com esta camada",
    folderName: "Pasta",
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
    whyUseTitle: "O que você pode fazer com o Inkdrop?",
    whyUseItems: [
      {
        title: "Recolorir ícones",
        description: "Mude as cores dos ícones para combinar com sua paleta de marca em segundos — sem precisar de software de design.",
      },
      {
        title: "Personalizar ilustrações",
        description: "Troque cores em ilustrações complexas para modo escuro, temas sazonais ou preferências de clientes.",
      },
      {
        title: "Preparar assets de design system",
        description: "Gere variações de cor de componentes SVG para uso em design systems ou bibliotecas de componentes.",
      },
      {
        title: "Exportar SVG limpo",
        description: "Baixe arquivos SVG otimizados prontos para usar em qualquer projeto web, app ou documento.",
      },
    ],
  },
  faq: {
    title: "Perguntas frequentes",
    subtitle: "Tudo o que você precisa saber sobre o Inkdrop.",
    items: [
      {
        question: "O que é o Inkdrop?",
        answer: "O Inkdrop é um editor de SVG gratuito, baseado em navegador, que permite recolorir paths, ajustar curvas bezier, mover camadas e exportar arquivos SVG limpos. Funciona inteiramente no navegador — sem conta, sem instalação e sem backend.",
      },
      {
        question: "O Inkdrop é gratuito?",
        answer: "Sim, completamente gratuito. O Inkdrop é open source sob a licença MIT. Você pode usá-lo em projetos pessoais e comerciais sem nenhum custo ou necessidade de atribuição.",
      },
      {
        question: "Meus arquivos são enviados para um servidor?",
        answer: "Não. Seus arquivos SVG nunca saem do seu dispositivo. Todo o processamento acontece localmente no seu navegador. Não armazenamos, rastreamos ou transmitimos seus arquivos de nenhuma forma.",
      },
      {
        question: "Quais arquivos SVG são suportados?",
        answer: "O Inkdrop suporta qualquer arquivo SVG válido de até 5MB. Isso inclui ícones, ilustrações, logos e diagramas exportados de ferramentas como Figma, Illustrator, Sketch ou SVGs escritos à mão.",
      },
      {
        question: "Como salvo meu trabalho?",
        answer: "Clique no botão Salvar ou pressione Cmd/Ctrl+S para salvar seu projeto no armazenamento local do navegador. Seus projetos persistem entre sessões — feche a aba e volte depois que tudo ainda estará lá.",
      },
      {
        question: "Posso editar paths e curvas individualmente?",
        answer: "Sim. Use a ferramenta caneta (atalho: P) para editar curvas bezier e pontos de ancoragem em qualquer path. Você também pode selecionar, mover, escalar e rotacionar camadas individualmente.",
      },
      {
        question: "Posso desfazer alterações?",
        answer: "Sim. O Inkdrop tem suporte completo a desfazer/refazer. Pressione Cmd/Ctrl+Z para desfazer e Cmd/Ctrl+Shift+Z para refazer. Você pode voltar por todo o histórico de edições.",
      },
      {
        question: "Quais navegadores são suportados?",
        answer: "O Inkdrop funciona em todos os navegadores modernos, incluindo Chrome, Firefox, Safari e Edge. Para a melhor experiência, recomendamos um navegador baseado em Chromium (Chrome ou Edge) no desktop.",
      },
    ],
  },
  uploadUseCases: {
    title: "Para o que as pessoas usam o Inkdrop",
    items: [
      {
        title: "Variantes de ícone para modo escuro",
        description: "Gere rapidamente variantes claras e escuras de qualquer conjunto de ícones trocando cores de preenchimento.",
      },
      {
        title: "Atualização de cores de marca",
        description: "Remarca assets SVG após uma mudança de paleta de cores sem abrir o Figma ou Illustrator.",
      },
      {
        title: "Tematização de ilustrações",
        description: "Aplique temas de cores sazonais ou de campanha em ilustrações SVG com múltiplas camadas.",
      },
      {
        title: "Assets de componentes UI",
        description: "Crie variantes de cores de componentes SVG para uso em design systems e bibliotecas de componentes.",
      },
      {
        title: "Personalização de logo",
        description: "Produza arquivos de logo com cores precisas para diferentes fundos — branco, preto ou com a marca.",
      },
      {
        title: "Preparação para impressão e exportação",
        description: "Ajuste cores de SVG para combinar com requisitos CMYK ou valores Pantone específicos antes de exportar.",
      },
    ],
  },
};
