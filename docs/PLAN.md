# PLAN — Sprint 1: Gipsy Pixel Design System + Landing Page
**Data:** 2026-04-02 | **Status:** EM IMPLEMENTAÇÃO

---

## Contexto
Migrar o design atual ("Premium Pixel Clean" / Mondwest font / fundo branco) para
o "Gipsy Pixel" conforme SDD v1.0: seções dark/light alternadas, glassmorphism,
fonte Dico (custom TTF) + Inter, pixel art backgrounds dos assets do designer.

**Stack:** Next.js 16.2.1 + React 19 + Tailwind v4 (CSS-only config via @theme)
**IMPORTANTE — Tailwind v4:** sem tailwind.config.ts. Tokens via `@theme {}` no globals.css.

---

## FONTE PIXEL — DICO (custom, local)
**Arquivo:** `public/fonts/Dico.ttf`
**Substitui:** Press Start 2P (que estava no SDD original)
**@font-face no globals.css:**
```css
@font-face {
  font-family: 'Dico';
  src: url('/fonts/Dico.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```
**Uso:** `font-family: 'Dico', monospace` em headlines, logo, badges RPG.
**NUNCA** em parágrafos longos.

---

## ASSETS DISPONÍVEIS (já em public/)

### Heroes (full-bleed, object-fit: cover)
| ID | Arquivo | Dimensão | Uso |
|----|---------|----------|-----|
| A1 | `/images/heroes/hero-home.png` | 3840×2160 | S1 — Hero Home |
| B1 | `/images/heroes/hero-consultoria.jpg` | 3840×2160 | Hero /consultoria |
| C1 | `/images/heroes/hero-educacao.jpg` | 2400×1200 | Hero /cursos |
| D1 | `/images/heroes/hero-ventures.png` | 3840×2160 | Hero /ventures |
| E1 | `/images/heroes/hero-guild.jpg` | 3840×2160 | Hero /guild |
| B2 | `/images/heroes/banner-cta.png` | 3840×1080 | Banner CTA inferior |

### Cards (border-radius: 16px)
| ID | Arquivo | Dimensão | Uso |
|----|---------|----------|-----|
| A2 | `/images/cards/card-consultoria.png` | 1200×900 | S4 — Card Consultoria |
| A3 | `/images/cards/card-ventures.png` | 1200×900 | S3 — Card Ventures |
| A4 | `/images/cards/card-educacao.png` | 1200×900 | S2 — Card Educação |
| C2 | `/images/cards/course-cover.png` | 1600×1000 | Curso cover |

### Outros
| ID | Arquivo | Dimensão | Uso |
|----|---------|----------|-----|
| F1 | `/images/avatar-founder.png` | 800×800 | border-radius: 50% |
| F2 | `/images/selo-brasil.png` | 400×400 | ~120px display, footer |

---

## FASE 1 — Foundation (globals.css + layout.tsx)

### 1.1 layout.tsx
- Adicionar `next/font/google` apenas para `Inter` e `JetBrains_Mono`
- Dico é local via `@font-face` no CSS (não usa next/font)
- Expor vars: `--font-inter`, `--font-mono`
- Metadata: title "Gipsy VIP", description, lang="pt-BR"

### 1.2 globals.css — substituição completa
**Remover:** Mondwest @font-face CDN, hero-gradient-genius, dither-overlay, btn-elite, card-elite, nav-pill, todas as vars antigas

**Adicionar:**
```css
/* Dico local */
@font-face {
  font-family: 'Dico';
  src: url('/fonts/Dico.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@theme {
  --font-pixel: 'Dico', monospace;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --color-gipsy-dark:   #0A0A0A;
  --color-gipsy-blue:   #3B82F6;
  --color-gipsy-glow:   #60A5FA;
  --color-gipsy-gold:   #F59E0B;
  --color-gipsy-green:  #10B981;
  --color-gipsy-purple: #8B5CF6;
}

:root {
  --glass-bg:             rgba(255,255,255,0.05);
  --glass-border:         rgba(255,255,255,0.12);
  --glass-blur:           12px;
  --glass-bg-light:       rgba(0,0,0,0.03);
  --glass-border-light:   rgba(0,0,0,0.08);
}

/* Text selection override — assinatura visual */
.section-dark ::selection  { background: #000; color: #fff; }
.section-light ::selection { background: #000; color: #fff; }

/* Pixel art rendering */
.pixel-render {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

/* Animações */
@keyframes fadeUp { 0% { opacity:0; transform:translateY(20px); } 100% { opacity:1; transform:translateY(0); } }
@keyframes glassShine { 0% { left:-100%; } 100% { left:100%; } }
.animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) forwards; }
```

---

## FASE 2 — Componentes Base

### Navbar (`components/layout/Navbar.tsx`)
```
- fixed, top-0, z-50, w-full, h-[72px] mobile h-[56px]
- Logo: "GIPSY VIP" em font-pixel (Dico), 14px
- Links: Guild | Cursos | Ventures | Consultoria
- Botões: Login (ghost) | Entrar na Guild (btn-glass)
- IntersectionObserver: troca data-theme="dark"↔"light" no <header>
  detectando quando #section-light-1 entra na viewport
- Cores: data-theme="dark" → text-white; data-theme="light" → text-gipsy-dark
- Transição: color 300ms ease
```

### ButtonGlass (`components/ui/ButtonGlass.tsx`)
```css
/* glass + shine sweep pseudo-element no hover */
background: var(--glass-bg);
border: 1px solid var(--glass-border);
backdrop-filter: blur(var(--glass-blur));
transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
/* ::before sweep left→right no hover */
/* hover: scale(1.05), border-color rgba(255,255,255,0.25) */
```

### ButtonRPG (`components/ui/ButtonRPG.tsx`)
```css
background: linear-gradient(135deg, #3B82F6, #8B5CF6);
font-family: 'Dico', monospace;
font-size: 0.75rem;
box-shadow: 0 4px 15px rgba(59,130,246,0.3);
/* hover: translateY(-2px), shadow maior */
```

### SectionDark / SectionLight (`components/ui/Section.tsx`)
```tsx
// SectionDark: className="section-dark bg-gipsy-dark text-white"
// SectionLight: className="section-light bg-white text-gipsy-dark"
// Ambos aceitam: id?, className?, children
```

### PixelBg (`components/ui/PixelBg.tsx`)
```tsx
// next/image com fill + object-fit: cover + pixel-render
// Props: src, alt, priority?, overlay? (boolean — adiciona gradient escurecedor)
```

### Footer (`components/layout/Footer.tsx`)
```
- bg-gipsy-dark
- Tagline: "You missed the internet. You missed mobile. Don't miss AI."
- Font-pixel (Dico) na tagline
- Selo: /images/selo-brasil.png 120px
- Links de navegação
- © Gipsy VIP 2026
- Ícones sociais (placeholder SVG por ora — F3 ainda não entregue)
```

---

## FASE 3 — Landing Page (app/page.tsx) — 7 Seções

```tsx
S1 SectionDark  id="hero"
   → PixelBg src="/images/heroes/hero-home.png" priority overlay
   → Overlay: gradient rgba(0,0,0,0.55) → rgba(0,0,0,0.25) bottom-to-top
   → Centro: logo/badge + H1 em Dico "Aprenda IA, Vibe Code\ne construa o futuro"
   → Subheadline Inter 20px white/80
   → CTA: ButtonGlass "Entrar na Guild" href="/register"
   → min-height: 100vh, flex items-center justify-center

S2 SectionLight id="section-light-1"  ← IntersectionObserver observa esse id
   → Grid 2 cols: imagem esquerda (card-educacao.png, rounded-2xl) + texto direita
   → Tag "EDUCAÇÃO" em Dico uppercase
   → H2 "Pare de brincar com o ChatGPT. Aprenda IA de verdade."
   → p Inter descrição
   → ButtonRPG "Ver Cursos" href="/cursos"

S3 SectionDark
   → Grid 2 cols: texto esquerda + imagem direita (card-ventures.png, rounded-2xl)
   → Tag "VENTURES" em Dico
   → H2 "Ferramentas que procuramos, não achamos, e criamos."
   → ButtonGlass "Ver Ventures" href="/ventures"

S4 SectionLight
   → Grid 2 cols: imagem esquerda (card-consultoria.png) + texto direita
   → Tag "CONSULTORIA" em Dico
   → H2 "Diagnóstico e implementação de IA no seu negócio."
   → ButtonRPG "Falar com a Gente" href="/consultoria"

S5 SectionDark
   → PixelBg src="/images/heroes/hero-guild.jpg" overlay sutil (0.4)
   → Centro: H2 "A maior guild de builders de IA do Brasil"
   → Stats row: 200+ Membros | 3 Classes | 10K+ XP acumulado
   → ButtonRPG "Entrar na Guild (grátis)" href="/register"

S6 SectionLight
   → H2 "O que dizem os membros"
   → Carousel horizontal de 3 cards placeholder (testimonials)
   → Cards glass-light com quote + nome + role

S7 SectionDark (Footer)
   → <Footer /> component
```

---

## ORDEM DE EXECUÇÃO DOS AGENTES

| # | Agente | Escopo | Paralelo? |
|---|--------|--------|-----------|
| 1 | `frontend-specialist` | Fases 1 + 2 + 3 completas | base |
| 2 | `seo-specialist` | metadata, OG, canonical, robots.txt | após F1 |
| 3 | `performance-optimizer` | font-display, sizes em next/image, LCP | após F1 |

---

## CRITÉRIO DE SUCESSO
- [ ] `npm run dev` sem erros TypeScript
- [ ] Landing exibe 7 seções alternando dark/light
- [ ] Hero home.png visível com overlay
- [ ] Fonte Dico carregando nos headlines
- [ ] Navbar troca cor ao scrollar para S2
- [ ] Responsivo mobile (stacked) e desktop (grid 2 cols)
- [ ] Nenhuma referência a Mondwest, btn-elite, card-elite, nav-pill
