# Changelog

Todas as mudanças significativas neste projeto são documentadas aqui.

## [Sino com popover] - 2026-04-24

> Deploy: https://gypsi-guild.vercel.app

### Changed
- **Bell no Header abre popover**, não navega mais pra `/notificacoes`. Novo [components/layout/NotificationsPopover.tsx](components/layout/NotificationsPopover.tsx): dropdown 360px com header (contador de não lidas + "Marcar todas"), lista rolável de até 15 itens mais recentes com ícones por `type` (upvote/comment/badge/xp/mention/system), estado vazio, skeleton no loading e footer "Ver histórico completo →" que mantém a página dedicada como acesso opcional.
- Fecha em outside-click, `Esc`, ou ao clicar num item.

### Added
- **Realtime Supabase** (`postgres_changes` em `public.notifications` filtrado por `user_id`) — INSERT em `notifications` recarrega o dropdown automaticamente, sem polling. Canal nomeado `notifications:<user_id>`, `removeChannel` no cleanup.
- **Badge numérico** no bell (1–9, "9+" acima). Antes era só um pontinho.

### Removed
- Import do `Bell`/`useNotificationsStore` diretos no [components/layout/Header.tsx](components/layout/Header.tsx) — movidos pra dentro do popover.

---

## [XP feedback visível] - 2026-04-24

> Deploy produção: https://gypsi-guild.vercel.app

### Added
- **Bônus de primeiro post (+50 XP)** — trigger `tr_award_first_post_bonus` (BEFORE INSERT em `posts`) dispara uma única vez por usuário. Grava em `xp_log` (reason `first_post_bonus`), incrementa `profiles.xp` via `award_xp` e marca `profiles.first_post_awarded_at`. Backfill já aplicado para `@juicenewera` (+50 → xp=53).
- **Notificação "Parabéns pelo primeiro post! 🎉"** — inserida em `notifications` pelo mesmo trigger com body `+50 XP de boas-vindas à Guilda`.
- **Notificação a cada ganho de XP** — trigger `tr_notify_xp_gained` (AFTER INSERT em `xp_log`) cria uma notificação `type=xp` com título contextual por `reason` (`post_adventure`, `upvote_received`, `validation_bonus`, `mission_complete`, etc.). Não duplica a do first-post.
- **Toast system** — `store/toast.ts` (zustand) + `components/ui/Toaster.tsx` montado em `app/(guild)/layout.tsx`. Kinds: `xp`, `info`, `success`, `error`. Auto-dismiss 5 s, dismiss manual.
- **Toast após publicar** — `handlePublish` no feed calcula o delta de XP após `refreshUser()` e exibe:
  - "+N XP · Aventura/Discussão/Pergunta registrada" quando houve ganho
  - "Parabéns pelo primeiro post! 🎉" (toast dedicado) quando `first_post_awarded_at` passou de null → preenchido
  - "Publicado sem XP" com dica dos 50 caracteres quando o trigger retorna 0 (anti-spam)
- **XPBar no `/perfil`** — barra de progresso `xpCurrent / xpNext` renderizada abaixo do stats-grid, com mensagem "Faltam N XP para o nível X+1".
- **Dashboard com dados reais** — novo `fetchUserDashboardStats(userId)` agrega em paralelo: posts, comentários, curtidas recebidas (join com `posts` do usuário), aventuras, `xp_log` dos últimos 7 dias, posição no ranking (`COUNT(*) WHERE xp > me.xp + 1`) e quem está logo à frente. Substitui `MOCK_STATS`/`MOCK_RANKING` do dashboard, inclusive ranking card.

### Changed
- **`profiles.first_post_awarded_at TIMESTAMPTZ`** — nova coluna nullable.
- **Dashboard `xp` fallback** — era `?? 3450` (misleading pra usuário novo). Agora `?? 0`.

### Database (Supabase `rvoyllttmlluhwenhyln`)
Migration `f6_first_post_bonus_and_xp_notifications` aplicada via MCP.

---

## [Hotfix likes + live EUA] - 2026-04-24

### Fixed
- **Curtidas nos posts não contavam** — RPC `toggle_post_like` quebrava com `column reference "likes" is ambiguous` em Postgres 17. A OUT column `likes` do retorno colidia com `posts.likes` dentro do `UPDATE ... SET likes = ...`. Fix: qualificar todas as referências (`p.likes`) e introduzir variável intermediária `v_is_liked` para o retorno. Log postgres mostrava repetidos erros 42702 antes do fix; smoke-test (like → unlike) agora fecha em 0→1→0 corretamente.

### Added
- **Live "Como Vender para os EUA e Ganhar em Dólar"** — `courses.slug = live-vender-eua-dolar` (type=`live`, `price=0`, `is_featured=true`, status=`available`). Aula única `course_lessons.slug = gravacao-completa` apontando para `https://www.youtube.com/watch?v=z2c8IzBXOz0`. Thumbnail puxa de `img.youtube.com/vi/.../maxresdefault.jpg`. Aberta pra todo o Guild (nenhuma regra `is_pro_only`).

### Database (Supabase `rvoyllttmlluhwenhyln`)
Migration `f5_fix_toggle_post_like_and_live_eua` aplicada via MCP.

---

## [Feed v2 — parity com rede-social] - 2026-04-24

> Inspiração funcional: https://github.com/MayconCoutinho/Rede-Social
> Deploy produção: https://gypsi-guild.vercel.app

### Added
- **Imagem em posts** — composer do feed permite anexar uma imagem (até 8 MB) com preview/remove antes de publicar.
- **Upload de imagens de post** — bucket `post-images` no Supabase Storage (público, com policies por `auth.uid()/folder`).
- **Comentários** — tabela `comments` + `comment_likes`, com threads em 1 nível, curtir, responder, excluir próprio comentário.
- **Like em comentário** — RPC `toggle_comment_like`, contador denormalizado em `comments.likes` via trigger.
- **Contador de comentários no post** — coluna `posts.comments_count` atualizada por trigger em insert/delete.
- **Visualizações de post** — RPC `increment_post_view` disparada ao abrir `/post/[id]`.
- **Excluir publicação própria** — botão no card do feed e na página do post (com confirmação). Policy RLS já existente (`Users can delete own posts`).
- **`fetchPostById` / `fetchComments` / `createComment` / `deleteOwnComment`** — novas queries em `lib/supabase/queries.ts`.

### Changed
- **Post detail `/post/[id]` reescrita** — removidos todos os MOCKs (post, comentários, avatars). Agora carrega dados reais do Supabase, respeita `liked_by_me`, suporta resposta a comentários e reage ao usuário autenticado.
- **`FeedPost`** — ganhou `image_url`, `comments_count`.
- **`createPost`** — aceita `imageUrl` opcional.
- **`FeedCard` (feed)** — renderiza imagem quando presente; contador real de comentários; mostra "Excluir" quando o post é do usuário.

### Database (Supabase `rvoyllttmlluhwenhyln`)
Migration `f4_feed_image_comments` aplicada via MCP:
- `posts.image_url TEXT`, `posts.comments_count INT DEFAULT 0`
- `comments(id, post_id, user_id, parent_id, body, likes, created, updated)` com RLS (público lê, dono escreve, staff modera)
- `comment_likes(user_id, comment_id UNIQUE)` com RLS
- Triggers: `tr_bump_comments_count`, `tr_bump_comment_likes`
- RPCs: `toggle_comment_like(UUID)`, `increment_post_view(UUID)`
- Bucket `post-images` (público) com policies de insert/update/delete restritas a `auth.uid()::text = foldername[1]`

### Notes
- Visual preservado — só funções adicionadas, nenhum redesenho.
- Recurso de image upload é a única peça que exigiu mudança de schema; o bucket é separado de `avatars` para não misturar quotas.

---

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
