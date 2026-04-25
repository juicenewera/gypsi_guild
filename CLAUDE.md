@AGENTS.md

# GUILD — GIPSY VIP PLATFORM
## Contexto de engenharia para o Claude Code

> **Última atualização:** 2026-04-02
> **Sessão anterior encerrou em:** Sprint 2 completo → Sprint 3 spec pronta → Supabase criado (smzsdsbddepieznqwnho) → Schema de 12 tabelas especificado em docs/SUPABASE-SCHEMA.md → PRÓXIMO: executar migrations e migrar auth do PocketBase para Supabase

---

## ONDE ESTAMOS AGORA

### Estado do repositório
- **GitHub:** https://github.com/Cigano-agi/gypsi-vip (privado)
- **Branch:** `master` — 2 commits (create-next-app + MVP completo)
- **Dev server:** `npm run dev` → http://localhost:3000
- **PocketBase:** `.\pocketbase.exe serve` dentro de `pocketbase/` → http://127.0.0.1:8090

### O que existe hoje (MVP atual)
O projeto tem um MVP funcional construído com o design "Premium Pixel Clean" (fundo branco, Instrument Serif). Porém **o SDD foi reformulado** e a plataforma vai mudar de direção visual:

| Componente | Estado atual | Estado alvo (SDD) |
|------------|-------------|-------------------|
| Design system | "Premium Pixel Clean" (branco, Instrument Serif) | "Gipsy Pixel" (escuro/claro alternado, Press Start 2P + Inter) |
| Landing page | Fundo azul gradiente | Pixel art full-bleed + glassmorphism |
| Auth | Feito (PocketBase) | Migrar para Supabase (Sprint 3) |
| Feed | Funcional | Manter lógica, refatorar visual |
| XP/Classes | Lógica em `lib/xp.ts` | Conectar ao backend |
| Banco | PocketBase local | Supabase (futuro) |

### Próxima ação imediata (Sprint 1 do SDD)
Implementar o novo design system "Gipsy Pixel" na landing page (`app/page.tsx`), substituindo o fundo azul atual pelo design correto conforme SDD.

---

## IDENTIDADE DO PROJETO

**Nome:** Gipsy VIP (plataforma) / Guild (comunidade interna)
**Domínio:** gypsi.vip
**Criador:** @cigano.agi (gypsiventures)
**Conceito:** Plataforma SaaS com 4 pilares — Educação, Consultoria, Ventures, Comunidade — com progressão RPG
**Ref visual:** donoshq.com

---

## DESIGN SYSTEM — "GIPSY PIXEL"

> Spec completa em: `C:\Users\Fabricio Padrin\.claude\projects\...\memory\sdd_gipsy_vip.md`

### Paleta oficial
```css
--color-bg-dark:        #0A0A0A
--color-bg-light:       #FFFFFF
--color-accent-primary: #3B82F6   /* azul principal */
--color-accent-warm:    #F59E0B   /* dourado XP */
--color-accent-green:   #10B981
--color-accent-purple:  #8B5CF6   /* premium/magia */
--glass-bg:             rgba(255,255,255,0.05)
--glass-border:         rgba(255,255,255,0.12)
--glass-blur:           12px
```

### Fontes
- **Press Start 2P** — SOMENTE headlines, logo, badges. NUNCA em parágrafos.
- **Inter** — todo o body, UI, formulários
- **JetBrains Mono** — código, terminais

### Regra das seções
Seções alternam escuro (`#0A0A0A`) e claro (`#FFFFFF`). Nunca duas escuras ou duas claras consecutivas.

### Text selection override (obrigatório)
```css
::selection { background: #000; color: #fff; }
```

### Classes Tailwind novas (adicionar ao config)
```js
fontFamily: { pixel: ['"Press Start 2P"'], body: ['Inter'], mono: ['"JetBrains Mono"'] }
colors: { 'gipsy-dark': '#0A0A0A', 'gipsy-blue': '#3B82F6', 'gipsy-gold': '#F59E0B', 'gipsy-purple': '#8B5CF6' }
```

---

## ASSETS DO DESIGNER

**Localização local:** `C:\Users\Fabricio Padrin\Downloads\Frame\`

| Arquivo | Uso |
|---------|-----|
| `Hero Banner Guild.png` | Hero da home (substituir fundo azul atual) |
| `Logo Guild Completo.jpg` | Header / navbar |
| `Logo Guild Ícone.jpg` | Favicon / avatar |
| `Personagem Mago.png` | Onboarding, perfil classe Mago |
| `Personagem Guerreiro.png` | Onboarding, perfil classe Guerreiro |
| `Avatar Frame Mago.png` | Frame de avatar no perfil |
| `Avatar Frame Guerreiro.png` | Frame de avatar no perfil |
| `Badge Classe Mago.jpg` | Badge de classe |
| `Badge Classe Guerreiro.jpg` | Badge de classe |
| `Badge Nível 1-10.*` | Sistema de progressão XP |
| `Barra de XP.png` | Componente XPBar |
| `Notificação Level Up.jpg` | Toast/modal de level up |
| `Moeda da Guilda.jpg` | Sistema de pontos futuro |
| `Banner Adventures.jpg` | Header da página Adventures |
| `Banner Feed.jpg` | Header do Feed |
| `Banner Leaderboard.jpg` | Header do Ranking |
| `Banner Membros.png` | Header dos Membros |
| `Ícone Missão *.{jpg,png}` | Ícones das categorias de missão |
| `Loading Screen.jpg` | Splash screen |
| `OG Image.png` | Open Graph / compartilhamento |
| `Template Instagram *.{jpg,png}` | Social media |

**Para copiar os assets para o projeto:**
```bash
cp "C:/Users/Fabricio Padrin/Downloads/Frame/"*.png public/images/designer/
cp "C:/Users/Fabricio Padrin/Downloads/Frame/"*.jpg public/images/designer/
```

---

## STACK TÉCNICA

```
Next.js:    16.2.1 (App Router, Turbopack)
React:      19.2.4
TypeScript: 5+
Tailwind:   3.4+
PocketBase: 0.36.8 (local, substituir por Supabase no Sprint 3)
```

### Comandos
```bash
npm run dev          # localhost:3000
.\pocketbase.exe serve   # dentro de pocketbase/ → :8090
```

### Credenciais de dev
- Vivem em `.env.local` (PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD) e no Supabase Auth.
- Usuário teste: troque a senha em prod e mantenha em password manager local. Nunca commitar.
- Se você herdou os defaults antigos (`admin12345678`, `password123`), troque agora:
  - PocketBase: 127.0.0.1:8090/_/ → Settings → Admins
  - Supabase: dashboard → Auth → Users

---

## ESTRUTURA DE ARQUIVOS

```
app/
├── page.tsx                  # Landing page (REESCREVER com novo design)
├── globals.css               # CSS vars + selection override (ATUALIZAR)
├── layout.tsx                # Root layout (adicionar novas fonts)
├── (auth)/login|register     # Auth flow
├── (guild)/                  # Feed, Adventures, Post, Perfil, Ranking, Notificações
├── api/bounties/             # API route
└── onboarding/               # Fluxo de onboarding

components/
├── layout/        Header, Sidebar, MobileNav, Navbar, Footer, NotificationsPopover, SplashScreen, PageTransition
├── post/          PostCard
├── profile/       EditProfileModal
├── sections/      PageHero, CTABanner
├── feedback/      FeedbackWidget
├── video/         VideoEmbed
└── ui/            XPBar, PixelBadge, PixelButton, PixelBg, ButtonGlass, ButtonRPG,
                   SectionDark, SectionLight, PixelImage, button, textarea, tooltip,
                   prompt-input, grid-loading, Toaster

lib/
├── pocketbase/types.ts       # legacy (só Profile usado em store/auth.ts)
├── supabase/client.ts, queries.ts
├── xp.ts
└── utils.ts

store/
├── auth.ts            # Supabase only
├── notifications.ts
├── toast.ts
└── ui.ts

utils/
└── supabase/proxy.ts  # usado por proxy.ts (root, gate de auth)
```

---

## DÉBITOS TÉCNICOS CONHECIDOS

| Item | Arquivo | Problema |
|------|---------|---------|
| Design antigo | `app/(guild)/adventures/page.tsx` | Usa `font-press-start`, `pixel-border`, vars antigas |

---

## SPRINTS (SDD v1.0)

| Sprint | Status | Foco |
|--------|--------|------|
| 1 | ✅ DONE | Design system Gipsy Pixel + Landing page 7 seções |
| 2 | ✅ DONE | 7 páginas públicas: /guild /cursos /agentes /oportunidades /consultoria /ventures /sobre |
| **3** | 🔴 PRÓXIMO | Auth visual (login/register), Dashboard, Feed/Adventures migração, XP conectado ao backend |
| 4 | ⬜ | Educação: CRUD cursos, player, Stripe, XP tracking |
| 5 | ⬜ | Animações Framer Motion, SEO, Core Web Vitals, polish |

### Sprint 3 — spec detalhada
Ver `docs/SPRINT-3.md` — Auth visual, Dashboard, Feed migration, XP conectado.

### Supabase (em produção)
- **Project ID:** `rvoyllttmlluhwenhyln` (fonte de verdade: `.env.local`)
- **URL:** https://rvoyllttmlluhwenhyln.supabase.co
- **Schema:** 15 tabelas ativas — ver `docs/SUPABASE-SCHEMA.md` (desatualizado, precisa sync) e `list_tables` via MCP pra snapshot real
- **Migrations aplicadas via MCP:** `f3_xp_pipeline` (2026-04-20) — triggers de XP em posts/likes/missões, cap diário 450 XP, notificações de level-up
- **Project IDs obsoletos (NÃO usar):** `smzsdsbddepieznqwnho`, `jydhdznqbwuwlfmmdwyi`, `yruhumgmyonokjcqwmsq`

---

## REGRAS INVIOLÁVEIS

1. **Fontes:** Press Start 2P só em headlines/badges. Inter no body. NUNCA misturar.
2. **Cores:** Usar tokens CSS (`--color-accent-primary`, etc.). Zero hardcoded hex no JSX/TSX.
3. **Glassmorphism:** Sempre incluir `-webkit-backdrop-filter` junto com `backdrop-filter`.
4. **Pixel art:** Sempre usar `image-rendering: pixelated` + `-moz-crisp-edges`.
5. **Supabase:** Projeto correto = `rvoyllttmlluhwenhyln` (ver `.env.local`). Ignorar IDs antigos em docs: `smzsdsbddepieznqwnho`, `jydhdznqbwuwlfmmdwyi`, `yruhumgmyonokjcqwmsq`.
6. **Assets designer:** Sempre referenciar de `public/images/designer/` após copiar da pasta Downloads.
7. **Commits:** Sempre commitar antes de mudar direção de design.
8. **GitHub:** https://github.com/Cigano-agi/gypsi-vip (privado, branch master).
