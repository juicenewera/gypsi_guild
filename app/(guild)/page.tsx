'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { PostCard } from '@/components/post/PostCard'
import { PathBadge } from '@/components/ui/PathBadge'
import { XPBar } from '@/components/ui/XPBar'
import { FeedSkeleton } from '@/components/ui/Skeleton'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getLevelForXP } from '@/lib/xp'
import { getAvatarUrl } from '@/lib/utils'
import type { Post } from '@/lib/pocketbase/types'
import { Zap, BookOpen, Flame, ArrowRight, Trophy, Compass } from 'lucide-react'

export default function DashboardPage() {
  const { user, refreshUser } = useAuthStore()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const loadRecentPosts = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles!author(*), categories!category(*)')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setPosts(data as unknown as Post[])
    } catch (err) {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRecentPosts()
  }, [loadRecentPosts])

  if (!user) return null

  const level = getLevelForXP(user.xp || 0)
  const nextLevelXp = level.xpNext - level.xpCurrent

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
      {/* ========== HERO SECTION ========== */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b-2 border-black">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-normal text-black uppercase tracking-tighter leading-none">
              Welcome Back,<br />Builder
            </h1>
            <p className="text-xl text-text-secondary italic font-medium">
              Sua jornada na Guild continua. Cumpra missões, suba de nível e se torne uma lenda.
            </p>
          </div>

          {/* Quick Profile Card */}
          <div className="card-donos p-6 bg-bg-primary border-2 border-black min-w-[280px] flex-shrink-0">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={getAvatarUrl(user.avatar, user.id)}
                alt={user.username}
                className="w-12 h-12 rounded-full border-2 border-black object-cover"
              />
              <div className="min-w-0">
                <p className="font-bold text-black truncate">{user.name || user.username}</p>
                <p className="text-xs text-text-muted">@{user.username}</p>
              </div>
            </div>
            <PathBadge path={user.path || 'mago'} level={level.level} className="mb-3" />
            <XPBar current={level.xpCurrent} max={level.xpNext} size="md" showLabel={false} />
            <p className="text-xs text-text-muted mt-2 text-right">{nextLevelXp} XP para o próximo nível</p>
          </div>
        </div>
      </section>

      {/* ========== STATS GRID ========== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Zap, label: 'Adventures', value: user.adventures_count || 0, color: 'border-guerr-300' },
          { icon: BookOpen, label: 'Missões', value: user.missions_count || 0, color: 'border-mago-300' },
          { icon: Flame, label: 'Streak', value: `${user.streak_days || 0}d`, color: 'border-xp-400' },
        ].map((stat) => (
          <div key={stat.label} className={`card-donos p-6 border-2 ${stat.color} bg-bg-primary`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black/5 rounded flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-text-muted">{stat.label}</p>
                <p className="text-3xl font-bold text-black">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ========== FEATURED SECTION ========== */}
      <section className="grid md:grid-cols-2 gap-8">
        {/* Call to Action Cards */}
        <Link href="/post/new" className="card-donos p-8 bg-black text-white border-2 border-black hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)] transition-all group">
          <div className="flex items-start justify-between mb-4">
            <Compass className="w-6 h-6" />
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight mb-2">Compartilhar Adventure</h3>
          <p className="text-white/70 text-sm">Mostre seu case, experiência ou resultado. Ganhe XP e reconhecimento.</p>
        </Link>

        <Link href="/ranking" className="card-donos p-8 border-2 border-black bg-bg-primary hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)] transition-all group">
          <div className="flex items-start justify-between mb-4">
            <Trophy className="w-6 h-6 text-black" />
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-black">Ranking Mensal</h3>
          <p className="text-text-secondary text-sm">Veja os top builders do mês. Seja o próximo no pódio.</p>
        </Link>
      </section>

      {/* ========== RECENT FEED ========== */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b-2 border-black">
          <h2 className="text-3xl font-normal text-black uppercase tracking-tighter">Recent Feed</h2>
          <Link href="/feed" className="text-sm font-black text-black hover:underline decoration-2 underline-offset-4">
            Ver Tudo →
          </Link>
        </div>

        {loading && posts.length === 0 ? (
          <FeedSkeleton />
        ) : posts.length === 0 ? (
          <div className="card-donos p-12 text-center">
            <p className="text-text-secondary italic">Nenhum post ainda. Seja o primeiro a compartilhar!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
