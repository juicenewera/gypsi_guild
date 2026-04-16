// scripts/create-user.mjs
// Cria usuário de teste diretamente via Supabase Auth Admin API
// Uso: node scripts/create-user.mjs

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rvoyllttmlluhwenhyln.supabase.co'

// Para criar usuário via admin precisamos do service_role key
// Como não temos, usamos signUp normal (funciona com email confirmation OFF)
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2b3lsbHR0bWxsdWh3ZW5oeWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3OTY0MjAsImV4cCI6MjA5MTM3MjQyMH0.wLXV1lUTIT1VTzvS_tq_X6k3K2uClK_0qjvOKjGEv9Y'

const supabase = createClient(SUPABASE_URL, ANON_KEY)

async function createUser() {
  const email    = 'sf.prod.sf3@gmail.com'
  const password = 'senha123'
  const username = 'juicenewera'
  const path     = 'mago'

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
