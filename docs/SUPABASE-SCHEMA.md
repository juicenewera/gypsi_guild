# Gipsy VIP — Supabase Schema Spec
**Projeto:** smzsdsbddepieznqwnho
**URL:** https://smzsdsbddepieznqwnho.supabase.co
**Status:** SPEC — aguardando execução das migrations

---

## DECISÃO DE ARQUITETURA

Migrar de PocketBase local → Supabase para:
- Auth gerenciado (Supabase Auth)
- Banco em produção (Postgres)
- Row Level Security (RLS)
- Realtime para feed e notificações
- Edge Functions para XP e webhooks

---

## TABELAS

### `profiles` (estende auth.users)
```sql
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  display_name  TEXT,
  avatar_url    TEXT,
  bio           TEXT DEFAULT '',
  path          TEXT CHECK (path IN ('mago','guerreiro','mercador')) NOT NULL DEFAULT 'mago',
  level         INT NOT NULL DEFAULT 1,
  xp            INT NOT NULL DEFAULT 0,
  attr_ai       INT NOT NULL DEFAULT 0,
  attr_automacao INT NOT NULL DEFAULT 0,
  attr_vendas   INT NOT NULL DEFAULT 0,
  attr_produto  INT NOT NULL DEFAULT 0,
  streak_days   INT NOT NULL DEFAULT 0,
  last_seen_at  TIMESTAMPTZ DEFAULT NOW(),
  is_admin      BOOLEAN NOT NULL DEFAULT FALSE,
  is_founder    BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_completed_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `categories`
```sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon        TEXT DEFAULT '',
  path        TEXT CHECK (path IN ('mago','guerreiro','mercador',NULL)),
  color       TEXT DEFAULT '#3B82F6',
  sort_order  INT DEFAULT 0,
  post_count  INT DEFAULT 0,
  is_locked   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### `posts`
```sql
CREATE TABLE posts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id        UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id      UUID REFERENCES categories(id),
  title            TEXT NOT NULL,
  body             TEXT NOT NULL,
  type             TEXT CHECK (type IN ('adventure','discussion','question','showcase')) NOT NULL,
  revenue_amount   NUMERIC,
  revenue_currency TEXT DEFAULT 'BRL',
  client_niche     TEXT DEFAULT '',
  system_used      TEXT[] DEFAULT '{}',
  days_to_close    INT,
  upvotes          INT DEFAULT 0,
  views            INT DEFAULT 0,
  comments_count   INT DEFAULT 0,
  xp_awarded       INT DEFAULT 0,
  tags             TEXT[] DEFAULT '{}',
  is_pinned        BOOLEAN DEFAULT FALSE,
  is_featured      BOOLEAN DEFAULT FALSE,
  is_validated     BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### `comments`
```sql
CREATE TABLE comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id  UUID REFERENCES comments(id),
  body       TEXT NOT NULL,
  upvotes    INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `post_upvotes`
```sql
CREATE TABLE post_upvotes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id    UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);
```

### `comment_upvotes`
```sql
CREATE TABLE comment_upvotes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);
```

### `xp_log`
```sql
CREATE TABLE xp_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount       INT NOT NULL,
  reason       TEXT NOT NULL, -- 'post_discussion' | 'post_adventure' | 'comment' | etc.
  reference_id UUID,          -- id do post/comment que gerou o XP
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### `badges`
```sql
CREATE TABLE badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon        TEXT DEFAULT '',
  rarity      TEXT CHECK (rarity IN ('comum','raro','epico','lendario')) DEFAULT 'comum',
  color       TEXT DEFAULT '#3B82F6',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### `user_badges`
```sql
CREATE TABLE user_badges (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id   UUID REFERENCES badges(id),
  earned_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);
```

### `notifications`
```sql
CREATE TABLE notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type         TEXT CHECK (type IN ('upvote','comment','badge','xp','mention')) NOT NULL,
  title        TEXT NOT NULL,
  body         TEXT DEFAULT '',
  reference_id UUID,
  is_read      BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### `bounties` (marketplace)
```sql
CREATE TABLE bounties (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id        UUID REFERENCES profiles(id),
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  reward_amount    NUMERIC NOT NULL,
  reward_currency  TEXT DEFAULT 'BRL',
  company_name     TEXT DEFAULT '',
  type             TEXT CHECK (type IN ('fixed','commission','hourly')) DEFAULT 'fixed',
  category         TEXT CHECK (category IN ('automation','sales_funnel','custom_ai','data_analysis','content','other')),
  status           TEXT CHECK (status IN ('open','in_progress','completed','expired')) DEFAULT 'open',
  is_external      BOOLEAN DEFAULT FALSE,
  external_url     TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  expires_at       TIMESTAMPTZ
);
```

### `agents` (biblioteca de agentes)
```sql
CREATE TABLE agents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id    UUID REFERENCES profiles(id),
  name         TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  description  TEXT NOT NULL,
  category     TEXT NOT NULL,  -- 'vendas' | 'automacao' | 'conteudo' | 'dados' | 'suporte' | 'dev'
  prompt       TEXT,           -- prompt base (opcional, pode ser privado)
  usage_count  INT DEFAULT 0,
  is_featured  BOOLEAN DEFAULT FALSE,
  is_public    BOOLEAN DEFAULT TRUE,
  github_url   TEXT,
  demo_url     TEXT,
  tags         TEXT[] DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### `courses`
```sql
CREATE TABLE courses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  cover_url    TEXT,
  path         TEXT CHECK (path IN ('mago','guerreiro','mercador','all')) DEFAULT 'all',
  level        INT DEFAULT 1,
  xp_reward    INT DEFAULT 500,
  price        NUMERIC DEFAULT 0,
  status       TEXT CHECK (status IN ('available','coming_soon','waitlist')) DEFAULT 'available',
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### `enrollments`
```sql
CREATE TABLE enrollments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id    UUID REFERENCES courses(id),
  progress_pct INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
```

---

## RLS POLICIES (principais)

```sql
-- profiles: público para leitura, privado para escrita
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_write" ON profiles FOR ALL USING (auth.uid() = id);

-- posts: público para leitura, autenticado para escrita
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_public_read" ON posts FOR SELECT USING (true);
CREATE POLICY "posts_auth_insert" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_own_update" ON posts FOR UPDATE USING (auth.uid() = author_id);

-- xp_log: só leitura do próprio usuário
ALTER TABLE xp_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "xp_log_own_read" ON xp_log FOR SELECT USING (auth.uid() = user_id);

-- notifications: só próprio usuário
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_own" ON notifications FOR ALL USING (auth.uid() = user_id);
```

---

## FUNÇÕES (triggers)

```sql
-- Auto-criar profile ao registrar
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## VARIÁVEIS DE AMBIENTE NECESSÁRIAS

```env
# .env.local (NUNCA commitar)
NEXT_PUBLIC_SUPABASE_URL=https://smzsdsbddepieznqwnho.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=       # pegar em: Dashboard > Settings > API
SUPABASE_SERVICE_ROLE_KEY=           # pegar em: Dashboard > Settings > API (SECRET)
SUPABASE_ACCESS_TOKEN=sbp_e8cf9856e90dd7385b1f29acf3858daf625d54e5
```

**Pegar as chaves em:**
https://supabase.com/dashboard/project/smzsdsbddepieznqwnho/settings/api

---

## ORDEM DE EXECUÇÃO DAS MIGRATIONS

1. profiles + trigger auth
2. categories + badges
3. posts + comments + upvotes
4. xp_log + notifications
5. bounties + agents
6. courses + enrollments
7. RLS policies em todas as tabelas
8. Índices de performance

---

## PRÓXIMOS PASSOS (Sprint 3 com Supabase)

1. Executar este schema no Supabase via MCP ou SQL Editor
2. Instalar `@supabase/supabase-js` no projeto
3. Criar `lib/supabase/client.ts` e `lib/supabase/server.ts`
4. Migrar auth: Supabase Auth substitui PocketBase auth
5. Migrar queries: `pb.collection('posts').getList()` → `supabase.from('posts').select()`
6. Dashboard e XP usando Supabase

---

## SEED DATA (categorias iniciais)

```sql
INSERT INTO categories (slug, name, description, icon, color, sort_order) VALUES
  ('geral', 'Geral', 'Discussões gerais da guild', '💬', '#3B82F6', 1),
  ('adventures', 'Adventures', 'Cases reais de execução', '⚔️', '#EF4444', 2),
  ('showcase', 'Showcase', 'Projetos e produtos criados', '🚀', '#8B5CF6', 3),
  ('oportunidades', 'Oportunidades', 'Jobs e freelas', '💼', '#F59E0B', 4),
  ('automacao', 'Automação', 'Fluxos e agentes de IA', '⚙️', '#10B981', 5),
  ('vendas', 'Vendas com IA', 'Estratégias e scripts', '💰', '#F59E0B', 6);
```
