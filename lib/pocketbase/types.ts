export interface Profile {
  id: string
  username: string
  email: string
  name: string
  avatar: string
  bio: string
  path: 'ladino' | 'mago' | 'mercador'
  revenue_range: string
  pain_points: string[]
  hardskills: string[]
  softskills: string[]
  onboarding_completed_at: string | null
  level: number
  xp: number
  xp_to_next: number
  attr_ai: number
  attr_automacao: number
  attr_vendas: number
  attr_database: number
  attr_conteudo: number
  attr_marketing: number
  adventures_count: number
  missions_count: number
  streak_days: number
  last_seen_at: string
  is_founder: boolean
  is_admin: boolean
  created: string
  updated: string
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  path: 'ladino' | 'mago' | 'mercador' | null
  color: string
  sort_order: number
  post_count: number
  is_locked: boolean
  created: string
  updated: string
}

export interface Post {
  id: string
  author: string
  category: string
  title: string
  body: string
  type: 'adventure' | 'discussion' | 'question' | 'showcase'
  revenue_amount: number | null
  revenue_currency: string
  client_niche: string
  system_used: string[]
  days_to_close: number | null
  upvotes: number
  views: number
  comments_count: number
  xp_awarded: number
  tags: string[]
  is_pinned: boolean
  is_featured: boolean
  is_validated: boolean
  created: string
  updated: string
  expand?: {
    author?: Profile
    category?: Category
  }
}

export interface Comment {
  id: string
  post: string
  author: string
  parent: string | null
  body: string
  upvotes: number
  created: string
  updated: string
  expand?: {
    author?: Profile
  }
}

export interface PostUpvote {
  id: string
  user: string
  post: string
  created: string
}

export interface CommentUpvote {
  id: string
  user: string
  comment: string
  created: string
}

export interface Mission {
  id: string
  slug: string
  title: string
  description: string
  path: 'ladino' | 'mago' | 'mercador' | 'ambos'
  module: string
  order_index: number
  duration_min: number
  video_url: string
  content: string
  xp_reward: number
  attr_rewards: Record<string, number>
  is_locked: boolean
  unlock_requires: string[]
  product_required: string
  created: string
  updated: string
}

export interface MissionProgress {
  id: string
  user: string
  mission: string
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  started_at: string | null
  completed_at: string | null
  xp_earned: number
  created: string
  updated: string
}

export interface Badge {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  rarity: 'comum' | 'raro' | 'epico' | 'lendario'
  color: string
  created: string
  updated: string
}

export interface UserBadge {
  id: string
  user: string
  badge: string
  earned_at: string
  created: string
  updated: string
  expand?: {
    badge?: Badge
  }
}

export interface XpLog {
  id: string
  user: string
  amount: number
  reason: string
  reference_id: string
  created: string
}

export interface Notification {
  id: string
  user: string
  type: 'upvote' | 'comment' | 'badge' | 'xp' | 'mention'
  title: string
  body: string
  reference_id: string
  is_read: boolean
  created: string
  updated: string
}
