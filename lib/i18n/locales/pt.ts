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
    mixed: "misto",
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
  legal: {
    privacy: {
      title: "Política de Privacidade",
      lastUpdated: "Última atualização: 4 de março de 2025",
      intro: "O Inkdrop (\"nós\") está comprometido em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações quando você visita nosso site.",
      sections: [
        {
          title: "Informações que Coletamos",
          content: "O Inkdrop é uma aplicação que roda no lado do cliente. Seus arquivos SVG são processados inteiramente no seu navegador e nunca são enviados para nossos servidores. Nós não coletamos, armazenamos ou temos acesso a nenhum arquivo que você edita.\n\nPodemos coletar dados anônimos de uso através do Google Analytics, incluindo páginas visitadas, tempo gasto em páginas, tipo de navegador, tipo de dispositivo e localização geográfica aproximada. Esses dados são usados exclusivamente para melhorar nosso serviço."
        },
        {
          title: "Google AdSense",
          content: "Utilizamos o Google AdSense para exibir anúncios. O Google AdSense pode usar cookies e web beacons para veicular anúncios com base em suas visitas anteriores ao nosso site ou a outros sites. O uso de cookies de publicidade pelo Google permite que ele e seus parceiros veiculem anúncios com base em sua visita ao nosso site e/ou outros sites na Internet.\n\nVocê pode desativar a publicidade personalizada visitando as Configurações de Anúncios do Google (https://www.google.com/settings/ads)."
        },
        {
          title: "Cookies",
          content: "Utilizamos cookies para os seguintes fins:\n\n• Cookies essenciais: Para lembrar sua preferência de idioma e tema.\n• Cookies de análise: O Google Analytics usa cookies para coletar dados anônimos de uso.\n• Cookies de publicidade: O Google AdSense usa cookies para veicular anúncios relevantes.\n\nVocê pode controlar os cookies através das configurações do seu navegador. Desabilitar cookies pode afetar algumas funcionalidades do site."
        },
        {
          title: "Armazenamento Local",
          content: "Utilizamos o armazenamento local do seu navegador para salvar seus projetos e preferências. Esses dados permanecem no seu dispositivo e nunca são transmitidos para nossos servidores. Você pode limpar esses dados a qualquer momento nas configurações do seu navegador."
        },
        {
          title: "Serviços de Terceiros",
          content: "Utilizamos os seguintes serviços de terceiros:\n\n• Google Analytics: Para análise anônima de uso do site.\n• Google AdSense: Para exibição de anúncios.\n\nEstes serviços podem coletar informações conforme descrito em suas respectivas políticas de privacidade."
        },
        {
          title: "Segurança dos Dados",
          content: "Como o Inkdrop processa todos os arquivos localmente no seu navegador, seus dados permanecem sob seu controle. Não temos acesso aos seus arquivos ou projetos. Implementamos medidas de segurança razoáveis para proteger os dados limitados que coletamos através de análise."
        },
        {
          title: "Privacidade de Crianças",
          content: "Nosso serviço não é direcionado a menores de 13 anos. Não coletamos intencionalmente informações pessoais de menores de 13 anos."
        },
        {
          title: "Alterações nesta Política",
          content: "Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre quaisquer alterações publicando a nova Política de Privacidade nesta página e atualizando a data de \"Última atualização\"."
        },
        {
          title: "Fale Conosco",
          content: "Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em suporte@polyaxis.com.br."
        }
      ]
    },
    terms: {
      title: "Termos de Uso",
      lastUpdated: "Última atualização: 4 de março de 2025",
      intro: "Ao acessar e usar o Inkdrop, você concorda em estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, por favor não use nosso serviço.",
      sections: [
        {
          title: "Descrição do Serviço",
          content: "O Inkdrop é um editor de SVG gratuito, open source e baseado em navegador. A ferramenta permite recolorir paths, editar curvas, gerenciar camadas e exportar arquivos SVG. Todo o processamento ocorre localmente no seu navegador."
        },
        {
          title: "Licença de Uso",
          content: "O Inkdrop é distribuído sob a Licença MIT. Você é livre para usar, copiar, modificar, mesclar, publicar, distribuir, sublicenciar e/ou vender cópias do software, sujeito às condições da Licença MIT."
        },
        {
          title: "Responsabilidades do Usuário",
          content: "Você é responsável por:\n\n• Qualquer conteúdo que envie, edite ou crie usando o Inkdrop.\n• Garantir que possui os direitos para editar qualquer arquivo SVG que utilize.\n• Usar o serviço em conformidade com as leis aplicáveis.\n• Manter backups do seu trabalho."
        },
        {
          title: "Propriedade Intelectual",
          content: "Você mantém todos os direitos sobre os arquivos SVG que editar com o Inkdrop. Não reivindicamos nenhuma propriedade sobre seu conteúdo. A marca Inkdrop, logotipo e design do site são propriedade da Polyaxis."
        },
        {
          title: "Isenção de Garantias",
          content: "O Inkdrop é fornecido \"como está\", sem garantia de qualquer tipo, expressa ou implícita. Não garantimos que o serviço será ininterrupto, livre de erros ou livre de componentes prejudiciais."
        },
        {
          title: "Limitação de Responsabilidade",
          content: "Em nenhum caso o Inkdrop, a Polyaxis ou seus contribuidores serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes ou relacionados ao seu uso do serviço."
        },
        {
          title: "Anúncios",
          content: "O Inkdrop exibe anúncios através do Google AdSense. Ao usar nosso serviço, você reconhece que anúncios podem ser exibidos durante o uso da ferramenta."
        },
        {
          title: "Alterações nos Termos",
          content: "Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações serão efetivas imediatamente após a publicação nesta página. O uso continuado do serviço após as alterações constitui aceitação dos novos termos."
        },
        {
          title: "Contato",
          content: "Para dúvidas sobre estes Termos de Uso, entre em contato em suporte@polyaxis.com.br."
        }
      ]
    },
    about: {
      title: "Sobre o Inkdrop",
      subtitle: "Um editor de SVG gratuito que respeita sua privacidade.",
      mission: {
        title: "Nossa Missão",
        content: "Acreditamos que editar SVGs não deveria exigir software caro, contas ou enviar seus arquivos para o servidor de outra pessoa. O Inkdrop foi construído para ser a maneira mais rápida e simples de recolorir e editar SVGs — inteiramente no seu navegador."
      },
      howItWorks: {
        title: "Como Funciona",
        content: "O Inkdrop roda 100% no seu navegador. Seus arquivos nunca são enviados para nenhum servidor. Quando você salva um projeto, ele é armazenado no armazenamento local do seu navegador. Quando você exporta, o arquivo é gerado na sua máquina. Sem backend, sem banco de dados, sem rastreamento dos seus arquivos."
      },
      openSource: {
        title: "Open Source",
        content: "O Inkdrop é open source sob a Licença MIT. Você pode inspecionar o código, contribuir ou fazer um fork para seus próprios projetos. Acreditamos em transparência e desenvolvimento orientado pela comunidade."
      },
      team: {
        title: "Feito pela Polyaxis",
        content: "O Inkdrop é desenvolvido e mantido pela Polyaxis, um estúdio de software baseado no Brasil. Construímos ferramentas que são úteis, bonitas e respeitam a privacidade do usuário."
      }
    },
    contact: {
      title: "Fale Conosco",
      subtitle: "Tem uma dúvida, sugestão ou encontrou um bug? Adoraríamos ouvir você.",
      email: {
        title: "E-mail",
        description: "Para dúvidas gerais e suporte, entre em contato diretamente."
      },
      github: {
        title: "GitHub",
        description: "Encontrou um bug ou quer solicitar uma funcionalidade? Abra uma issue no nosso repositório GitHub."
      },
      response: "Normalmente respondemos em até 48 horas."
    },
    cookieConsent: {
      message: "Usamos cookies para análise e exibir anúncios relevantes. Seus arquivos SVG nunca são enviados ou rastreados.",
      accept: "Aceitar",
      decline: "Recusar",
      learnMore: "Saiba mais"
    }
  },
  footerLinks: {
    privacy: "Privacidade",
    terms: "Termos",
    about: "Sobre",
    contact: "Contato",
  },
};
