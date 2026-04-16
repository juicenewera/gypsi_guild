# SPRINT 3 — Plataforma Interna: Auth, Dashboard, Feed & XP
**Data:** 2026-04-02 | **Status:** SPEC PRONTA

---

## CONTEXTO

Sprint 1 e 2 entregaram o site público (marketing). Sprint 3 é a plataforma real:
o que o membro vê depois de fazer login.

**Problema crítico:** O Sprint 1 substituiu `globals.css` e removeu todos os tokens
antigos (`text-text-primary`, `bg-bg-surface`, `--font-heading`, etc.). Todas as
páginas `/(guild)/` e `/(auth)/` estão visualmente quebradas. Sprint 3 corrige isso.

**Backend:** PocketBase (mantém — não migra para Supabase ainda).

---

## DECISÃO DE DESIGN: APP SHELL INTERNO

O interior da plataforma usa um design diferente das páginas de marketing:

```
Marketing (Sprints 1+2): dark/light alternado + pixel art full-bleed
Plataforma (Sprint 3):   app shell com sidebar + conteúdo central limpo
```

### Tokens de App (adicionar ao globals.css)

```css
/* === APP SHELL — tokens internos === */
:root {
  /* Backgrounds */
  --app-bg:        #0D0D0D;   /* fundo geral do app (quase preto) */
  --app-surface:   #161616;   /* cards, sidebar */
  --app-elevated:  #1E1E1E;   /* modais, dropdowns */
  --app-border:    rgba(255,255,255,0.08);

  /* Texto no app */
  --app-text:      #F0F0F0;   /* texto principal */
  --app-muted:     #888888;   /* texto secundário */
  --app-subtle:    #555555;   /* labels, placeholders */
}

/* Classes utilitárias app */
.app-bg       { background-color: var(--app-bg); }
.app-surface  { background-color: var(--app-surface); }
.app-elevated { background-color: var(--app-elevated); }
.app-text     { color: var(--app-text); }
.app-muted    { color: var(--app-muted); }
.app-border   { border-color: var(--app-border); }

/* Cards padrão do app */
.app-card {
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  transition: border-color 0.2s ease;
}
.app-card:hover { border-color: rgba(255,255,255,0.15); }

/* Mapear tokens antigos → novos (compatibilidade) */
.text-text-primary   { color: var(--app-text); }
.text-text-secondary { color: var(--app-muted); }
.text-text-muted     { color: var(--app-subtle); }
.bg-bg-primary       { background-color: var(--app-bg); }
.bg-bg-surface       { background-color: var(--app-surface); }
.bg-bg-elevated      { background-color: var(--app-elevated); }
.border-border-default { border-color: var(--app-border); }
.border-border-subtle  { border-color: rgba(255,255,255,0.05); }
```

**Nota:** Os tokens `--font-heading` e classes antigas de card/button também
precisam ser mapeados. Ver seção "Compatibilidade" abaixo.

---

## COMPATIBILIDADE — TOKENS LEGADOS (adicionar ao globals.css)

Para não ter que reescrever cada página interna, adicionar mapeamentos:

```css
/* Font heading → Dico */
:root { --font-heading: 'Dico', monospace; }

/* Classes de cor das classes RPG (usadas nos cards) */
.text-mago-500   { color: #8B5CF6; }
.text-guerr-500  { color: #EF4444; }
.bg-mago-50      { background-color: rgba(139,92,246,0.1); }
.bg-guerr-50     { background-color: rgba(239,68,68,0.1); }
.border-mago-400 { border-color: rgba(139,92,246,0.4); }
.border-guerr-400{ border-color: rgba(239,68,68,0.4); }
.text-xp-600     { color: var(--color-gipsy-gold); }
.bg-xp-50        { background-color: rgba(245,158,11,0.1); }
.border-xp-400   { border-color: rgba(245,158,11,0.4); }

/* Botões legados */
.btn { 
  display: inline-flex; align-items: center; justify-content: center;
  padding: 8px 16px; border-radius: 8px; font-size: 0.875rem;
  font-weight: 500; transition: all 0.2s;
  background: var(--app-surface); border: 1px solid var(--app-border);
  color: var(--app-text); cursor: pointer;
}
.btn:hover { border-color: rgba(255,255,255,0.2); }
.btn-primary {
  background: var(--color-gipsy-blue);
  border-color: var(--color-gipsy-blue); color: white;
}
.btn-primary:hover { filter: brightness(1.15); }
.btn-ghost { background: transparent; border-color: transparent; }
.btn-ghost:hover { background: var(--app-surface); }

/* Card legado */
.card { background: var(--app-surface); border: 1px solid var(--app-border); border-radius: 12px; }
.card-guerr { border-color: rgba(239,68,68,0.3); }

/* Input legado */
.input {
  background: var(--app-elevated); border: 1px solid var(--app-border);
  border-radius: 8px; padding: 10px 14px; color: var(--app-text);
  font-size: 0.875rem; width: 100%; outline: none;
  transition: border-color 0.2s;
}
.input:focus { border-color: var(--color-gipsy-blue); }
.input::placeholder { color: var(--app-subtle); }

/* Animate legado */
.animate-fade-in { animation: fadeUp 0.4s ease forwards; }
```

---

## FASE 1 — Auth Pages (migração visual)

### `app/(auth)/login/page.tsx` — reescrever

```
Layout: tela dividida 50/50
- Esquerda: PixelBg hero-guild.jpg + overlay + copy de conversão
  "Bem-vindo de volta, aventureiro."
- Direita: bg-app-surface, form de login

Form:
- Email input (classe .input)
- Password input (classe .input)
- Botão "Entrar" (.btn-primary full-width)
- Link "Não tem conta? Criar conta →" → /register
- Manter toda lógica existente (useAuthStore, react-hook-form, zod)
```

### `app/(auth)/register/page.tsx` — reescrever

```
Layout: tela dividida 50/50
- Esquerda: PixelBg hero-guild.jpg + "Junte-se à Guild."
  Mini preview das 3 classes (badges)
- Direita: form de cadastro (3 steps visuais)

Manter:
- Toda a lógica existente (useAuthStore, useForm, zod schema)
- Steps: dados básicos → escolha de classe → confirmar
- Não reescrever a lógica, só o visual
```

### `app/onboarding/page.tsx` — refatorar visual

```
- Manter os 4 steps e toda a lógica
- Visual: fundo app-bg, steps com classes RPG em destaque
- Cards de seleção de classe: usar PixelBadge + cores da classe
- Botões: .btn-primary
```

---

## FASE 2 — Guild Layout (Sidebar + Header)

### `components/layout/Sidebar.tsx` — migração visual

```
Fundo: var(--app-surface)
Borda direita: var(--app-border)
Logo: "GIPSY VIP" em Dico

Nav links com ícones:
- Feed (ícone: layout-grid)
- Adventures (ícone: sword/zap)
- Oportunidades → /bounties (ícone: briefcase)
- Ranking (ícone: trophy)
- Meu Perfil (ícone: user)

Footer do sidebar:
- Avatar do usuário + nome + classe
- Badge de nível + XP
- Link para /perfil

Manter toda a lógica de auth existente
```

### `components/layout/Header.tsx` — migração visual

```
Fundo: var(--app-bg), border-bottom var(--app-border)
- Breadcrumb da página atual
- Search input
- Notificações (sino com badge)
- Avatar do usuário
```

---

## FASE 3 — Dashboard (novo)

### `app/(guild)/dashboard/page.tsx` — criar

```
Redirecionar login bem-sucedido → /dashboard (não para /feed)

Layout: grid de widgets

Widget 1 — Boas-vindas + XP
  "Olá, [username]."
  Classe: [MAGO/GUERREIRO/MERCADOR]
  Nível atual: [N] — [Título] 
  XPBar: barra visual de progresso até próximo nível
  XP atual / XP próximo nível

Widget 2 — Stats rápidos (4 cards)
  Posts feitos | Comentários | Upvotes recebidos | Missões completadas

Widget 3 — Atividade recente (feed pessoal)
  Últimos 5 posts do usuário

Widget 4 — Próximas missões sugeridas
  3 adventures não completos mais recentes

Widget 5 — Ranking position
  Posição atual no ranking + XP total + rank acima e abaixo
```

---

## FASE 4 — Feed & Adventures (migração visual)

### `app/(guild)/feed/page.tsx`
- Manter toda a lógica (PocketBase, loadPosts, filters)
- Trocar classes legadas → tokens novos
- Filtros: usar `.btn` e `.btn-primary` para ativo
- Header da página em Dico

### `app/(guild)/adventures/page.tsx`
- Mesma abordagem do feed
- Banner de destaque com hero pixel art pequeno

### `components/post/PostCard.tsx`
- Manter lógica de upvotes e expand
- Trocar classes legadas
- Avatar com classe badge colorido
- XP badge no canto do card

---

## FASE 5 — XP Conectado ao Backend

### `app/api/xp/award/route.ts` — criar endpoint

```ts
// POST /api/xp/award
// Body: { userId, reason: keyof XP_REWARDS }
// - Valida o userId via PocketBase
// - Calcula XP pelo reason usando XP_REWARDS de lib/xp.ts
// - Atualiza users.xp no PocketBase (+= amount)
// - Cria registro em xp_log
// - Verifica level up e atualiza users.level
// - Retorna { xp_awarded, new_xp, new_level, leveled_up }
```

### Conectar nas actions existentes:

**Quando criar post** (`app/(guild)/post/new/page.tsx`):
```ts
// Após pb.collection('posts').create(...)
// Chamar POST /api/xp/award com reason='post_discussion' ou 'post_adventure'
```

**Quando criar comment** (`app/(guild)/post/[id]/page.tsx`):
```ts
// Após criar comment: POST /api/xp/award com reason='comment'
```

**Quando receber upvote** (`app/api/bounties/public/route.ts` ou novo endpoint):
```ts
// Após upvote: POST /api/xp/award para o author com reason='upvote_received'
```

---

## FASE 6 — Perfil & Ranking (migração visual)

### `app/(guild)/perfil/page.tsx`
- Avatar com borda colorida da classe
- XPBar proeminente
- Grid de badges conquistados
- Stats: nível, XP total, posts, missões

### `app/(guild)/ranking/page.tsx`
- Tabela/lista com posição, avatar, nome, classe, nível, XP
- Top 3 em destaque com Dico gold/silver/bronze

---

## MAPA DE ARQUIVOS

```
MODIFICAR (visual):
app/globals.css                    ← adicionar tokens app + compat legados
app/(auth)/login/page.tsx          ← split layout pixel art
app/(auth)/register/page.tsx       ← split layout pixel art
app/onboarding/page.tsx            ← migração visual
components/layout/Sidebar.tsx      ← app-surface dark
components/layout/Header.tsx       ← app-bg dark
components/post/PostCard.tsx       ← tokens novos

CRIAR:
app/(guild)/dashboard/page.tsx     ← dashboard com widgets
app/api/xp/award/route.ts          ← endpoint XP

MIGRAR (só tokens, manter lógica):
app/(guild)/feed/page.tsx
app/(guild)/adventures/page.tsx
app/(guild)/perfil/page.tsx
app/(guild)/ranking/page.tsx
app/(guild)/post/new/page.tsx
app/(guild)/post/[id]/page.tsx
app/(guild)/bounties/page.tsx
```

---

## FLUXO DO USUÁRIO (pós Sprint 3)

```
Landing (/) → /register → Onboarding (escolha classe) → /dashboard
                ↓ já tem conta
              /login → /dashboard
                         ↓
              Sidebar: Feed | Adventures | Oportunidades | Ranking | Perfil
```

---

## SPRINTS FUTUROS

| Sprint | Foco |
|--------|------|
| 4 | Educação: player de aulas, progresso de curso, Stripe |
| 5 | Animações Framer Motion, polish, Core Web Vitals, deploy |

---

## CRITÉRIO DE SUCESSO

- [ ] Login e register com design Gipsy Pixel funcionando
- [ ] Dashboard carrega com XP e nível do usuário
- [ ] Feed carrega posts sem erros visuais
- [ ] XP é concedido ao criar post (verificável no dashboard)
- [ ] Sidebar com links corretos e avatar do usuário
- [ ] `npx tsc --noEmit` → 0 erros
- [ ] `npm run build` → sem erros
