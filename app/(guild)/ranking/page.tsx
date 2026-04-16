'use client'

import { useState, useEffect, useCallback } from 'react'
import { PathBadge } from '@/components/ui/PathBadge'
import { XPBar } from '@/components/ui/XPBar'
import { RankingSkeleton } from '@/components/ui/Skeleton'
import { cn, getAvatarUrl } from '@/lib/utils'
import { getLevelForXP } from '@/lib/xp'
import { getClient } from '@/lib/pocketbase/client'
import type { Profile } from '@/lib/pocketbase/types'

type Tab = 'all' | 'month' | 'week'

const tabs: { value: Tab; label: string }[] = [
  { value: 'all', label: 'ALL TIME' },
  { value: 'month', label: 'MONTHLY' },
  { value: 'week', label: 'WEEKLY' },
]

export default function RankingPage() {
  const [tab, setTab] = useState<Tab>('all')
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  const loadRanking = useCallback(async () => {
    setLoading(true)
    try {
      const pb = getClient()
      const result = await pb.collection('users').getList(1, 50, {
        sort: '-xp',
        filter: 'xp > 0',
      })
      setUsers(result.items as unknown as Profile[])
    } catch (err) {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRanking()
  }, [loadRanking])

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-8 border-b-2 border-black">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-normal text-black uppercase tracking-tighter leading-none">
            Elite <br/> Leaderboard
          </h1>
          <p className="text-xl text-text-secondary italic font-medium">Os builders mais letais da Guilda.</p>
        </div>

        <div className="flex gap-4 border-2 border-black p-1 bg-bg-surface h-fit">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                'px-6 py-2 text-[11px] font-black uppercase tracking-widest transition-all',
                tab === t.value
                  ? 'bg-black text-white'
                  : 'text-text-muted hover:text-black hover:bg-black/5'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <RankingSkeleton />
      ) : users.length === 0 ? (
        <div className="card-donos p-20 text-center animate-fade-in">
          <div className="text-6xl mb-6">🏜️</div>
          <h3 className="text-3xl font-bold text-black uppercase text-pixel">Arena Empty</h3>
          <p className="text-text-secondary text-lg mt-4 italic">Seja o primeiro a deixar sua marca.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map((u, i) => {
            const levelInfo = getLevelForXP(u.xp || 0)
            const isTop3 = i < 3
            
            return (
              <div
                key={u.id}
                className={cn(
                  'card-donos p-6 group transition-all duration-200',
                  isTop3 && 'bg-bg-surface ring-2 ring-black ring-offset-2'
                )}
              >
                <div className="flex items-center gap-8">
                  {/* Rank */}
                  <div className="w-16 flex items-center justify-center shrink-0">
                    {isTop3 ? (
                      <span className="text-4xl">{medals[i]}</span>
                    ) : (
                      <span className="text-2xl font-black text-black italic opacity-20 group-hover:opacity-100 transition-opacity">
                        #{i + 1}
                      </span>
                    )}
                  </div>

                  {/* Profile */}
                  <div className="relative shrink-0">
                    <img
                      src={getAvatarUrl(u.avatar, u.id)}
                      alt={u.username}
                      className={cn(
                        "w-16 h-16 border-2 border-black grayscale transition-all duration-500 group-hover:grayscale-0",
                        isTop3 && "shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                      )}
                    />
                  </div>

                  {/* Identity */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 flex-wrap mb-2">
                      <span className="text-xl md:text-2xl font-black text-black uppercase tracking-tight truncate">
                        {u.name || u.username}
                      </span>
                      <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 uppercase tracking-widest text-pixel">
                        {u.path || 'Builder'}
                      </span>
                    </div>
                    <div className="max-w-[200px] border border-black/10 p-0.5">
                      <XPBar current={levelInfo.xpCurrent} max={levelInfo.xpNext} size="xs" showLabel={false} />
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <p className="text-3xl md:text-4xl font-black text-black leading-none text-pixel">
                      {u.xp?.toLocaleString() || 0}
                    </p>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">
                      Total XP Points
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
