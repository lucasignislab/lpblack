---
name: Black Friday Ratoeira
description: Campanha de captação em alto contraste que transforma dados reais em uma decisão clara.
colors:
  brand-gold: "#ffb800"
  brand-gold-hover: "#ffc129"
  brand-orange: "#ff7e4a"
  performance-orange: "#d95700"
  ink: "#0a0a0a"
  cream: "#fff8ee"
  white: "#ffffff"
  surface-alt: "#f7f8fa"
  field-surface: "#f8fafc"
  line: "#e5e7eb"
  muted: "#667085"
  field-label: "#596273"
  dark-section: "#080808"
  dark-card: "#121212"
  dark-border: "#2f2f2f"
  dark-copy: "#c7c7cc"
  dark-muted: "#94949c"
  badge-copy: "#a94210"
  badge-border: "#ffe1b0"
  error: "#d92d20"
  error-copy: "#b42318"
typography:
  display:
    fontFamily: "Inter Local, Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(3rem, 4.1vw, 4.5rem)"
    fontWeight: 900
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  headline-form:
    fontFamily: "Inter Local, Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(2rem, 3.1vw, 2.5rem)"
    fontWeight: 900
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  headline-proof:
    fontFamily: "Inter Local, Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(2.1rem, 3.3vw, 3rem)"
    fontWeight: 900
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  lead:
    fontFamily: "Inter Local, Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.35
  button-label:
    fontFamily: "Inter Local, Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 800
    lineHeight: 1.2
  body:
    fontFamily: "Inter Local, Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Inter Local, Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.035em"
rounded:
  sm: "12px"
  md: "16px"
  lg: "24px"
  full: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  form-gap: "20px"
  lg: "24px"
  xl: "28px"
  card: "26px"
  section-mobile: "72px"
  section-desktop: "92px"
components:
  button-primary:
    backgroundColor: "{colors.brand-gold}"
    textColor: "{colors.ink}"
    typography: "{typography.button-label}"
    rounded: "{rounded.md}"
    padding: "0 28px"
    height: "54px"
  button-primary-hover:
    backgroundColor: "{colors.brand-gold-hover}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  button-submit:
    backgroundColor: "linear-gradient(100deg, #ee5f00, #e79a00)"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    width: "100%"
    height: "54px"
  field:
    backgroundColor: "{colors.field-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    width: "100%"
    height: "52px"
  campaign-badge:
    backgroundColor: "rgba(255, 249, 239, 0.92)"
    textColor: "{colors.badge-copy}"
    rounded: "{rounded.full}"
    padding: "9px 15px"
  testimonial-card:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.dark-copy}"
    rounded: "{rounded.md}"
    padding: "26px"
---

# Design System: Black Friday Ratoeira

## Overview

**Creative North Star: "Dado Real, Decisão Clara"**

O sistema visual transforma a promessa de performance em uma jornada direta e legível. Creme quente pontilhado, preto profundo, dourado e laranja criam um contraste de campanha sem recorrer à estética genérica de contagem regressiva; a hierarquia pesada conduz do argumento ao cadastro e então à prova social.

A composição combina impacto e confiança: o primeiro viewport é contido e assimétrico, o formulário ocupa uma superfície branca suavemente elevada e a validação social migra para uma faixa escura. Controles compactos, cantos generosos e estados de interação explícitos mantêm a experiência acolhedora e operacional.

**Key Characteristics:**

- Contraste quente entre creme, preto, dourado e laranja.
- Tipografia Inter pesada, compacta e orientada à conversão.
- Pontilhado, auras difusas e gradientes restritos aos momentos de campanha.
- Uma coluna de ação clara no mobile, com CTA persistente fora das zonas de conversão.
- Superfícies arredondadas e elevadas sem perder a leitura direta.

## Colors

A paleta concentra calor e urgência nos acentos, reservando neutros claros para leitura e neutros quase pretos para enquadrar conteúdo editorial.

### Primary

- **Dourado de Conversão:** cor principal dos CTAs, estrelas e indicador do selo.
- **Dourado Ativo:** variação luminosa exclusiva do hover do CTA principal.

### Secondary

- **Laranja Ratoeira:** base de gradientes, foco, auras e profundidade colorida.
- **Laranja de Performance:** destaque textual do argumento principal.

### Neutral

- **Tinta Profunda:** títulos, texto principal e base estrutural do rodapé.
- **Creme de Campanha:** fundo pontilhado do hero e da página de confirmação.
- **Branco de Superfície:** cartões e estados ativos de campos.
- **Cinza de Seção:** fundo neutro da área de cadastro.
- **Cinza de Campo:** repouso dos inputs e selects.
- **Linha Suave:** contorno padrão dos controles.
- **Texto Secundário:** descrições extensas em fundos claros.
- **Preto Editorial:** seção de depoimentos e rodapé.
- **Cartão Noturno:** superfície dos depoimentos sobre o preto editorial.
- **Borda Noturna:** separação estrutural de cartões escuros.
- **Texto Noturno:** conteúdo principal dos depoimentos.
- **Erro Funcional:** borda de campo inválido e seu texto de apoio.

### Named Rules

**The Conversion Color Rule.** Dourado chama para a ação; laranja enfatiza, cria foco e costura gradientes. Não inverter esses papéis em fluxos primários.

**The Contrast Chapter Rule.** Creme apresenta a promessa, branco recebe os dados e preto enquadra a prova social.

## Typography

**Display Font:** Inter Local, com Inter e sans-serif de sistema como fallback.
**Body Font:** Inter Local, com Inter e sans-serif de sistema como fallback.

**Character:** A família única mantém a campanha coesa, enquanto pesos 800–900 e tracking negativo dão densidade aos títulos. Texto de apoio permanece regular, arejado e curto.

### Hierarchy

- **Display** (900, fluido de 3rem a 4.5rem, 1.04): argumento do hero, limitado a aproximadamente 12 caracteres por linha em desktop.
- **Headline Form** (900, fluido de 2rem a 2.5rem, 1.12): título do cartão de captação.
- **Headline Proof** (900, fluido de 2.1rem a 3rem, 1.08): entrada da seção editorial escura.
- **Lead** (800, 1.25rem, 1.35): frase curta de campanha e ênfase imediatamente abaixo do título.
- **Body** (400, 1.0625rem, 1.55): descrições, com largura de leitura entre 42ch e 54ch conforme o viewport.
- **Label** (800, 0.75rem, 0.035em, uppercase): rótulos de formulário compactos e inequívocos.

### Named Rules

**The Heavy Headline Rule.** Títulos usam peso máximo e tracking negativo; parágrafos recuperam espaço com peso regular e entrelinha aberta.

## Layout

O contêiner central mede até 1160px, cresce para 1280px a partir de 1680px e mantém respiros laterais de 24px por lado em desktop e 16px por lado até 760px. O hero usa duas colunas, texto flexível e vídeo entre 330px e 408px, com um vão fluido de 70px a 140px; em telas ultra-wide o vídeo chega a 430px.

Até 960px, o vídeo reduz para 280–340px e o vão cai para 48px. Até 760px, a composição vira uma coluna, o CTA principal ocupa toda a largura, o vídeo centraliza com máximo de 420px, os pares de campos empilham e os depoimentos viram uma trilha horizontal com snap. Até 420px, selos deixam de ser pílulas e adotam o raio pequeno para acomodar texto sem compressão.

As seções respiram em blocos largos: o hero mantém pelo menos 700px em desktop e 760px em telas grandes; a oferta usa 86px no topo e 100px na base; a prova social usa 92px no topo e 90px na base. No mobile, esses intervalos comprimem sem colapsar a hierarquia. Um CTA fixo aparece apenas até 760px, respeita a safe area e se oculta enquanto o CTA do hero ou a seção do formulário estão visíveis.

**The Contained Campaign Rule.** A página pode ocupar telas grandes, mas o conteúdo nunca se espalha além do contêiner e da largura de leitura estabelecidos.

## Elevation & Depth

O sistema usa elevação híbrida: superfícies permanecem limpas e a profundidade aparece em cartões de conversão, no vídeo, em botões e no CTA móvel. Auras coloridas e bordas em gradiente dão volume sem substituir hierarquia por decoração.

### Shadow Vocabulary

- **Card Conversion** (`0 18px 48px rgba(255, 126, 74, 0.16), 0 6px 20px rgba(10, 10, 10, 0.06)`): elevação composta do formulário e da confirmação.
- **Button Warm** (`0 10px 26px rgba(255, 151, 24, 0.28)`): glow de repouso do CTA dourado.
- **Button Warm Hover** (`0 14px 32px rgba(255, 151, 24, 0.36)`): resposta elevada do CTA dourado.
- **Video Frame** (`0 20px 50px rgba(10, 10, 10, 0.16)`): separa o placeholder escuro do hero claro.
- **Mobile Action** (`0 12px 34px rgba(10, 10, 10, 0.28)`): mantém o CTA fixo destacado do conteúdo rolável.

**The Purposeful Lift Rule.** Sombra só acompanha conversão, mídia ou uma ação persistente; cartões editoriais usam borda e contraste tonal.

## Shapes

Três raios organizam a forma: controles usam cantos compactos de 12px, ações e cartões editoriais usam 16px e superfícies protagonistas usam 24px. Pílulas de 999px ficam restritas a selos curtos; em telefones estreitos, selos longos recuam para 12px. O player circular é a exceção icônica e serve como ponto focal do vídeo.

**The Three-Radius Rule.** Use 12px para campos, 16px para ações e cartões compactos, e 24px para contêineres protagonistas.

## Components

### Buttons

- **Shape:** ação compacta e robusta, com cantos de 16px e altura mínima de 54px.
- **Primary:** dourado sobre tinta profunda, padding horizontal de 28px, peso 800 e glow quente.
- **Submit:** largura total, texto branco e gradiente de laranja para ouro queimado.
- **Hover / Focus:** sobe 2px em 180ms, intensifica a sombra e usa outline laranja translúcido de 3px no teclado; active retorna à linha de base.
- **Loading / Disabled:** reduz opacidade, bloqueia nova ação e mostra spinner de 18px; movimento é removido.

### Badges

- **Style:** superfície creme translúcida, borda pêssego, texto terracota e conteúdo em peso 700.
- **Shape:** pílula em larguras confortáveis; 12px em telas até 420px quando o conteúdo é longo.
- **Indicator:** ponto dourado de 9px com halo suave apenas no selo da campanha.

### Cards / Containers

- **Form Card:** superfície branca, canto de 24px, padding fluido de 30px a 52px e borda de 2px em gradiente dourado-laranja.
- **Video Card:** moldura quase preta em proporção 9:15.4, canto de 24px, pontilhado claro e play circular em gradiente.
- **Testimonial Card:** superfície noturna, borda tonal, canto de 16px, padding de 26px e altura mínima de 210px.
- **Shadow Strategy:** formulário e vídeo elevam; depoimentos permanecem estruturais e planos.

### Inputs / Fields

- **Style:** fundo cinza muito claro, borda neutra de 1px, canto de 12px, altura de 52px e padding horizontal de 16px.
- **Hover:** fundo branco e borda ligeiramente mais forte.
- **Focus:** fundo branco, borda laranja e halo externo laranja de 4px.
- **Error:** borda vermelha, halo vermelho translúcido e mensagem curta abaixo do campo.
- **Select:** seta vetorial interna de 22px e reserva de 50px à direita.

### Navigation

- **Brand Link:** símbolo de 74×48px e wordmark textual em peso 900; no rodapé, reduz para 56×38px e inverte para branco.
- **Skip Link:** permanece fora da tela até receber foco, quando surge no canto superior com fundo profundo e texto branco.
- **Mobile CTA:** ação fixa dourada com 14px de margem lateral e inferior, altura mínima de 52px e ocultação contextual por opacidade e translação.

### Testimonial Rail

Em desktop, três cartões ocupam colunas iguais com gap de 18px. Até 760px, a trilha se torna horizontal, cada cartão mede no máximo 340px ou 84vw e encaixa no início ao rolar.

## Do's and Don'ts

### Do:

- **Do** preserve o percurso cromático creme → branco → preto para promessa, ação e prova.
- **Do** mantenha o dourado como voz principal de conversão e o laranja como ênfase e estado.
- **Do** use Inter Local, títulos em 800–900 e corpo regular com largura de leitura controlada.
- **Do** mantenha foco visível, alvos com pelo menos 52px e comportamento reduzido quando `prefers-reduced-motion` estiver ativo.
- **Do** transforme grades em fluxo de uma coluna e depoimentos em trilha com snap até 760px.

### Don't:

- **Don't** introduza contadores, preços, descontos ou urgência visual que não tenham conteúdo aprovado.
- **Don't** espalhe gradientes por texto ou superfícies neutras; reserve-os para bordas, ação de envio, play e auras.
- **Don't** use sombra em cartões editoriais quando borda e contraste tonal já estruturam a seção.
- **Don't** deixe pílulas longas comprimirem em telefones estreitos; use o raio de 12px abaixo de 420px.
- **Don't** crie movimento indispensável: o sistema deve permanecer completo com transições e spinner desativados.
