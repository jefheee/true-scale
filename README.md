📏 TrueScale | Metrologia Física e Alinhamento Virtual

TrueScale é um utilitário SaaS (Single Page Application) de precisão construído para metrologia física em telas virtuais. Ele soluciona o problema crônico de navegadores web que ocultam as dimensões físicas dos monitores, permitindo medições em centímetros reais e alinhamento de hardware de alta precisão direto no browser.

Desenvolvido com foco em alta performance (SSR bypass para WebGL), matemática paramétrica e um design system High-End (monocromático, glassmorphism e 3D fluido).

🚀 O Problema e a Solução

Por questões de segurança e privacidade (anti-fingerprinting), navegadores modernos não expõem os dados do EDID do monitor (tamanho físico em polegadas). Ferramentas genéricas tentam adivinhar cruzando a resolução com o devicePixelRatio, falhando miseravelmente em setups multi-telas ou monitores de 24" operando a 100% de escala.

A Solução TrueScale: Forçamos uma base de cálculo absoluta calibrada pelo usuário (Cartão de Crédito ISO 7810 ou inserção exata da Diagonal). O sistema salva um Fator Constante de Normalização (PPI em float de alta precisão) e o utiliza para renderizar réguas, grades e projeções vetoriais fisicamente exatas.

🎯 Público-Alvo e Casos de Uso (Nicho)

Entusiastas de Hardware e Gamers: Instalação precisa de periféricos (como colar a base magnética de um BenQ ScreenBar ou Tobii Eye Tracker) usando a ferramenta Mounting Jigs como gabarito na tela.

Sim Racers (Pilotos Virtuais): Alinhamento perfeito da inclinação de setups multi-monitor usando o FOV Aligner para calcular e projetar o Campo de Visão (Field of View) exato na tela.

Designers Industriais e UI/UX: Verificação de proporções reais de interfaces e embalagens antes da impressão.

Uso Diário: Usuários pesquisando "onde é o centro da minha tela" ou "régua online em centímetros" para medir objetos encostando-os no monitor.

🛠️ Arquitetura e Stack Tecnológico

Core: Next.js 14+ (App Router).

Styling & UI: Tailwind CSS (Arquitetura No-Scroll, 100vh/vw overflow-hidden).

3D Engine: Spline Design (Renderização WebGL otimizada via next/dynamic sem SSR).

State Management: Zustand (Persistência paramétrica do PPI e configurações do usuário).

Motion & UX: Framer Motion (Transições de páginas, Layout IDs para o Navigation Dock, Glassmorphism).

Deploy: Vercel (CI/CD ultra-rápido, otimizado para Edge Network).

🧰 Ferramentas Inclusas (Views)

Ruler (Régua Digital): Réguas em L (Top/Left/Bottom/Right) de alta performance com Quick Calibration via Diagonal do Monitor. Alterna entre cm/in instantaneamente.

Calibration Engine: Motor de ajuste fino onde um cartão virtual de proporções físicas imutáveis (aspect-[85.6/53.98]) calibra o escalonamento geral do app.

Center Mark: Miras de precisão (crosshairs) sobrepondo o centro absoluto geométrico do viewport.

Mounting Jigs (Gabaritos): Prancheta estilo blueprint que projeta blocos brancos sólidos no topo da tela nas dimensões milimétricas exatas para colagem de hardware.

FOV Aligner: HUD Sci-Fi que calcula através de trigonometria a angulação do campo de visão baseada na distância do rosto à tela.

💻 Como Rodar Localmente

Clone o repositório: git clone https://github.com/your-username/true-scale.git

Instale as dependências: npm install

Inicie o servidor: npm run dev

Acesse: http://localhost:3000
