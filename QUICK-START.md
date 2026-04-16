# 🚀 Quick Start — Como Testar a Plataforma

## ✅ Erro 404 (logo-icon.png)
**Fixado!** Reload a página (F5) para limpar o cache.

---

## ⚠️ Erro 401 Supabase (Unauthorized)

O erro `401` significa: **Usuário não existe ou credenciais incorretas**

### Fluxo Correto:

**PASSO 1: REGISTRAR uma nova conta**
```
http://localhost:3001/register
```

1. Preencha:
   - **Nome de Usuário:** BuilderTest01
   - **Email:** seu-email+test-20260416@gmail.com  ⚠️ USE UM EMAIL ÚNICO
   - **Senha:** Senha@123456
   - **Selecione classe:** Mago (ou Ladino/Mercador)

2. Clique "Criar Conta"

3. Espere redirecionamento automático para `/onboarding`

**PASSO 2: COMPLETAR ONBOARDING (4 passos)**
```
http://localhost:3001/onboarding
```

1. **Step 1:** Confirme a classe escolhida → "Continue"
2. **Step 2:** Selecione range de receita → "Continue"
3. **Step 3:** Escreva uma bio (min 20 caracteres) → "Continue"
4. **Step 4:** Clique "Enter the Guild"

5. Redirecionamento automático para `/` (dashboard)

**PASSO 3: AGORA VOCÊ PODE FAZER LOGIN**
```
http://localhost:3001/login
```

Use as MESMAS credenciais do registro:
- **Email:** seu-email+test-20260416@gmail.com
- **Senha:** Senha@123456

---

## ⚠️ Email Único Obrigatório

Supabase rejeita duplicatas. Use variações:

```
seu-email+test-001@gmail.com
seu-email+test-002@gmail.com
seu-email+guild-001@gmail.com
seu-email+builder-20260416@gmail.com
```

Se receber "System rejection. Credentials may be already active.":
- Use um novo email +tag
- Ou delete o usuário no Supabase dashboard

---

## 🎨 O Que Testar Após Login

### Dashboard Home (`/`)
- ✅ Greeting personalizado com seu nome
- ✅ 4 stats cards (POSTS, COMENTÁRIOS, UPVOTES, ADVENTURES)
- ✅ XP Evolution card com progress bar
- ✅ Ranking Position card
- ✅ Activity section (vazio até criar post)
- ✅ Missions section com 3 placeholder missions

### Sidebar
- ✅ Light theme (branco/cinza)
- ✅ 6 items: Dashboard, Feed, Cursos, Ranking, Missões, Chat
- ✅ Profile footer com seu nome/role

### Logout
- Clique em "Sair" no sidebar
- Redirecionamento para `/login`

---

## 📋 Checklist de Testes

- [ ] Registro em `/register` funciona
- [ ] Onboarding em `/onboarding` completa todos 4 steps
- [ ] Dashboard em `/` carrega com dados corretos
- [ ] Sidebar mostra light theme com 6 items
- [ ] Stats mostram contadores corretos
- [ ] XP bar tem progress visual
- [ ] Ranking mostra posição correta
- [ ] Login em `/login` funciona com credenciais registradas
- [ ] Logout redireciona para `/login`
- [ ] Nenhum erro 404/401 no console após reload

---

## 🐛 Se Algo Não Funcionar

1. **Logo 404** → Reload (F5)
2. **Supabase 401** → Use credenciais de um usuário que você registrou
3. **"Credentials already active"** → Use novo email com +tag
4. **Hydration error** → Reload (F5)
5. **Sidebar texto desaparece** → Clear cache ou reload

---

**Status:** ✅ Tudo implementado e pronto para testar!
