// scripts/create-user.mjs
// Cria usuário de teste via signUp do Supabase.
// Uso:
//   SEED_EMAIL=foo@bar.com SEED_PASSWORD=xxx SEED_USERNAME=foo node scripts/create-user.mjs
// Lê NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY do .env.local automaticamente.

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

// Carrega .env.local (sem dotenv pra evitar dep)
try {
  const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
} catch { /* env opcional */ }

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('Faltam NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY no env.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, ANON_KEY)

async function createUser() {
  const email    = process.env.SEED_EMAIL
  const password = process.env.SEED_PASSWORD
  const username = process.env.SEED_USERNAME
  const path     = process.env.SEED_PATH || 'mago'

  if (!email || !password || !username) {
    console.error('Defina SEED_EMAIL, SEED_PASSWORD, SEED_USERNAME antes de rodar.')
    process.exit(1)
  }

  console.log(`\n🔧 Criando usuário: ${email}`)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, display_name: username, path }
    }
  })

  if (error) {
    console.error('❌ Erro no signUp:', error.message)
    process.exit(1)
  }

  console.log('✅ Usuário criado com ID:', data.user?.id)
  console.log('   Session ativa?', !!data.session)

  if (!data.session) {
    console.log('\n⚠️  Email confirmation ainda está ATIVO no Supabase.')
    console.log('   Vá em: Authentication → Settings → desative "Enable email confirmations"')
    process.exit(1)
  }

  // Aguarda trigger criar o perfil
  await new Promise(r => setTimeout(r, 1000))

  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()

  if (profileErr || !profile) {
    console.error('❌ Perfil não criado. Trigger pode ter falhado:', profileErr?.message)
    console.log('\n📋 Cole o SQL do trigger no SQL Editor do Supabase e execute novamente.')
    process.exit(1)
  }

  console.log('\n✅ Perfil criado com sucesso:')
  console.table({ id: profile.id, username: profile.username, path: profile.path, level: profile.level })
  console.log('\n🎉 Pode fazer login em http://localhost:3001/login')
  console.log(`   Email:  ${email}`)
  console.log(`   Senha:  ${password}`)
}

createUser()
