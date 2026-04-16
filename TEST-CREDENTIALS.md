# 🧪 Test Credentials

Use estas credenciais para testar o fluxo da aplicação.

---

## 📝 Test User #1 (Mago)

**IMPORTANTE:** Se receber "System rejection", use um email único adicionando timestamp:

```
Email:    builder.mago.20260416@gmail.com
Password: Senha@123456
Username: MagoBuilder01
Classe:   Mago
```

Ou crie seus próprios:
```
Email:    seu-email+test1@gmail.com
Password: Senha@123456
Username: TestUser01
Classe:   Mago
```

**Para registrar:**
1. Acesse: http://localhost:3001/register
2. Preencha os dados acima
3. Selecione classe: **Mago**
4. Completa onboarding

**Para fazer login:**
1. Acesse: http://localhost:3001/login
2. Email: `teste.mago@guild.com`
3. Senha: `Senha@123456`

---

## 🗡️ Test User #2 (Ladino)

```
Email:    teste.ladino@guild.com
Password: Senha@123456
Username: LadinoTeste
Classe:   Ladino
```

---

## 🏪 Test User #3 (Mercador)

```
Email:    teste.mercador@guild.com
Password: Senha@123456
Username: MercadorTeste
Classe:   Mercador
```

---

## 📋 Fluxo de Teste Completo

### 1. Registrar Nova Conta
```
GET http://localhost:3001/register
POST /register (form submission)
Verifica:
  ✓ Validação de email
  ✓ Validação de password (mín 8 caracteres)
  ✓ Seleção de classe obrigatória
  ✓ Criação de perfil no banco
```

### 2. Onboarding (4 Steps)
```
GET http://localhost:3001/onboarding
Step 1: Confirmar classe escolhida
Step 2: Selecionar range de receita mensal
Step 3: Escrever bio/manifesto (min 20 chars)
Step 4: Welcome screen + Enter the Guild
Verifica:
  ✓ Progress bar (0% → 100%)
  ✓ Back/Next navigation
  ✓ Field validation
  ✓ Salva onboarding_completed_at no perfil
  ✓ Redireciona para dashboard (/)
```

### 3. Dashboard Home
```
GET http://localhost:3001/
Verifica:
  ✓ Profile card com dados do usuário
  ✓ XP bar com level progressão
  ✓ Stats (adventures, missões, streak)
  ✓ CTA cards (compartilhar adventure, ranking)
  ✓ Recent feed com últimos 5 posts
```

### 4. Criar Post
```
GET http://localhost:3001/post/new
POST /post/new (form submission)
Tipos:
  - Adventure (⚔️): +75 XP
  - Discussion (💬): +25 XP
  - Question (❓): +10 XP
  - Showcase (🏆): +15 XP
Verifica:
  ✓ Validação de título (min 5 chars)
  ✓ Validação de body (min 20 chars)
  ✓ Seleção de categoria obrigatória
  ✓ XP is credited immediately
  ✓ Post aparece no feed
  ✓ Post detail page funciona
```

### 5. Comentar em Post
```
GET http://localhost:3001/post/[id]
POST comment (inline)
Verifica:
  ✓ Validação de comment (min 1 char)
  ✓ +10 XP ao comentar
  ✓ Comments aparecem no post
  ✓ Upvote em comments
```

### 6. Perfil & Ranking
```
GET http://localhost:3001/perfil
GET http://localhost:3001/ranking
Verifica:
  ✓ Perfil mostra todos os atributos
  ✓ Ranking ordenado por XP DESC
  ✓ Atributos aumentam conforme posts/comments
```

### 7. Logout
```
Click em "Sair da Guilda" no perfil
Verifica:
  ✓ Redireciona para /login
  ✓ Session limpa
  ✓ Não consegue acessar /feed sem re-login
```

---

## 🔧 Troubleshooting

### Erro: "System rejection. Credentials may be already active."
- ✅ **Solução:** O email já foi registrado no Supabase
- **Opção 1:** Use um email NOVO e ÚNICO:
  ```
  seu-email+test-20260416@gmail.com
  seu-email+test-001@gmail.com
  seu-email+guild@gmail.com
  ```
- **Opção 2:** Acesse o Supabase dashboard e delete o usuário:
  - https://supabase.com/dashboard/project/smzsdsbddepieznqwnho/auth/users
  - Encontre o usuário
  - Delete e tente novamente

### Erro: Hydration mismatch
- ✅ Já corrigido com `suppressHydrationWarning`
- Recarregue a página (F5)

### Erro: "AUTH_FAILURE: Credentials not recognized"
- Email ou senha incorretos
- Verifica se o usuário foi criado corretamente
- Testa com as credenciais acima

### Erro: Campos de texto desaparecem (preto em branco)
- ✅ Já corrigido (text-gray-900 em vez de text-black)
- Recarregue a página

### XP não aumenta após criar post
- Verifica se a resposta POST foi bem-sucedida (200)
- Verifica no console se há erros de JavaScript
- Recarregue a página para sincronizar XP

---

## 🚀 Quick Start

```bash
# Terminal 1: Frontend
npm run dev
# Acessa http://localhost:3001

# Terminal 2: PocketBase (se quiser usar)
npm run pocketbase
# Acessa http://localhost:8090/_/
```

**Credenciais PocketBase Admin:**
```
Email: admin@guild.com
Password: admin12345678
```

---

**Última atualização:** 2026-04-16
