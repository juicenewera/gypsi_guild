# 🔑 Erro 401 Supabase — Regenerar Chaves

## Problema
```
POST https://smzsdsbddepieznqwnho.supabase.co/auth/v1/signup 401 (Unauthorized)
```

**Causa:** As credenciais JWT estão inválidas ou expiradas.

---

## ✅ Solução: Regenerar Chaves no Supabase Dashboard

### Passo 1: Acessar Supabase Dashboard
```
https://supabase.com/dashboard/projects
```

### Passo 2: Selecionar o Projeto
- Nome: `smzsdsbddepieznqwnho` (ou procure pelo projeto Guild)

### Passo 3: Ir para Settings > API
```
Menu esquerdo → Project Settings → API
```

### Passo 4: Copiar as Chaves
Encontre as 2 chaves:

**1. `NEXT_PUBLIC_SUPABASE_ANON_KEY`**
- Label: "anon public" ou "Anon/Public"
- Copie o valor (começa com `eyJ...`)

**2. `NEXT_PUBLIC_SUPABASE_URL`**
- Deve ser: `https://smzsdsbddepieznqwnho.supabase.co`
- (Se diferente, use o correto)

### Passo 5: Atualizar `.env.local`

Abra `c:\Users\juice\Desktop\PROJETOS\gypsi-vip-master\.env.local`

Substitua:
```env
NEXT_PUBLIC_SUPABASE_URL=https://smzsdsbddepieznqwnho.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=COLE_AQUI_A_NOVA_CHAVE_ANON
SUPABASE_SERVICE_ROLE_KEY=COLE_AQUI_A_NOVA_CHAVE_SERVICE_ROLE
SUPABASE_ACCESS_TOKEN=sbp_6d1bc1a0eff2c740e28c5298e35010275b4f83ab
```

### Passo 6: Restart Dev Server
```bash
# Ctrl+C no terminal
npm run dev
```

### Passo 7: Teste Register Novamente
```
http://localhost:3001/register
```

---

## 🔍 Se Ainda Não Funcionar

### Verificar se o Projeto Existe
1. Acesse https://supabase.com/dashboard/projects
2. Procure por `smzsdsbddepieznqwnho`
3. Se não encontrar:
   - O projeto foi deletado
   - **Opção:** Crie um novo projeto Supabase
   - Atualize `NEXT_PUBLIC_SUPABASE_URL` com o novo projeto

### Verificar RLS Policies
Se as chaves estão corretas mas ainda recebe 401:

1. Acesse Supabase Dashboard
2. SQL Editor
3. Execute:
```sql
-- Permitir qualquer um criar usuário em profiles
CREATE POLICY "Anyone can insert profiles" ON public.profiles
FOR INSERT WITH CHECK (true);
```

### Regenerar Chaves (Force)
Se suspeita que as chaves foram comprometidas:

1. Supabase Dashboard → Settings → API
2. Clique em "Rotate" (se disponível) ou delete e recrie as chaves
3. Copie as novas chaves
4. Atualize `.env.local`
5. Restart dev server

---

## 📋 Checklist
- [ ] Chaves atualizadas em `.env.local`
- [ ] Dev server reiniciado
- [ ] Cache do navegador limpo (Ctrl+Shift+Del)
- [ ] Página recarregada (F5)
- [ ] Tentou registrar novamente

---

**Após atualizar as chaves, teste:**
http://localhost:3001/register
