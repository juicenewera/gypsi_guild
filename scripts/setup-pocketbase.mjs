/**
 * PocketBase Setup Script
 * Run AFTER starting PocketBase and creating admin account:
 *   1. Start PocketBase: ./pocketbase/pocketbase.exe serve
 *   2. Go to http://127.0.0.1:8090/_/ and create admin
 *   3. Run: node scripts/setup-pocketbase.mjs
 */

const PB_URL = 'http://127.0.0.1:8090'

// Get admin credentials from args or prompt
const ADMIN_EMAIL = process.argv[2] || 'admin@guild.com'
const ADMIN_PASSWORD = process.argv[3] || 'admin12345678'

async function api(path, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json', 'Connection': 'close' }
  if (token) headers['Authorization'] = token
  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)
  await new Promise(r => setTimeout(r, 100)) // slight delay to prevent Node crash
  const res = await fetch(`${PB_URL}${path}`, opts)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${method} ${path} failed: ${res.status} - ${text}`)
  }
  return res.json()
}

async function main() {
  console.log('🏰 GUILD — PocketBase Setup')
  console.log('===========================\n')

  // Auth as admin
  console.log('🔑 Authenticating as admin...')
  const auth = await api('/api/collections/_superusers/auth-with-password', 'POST', {
    identity: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  })
  const token = auth.token

  let collCache = {}
  async function getCollectionId(name) {
    if (collCache[name]) return collCache[name]
    const list = await api('/api/collections', 'GET', null, token)
    const items = list.items || list
    const found = items.find(c => c.name === name)
    if (found) {
      collCache[name] = found.id
      return found.id
    }
    // Hardcoded system IDs if needed
    if (name === 'users') return '_pb_users_auth_'
    return name
  }

  // ===============================
  // 1. Extend users collection
  // ===============================
  console.log('\n📦 Extending users collection...')
  try {
    const collections = await api('/api/collections', 'GET', null, token)
    const items = collections.items || collections
    const usersCol = items.find(c => c.name === 'users')
    
    if (usersCol) {
      const extraFields = [
        { name: 'bio', type: 'text' },
        { name: 'path', type: 'select', options: { values: ['mago', 'ladino', 'mercador'] } },
        { name: 'revenue_range', type: 'text' },
        { name: 'pain_points', type: 'json' },
        { name: 'hardskills', type: 'json' },
        { name: 'softskills', type: 'json' },
        { name: 'onboarding_completed_at', type: 'date' },
        { name: 'level', type: 'number', options: { min: 1 } },
        { name: 'xp', type: 'number', options: { min: 0 } },
        { name: 'xp_to_next', type: 'number', options: { min: 0 } },
        { name: 'attr_ai', type: 'number' },
        { name: 'attr_automacao', type: 'number' },
        { name: 'attr_vendas', type: 'number' },
        { name: 'attr_database', type: 'number' },
        { name: 'attr_conteudo', type: 'number' },
        { name: 'attr_marketing', type: 'number' },
        { name: 'adventures_count', type: 'number' },
        { name: 'missions_count', type: 'number' },
        { name: 'streak_days', type: 'number' },
        { name: 'last_seen_at', type: 'date' },
        { name: 'is_founder', type: 'bool' },
        { name: 'is_admin', type: 'bool' },
      ]

      const existingNames = (usersCol.fields || []).map(f => f.name)
      const newFields = extraFields.filter(f => !existingNames.includes(f.name)).map(f => {
        if (f.options) {
          Object.assign(f, f.options)
          delete f.options
        }
        return f
      })

      if (newFields.length > 0) {
        await api(`/api/collections/${usersCol.id}`, 'PATCH', {
          fields: [...(usersCol.fields || []), ...newFields],
        }, token)
        console.log(`  ✅ Extended users with ${newFields.length} fields`)
      } else {
        console.log('  ⚠️ Users already has all fields')
      }
      collCache['users'] = usersCol.id
    }
  } catch (e) {
    console.log(`  ⚠️ Could not extend users: ${e.message}`)
  }

  // Helper to create collection
  async function createCollection(data) {
    // Resolve relation collection IDs automatically and flatten options
    const fieldsToProcess = [...(data.fields || [])]
    for (const f of fieldsToProcess) {
      if (f.options) {
        Object.assign(f, f.options)
        delete f.options
      }
      if (f.type === 'select' && f.maxSelect === undefined) {
        f.maxSelect = 1
      }
      if (f.type === 'relation' && f.collectionId) {
        const cid = await getCollectionId(f.collectionId)
        f.collectionId = cid
      }
    }
    
    try {
      const result = await api('/api/collections', 'POST', data, token)
      console.log(`  ✅ Created: ${data.name}`)
      // update cache
      collCache[data.name] = result.id
      return result
    } catch (e) {
      if (e.message.includes('409') || e.message.includes('already exists') || e.message.includes('unique') || e.message.includes('validation_collection')) {
        console.log(`  ⚠️ Exists: ${data.name}`)
        // try to get ID anyway
        await getCollectionId(data.name)
        return null
      }
      throw e
    }
  }

  // ===============================
  // 2. Create collections
  // ===============================
  console.log('\n📦 Creating collections...')

  await createCollection({
    name: 'categories',
    type: 'base',
    fields: [
      { name: 'slug', type: 'text', required: true, options: { min: 1 } },
      { name: 'name', type: 'text', required: true },
      { name: 'description', type: 'text' },
      { name: 'icon', type: 'text' },
      { name: 'path', type: 'select', options: { values: ['mago', 'ladino', 'mercador'] } },
      { name: 'color', type: 'text' },
      { name: 'sort_order', type: 'number' },
      { name: 'post_count', type: 'number' },
      { name: 'is_locked', type: 'bool' },
    ],
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.is_admin = true',
    updateRule: '@request.auth.is_admin = true',
    deleteRule: '@request.auth.is_admin = true',
  })

  await createCollection({
    name: 'posts',
    type: 'base',
    fields: [
      { name: 'author', type: 'relation', required: true, options: { collectionId: 'users', maxSelect: 1 } },
      { name: 'category', type: 'relation', options: { collectionId: 'categories', maxSelect: 1 } },
      { name: 'title', type: 'text', required: true },
      { name: 'body', type: 'text', required: true },
      { name: 'type', type: 'select', required: true, options: { values: ['adventure', 'discussion', 'question', 'showcase'] } },
      { name: 'revenue_amount', type: 'number' },
      { name: 'revenue_currency', type: 'text' },
      { name: 'client_niche', type: 'text' },
      { name: 'system_used', type: 'json' },
      { name: 'days_to_close', type: 'number' },
      { name: 'upvotes', type: 'number' },
      { name: 'views', type: 'number' },
      { name: 'comments_count', type: 'number' },
      { name: 'xp_awarded', type: 'number' },
      { name: 'tags', type: 'json' },
      { name: 'is_pinned', type: 'bool' },
      { name: 'is_featured', type: 'bool' },
      { name: 'is_validated', type: 'bool' },
    ],
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id = author',
    deleteRule: '@request.auth.id = author || @request.auth.is_admin = true',
  })

  await createCollection({
    name: 'comments',
    type: 'base',
    fields: [
      { name: 'post', type: 'relation', required: true, options: { collectionId: 'posts', maxSelect: 1 } },
      { name: 'author', type: 'relation', required: true, options: { collectionId: 'users', maxSelect: 1 } },
      { name: 'body', type: 'text', required: true },
      { name: 'upvotes', type: 'number' },
    ],
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id = author',
    deleteRule: '@request.auth.id = author || @request.auth.is_admin = true',
  })
  
  // Add self-referencing parent relation to comments
  try {
    const commentsId = await getCollectionId('comments')
    if (commentsId) {
      const col = await api(`/api/collections/${commentsId}`, 'GET', null, token)
      const hasParent = (col.fields || []).find(f => f.name === 'parent')
      if (!hasParent) {
        await api(`/api/collections/${commentsId}`, 'PATCH', {
          fields: [...(col.fields || []), { name: 'parent', type: 'relation', collectionId: commentsId, maxSelect: 1 }]
        }, token)
        console.log('  ✅ Added parent relation to comments')
      }
    }
  } catch (e) {
    console.log(`  ⚠️ Could not add parent to comments: ${e.message}`)
  }

  await createCollection({
    name: 'post_upvotes',
    type: 'base',
    fields: [
      { name: 'user', type: 'relation', required: true, options: { collectionId: 'users', maxSelect: 1 } },
      { name: 'post', type: 'relation', required: true, options: { collectionId: 'posts', maxSelect: 1 } },
    ],
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id = user',
    indexes: ['CREATE UNIQUE INDEX idx_unique_upvote ON post_upvotes (user, post)'],
  })

  await createCollection({
    name: 'comment_upvotes',
    type: 'base',
    fields: [
      { name: 'user', type: 'relation', required: true, options: { collectionId: 'users', maxSelect: 1 } },
      { name: 'comment', type: 'relation', required: true, options: { collectionId: 'comments', maxSelect: 1 } },
    ],
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id = user',
  })

  await createCollection({
    name: 'badges',
    type: 'base',
    fields: [
      { name: 'slug', type: 'text', required: true },
      { name: 'name', type: 'text', required: true },
      { name: 'description', type: 'text' },
      { name: 'icon', type: 'text' },
      { name: 'rarity', type: 'select', options: { values: ['comum', 'raro', 'epico', 'lendario'] } },
      { name: 'color', type: 'text' },
    ],
    listRule: '',
    viewRule: '',
  })

  await createCollection({
    name: 'user_badges',
    type: 'base',
    fields: [
      { name: 'user', type: 'relation', required: true, options: { collectionId: 'users', maxSelect: 1 } },
      { name: 'badge', type: 'relation', required: true, options: { collectionId: 'badges', maxSelect: 1 } },
      { name: 'earned_at', type: 'date' },
    ],
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.is_admin = true',
  })

  await createCollection({
    name: 'xp_log',
    type: 'base',
    fields: [
      { name: 'user', type: 'relation', required: true, options: { collectionId: 'users', maxSelect: 1 } },
      { name: 'amount', type: 'number', required: true },
      { name: 'reason', type: 'text', required: true },
      { name: 'reference_id', type: 'text' },
    ],
    listRule: '@request.auth.id = user',
    viewRule: '@request.auth.id = user',
    createRule: '@request.auth.id != ""',
  })

  await createCollection({
    name: 'notifications',
    type: 'base',
    fields: [
      { name: 'user', type: 'relation', required: true, options: { collectionId: 'users', maxSelect: 1 } },
      { name: 'type', type: 'select', options: { values: ['upvote', 'comment', 'badge', 'xp', 'mention'] } },
      { name: 'title', type: 'text', required: true },
      { name: 'body', type: 'text' },
      { name: 'reference_id', type: 'text' },
      { name: 'is_read', type: 'bool' },
    ],
    listRule: '@request.auth.id = user',
    viewRule: '@request.auth.id = user',
    updateRule: '@request.auth.id = user',
  })

  // ===============================
  // 3. Seed categories
  // ===============================
  console.log('\n🌱 Seeding categories...')
  const cats = [
    { slug: 'adventures', name: 'Adventures', description: 'Relatos de vendas e conquistas.', icon: '⚔️', path: null, color: '#d97706', sort_order: 1 },
    { slug: 'missoes-mago', name: 'Missões do Mago', description: 'Produto, sistema e estratégia.', icon: '🔮', path: 'mago', color: '#7c3aed', sort_order: 2 },
    { slug: 'missoes-ladino', name: 'Missões do Ladino', description: 'Execução, clientes, fechamentos.', icon: '🗡️', path: 'ladino', color: '#d97706', sort_order: 3 },
    { slug: 'taverna', name: 'Taverna', description: 'Discussões gerais e networking.', icon: '🍺', path: null, color: '#6b7280', sort_order: 4 },
    { slug: 'arsenal', name: 'Arsenal', description: 'Ferramentas e recursos.', icon: '🛡️', path: null, color: '#10b981', sort_order: 5 },
    { slug: 'conselho', name: 'Conselho da Guilda', description: 'Feedback e estratégias.', icon: '👑', path: null, color: '#f59e0b', sort_order: 6 },
  ]

  for (const cat of cats) {
    try {
      await api('/api/collections/categories/records', 'POST', cat, token)
      console.log(`  ✅ ${cat.name}`)
    } catch {
      console.log(`  ⚠️ ${cat.name} (exists)`)
    }
  }

  // ===============================
  // 4. Seed badges
  // ===============================
  console.log('\n🏅 Seeding badges...')
  const badges = [
    { slug: 'primeiro-sangue', name: 'Primeiro Sangue', description: 'Postou o primeiro Adventure', icon: '🗡️', rarity: 'comum', color: '#d97706' },
    { slug: 'fundador', name: 'Membro Fundador', description: 'Estava aqui desde o início', icon: '👑', rarity: 'lendario', color: '#ffd700' },
    { slug: 'speed-run', name: 'Speed Run', description: 'Completou missão em menos de 24h', icon: '⚡', rarity: 'raro', color: '#7c3aed' },
    { slug: '100k-mago', name: 'Arquimago', description: 'Faturou R$100k com IA', icon: '🔮', rarity: 'lendario', color: '#a855f7' },
    { slug: 'evangelista', name: 'Evangelista', description: 'Trouxe 5 membros', icon: '📯', rarity: 'epico', color: '#10b981' },
    { slug: 'streak-30', name: 'Imparável', description: '30 dias consecutivos ativo', icon: '🔥', rarity: 'epico', color: '#f59e0b' },
  ]

  for (const badge of badges) {
    try {
      await api('/api/collections/badges/records', 'POST', badge, token)
      console.log(`  ✅ ${badge.name}`)
    } catch {
      console.log(`  ⚠️ ${badge.name} (exists)`)
    }
  }

  console.log('\n🎮 Setup complete! Guild is ready.\n')
}

main().catch(e => {
  console.error('❌ Setup failed:', e.message)
  process.exit(1)
})
