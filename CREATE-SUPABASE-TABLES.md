# 🗄️ Criar Tabelas no Supabase

## Problema
```
GET smzsdsbddepieznqwnho.supabase.co/rest/v1/profiles?select=*:1 404
```

A tabela `profiles` não existe no banco.

---

## ✅ Solução: Executar SQL no Supabase

### Passo 1: Acessar SQL Editor
```
https://supabase.com/dashboard/projects
→ Selecione o projeto
→ SQL Editor (menu esquerdo)
```

### Passo 2: Copie e Execute Este SQL

```sql
-- Criar tabela profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  avatar TEXT,
  bio TEXT,
  path TEXT CHECK (path IN ('ladino', 'mago', 'mercador')),
  revenue_range TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  adventures_count INTEGER DEFAULT 0,
  missions_count INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  is_founder BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  onboarding_completed_at TIMESTAMP,
  last_seen_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies (permite leitura pública, escrita autenticada)
CREATE POLICY "Public read profiles" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Criar tabela posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT CHECK (type IN ('adventure', 'discussion', 'question', 'showcase')),
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read posts" ON public.posts
FOR SELECT USING (true);

CREATE POLICY "Users can insert posts" ON public.posts
FOR INSERT WITH CHECK (auth.uid() = author);

-- Criar tabela comments
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read comments" ON public.comments
FOR SELECT USING (true);

CREATE POLICY "Users can insert comments" ON public.comments
FOR INSERT WITH CHECK (auth.uid() = author);
```

### Passo 3: Copie o SQL Acima
- Selecione TODO o SQL
- Ctrl+C (copiar)

### Passo 4: No SQL Editor do Supabase
1. Cole o SQL no editor
2. Clique no botão **"Run"** (canto superior direito)
3. Aguarde execução

### Passo 5: Verifique Criação
Se aparecer "Success!" você criou:
- ✅ `profiles` table
- ✅ `posts` table
- ✅ `comments` table
- ✅ RLS Policies

---

## ✅ Pronto!

Agora:
1. Restart dev server (`Ctrl+C`, `npm run dev`)
2. Tente registrar novamente em `/register`
3. A tabela `profiles` será criada automaticamente

---

## 🆘 Se Ainda Receber 404

Significa o SQL não rodou. Tente:

1. **Verifique erros** no SQL Editor
2. **Copie exatamente** todo o SQL acima (sem edições)
3. **Execute de novo**
4. **Verifique se tabela foi criada:**
   ```
   Supabase Dashboard → Table Editor
   Você deve ver: profiles, posts, comments
   ```

---

**Após criar as tabelas, volte a testar o registro!** ✅
