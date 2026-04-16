# 🚀 Development Status

**Data:** 2026-04-16  
**Status:** Frontend Rodando | Backend Configurado

---

## ✅ Frontend (Next.js)

```
✓ Rodando em http://localhost:3001
✓ Build bem-sucedido
✓ TypeScript compilando sem erros
✓ Turbopack habilitado (modo turbo)
```

**Para parar:**
```bash
kill $(lsof -ti :3001)
```

---

## 🔄 Backend (Banco de Dados)

### Opção 1: Supabase (RECOMENDADO)

**Status:** Schema criado ✓ | Migrations aplicadas ✓ | Aguardando credenciais ⏳

Próximos passos:
1. Obter `NEXT_PUBLIC_SUPABASE_ANON_KEY` em: https://supabase.com/dashboard/project/smzsdsbddepieznqwnho/settings/api
2. Obter `SUPABASE_SERVICE_ROLE_KEY` em: https://supabase.com/dashboard/project/smzsdsbddepieznqwnho/settings/api
3. Atualizar `.env.local` com as chaves corretas
4. Testar fluxo: /register → /onboarding → /

**Credenciais atuais (.env.local):**
- ✅ URL: `https://smzsdsbddepieznqwnho.supabase.co`
- ⏳ ANON_KEY: Placeholder (SUBSTITUIR)
- ⏳ SERVICE_ROLE_KEY: Placeholder (SUBSTITUIR)
- ✅ ACCESS_TOKEN: `sbp_6d1bc1a0eff2c740e28c5298e35010275b4f83ab`

### Opção 2: PocketBase (Legado)

**Executável necessário:** `pocketbase/pocketbase.exe`

Se tiver o executável:
```bash
npm run pocketbase
# Ou
cd pocketbase && ./pocketbase.exe serve
```

Acesso: http://localhost:8090/_/

---

## 📊 Rotas Disponíveis

### Public (Sem autenticação)
- ✅ `/` — Landing page
- ✅ `/guild` — Sobre a comunidade
- ✅ `/cursos` — Educação
- ✅ `/agentes` — Biblioteca de agentes
- ✅ `/oportunidades` — Jobs & freelas
- ✅ `/consultoria` — Consultoria
- ✅ `/ventures` — Ventures
- ✅ `/sobre` — Sobre nós

### Auth (Requer login)
- ✅ `/register` — Cadastro com escolha de classe
- ✅ `/login` — Login
- ✅ `/onboarding` — 4 steps (path, revenue, bio, welcome)

### Autenticadas (Requer login + onboarding)
- ✅ `/` — **Dashboard home** (NOVO!)
- ✅ `/feed` — Feed com filtros
- ✅ `/post/new` — Criar post
- ✅ `/post/[id]` — Ver post + comentar
- ✅ `/perfil` — Seu perfil
- ✅ `/ranking` — Leaderboard
- ✅ `/adventures` — Missões
- ✅ `/bounties` — Bounties

---

## 🧪 Fluxo de Teste End-to-End

```
1. Abrir http://localhost:3001/register
2. Preencher: email, password, username
3. Escolher classe: mago, ladino ou mercador
4. Clicar "INITIALIZE SYSTEM"
   ↓ Redireciona para /onboarding
5. Step 1: Confirmar classe
6. Step 2: Escolher revenue range
7. Step 3: Escrever bio
8. Step 4: Welcome screen
9. Clicar "Enter the Guild"
   ↓ Redireciona para / (Dashboard)
10. Verificar profile card, stats, recent feed
11. Clicar em "Compartilhar Adventure"
    ↓ Vai para /post/new
12. Criar um post
    ↓ Deve ganhar XP automaticamente
13. Voltar ao dashboard
14. Verificar XP no perfil (deve aumentar)
```

---

## ⚠️ Próximas Ações

### Imediato (Hoje)
- [ ] Completar credenciais Supabase
- [ ] Testar fluxo end-to-end
- [ ] Fazer push ao GitHub (com SSH ou token)

### Curto Prazo (Sprint 3)
- [ ] Verificar RLS policies com dados reais
- [ ] Migrar dados do PocketBase (se houver)
- [ ] Conectar email verification (Supabase Auth)

### Médio Prazo (Sprint 4)
- [ ] Sistema de educação (cursos, player)
- [ ] Integração Stripe (pagamentos)
- [ ] Aprofundar XP system

---

## 🛠️ Comandos Úteis

```bash
# Frontend
npm run dev          # Iniciar dev server (porta 3001)
npm run build        # Build production
npm run start        # Rodar build production
npm run lint         # Linter ESLint

# Database
npm run setup-db     # Script de setup PocketBase
npm run pocketbase   # Iniciar PocketBase server

# Git
git log --oneline    # Ver commits
git status           # Ver mudanças
git push origin main # Push para GitHub
```

---

**Última atualização:** 2026-04-16 14:45
