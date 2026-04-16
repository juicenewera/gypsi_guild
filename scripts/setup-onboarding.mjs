/**
 * Guild — Onboarding Fields Migration
 * Adds onboarding fields to users collection and updates path values.
 *
 * Run: node scripts/setup-onboarding.mjs
 */

const PB_URL = 'http://127.0.0.1:8090'
const ADMIN_EMAIL = process.argv[2] || 'admin@guild.com'
const ADMIN_PASSWORD = process.argv[3] || 'admin12345678'

async function api(path, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json', 'Connection': 'close' }
  if (token) headers['Authorization'] = token
  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)
  await new Promise(r => setTimeout(r, 100))
  const res = await fetch(`${PB_URL}${path}`, opts)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${method} ${path} failed: ${res.status} - ${text}`)
  }
  return res.json()
}

async function main() {
  console.log('Guild — Onboarding Migration')
  console.log('=============================\n')

  console.log('Authenticating as admin...')
  const auth = await api('/api/collections/_superusers/auth-with-password', 'POST', {
    identity: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  })
  const token = auth.token

  // Get users collection
  console.log('\nFetching users collection...')
  const collections = await api('/api/collections', 'GET', null, token)
  const items = collections.items || collections
  const usersCol = items.find(c => c.name === 'users')

  if (!usersCol) {
    throw new Error('users collection not found. Run setup-pocketbase.mjs first.')
  }

  const existingNames = (usersCol.fields || []).map(f => f.name)

  const onboardingFields = [
    {
      name: 'revenue_range',
      type: 'text',
    },
    {
      name: 'pain_points',
      type: 'json',
    },
    {
      name: 'hardskills',
      type: 'json',
    },
    {
      name: 'softskills',
      type: 'json',
    },
    {
      name: 'onboarding_completed_at',
      type: 'date',
    },
  ]

  const newFields = onboardingFields.filter(f => !existingNames.includes(f.name))

  // Update path field values to include ladino and mercador
  const currentFields = usersCol.fields || []
  const updatedFields = currentFields.map(f => {
    if (f.name === 'path' && f.type === 'select') {
      return {
        ...f,
        values: ['ladino', 'mago', 'mercador'],
      }
    }
    return f
  })

  const allFields = [
    ...updatedFields,
    ...newFields,
  ]

  if (newFields.length > 0 || true) {
    await api(`/api/collections/${usersCol.id}`, 'PATCH', {
      fields: allFields,
    }, token)
    console.log(`Updated users collection:`)
    if (newFields.length > 0) {
      console.log(`  Added ${newFields.length} onboarding fields: ${newFields.map(f => f.name).join(', ')}`)
    }
    console.log('  Updated path values to: ladino, mago, mercador')
  }

  // Update categories collection path field
  console.log('\nUpdating categories path field...')
  const catsCol = items.find(c => c.name === 'categories')
  if (catsCol) {
    const catFields = (catsCol.fields || []).map(f => {
      if (f.name === 'path' && f.type === 'select') {
        return { ...f, values: ['ladino', 'mago', 'mercador'] }
      }
      return f
    })
    await api(`/api/collections/${catsCol.id}`, 'PATCH', {
      fields: catFields,
    }, token)
    console.log('  Updated categories.path values')
  }

  console.log('\nOnboarding migration complete!\n')
}

main().catch(e => {
  console.error('Migration failed:', e.message)
  process.exit(1)
})
