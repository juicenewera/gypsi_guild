'use client'

import { getSupabaseClient } from './client'

// ── TIPOS DO DOMÍNIO (espelham as tabelas do Supabase) ─────────────────

export type Notification = {
  id: string
  user_id: string
  type: 'upvote' | 'comment' | 'badge' | 'xp' | 'mention' | 'system'
  title: string
  body: string | null
  reference_id: string | null
  is_read: boolean
  created: string
}

export type Mission = {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  rarity: 'Bronze' | 'Prata' | 'Ouro' | 'Lendário'
  xp_reward: number
  is_pro_only: boolean
  queue_size: number
  is_active: boolean
  sort_order: number
}

export type Bounty = {
  id: string
  author_id: string | null
  title: string
  description: string
  reward_amount: number
  reward_currency: string
  company_name: string
  type: 'fixed' | 'commission' | 'hourly'
  category: 'automation' | 'sales_funnel' | 'custom_ai' | 'data_analysis' | 'content' | 'other'
  status: 'open' | 'in_progress' | 'completed' | 'expired'
  is_external: boolean
  external_url: string | null
  is_pro_only: boolean
  queue_size: number
  created: string
}

export type Course = {
  id: string
  slug: string
  title: string
  description: string
  emoji: string
  cover_color: string
  tag: string
  duration: string
  xp_reward: number
  price: number
  old_price: number | null
  is_featured: boolean
  is_affiliate: boolean
  affiliate_url: string | null
  status: 'available' | 'coming_soon' | 'pending_validation' | 'rejected'
  sort_order: number
}

export type EventRow = {
  id: string
  title: string
  description: string
  starts_at: string
  ends_at: string | null
  location: string
  join_url: string | null
  kind: 'mentoria' | 'workshop' | 'live' | 'open'
  is_private: boolean
  pro_only: boolean
}

export type MemberCard = {
  id: string
  username: string
  display_name: string | null
  path: 'mago' | 'ladino' | 'mercador'
  level: number
  xp: number
  location: string | null
  whatsapp: string | null
  instagram: string | null
  is_pro: boolean
  avatar_url: string | null
}

export type PostType = 'adventure' | 'discussion' | 'question'

export type FeedPost = {
  id: string
  user_id: string
  title: string
  content: string
  type: PostType
  category_id: string | null
  likes: number
  views: number
  is_validated: boolean
  created: string
  updated: string
  author: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
    path: 'mago' | 'ladino' | 'mercador' | null
    level: number
    is_pro: boolean
    is_founder: boolean
  } | null
  liked_by_me?: boolean
}

// ── QUERIES ────────────────────────────────────────────────────────────

export async function fetchNotifications(userId: string, limit = 20) {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created', { ascending: false })
    .limit(limit)
  if (error) return []
  return (data ?? []) as unknown as Notification[]
}

export async function markNotificationsRead(userId: string) {
  const sb = getSupabaseClient()
  await sb
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)
}

export async function fetchMissions() {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('missions')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) return []
  return (data ?? []) as unknown as Mission[]
}

export async function fetchMyMissionApplications(userId: string) {
  const sb = getSupabaseClient()
  const { data } = await sb
    .from('mission_applications')
    .select('mission_id, position, status')
    .eq('user_id', userId)
  return (data ?? []) as { mission_id: string; position: number; status: string }[]
}

export async function applyToMission(missionId: string): Promise<number> {
  const sb = getSupabaseClient()
  const { data, error } = await sb.rpc('apply_to_mission', { p_mission_id: missionId })
  if (error) throw new Error(error.message)
  return data as unknown as number
}

export async function fetchBounties(status: Bounty['status'] = 'open') {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('bounties')
    .select('*')
    .eq('status', status)
    .order('created', { ascending: false })
  if (error) return []
  return (data ?? []) as unknown as Bounty[]
}

export async function fetchMyBountyApplications(userId: string) {
  const sb = getSupabaseClient()
  const { data } = await sb
    .from('bounty_applications')
    .select('bounty_id, position, status')
    .eq('user_id', userId)
  return (data ?? []) as { bounty_id: string; position: number; status: string }[]
}

export async function applyToBounty(bountyId: string): Promise<number> {
  const sb = getSupabaseClient()
  const { data, error } = await sb.rpc('apply_to_bounty', { p_bounty_id: bountyId })
  if (error) throw new Error(error.message)
  return data as unknown as number
}

export async function fetchCourses() {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('courses')
    .select('*')
    .eq('status', 'available')
    .order('sort_order', { ascending: true })
  if (error) return []
  return (data ?? []) as unknown as Course[]
}

export async function submitCourseRequest(userId: string, topic: string) {
  const sb = getSupabaseClient()
  const { error } = await sb.from('course_requests').insert({ user_id: userId, topic })
  if (error) throw new Error(error.message)
}

export async function fetchUpcomingEvents(days = 45) {
  const sb = getSupabaseClient()
  const now = new Date()
  const until = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  const { data, error } = await sb
    .from('events')
    .select('*')
    .gte('starts_at', now.toISOString())
    .lte('starts_at', until.toISOString())
    .order('starts_at', { ascending: true })
  if (error) return []
  return (data ?? []) as unknown as EventRow[]
}

export async function fetchEventsInMonth(year: number, monthIndex: number) {
  const sb = getSupabaseClient()
  const start = new Date(year, monthIndex, 1).toISOString()
  const end   = new Date(year, monthIndex + 1, 1).toISOString()
  const { data, error } = await sb
    .from('events')
    .select('*')
    .gte('starts_at', start)
    .lt('starts_at', end)
    .order('starts_at', { ascending: true })
  if (error) return []
  return (data ?? []) as unknown as EventRow[]
}

export async function fetchMatilha() {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('profiles')
    .select('id, username, display_name, path, level, xp, location, whatsapp, instagram, is_pro, avatar_url')
    .order('xp', { ascending: false })
  if (error) return []
  return (data ?? []) as unknown as MemberCard[]
}

export async function fetchLeaderboard(path?: 'mago' | 'ladino' | 'mercador') {
  const sb = getSupabaseClient()
  let query = sb
    .from('profiles')
    .select('id, username, display_name, path, level, xp, is_pro, avatar_url')
    .order('xp', { ascending: false })
    .limit(50)
  if (path) query = query.eq('path', path)
  const { data, error } = await query
  if (error) return []
  return (data ?? []) as unknown as MemberCard[]
}

// ── POSTS / FEED ────────────────────────────────────────────────────────

export async function fetchPosts(opts?: { type?: PostType; userId?: string; currentUserId?: string | null; limit?: number }) {
  const sb = getSupabaseClient()
  const limit = opts?.limit ?? 40

  let query = sb
    .from('posts')
    .select(`
      id, user_id, title, content, type, category_id, likes, views, is_validated, created, updated,
      author:profiles!posts_user_id_fkey (
        id, username, display_name, avatar_url, path, level, is_pro, is_founder
      )
    `)
    .order('created', { ascending: false })
    .limit(limit)

  if (opts?.type) query = query.eq('type', opts.type)
  if (opts?.userId) query = query.eq('user_id', opts.userId)

  const { data, error } = await query
  if (error) return []

  const posts = (data ?? []) as unknown as FeedPost[]

  if (opts?.currentUserId && posts.length > 0) {
    const ids = posts.map(p => p.id)
    const { data: likes } = await sb
      .from('post_likes')
      .select('post_id')
      .eq('user_id', opts.currentUserId)
      .in('post_id', ids)
    const likedSet = new Set(((likes ?? []) as { post_id: string }[]).map(l => l.post_id))
    posts.forEach(p => { p.liked_by_me = likedSet.has(p.id) })
  }

  // Ordenação: Pro primeiro, depois validado, depois data (mais recente)
  posts.sort((a, b) => {
    const aPro = a.author?.is_pro ? 1 : 0
    const bPro = b.author?.is_pro ? 1 : 0
    if (aPro !== bPro) return bPro - aPro
    const aVal = a.is_validated ? 1 : 0
    const bVal = b.is_validated ? 1 : 0
    if (aVal !== bVal) return bVal - aVal
    return new Date(b.created).getTime() - new Date(a.created).getTime()
  })

  return posts
}

export async function createPost(input: {
  userId: string
  content: string
  title?: string
  type?: PostType
}) {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('posts')
    .insert({
      user_id: input.userId,
      title: input.title ?? '',
      content: input.content,
      type: input.type ?? 'adventure',
    })
    .select(`
      id, user_id, title, content, type, category_id, likes, views, is_validated, created, updated,
      author:profiles!posts_user_id_fkey (
        id, username, display_name, avatar_url, path, level, is_pro, is_founder
      )
    `)
    .single()
  if (error) throw new Error(error.message)
  return { ...(data as any), liked_by_me: false } as FeedPost
}

export async function togglePostLike(postId: string): Promise<{ likes: number; liked: boolean }> {
  const sb = getSupabaseClient()
  const { data, error } = await sb.rpc('toggle_post_like', { p_post_id: postId })
  if (error) throw new Error(error.message)
  const row = Array.isArray(data) ? data[0] : data
  return {
    likes: Number((row as any)?.likes ?? 0),
    liked: Boolean((row as any)?.liked ?? false),
  }
}

export async function submitOnboarding(
  slug: 'perfil' | 'preferencias' | 'negocio',
  answers: Record<string, unknown>,
  xp: number,
  path?: 'mago' | 'ladino' | 'mercador'
) {
  const sb = getSupabaseClient()
  const { error } = await sb.rpc('submit_onboarding', {
    p_slug: slug,
    p_answers: answers,
    p_xp: xp,
    p_path: path ?? null,
  })
  if (error) throw new Error(error.message)
}

// ── FEEDBACK ───────────────────────────────────────────────────────────

export async function submitFeedback(input: {
  rating: number
  message: string
  page?: string
}) {
  const sb = getSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : null
  const { error } = await sb.from('feedback').insert({
    user_id: user?.id ?? null,
    rating: input.rating,
    message: input.message,
    page: input.page ?? (typeof window !== 'undefined' ? window.location.pathname : null),
    user_agent: ua,
  })
  if (error) throw new Error(error.message)
}
