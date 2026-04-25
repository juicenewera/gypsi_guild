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
  type: 'course' | 'live'
}

export type CourseLesson = {
  id: string
  course_id: string
  slug: string
  title: string
  description: string
  external_url: string
  thumbnail_url: string | null
  duration_sec: number | null
  instructor: string
  order_index: number
  published_at: string
  xp_reward: number
  is_pro_only: boolean
  completed_at?: string | null
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
  bio: string | null
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
  image_url: string | null
  comments_count: number
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

export type FeedComment = {
  id: string
  post_id: string
  user_id: string
  parent_id: string | null
  body: string
  likes: number
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

export type UserDashboardStats = {
  posts: number
  comments: number
  likes_received: number
  adventures: number
  weekly_xp: number
  position: number
  above_username: string | null
  above_xp_delta: number
}

export async function fetchUserDashboardStats(userId: string): Promise<UserDashboardStats> {
  const sb = getSupabaseClient()

  const [
    postsRes,
    adventuresRes,
    commentsRes,
    likesRes,
    weeklyXpRes,
    meRes,
  ] = await Promise.all([
    sb.from('posts')   .select('id', { count: 'exact', head: true }).eq('user_id', userId),
    sb.from('posts')   .select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('type', 'adventure'),
    sb.from('comments').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    sb.from('post_likes').select('post_id, posts!inner(user_id)', { count: 'exact', head: true }).eq('posts.user_id', userId),
    sb.from('xp_log')  .select('amount').eq('user_id', userId).gte('created', new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()),
    sb.from('profiles').select('xp').eq('id', userId).maybeSingle(),
  ])

  const myXp = Number((meRes.data as any)?.xp ?? 0)

  const { data: above } = await sb
    .from('profiles')
    .select('username, display_name, xp')
    .gt('xp', myXp)
    .order('xp', { ascending: true })
    .limit(1)
    .maybeSingle()

  const { count: aheadCount } = await sb
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .gt('xp', myXp)

  const weekly = Array.isArray(weeklyXpRes.data)
    ? (weeklyXpRes.data as { amount: number }[]).reduce((acc, r) => acc + Number(r.amount ?? 0), 0)
    : 0

  return {
    posts:          postsRes.count ?? 0,
    comments:       commentsRes.count ?? 0,
    likes_received: likesRes.count ?? 0,
    adventures:     adventuresRes.count ?? 0,
    weekly_xp:      weekly,
    position:       (aheadCount ?? 0) + 1,
    above_username: (above as any)?.display_name || (above as any)?.username || null,
    above_xp_delta: above ? Math.max(Number((above as any).xp) - myXp, 0) : 0,
  }
}

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

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  const sb = getSupabaseClient()
  const { data } = await sb.from('courses').select('*').eq('slug', slug).maybeSingle()
  return (data as unknown as Course) ?? null
}

export async function fetchCourseLessons(
  courseId: string,
  currentUserId?: string | null,
): Promise<CourseLesson[]> {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('course_lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })
    .order('published_at', { ascending: false })
  if (error || !data) return []

  if (!currentUserId) return data as unknown as CourseLesson[]

  const { data: views } = await sb
    .from('lesson_views')
    .select('lesson_id, completed_at')
    .eq('user_id', currentUserId)
    .in('lesson_id', data.map((d: any) => d.id))

  const viewMap = new Map<string, string | null>()
  ;(views ?? []).forEach((v: any) => viewMap.set(v.lesson_id, v.completed_at))

  return (data as any[]).map(l => ({
    ...l,
    completed_at: viewMap.get(l.id) ?? null,
  })) as CourseLesson[]
}

export async function markLessonCompleted(lessonId: string, watchedSec: number) {
  const sb = getSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Autenticação necessária')

  const { error } = await sb.from('lesson_views').upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      watched_sec: watchedSec,
      completed_at: new Date().toISOString(),
      updated: new Date().toISOString(),
    },
    { onConflict: 'user_id,lesson_id' },
  )
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

export type PublicProfile = {
  id: string
  username: string
  display_name: string | null
  name: string | null
  bio: string | null
  avatar_url: string | null
  path: 'mago' | 'ladino' | 'mercador' | null
  level: number
  xp: number
  is_pro: boolean
  is_founder: boolean
  whatsapp: string | null
  instagram: string | null
  location: string | null
  streak_days: number
  attr_ai: number
  attr_automacao: number
  attr_vendas: number
  attr_database: number
  attr_conteudo: number
  attr_marketing: number
  adventures_count: number
  missions_count: number
  title: string | null
  tagline: string | null
  email_public: string | null
  phone_public: string | null
  hobbies: string[]
  wishlist: string[]
  rating_avg: number | null
  rating_count: number
}

export type ReviewTag = 'Ajudei' | 'Indiquei' | 'Colaborei' | 'Contratei'

export type ProfileReview = {
  id: string
  target_id: string
  reviewer_id: string
  rating: number
  tag: ReviewTag
  body: string
  company: string | null
  created_at: string
  updated_at: string
  reviewer: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
    path: 'mago' | 'ladino' | 'mercador' | null
    level: number
  } | null
}

const PROFILE_SELECT = `
  id, username, display_name, name, bio, avatar_url, path, level, xp,
  is_pro, is_founder, whatsapp, instagram, location, streak_days,
  attr_ai, attr_automacao, attr_vendas, attr_database, attr_conteudo, attr_marketing,
  adventures_count, missions_count,
  title, tagline, email_public, phone_public, hobbies, wishlist, rating_avg, rating_count
`

export async function fetchProfileByUsername(username: string): Promise<PublicProfile | null> {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('profiles')
    .select(PROFILE_SELECT)
    .eq('username', username)
    .maybeSingle()
  if (error || !data) return null
  return data as unknown as PublicProfile
}

export async function fetchProfileReviews(targetId: string, page = 0, pageSize = 10): Promise<{ rows: ProfileReview[]; total: number }> {
  const sb = getSupabaseClient()
  const from = page * pageSize
  const to = from + pageSize - 1
  const { data, error, count } = await sb
    .from('profile_reviews')
    .select('id, target_id, reviewer_id, rating, tag, body, company, created_at, updated_at, reviewer:profiles!profile_reviews_reviewer_id_fkey(id, username, display_name, avatar_url, path, level)', { count: 'exact' })
    .eq('target_id', targetId)
    .order('created_at', { ascending: false })
    .range(from, to)
  if (error || !data) return { rows: [], total: 0 }
  return { rows: data as unknown as ProfileReview[], total: count ?? 0 }
}

export async function fetchMyReviewOf(targetId: string): Promise<ProfileReview | null> {
  const sb = getSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null
  const { data } = await sb
    .from('profile_reviews')
    .select('id, target_id, reviewer_id, rating, tag, body, company, created_at, updated_at, reviewer:profiles!profile_reviews_reviewer_id_fkey(id, username, display_name, avatar_url, path, level)')
    .eq('target_id', targetId)
    .eq('reviewer_id', user.id)
    .maybeSingle()
  return (data as unknown as ProfileReview) ?? null
}

export async function upsertReview(input: {
  target_id: string
  rating: number
  tag: ReviewTag
  body?: string
  company?: string | null
}) {
  const sb = getSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Autenticação necessária')
  if (user.id === input.target_id) throw new Error('Você não pode avaliar a si mesmo')
  const payload = {
    target_id: input.target_id,
    reviewer_id: user.id,
    rating: input.rating,
    tag: input.tag,
    body: input.body ?? '',
    company: input.company ?? null,
  }
  const { error } = await sb
    .from('profile_reviews')
    .upsert(payload, { onConflict: 'target_id,reviewer_id' })
  if (error) throw new Error(error.message)
}

export async function deleteMyReview(targetId: string) {
  const sb = getSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Autenticação necessária')
  const { error } = await sb
    .from('profile_reviews')
    .delete()
    .eq('target_id', targetId)
    .eq('reviewer_id', user.id)
  if (error) throw new Error(error.message)
}

export async function updateProfile(userId: string, patch: Partial<{
  display_name: string
  bio: string
  avatar_url: string | null
  whatsapp: string
  instagram: string
  location: string
  title: string
  tagline: string
  email_public: string | null
  phone_public: string | null
  hobbies: string[]
  wishlist: string[]
}>) {
  const sb = getSupabaseClient()
  const { error } = await sb.from('profiles').update(patch).eq('id', userId)
  if (error) throw new Error(error.message)
}

export async function fetchAdventurers() {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('profiles')
    .select('id, username, display_name, path, level, xp, location, whatsapp, instagram, is_pro, avatar_url, bio')
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
      id, user_id, title, content, type, category_id, likes, views, is_validated, image_url, comments_count, created, updated,
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
  imageUrl?: string | null
}) {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('posts')
    .insert({
      user_id: input.userId,
      title: input.title ?? '',
      content: input.content,
      type: input.type ?? 'adventure',
      image_url: input.imageUrl ?? null,
    })
    .select(`
      id, user_id, title, content, type, category_id, likes, views, is_validated, image_url, comments_count, created, updated,
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

export async function fetchPostById(postId: string, currentUserId?: string | null): Promise<FeedPost | null> {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('posts')
    .select(`
      id, user_id, title, content, type, category_id, likes, views, is_validated, image_url, comments_count, created, updated,
      author:profiles!posts_user_id_fkey (
        id, username, display_name, avatar_url, path, level, is_pro, is_founder
      )
    `)
    .eq('id', postId)
    .maybeSingle()
  if (error || !data) return null

  const post = data as unknown as FeedPost
  if (currentUserId) {
    const { data: like } = await sb
      .from('post_likes')
      .select('post_id')
      .eq('user_id', currentUserId)
      .eq('post_id', postId)
      .maybeSingle()
    post.liked_by_me = !!like
  }
  return post
}

export async function incrementPostView(postId: string) {
  const sb = getSupabaseClient()
  await sb.rpc('increment_post_view', { p_post_id: postId }).then(
    () => {},
    async () => {
      const { data } = await sb.from('posts').select('views').eq('id', postId).maybeSingle()
      const next = Number((data as any)?.views ?? 0) + 1
      await sb.from('posts').update({ views: next }).eq('id', postId)
    },
  )
}

export async function deleteOwnPost(postId: string): Promise<void> {
  const sb = getSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Sessão expirada.')
  const { error } = await sb.from('posts').delete().eq('id', postId).eq('user_id', user.id)
  if (error) throw new Error(error.message)
}

export async function uploadPostImage(file: File): Promise<string> {
  const sb = getSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Sessão expirada. Entre novamente.')
  if (file.size > 8 * 1024 * 1024) throw new Error('Imagem muito grande (máx 8 MB).')

  const ext  = (file.name.split('.').pop() || 'png').toLowerCase()
  const path = `${user.id}/post-${Date.now()}.${ext}`

  const { error: upErr } = await sb.storage.from('post-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (upErr) throw new Error(upErr.message)

  const { data } = sb.storage.from('post-images').getPublicUrl(path)
  return data.publicUrl
}

// ── COMMENTS ───────────────────────────────────────────────────────────

export async function fetchComments(postId: string, currentUserId?: string | null): Promise<FeedComment[]> {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('comments')
    .select(`
      id, post_id, user_id, parent_id, body, likes, created, updated,
      author:profiles!comments_user_id_fkey (
        id, username, display_name, avatar_url, path, level, is_pro, is_founder
      )
    `)
    .eq('post_id', postId)
    .order('created', { ascending: true })
  if (error || !data) return []

  const comments = data as unknown as FeedComment[]
  if (currentUserId && comments.length > 0) {
    const ids = comments.map(c => c.id)
    const { data: likes } = await sb
      .from('comment_likes')
      .select('comment_id')
      .eq('user_id', currentUserId)
      .in('comment_id', ids)
    const likedSet = new Set(((likes ?? []) as { comment_id: string }[]).map(l => l.comment_id))
    comments.forEach(c => { c.liked_by_me = likedSet.has(c.id) })
  }
  return comments
}

export async function createComment(input: {
  postId: string
  body: string
  parentId?: string | null
}): Promise<FeedComment> {
  const sb = getSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Entre para comentar.')
  const trimmed = input.body.trim()
  if (!trimmed) throw new Error('Comentário vazio.')

  const { data, error } = await sb
    .from('comments')
    .insert({
      post_id: input.postId,
      user_id: user.id,
      parent_id: input.parentId ?? null,
      body: trimmed,
    })
    .select(`
      id, post_id, user_id, parent_id, body, likes, created, updated,
      author:profiles!comments_user_id_fkey (
        id, username, display_name, avatar_url, path, level, is_pro, is_founder
      )
    `)
    .single()
  if (error) throw new Error(error.message)
  return { ...(data as any), liked_by_me: false } as FeedComment
}

export async function deleteOwnComment(commentId: string): Promise<void> {
  const sb = getSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Sessão expirada.')
  const { error } = await sb.from('comments').delete().eq('id', commentId).eq('user_id', user.id)
  if (error) throw new Error(error.message)
}

export async function toggleCommentLike(commentId: string): Promise<{ likes: number; liked: boolean }> {
  const sb = getSupabaseClient()
  const { data, error } = await sb.rpc('toggle_comment_like', { p_comment_id: commentId })
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

// ── PROFILE EDIT / AVATAR UPLOAD ───────────────────────────────────────

export type ProfileUpdate = {
  display_name?: string | null
  bio?: string | null
  whatsapp?: string | null
  instagram?: string | null
  location?: string | null
  avatar_url?: string | null
  title?: string | null
  tagline?: string | null
  email_public?: string | null
  phone_public?: string | null
  hobbies?: string[]
  wishlist?: string[]
}

export async function updateMyProfile(patch: ProfileUpdate) {
  const sb = getSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Sessão expirada. Entre novamente.')
  const { data, error } = await sb
    .from('profiles')
    .update(patch)
    .eq('id', user.id)
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function uploadAvatar(file: File): Promise<string> {
  const sb = getSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Sessão expirada. Entre novamente.')
  if (file.size > 5 * 1024 * 1024) throw new Error('Imagem muito grande (máx 5 MB).')

  const ext  = (file.name.split('.').pop() || 'png').toLowerCase()
  const path = `${user.id}/avatar-${Date.now()}.${ext}`

  const { error: upErr } = await sb.storage.from('avatars').upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type,
  })
  if (upErr) throw new Error(upErr.message)

  const { data } = sb.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}

// ── FEEDBACK ───────────────────────────────────────────────────────────

export async function submitFeedback(input: {
  rating: number
  message: string
  page?: string
}) {
  const sb = getSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Entre para enviar feedback.')
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : null
  const { error } = await sb.from('feedback').insert({
    user_id: user.id,
    rating: input.rating,
    message: input.message,
    page: input.page ?? (typeof window !== 'undefined' ? window.location.pathname : null),
    user_agent: ua,
  })
  if (error) throw new Error(error.message)
}

// ── ADMIN (F2) ─────────────────────────────────────────────────────────

export type AdminPendingPost = {
  id: string
  title: string | null
  content: string
  type: string
  created: string
  likes: number
  author: { id: string; username: string; display_name: string | null; avatar_url: string | null } | null
}

export async function fetchAllCoursesAdmin(): Promise<Course[]> {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('courses')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) return []
  return (data ?? []) as unknown as Course[]
}

export async function upsertCourse(input: Partial<Course> & { slug: string; title: string }) {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('courses')
    .upsert(input, { onConflict: 'slug' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as unknown as Course
}

export async function deleteCourse(id: string) {
  const sb = getSupabaseClient()
  const { error } = await sb.from('courses').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function upsertLesson(input: Partial<CourseLesson> & { course_id: string; slug: string; title: string; external_url: string }) {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('course_lessons')
    .upsert(input, { onConflict: 'course_id,slug' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as unknown as CourseLesson
}

export async function deleteLesson(id: string) {
  const sb = getSupabaseClient()
  const { error } = await sb.from('course_lessons').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function fetchAllMissionsAdmin(): Promise<Mission[]> {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('missions')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) return []
  return (data ?? []) as unknown as Mission[]
}

export async function upsertMission(input: Partial<Mission> & { slug: string; title: string }) {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('missions')
    .upsert(input, { onConflict: 'slug' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as unknown as Mission
}

export async function deleteMission(id: string) {
  const sb = getSupabaseClient()
  const { error } = await sb.from('missions').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function fetchAllEventsAdmin(): Promise<EventRow[]> {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('events')
    .select('*')
    .order('starts_at', { ascending: false })
  if (error) return []
  return (data ?? []) as unknown as EventRow[]
}

export async function upsertEvent(input: Partial<EventRow> & { title: string; starts_at: string }) {
  const sb = getSupabaseClient()
  const payload: any = { ...input }
  const { data, error } = payload.id
    ? await sb.from('events').update(payload).eq('id', payload.id).select().single()
    : await sb.from('events').insert(payload).select().single()
  if (error) throw new Error(error.message)
  return data as unknown as EventRow
}

export async function deleteEvent(id: string) {
  const sb = getSupabaseClient()
  const { error } = await sb.from('events').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function fetchPendingPosts(): Promise<AdminPendingPost[]> {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('posts')
    .select('id, title, content, type, created, likes, author:profiles!posts_user_id_fkey(id, username, display_name, avatar_url)')
    .eq('is_validated', false)
    .order('created', { ascending: false })
    .limit(50)
  if (error) return []
  return (data ?? []) as unknown as AdminPendingPost[]
}

export async function setPostValidation(postId: string, validated: boolean) {
  const sb = getSupabaseClient()
  const { error } = await sb.rpc('validate_post', { p_post: postId, p_validated: validated })
  if (error) throw new Error(error.message)
}

export async function deletePostAdmin(id: string) {
  const sb = getSupabaseClient()
  const { error } = await sb.from('posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
