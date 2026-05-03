# **📏 TrueScale**

**TrueScale** é um utilitário SaaS "Single Page Application" (SPA) projetado para metrologia física em telas virtuais. Ele resolve o problema comum de alinhar hardwares físicos (como lightbars, webcams e eye-trackers) no monitor e medir objetos do mundo real diretamente na tela com precisão milimétrica.

## **🚀 O Problema**

Navegadores modernos não expõem o tamanho físico do monitor (via EDID) por questões de segurança (anti-fingerprinting). A maioria das réguas online tenta cruzar a resolução (window.screen.width) com o devicePixelRatio, o que falha em monitores desktop de 23.8" ou 24" que utilizam 100% de escala do SO.

**A Solução TrueScale:** Forçar uma calibração matemática baseada no usuário (via Cartão de Crédito ISO 7810 ou Diagonal Exata) para estabelecer um PPI (Pixels Per Inch) absoluto, salvando essa métrica para uso em múltiplas ferramentas de hardware.

## **🏗️ Arquitetura e Stack**

* **Framework:** Next.js 14+ (App Router)  
* **Styling:** Tailwind CSS (Arquitetura No-Scroll, 100vh/100vw overflow-hidden)  
* **State Management:** Zustand (Persistência local do PPI em formato float de alta precisão)  
* **Animações:** Framer Motion (Transições cinematográficas entre Views via \<AnimatePresence\>)  
* **Design System:** High-End, Monocromático, Glassmorphism sutil (Foco no contraste para visibilidade do laser/réguas).

## **🛠️ Core Features (Views)**

A interface é guiada por um **Navigation Dock** inferior, alternando entre quatro ferramentas principais:

1. **📏 Ruler View:** Réguas geradas dinamicamente via \<canvas\> (Top e Left), alternando instantaneamente entre Centímetros (cm) e Polegadas (in) baseadas no PPI calibrado.  
2. **🎛️ Calibration View:** O motor matemático. Permite ajustar o PPI por dois métodos:  
   * **Cartão de Crédito:** Interface drag-to-resize com trava estrita de proporção (aspect-\[85.6/53.98\]).  
   * **Diagonal Real:** Input matemático exato (ex: tela de 23.8").  
3. **🎯 Center Mark View (Fullscreen):** Para alinhar o centro exato da tela.  
   * Força a Fullscreen API para anular barras de navegação laterais (ex: Vivaldi, Edge).  
   * Renderiza um grid milimétrico SVG espaçado com base no PPI.  
   * Miras concêntricas (crosshairs) no centro absoluto (50vw, 50vh).  
4. **💡 Top Notch View (Hardware Mount):** Para colagem de imãs e periféricos.  
   * Força Fullscreen.  
   * Renderiza um gabarito branco sólido grudado no eixo Y: 0, centralizado no eixo X.  
   * Redimensionável pelo usuário (ex: base da lightbar tem 40mm x 15mm) para servir de molde físico na colagem.

## **🔍 Contexto para Deep Research (AI Agents)**

Este projeto está em fase de expansão. Os agentes de pesquisa devem investigar as seguintes barreiras arquiteturais e oportunidades:

### **Desafios Técnicos Atuais**

1. **Distorção de OS Scaling:** Como o Windows Scaling (125%, 150%) ou o macOS Retina Display alteram a contagem de pixels lógicos vs. físicos, e como normalizar isso matematicamente sem depender apenas do window.devicePixelRatio.  
2. **Limitações do EDID:** Existe alguma API experimental (WebUSB, WebHID, Screen Detailed API, Window Management API) que permita a leitura do tamanho do monitor pulando a calibração manual?  
3. **Gerenciamento de Float em Polegadas:** Evitar problemas de arredondamento (Math.round) ao fazer conversões bidirecionais entre a escala de pixels, milímetros e polegadas fracionadas (1/16, 1/32).

### **Expansão de Mercado (SaaS)**

* Quais ferramentas "pro-sumer" ou de nicho (gamers de simulação, designers gráficos CAD) precisam desse tipo de calibração?  
* Como integrar detecção de câmera para auto-calibração usando visão computacional (ex: o usuário segura um papel A4 e a webcam calibra a tela)?

## **💻 Instalação e Uso**

\# Clone o repositório  
git clone \[https://github.com/your-user/true-scale.git\](https://github.com/your-user/true-scale.git)

\# Instale as dependências  
npm install

\# Rode em desenvolvimento  
npm run dev  
