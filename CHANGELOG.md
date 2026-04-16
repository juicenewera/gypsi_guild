# Changelog

Todas as mudanças significativas neste projeto são documentadas aqui.

## [Sprint 3] - 2026-04-16

### 🔧 Bug Fixes & Polish

#### Fixed
- **Hydration Mismatch** — Added `suppressHydrationWarning` to `<body>` element
  - Caused by browser extensions (Smart Converter, ad blockers)
  - React now ignores attribute changes made by extensions
- **Text Contrast Issues** — Improved readability on auth pages (register, login)
  - Changed labels: `text-black` → `text-gray-900`
  - Changed icons: `text-text-muted` → `text-gray-600`
  - Changed footer: `text-text-muted` → `text-gray-700`
  - All text now visible on white/light backgrounds

#### Added
- **Test Credentials Document** — `TEST-CREDENTIALS.md`
  - 3 test users (mago, ladino, mercador)
  - Complete end-to-end test flow
  - Verification checklist for each feature
  - Troubleshooting guide
- **Detailed Testing Guide** — Step-by-step validation for:
  - Registration flow
  - Onboarding (4 steps)
  - Dashboard home
  - Post creation & XP
  - Comments & upvotes
  - Profile & ranking
  - Logout

---

### 🎯 Supabase Integration

#### Added
- **Supabase Schema Completo** — 26 migrations criadas com 14 tabelas:
  - `profiles` (estende auth.users com Supabase Auth)
  - `categories`, `badges`, `user_badges`
  - `posts`, `comments`, `post_upvotes`, `comment_upvotes`
  - `xp_log`, `notifications`
  - `bounties`, `agents`
  - `courses`, `enrollments`
- **RLS Policies** — Row Level Security em todas as tabelas (public read, auth write)
- **Triggers** — Auto-create profiles, updated_at, índices de performance
- **Seed Data** — 6 categorias iniciais (geral, adventures, showcase, oportunidades, automação, vendas)
- **Supabase Clients** — `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server)
- **Auth Store Migrado** — `/store/auth.ts` agora usa Supabase em vez de PocketBase
- **Dependências** — `@supabase/supabase-js`, `@supabase/ssr`
- **Environment Variables** — `.env.local` com placeholders para credenciais Supabase

#### Changed
- Auth store 100% compatível com código existente
- Redirecionamentos agora apontam para dashboard home (`/`)
- Build pipeline mantém sucesso (TypeScript, Turbopack)

#### Status
- ⏳ Aguardando credenciais Supabase (ANON_KEY, SERVICE_ROLE_KEY)
- ⏳ Testar fluxo end-to-end: register → onboarding → dashboard → post

---

### 📊 Dashboard & Routing

#### Added
- **Dashboard Home** — `/app/(guild)/page.tsx` com:
  - Hero section com perfil resumido
  - Stats grid (adventures, missões, streak)
  - Cards CTA (compartilhar adventure, ver ranking)
  - Recent feed (últimos 5 posts)
  - Componentes: XPBar, PathBadge, PostCard reutilizados

#### Changed
- Redirecionamento pós-login: `/feed` → `/` (dashboard)
- Redirecionamento pós-registro: `/feed` → `/` (dashboard)
- Redirecionamento pós-onboarding: `/feed` → `/` (dashboard)
- `/feed` permanece como full feed com filtros avançados

#### Impact
- Melhor UX com home visual e contextual
- Dashboard unificado para novos usuários

---

### ✅ XP System (Verificado)

#### Status
- XP para posts (`post_adventure` +75, `post_discussion` +25) ✅ Funcional
- XP para comments (+10) ✅ Funcional
- XP logging em `xp_log` collection ✅ Funcional
- User refresh automático após XP ✅ Funcional

#### Note
- Sistema JÁ estava conectado ao backend (não era débito técnico)
- Upvotes ainda não geram XP (adicionar se necessário)

---

## [Sprint 2] - 2026-04-02

### ✨ Design System & Landing Pages

#### Added
- **Design System "Gipsy Pixel"** — Paleta, tipografia, componentes
- **Landing Page** — 7 seções (hero, educação, consultoria, ventures, comunidade, sobre, footer)
- **Página Guild** — Comunidade overview (200+ membros, 3 classes, missões)
- **Componentes UI** — PathBadge, XPBar, PixelBadge, PixelButton, PixelCard
- **Fontes** — Press Start 2P (headlines), Inter (body), JetBrains Mono (código)

#### Changed
- Transição de "Premium Pixel Clean" → "Gipsy Pixel"
- Cores agora em CSS vars (`--color-accent-primary`, `--color-accent-warm`, etc)

---

## [Sprint 1] - 2026-04-02

### 🔐 Authentication & Onboarding

#### Added
- **Auth Flow** — PocketBase integration (registro, login, logout)
- **Registro com Classes** — 3 paths (ladino, mago, mercador) com ícones e descrições
- **Onboarding 4-Step** — Path selection, revenue range, bio, welcome screen
- **Auth Store (Zustand)** — Gerenciamento de estado com persistência
- **Proteção de Rotas** — Layout (guild) redireciona para login/onboarding conforme necessário
- **Form Validation** — React Hook Form + Zod schemas

#### Changed
- Estrutura de rotas: `(auth)`, `(guild)`, `onboarding` com proteção em layouts
- XP, levels, atributos inicializados no registro

---

## [MVP] - 2026-04-02

### 🚀 Initial Release

#### Added
- **Stack** — Next.js 16.2.1, React 19.2.4, TypeScript 5, Tailwind 3.4
- **Banco** — PocketBase 0.26.8 (local)
- **Feed Funcional** — Listagem de posts com filtros (all, adventures, strategies, queries, showcase)
- **Post Creation** — Criar adventures e discussions com XP
- **Perfil** — Visualizar stats do usuário (XP, nível, atributos, streak)
- **Ranking** — Leaderboard mensal
- **Notificações** — Sistema básico
- **Componentes Base** — Header, Sidebar, MobileNav, PostCard, FeedSkeleton

---

## Convenções de Commit

```
[tipo]: descrição

Tipos:
- feat:     Nova feature
- fix:      Bug fix
- docs:     Documentação
- style:    Mudanças de styling (Tailwind, CSS)
- refactor: Refatoração de código
- perf:     Performance improvement
- test:     Testes
- chore:    Dependências, config, build

Exemplo:
feat: add dashboard home with profile card and stats
docs: update CHANGELOG for Sprint 3 Supabase integration
```

---

## Próximas Ações

### Curto Prazo (Sprint 3 - Agora)
- [ ] Completar integração Supabase (credenciais)
- [ ] Testar fluxo completo end-to-end
- [ ] Verificar RLS policies com dados reais
- [ ] Migrar dados do PocketBase (se necessário)

### Médio Prazo (Sprint 4)
- [ ] Educação: CRUD de cursos, player, Stripe integration
- [ ] XP conectado ao backend (já feito!)
- [ ] Upvotes com XP (nova feature)

### Longo Prazo (Sprint 5)
- [ ] Animações Framer Motion
- [ ] SEO otimização
- [ ] Core Web Vitals
- [ ] Polish final
