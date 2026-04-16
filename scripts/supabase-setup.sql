-- Cole este SQL no Supabase Dashboard → SQL Editor e execute
-- https://supabase.com/dashboard/project/rvoyllttmlluhwenhyln/sql/new

-- 1. Função que cria o perfil automaticamente quando um usuário é cadastrado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    email,
    name,
    path,
    level,
    xp,
    created,
    updated
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'path', 'ladino'),
    1,
    0,
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 2. Trigger que dispara a função acima após cada novo usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Remover política de INSERT do lado cliente (trigger faz isso agora)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- 4. Garantir política de UPDATE correta
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Desabilitar confirmação de email para que login funcione imediatamente
-- (faça isso em Authentication → Settings → "Enable email confirmations" → OFF)
