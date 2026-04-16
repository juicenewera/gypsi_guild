'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getLevelForXP } from '@/lib/xp'
import { ArrowRight } from 'lucide-react'

interface Stats {
  postsCount: number
  commentsCount: number
  upvotesSum: number
  rankingPosition: number | null
  nextUserName: string | null
  nextUserXp: number | null
}

const MISSIONS_PLACEHOLDER = [
  { id: '1', icon: '⚡', title: 'Missão de boas-vindas', rarity: 'Bronze', xp: 150 },
  { id: '2', icon: '🎯', title: 'Primeiro agente vivo', rarity: 'Prata', xp: 300 },
  { id: '3', icon: '🏅', title: 'Missão validada', rarity: 'Ouro', xp: 500 },
]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      if (!user) return
      try {
        const supabase = getSupabaseClient()

        // Posts count
        const { count: postsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('author_id', user.id)

        // Comments count
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('author_id', user.id)

        // Upvotes sum
        const { data: postsData } = await supabase
          .from('posts')
          .select('upvotes')
          .eq('author_id', user.id)
        const upvotesSum = postsData?.reduce((sum: number, post: { upvotes?: number }) => sum + (post.upvotes || 0), 0) || 0

        // Ranking
        const { data: rankingData } = await supabase
          .from('profiles')
          .select('id,xp,username')
          .order('xp', { ascending: false })

        let rankingPosition: number | null = null
        let nextUserName: string | null = null
        let nextUserXp: number | null = null

        if (rankingData) {
          const userIndex = rankingData.findIndex((u: { id: string; xp: number; username: string }) => u.id === user.id)
          if (userIndex !== -1) {
            rankingPosition = userIndex + 1
            if (userIndex > 0) {
              nextUserName = rankingData[userIndex - 1].username
              nextUserXp = rankingData[userIndex - 1].xp
            }
          }
        }

        setStats({
          postsCount: postsCount || 0,
          commentsCount: commentsCount || 0,
          upvotesSum,
          rankingPosition,
          nextUserName,
          nextUserXp,
        })
      } catch (err) {
        console.error('Error loading stats:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [user])

  if (!user) return null

  const level = getLevelForXP(user.xp || 0)
  const nextLevelXp = level.xpNext - level.xpCurrent
  const pathName = user.path?.toUpperCase() || 'BUILDER'

  return (
    <div className="min-h-screen bg-bg-primary p-6 lg:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-text-muted uppercase tracking-wider">
            CIDADÃO DA GUILD · {pathName}
          </div>
          <Link href="/post/new" className="px-4 py-2 bg-white text-black rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
            + Novo Post
          </Link>
        </div>

        {/* Greeting */}
        <div className="space-y-2">
          <h1 className="text-5xl lg:text-6xl font-bold text-text-primary">
            Olá, {user.name || user.username}.
          </h1>
          <p className="text-text-secondary text-lg">
            Sua jornada continua. O que vamos construir hoje?
          </p>
        </div>

        {/* Stats Grid (4 columns) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'POSTS', value: stats?.postsCount || 0 },
            { label: 'COMENTÁRIOS', value: stats?.commentsCount || 0 },
            { label: 'UPVOTES', value: stats?.upvotesSum || 0 },
            { label: 'ADVENTURES', value: user.adventures_count || 0 },
          ].map((stat) => (
            <div key={stat.label} className="card-donos p-6 text-center">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">{stat.label}</p>
              <p className="text-4xl font-bold text-text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* XP + Ranking Grid (2 columns) */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* XP Evolution Card */}
          <div className="card-donos p-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-bold text-text-primary">{level.level}</span>
                  <span className="text-text-secondary text-lg">NÍVEL</span>
                </div>
                <p className="text-2xl font-bold text-text-primary mb-4">{level.title}</p>
              </div>

              <div className="space-y-2">
                <div className="w-full bg-bg-elevated rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full transition-all duration-500"
                    style={{ width: `${Math.min((level.xpCurrent / level.xpNext) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted text-sm">{level.xpCurrent} / {level.xpNext} XP</span>
                  <span className="text-text-secondary font-bold">
                    Faltam {nextLevelXp} XP para o nível {level.level + 1}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ranking Card */}
          <div className="card-donos p-8">
            <div className="space-y-6">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Posição no Ranking</p>

              {stats?.rankingPosition ? (
                <>
                  <div className="py-4 border-b border-border-default">
                    <p className="text-3xl font-bold text-text-primary mb-2">
                      #{stats.rankingPosition}
                    </p>
                    <p className="text-text-secondary text-base">
                      Você — {user.xp} XP total
                    </p>
                  </div>

                  {stats.nextUserName && (
                    <div className="py-4">
                      <p className="text-text-secondary text-sm mb-2">
                        #{(stats.rankingPosition - 1)} {stats.nextUserName}
                      </p>
                      <p className="text-text-muted text-xs">
                        +{(stats.nextUserXp || 0) - user.xp} XP
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-text-muted">Carregando posição...</p>
              )}

              <Link href="/ranking" className="inline-flex items-center gap-2 text-text-primary hover:text-white transition-colors text-sm font-medium pt-4 border-t border-border-default">
                Ver ranking completo →
              </Link>
            </div>
          </div>
        </div>

        {/* Activity + Missions Grid (2 columns) */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Activity Section */}
          <div className="card-donos p-8">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6">Atividade Recente</h3>
            <div className="text-center py-12">
              <p className="text-text-secondary mb-4">Nenhuma atividade recente</p>
              <p className="text-text-muted text-sm mb-6">Seus posts e comentários aparecerão aqui.</p>
              <Link href="/post/new" className="inline-block px-6 py-2 bg-text-primary text-black rounded-lg font-bold text-sm hover:bg-text-secondary transition-colors">
                Começar agora
              </Link>
            </div>
          </div>

          {/* Missions Section */}
          <div className="card-donos p-8">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6">Próximas Missões</h3>
            <div className="space-y-3">
              {MISSIONS_PLACEHOLDER.map((mission) => (
                <div key={mission.id} className="p-4 bg-bg-elevated rounded-lg flex items-start gap-4 hover:bg-bg-elevated/80 transition-colors cursor-pointer">
                  <span className="text-2xl flex-shrink-0">{mission.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary text-sm">{mission.title}</p>
                    <p className="text-text-muted text-xs mt-1">{mission.rarity} · +{mission.xp} XP</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted flex-shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
