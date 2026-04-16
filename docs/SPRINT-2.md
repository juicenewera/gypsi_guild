# SPRINT 2 — Páginas Públicas do Ecossistema Gipsy VIP
**Data:** 2026-04-02 | **Status:** EM IMPLEMENTAÇÃO

---

## CONTEXTO

Sprint 2 cria as páginas públicas de marketing que explicam o ecossistema
**antes** do usuário entrar na plataforma. Não são páginas de app — são páginas
de produto. Cada uma responde: "O que é isso e por que quero entrar?"

Páginas existentes na plataforma (`/(guild)/`) permanecem intocadas.

---

## ROTAS A CRIAR

```
app/
├── guild/page.tsx           → /guild        Comunidade (foco principal)
├── cursos/page.tsx          → /cursos       Educação & Biblioteca
├── agentes/page.tsx         → /agentes      Biblioteca de Agentes de IA
├── oportunidades/page.tsx   → /oportunidades Marketplace de Oportunidades
├── consultoria/page.tsx     → /consultoria  Consultoria empresarial
├── ventures/page.tsx        → /ventures     Produtos do ecossistema
└── sobre/page.tsx           → /sobre        Sobre @cigano.agi
```

**Atualizar também:**
- `app/sitemap.ts` — adicionar 7 novas rotas
- `components/layout/Navbar.tsx` — links corretos (Guild | Cursos | Agentes | Oportunidades)

---

## DESIGN SYSTEM (herdar do Sprint 1)

Todos os componentes disponíveis:
- `SectionDark` / `SectionLight` — seções alternadas ✅
- `PixelBg` — backgrounds com pixel art ✅
- `ButtonGlass` / `ButtonRPG` — CTAs ✅
- `Footer` — footer padrão ✅
- `Navbar` — navbar com theme swap ✅

**Padrão de cada página:**
```
1. Hero (SectionDark + PixelBg + headline Dico)
2. Seções de conteúdo (alternando dark/light)
3. Banner CTA inferior (SectionDark + banner-cta.png)
```

---

## ASSETS DISPONÍVEIS

| Arquivo | Uso |
|---------|-----|
| `/images/heroes/hero-guild.jpg` | Hero /guild |
| `/images/heroes/hero-educacao.jpg` | Hero /cursos |
| `/images/heroes/hero-consultoria.jpg` | Hero /consultoria e /sobre |
| `/images/heroes/hero-ventures.png` | Hero /ventures |
| `/images/heroes/hero-home.png` | Hero /agentes e /oportunidades (fallback) |
| `/images/heroes/banner-cta.png` | Banner CTA em todas as páginas |
| `/images/cards/card-educacao.png` | Card em /cursos |
| `/images/cards/card-consultoria.png` | Card em /consultoria |
| `/images/cards/card-ventures.png` | Card em /ventures |
| `/images/cards/course-cover.png` | Cover de curso em /cursos |
| `/images/avatar-founder.png` | Avatar em /sobre e /consultoria |
| `/images/selo-brasil.png` | Selo em /sobre |

---

## ESPECIFICAÇÃO DE CADA PÁGINA

---

### `/guild` — A Comunidade

**Propósito:** Landing de conversão para a comunidade gratuita. Foco: 200+ membros migrados do WhatsApp, sistema RPG, networking.

```
S1 SectionDark — Hero
   PixelBg: hero-guild.jpg, overlay 0.45
   Tag Dico: "COMUNIDADE GRATUITA"
   H1 Dico: "A Guild dos\nBuilders de IA"
   Sub Inter: "200+ membros. 3 classes. Um objetivo: construir com IA."
   CTAs: ButtonRPG "Entrar Grátis →" | ButtonGlass "Como Funciona"

S2 SectionLight — Como Funciona (3 cards)
   H2 Dico: "Sua jornada começa aqui"
   Grid 3 colunas, cada card:
   ┌─────────────────────────────────┐
   │  Ícone pixel (emoji RPG)        │
   │  H3 Dico: "01. Escolha sua      │
   │           Classe"               │
   │  Inter: Mago · Guerreiro ·      │
   │         Mercador                │
   └─────────────────────────────────┘
   Card 1: "01. Escolha sua Classe" — Mago (automação/arquitetura), Guerreiro (vendas/execução), Mercador (negócios/produto)
   Card 2: "02. Complete Missões" — Adventures semanais, challenges com XP real
   Card 3: "03. Suba de Nível" — XP → badges → acesso a conteúdos exclusivos

S3 SectionDark — O que você encontra dentro
   H2 Dico: "O que tem lá dentro"
   Grid 2x2:
   - Feed da comunidade (discussões, cases, showcase de projetos)
   - Mural de Oportunidades (jobs, freelances, bounties)
   - Biblioteca de Agentes (ferramentas criadas pelos membros)
   - Ranking & Conquistas (XP, badges, leaderboard mensal)

S4 SectionLight — Classes RPG (Destaque)
   H2 Dico: "Três caminhos. Uma Guild."
   3 cards detalhados:
   - MAGO: automação, arquitetura de sistemas, infraestrutura de IA
   - GUERREIRO: vendas com IA, prospecção automatizada, alto ticket
   - MERCADOR: produtos digitais, SaaS, ativos de receita recorrente
   Cada card: nome da classe em Dico, tagline, 3 habilidades desbloqueáveis

S5 SectionDark — Stats + Social Proof
   Números grandes em Dico gold:
   200+ Membros Ativos | 3 Classes | 50+ Missões | R$2M+ Gerado pelos membros
   3 testimonials cards glass

S6 SectionDark — Banner CTA Final
   PixelBg: banner-cta.png
   H2 Dico: "Sua guilda está esperando."
   Sub: "Cadastro gratuito. Sem cartão. Sem enrolação."
   ButtonRPG grande: "ENTRAR NA GUILD AGORA →" href="/register"
```

---

### `/cursos` — Educação

**Propósito:** Catálogo de cursos e trilhas de aprendizado.

```
S1 SectionDark — Hero
   PixelBg: hero-educacao.jpg
   Tag: "EDUCAÇÃO"
   H1 Dico: "Pare de brincar\ncom o ChatGPT."
   Sub: "Aprenda a usar IA como os 0.1% do mercado sabem."
   CTA: ButtonRPG "Ver Cursos" | ButtonGlass "Entrar na Guild Grátis"

S2 SectionLight — Cursos em Destaque
   H2 Dico: "Trilhas de Aprendizado"
   Grid 3 colunas de course cards:
   Card structure:
   ┌──────────────────────┐
   │  course-cover.png    │
   │  (aspect 16:10)      │
   ├──────────────────────┤
   │  Badge: NÍVEL RPG    │
   │  Título do Curso     │
   │  Descrição curta     │
   │  Status: Disponível  │
   └──────────────────────┘
   
   Cursos (placeholder realista):
   - "Vibe Coding com IA" — Nível 1, Disponível
   - "Automação de Vendas com Agentes" — Nível 2, Disponível
   - "Arquitetura de Sistemas de IA" — Nível 3, Em Breve
   - "Prospecção Automatizada" — Nível 2, Disponível
   - "Construindo Produtos com IA" — Nível 3, Lista de Espera
   - "IA para Consultores" — Nível 2, Disponível

S3 SectionDark — Por que diferente
   H2 Dico: "Não é mais um curso online"
   3 diferenciais lado a lado:
   - "Gamificado" — XP real ao completar aulas, sobe de nível na Guild
   - "Aplicado" — Cases reais, projetos que você usa no dia seguinte
   - "Comunidade" — Acesso ao feed, networking, oportunidades

S4 SectionLight — FAQ
   Accordion: 5 perguntas frequentes sobre os cursos

S5 SectionDark — Banner CTA
   PixelBg: banner-cta.png
   CTA: "Começar Agora" → /register
```

---

### `/agentes` — Biblioteca de Agentes

**Propósito:** Vitrine da biblioteca de agentes de IA construídos pela comunidade.
Este é um diferencial único — repositório vivo de agentes testados em produção.

```
S1 SectionDark — Hero
   PixelBg: hero-home.png (fallback — sem hero específico ainda)
   Tag: "BIBLIOTECA DE AGENTES"
   H1 Dico: "Agentes de IA\nconstruídos em\nbatalha."
   Sub: "Não são demos. São ferramentas que membros da Guild usam para faturar."
   CTA: ButtonRPG "Ver Biblioteca" | ButtonGlass "Contribuir"

S2 SectionLight — Categorias de Agentes
   H2 Dico: "Encontre o agente certo"
   Grid de categoria cards (6 categorias):
   - 🤖 Vendas & Prospecção
   - ⚙️ Automação de Processos
   - 📝 Conteúdo & Copy
   - 📊 Análise de Dados
   - 💬 Atendimento & Suporte
   - 🔧 Desenvolvimento & Código

S3 SectionDark — Agentes em Destaque
   H2 Dico: "Em destaque"
   Grid 3 colunas de agent cards (glass dark):
   Cada card: nome, categoria badge, descrição 2 linhas, "Por @username", badge de uso ("247 usos")
   
   Cards placeholder realistas:
   - SARGENTO AI — Debug & Refatoração, "O agente de debug mais usado da Guild", @cigano.agi, 1.2k usos
   - Prospec-Bot — Vendas, "Prospecção fria automatizada via LinkedIn + e-mail", @membro1, 389 usos
   - Copy-Mago — Conteúdo, "Gera copy de alto ticket em qualquer formato", @membro2, 521 usos
   - Data-Scout — Análise, "Extrai insights de planilhas e responde em linguagem natural", @membro3, 203 usos
   - Reply-Fast — Atendimento, "Triagem e resposta de suporte nível 1 com escalonamento", @membro4, 178 usos
   - Vibe-Dev — Desenvolvimento, "Pair programmer especializado em Next.js + Supabase", @membro5, 445 usos

S4 SectionLight — Como Contribuir
   H2 Dico: "Construiu um agente que funciona?"
   3 passos: Documentar → Submeter PR → Ganhar XP + Créditos
   CTA: ButtonRPG "Submeter Agente" → /register

S5 SectionDark — Banner CTA
   PixelBg: banner-cta.png
   H2: "Acesso completo com cadastro gratuito."
```

---

### `/oportunidades` — Marketplace

**Propósito:** Marketplace de trabalhos, freelances e bounties de IA.

```
S1 SectionDark — Hero
   PixelBg: hero-home.png
   Tag: "MARKETPLACE"
   H1 Dico: "Trabalhos de IA\npara quem sabe\no que faz."
   Sub: "Empresas que precisam de IA encontram os builders que entregam."
   CTAs: ButtonRPG "Ver Oportunidades" | ButtonGlass "Publicar Vaga"

S2 SectionLight — Tipos de Oportunidade
   H2 Dico: "Três formas de trabalhar"
   3 cards grandes:
   - BOUNTIES: missões com recompensa fixa, empresas postam, membros resolvem
   - FREELAS: projetos pontuais, escopo fechado, pagamento por entrega
   - CLT/PJ: posições recorrentes em empresas que já usam IA de verdade

S3 SectionDark — Oportunidades Recentes (placeholder)
   H2 Dico: "Recém publicadas"
   Lista de 4-5 oportunidade cards glass:
   - Empresa X · Automação de Atendimento · R$3.500 fixo · Remoto
   - Startup Y · Agente de Prospecção · R$2.000/mês · Remoto  
   - Consultoria Z · Implementação de RAG · R$8.000 · São Paulo
   - Empresa W · Copy com IA para e-commerce · R$1.500 · Remoto
   CTA embaixo: ButtonRPG "Ver Todas → /register"

S4 SectionLight — Para Empresas
   H2 Dico: "Publique uma oportunidade"
   Sub: Acesse 200+ especialistas em IA pré-validados pela comunidade.
   3 diferenciais: Talent pool validado · Pagamento seguro · Entrega garantida
   CTA: ButtonGlass "Publicar Agora" → mailto ou form simples

S5 SectionDark — Banner CTA
   PixelBg: banner-cta.png
   CTA: "Entrar na Guild para acessar todas as oportunidades"
```

---

### `/consultoria` — Consultoria

```
S1 SectionDark — Hero
   PixelBg: hero-consultoria.jpg
   Tag: "CONSULTORIA"
   H1 Dico: "IA no seu negócio,\ndo diagnóstico\nà implementação."
   Sub: "Empresas que implementam IA estão vencendo. Vamos fazer você vencer também."
   CTA: ButtonRPG "Falar com a Gente"

S2 SectionLight — 3 Pilares (numerados)
   H2 Dico: "Como trabalhamos"
   Estilo DonosHQ: cards numerados grandes
   01. DIAGNÓSTICO — Mapeamos processos, identificamos onde IA gera ROI real
   02. AUTOMAÇÃO — Construímos e implantamos as soluções (agentes, fluxos, integrações)
   03. CAPACITAÇÃO — Treinamos seu time para operar e evoluir sem depender de nós

S3 SectionDark — Sobre o Founder
   Grid 2 cols: avatar-founder.png (border-radius 50%) | texto
   Tag: "@cigano.agi"
   H2 Dico: nome/título
   Bio Inter: perfil, experiência, contexto
   Selo: selo-brasil.png 120px

S4 SectionLight — Para quem é
   H2 Dico: "Ideal para"
   3 perfis: Startups escalando / PMEs digitalizando / Empresas estabelecidas inovando

S5 SectionLight — FAQ Consultoria
   5 perguntas frequentes

S6 SectionDark — Banner CTA
   PixelBg: banner-cta.png
   H2: "Pronto para implementar IA de verdade?"
   CTA: ButtonRPG "Agendar Diagnóstico"
```

---

### `/ventures` — Produtos

```
S1 SectionDark — Hero
   PixelBg: hero-ventures.png
   Tag: "VENTURES"
   H1 Dico: "Ferramentas que\ncriamos porque\nprecisávamos."
   Sub: "Construídas pela Guild, usadas em produção, disponíveis para você."

S2 SectionLight — Produtos em Destaque
   H2 Dico: "O que construímos"
   Grid 2 colunas de produto cards (card-ventures.png como imagem):
   - SARGENTO AI — debug & refatoração, link para produto
   - (próximos produtos com badge "Em Breve")

S3 SectionDark — Filosofia
   H2 Dico: "Por que construímos nossas próprias ferramentas"
   Texto storytelling: procuramos no mercado, não encontramos, construímos.

S4 SectionDark — Banner CTA
   PixelBg: banner-cta.png
   CTA: "Acesse as ferramentas → Entrar na Guild"
```

---

### `/sobre` — Sobre

```
S1 SectionDark — Hero simples
   Sem PixelBg (hero limpo)
   Tag: "@CIGANO.AGI"
   H1 Dico: "Construindo a infraestrutura\nda era da IA."

S2 SectionLight — Founder
   Grid 2 cols: texto esquerda | avatar-founder.png direita (800×800, border-radius 50%)
   H2 Dico: nome
   Bio Inter: história, trajetória
   Selo: selo-brasil.png

S3 SectionDark — Missão
   H2 Dico: "Por que a Gipsy VIP existe"
   Quote grande em Dico: "You missed the internet. You missed mobile. Don't miss AI."
   Parágrafo sobre a missão

S4 SectionLight — Ecossistema (4 pilares linkados)
   Grid 2x2: Guild | Cursos | Ventures | Consultoria
   Cada um com link para a respectiva página

S5 SectionDark — Contato / Social
   Links sociais, email
```

---

## NAVBAR — CORREÇÃO DE LINKS

Atualizar `components/layout/Navbar.tsx`:

```tsx
// Links atuais: Guild | Cursos | Ventures | Consultoria
// Links novos:
const links = [
  { href: '/guild', label: 'Comunidade' },
  { href: '/cursos', label: 'Cursos' },
  { href: '/agentes', label: 'Agentes' },
  { href: '/oportunidades', label: 'Oportunidades' },
]
// Dropdown ou link simples para Ventures e Consultoria no footer
```

---

## COMPONENTE COMPARTILHADO: CTABanner

Criar `components/sections/CTABanner.tsx` — reutilizado em todas as páginas:

```tsx
// Props: headline, sub, ctaLabel, ctaHref, imageSrc?
// SectionDark + PixelBg banner-cta.png + conteúdo centralizado
// Padrão: headline Dico + sub Inter + ButtonRPG
```

---

## COMPONENTE: PageHero

Criar `components/sections/PageHero.tsx` — hero padrão para subpáginas:

```tsx
// Props: tag, headline, sub, ctaPrimary, ctaSecondary?, imageSrc, overlayOpacity?
// SectionDark min-h-[70vh] + PixelBg + conteúdo centralizado
// Reutilizado em todas as 7 páginas
```

---

## SITEMAP — ATUALIZAR

Adicionar em `app/sitemap.ts`:
```ts
{ url: 'https://gypsi.vip/guild', priority: 0.95, changeFrequency: 'daily' },
{ url: 'https://gypsi.vip/cursos', priority: 0.85, changeFrequency: 'weekly' },
{ url: 'https://gypsi.vip/agentes', priority: 0.80, changeFrequency: 'weekly' },
{ url: 'https://gypsi.vip/oportunidades', priority: 0.80, changeFrequency: 'daily' },
{ url: 'https://gypsi.vip/consultoria', priority: 0.75, changeFrequency: 'monthly' },
{ url: 'https://gypsi.vip/ventures', priority: 0.70, changeFrequency: 'monthly' },
{ url: 'https://gypsi.vip/sobre', priority: 0.60, changeFrequency: 'monthly' },
```

---

## ORDEM DE IMPLEMENTAÇÃO

1. `PageHero` + `CTABanner` (componentes compartilhados — base de tudo)
2. `/guild` (prioridade máxima — foco da comunidade)
3. `/cursos` + `/agentes` (educação + diferencial)
4. `/oportunidades` (marketplace)
5. `/consultoria` + `/ventures` + `/sobre` (institucional)
6. Navbar atualizada
7. Sitemap atualizado

---

## CRITÉRIO DE SUCESSO

- [ ] 7 rotas públicas respondem 200
- [ ] Todas usam design system Gipsy Pixel (sem classes antigas)
- [ ] Navbar com links corretos e theme-swap funcionando
- [ ] `/guild` tem CTA para /register em pelo menos 3 pontos
- [ ] `npm run build` sem erros TS
- [ ] Sitemap com 12 URLs total
