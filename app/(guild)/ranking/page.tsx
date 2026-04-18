'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { Shield, Sparkles, Swords, Gem, Lock, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchLeaderboard, type MemberCard } from '@/lib/supabase/queries'

type CategoryId = 'geral' | 'mago' | 'ladino' | 'mercador'

const CATEGORIES: { id: CategoryId; label: string; Icon: LucideIcon }[] = [
  { id: 'geral',    label: 'Guilda',     Icon: Shield },
  { id: 'mago',     label: 'Magos',      Icon: Sparkles },
  { id: 'ladino',   label: 'Ladinos',    Icon: Swords },
  { id: 'mercador', label: 'Mercadores', Icon: Gem },
]

const LEVELS = [
  { level: 1, title: 'Recruta' },
  { level: 2, title: 'Aprendiz' },
  { level: 3, title: 'Iniciado' },
  { level: 4, title: 'Aventureiro' },
  { level: 5, title: 'Veterano' },
  { level: 6, title: 'Especialista' },
  { level: 7, title: 'Mestre' },
  { level: 8, title: 'Arquimago' },
  { level: 9, title: 'Lendário', unlocks: 'mentorias privadas' },
]

export default function RankingPage() {
  const { user } = useAuthStore()
  const [category, setCategory] = useState<CategoryId>('geral')
  const [members, setMembers] = useState<MemberCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const path = category === 'geral' ? undefined : category
    fetchLeaderboard(path).then(ms => {
      setMembers(ms)
      setLoading(false)
    })
  }, [category])

  const levelDistribution = useMemo(() => {
    const counts: Record<number, number> = {}
    members.forEach(m => {
      const lvl = Math.min(Math.max(m.level, 1), 9)
      counts[lvl] = (counts[lvl] || 0) + 1
    })
    const total = members.length || 1
    return LEVELS.map(l => ({
      ...l,
      percentage: `${Math.round((counts[l.level] || 0) * 100 / total)}%`,
    }))
  }, [members])

  const userName  = (user as any)?.display_name || (user as any)?.username || 'Convidado'
  const userLevel = (user as any)?.level ?? 1
  const userXp    = (user as any)?.xp ?? 0
  const userInitials = userName.slice(0, 2).toUpperCase()

  // Simplificação: os 3 boards mostram o mesmo ranking all-time (7d/30d precisariam de agregação em xp_log)
  const board = members

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10 text-black">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── TOP HEAD ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center lg:items-start gap-12">

          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full border-[6px] border-blue-50 bg-gray-100 flex items-center justify-center font-serif text-3xl font-bold">
                {userInitials}
              </div>
              <div className="absolute bottom-0 right-2 w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center border-2 border-white shadow-sm">
                {userLevel}
              </div>
            </div>
            <h2 className="text-2xl font-serif font-bold text-black">{userName}</h2>
            <p className="font-bold text-blue-500 text-sm mt-1">Level {userLevel}</p>
            <p className="text-xs text-gray-500 mt-2"><span className="font-bold text-black">{userXp}</span> XP acumulado</p>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full lg:pl-12 lg:border-l border-gray-100">
            {levelDistribution.map(l => (
              <div key={l.level} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  l.level <= userLevel
                    ? 'bg-[#F2DB76] text-black'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}>
                  {l.level <= userLevel ? l.level : <Lock className="w-3.5 h-3.5" strokeWidth={2} />}
                </div>
                <div>
                  <p className="font-bold text-sm text-black">Level {l.level} · {l.title}</p>
                  <p className="text-[10px] text-gray-500">
                    {l.unlocks ? `Desbloqueia ${l.unlocks} · ` : ''}
                    {l.percentage} da guilda
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CATEGORY FILTER ──────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm border inline-flex items-center gap-1.5',
                category === c.id
                  ? 'bg-black border-black text-white'
                  : 'bg-white border-gray-200 text-gray-500 hover:text-black'
              )}
            >
              <c.Icon className="w-3.5 h-3.5" strokeWidth={2} />
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* ── LEADERBOARDS ─────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-96 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : board.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-500 text-sm">Nenhum membro nessa categoria ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Top XP', showDelta: false },
              { title: 'Mais ativos', showDelta: true },
              { title: 'All-time', showDelta: false },
            ].map((col) => (
              <div key={col.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-serif font-bold text-black mb-6">{col.title}</h3>

                <div className="space-y-4">
                  {board.slice(0, 10).map((m, i) => {
                    const name = m.display_name || m.username
                    return (
                      <div key={m.id} className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-6 flex justify-center">
                          {i < 3 ? (
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm
                              ${i === 0 ? 'bg-[#F2DB76]' : i === 1 ? 'bg-[#9CA3AF]' : 'bg-[#CD7F32]'}`}
                            >
                              {i + 1}
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-gray-400">{i + 1}</span>
                          )}
                        </div>

                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                          {m.avatar_url
                            ? <img src={m.avatar_url} alt={name} className="w-full h-full object-cover" />
                            : name.slice(0, 2).toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <p className="font-bold text-sm text-black truncate group-hover:underline">
                            {name}
                          </p>
                          {m.is_pro && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-black text-white">
                              Pro
                            </span>
                          )}
                        </div>

                        <span className="text-sm font-bold text-blue-500">
                          {col.showDelta ? `+${m.xp}` : m.xp}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
