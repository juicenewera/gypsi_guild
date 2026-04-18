'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import { Zap, Users, Lock } from 'lucide-react'
import {
  fetchMissions,
  fetchMyMissionApplications,
  applyToMission,
  type Mission,
} from '@/lib/supabase/queries'

const RARITY_COLORS: Record<Mission['rarity'], string> = {
  Bronze:   'bg-amber-50  text-amber-700  border-amber-100',
  Prata:    'bg-gray-50   text-gray-700   border-gray-100',
  Ouro:     'bg-yellow-50 text-yellow-700 border-yellow-100',
  Lendário: 'bg-purple-50 text-purple-700 border-purple-100',
}

const RARITY_LABEL: Record<Mission['rarity'], string> = {
  Bronze:   'Entrada',
  Prata:    'Intermediário',
  Ouro:     'Avançado',
  Lendário: 'Elite',
}

type FilterId = 'todas' | 'abertas' | 'pro'

export default function MissoesPage() {
  const { user } = useAuthStore()
  const isPro = !!(user as any)?.is_pro
  const [missions, setMissions]     = useState<Mission[]>([])
  const [applied, setApplied]       = useState<Record<string, number>>({})
  const [loading, setLoading]       = useState(true)
  const [pendingId, setPendingId]   = useState<string | null>(null)
  const [error, setError]           = useState<string | null>(null)
  const [filter, setFilter]         = useState<FilterId>('todas')

  useEffect(() => {
    async function load() {
      const [ms, apps] = await Promise.all([
        fetchMissions(),
        user ? fetchMyMissionApplications(user.id) : Promise.resolve([]),
      ])
      setMissions(ms)
      setApplied(Object.fromEntries(apps.map(a => [a.mission_id, a.position])))
      setLoading(false)
    }
    load()
  }, [user])

  async function apply(m: Mission) {
    if (m.is_pro_only && !isPro) return
    setError(null)
    setPendingId(m.id)
    try {
      const pos = await applyToMission(m.id)
      setApplied(prev => ({ ...prev, [m.id]: pos }))
      setMissions(prev => prev.map(x => x.id === m.id ? { ...x, queue_size: pos } : x))
    } catch (err: any) {
      setError(err?.message || 'Erro ao candidatar-se')
    } finally {
      setPendingId(null)
    }
  }

  const visible = missions.filter(m => {
    if (filter === 'abertas') return !applied[m.id]
    if (filter === 'pro')     return m.is_pro_only
    return true
  })

  const stats = {
    total: missions.length,
    pro:   missions.filter(m => m.is_pro_only).length,
    minhas: Object.keys(applied).length,
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10 text-black">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── HEADER ────────────────────────────────────────── */}
        <div>
          <h1 className="text-4xl lg:text-5xl font-serif font-medium text-black">Missões</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Vagas de trabalho da guilda. Oportunidades pagas, desafios que viram contrato.
          </p>
        </div>

        {/* ── STATS COMPACTAS ───────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Abertas</p>
            <p className="text-2xl font-serif font-bold text-black mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Exclusivas Pro</p>
            <p className="text-2xl font-serif font-bold text-black mt-1">{stats.pro}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Na fila</p>
            <p className="text-2xl font-serif font-bold text-black mt-1">{stats.minhas}</p>
          </div>
        </div>

        {/* ── FILTROS ───────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2">
          {([
            { id: 'todas',   label: 'Todas',              Icon: null },
            { id: 'abertas', label: 'Ainda não apliquei', Icon: null },
            { id: 'pro',     label: 'Só Pro',             Icon: Zap  },
          ] as { id: FilterId; label: string; Icon: typeof Zap | null }[]).map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm border',
                filter === f.id
                  ? 'bg-black border-black text-white'
                  : 'bg-white border-gray-200 text-gray-500 hover:text-black'
              )}
            >
              {f.Icon && <f.Icon className="w-3.5 h-3.5" strokeWidth={2} />}
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* ── FEED DE VAGAS ─────────────────────────────────── */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-500 text-sm">Nenhuma vaga nesse filtro.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden">
            {visible.map(m => {
              const locked   = m.is_pro_only && !isPro
              const position = applied[m.id]

              return (
                <article key={m.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex gap-4">
                    {/* Avatar-like icon (quem oferece) */}
                    <div className="flex-shrink-0">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center text-xl">
                        {m.icon}
                      </div>
                    </div>

                    {/* Corpo da vaga */}
                    <div className="flex-1 min-w-0">
                      {/* Header linha 1: "autor" + badges + timestamp */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                        <span className="text-sm font-bold text-black">Guild · Vaga aberta</span>
                        <span className={cn(
                          'text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                          RARITY_COLORS[m.rarity]
                        )}>
                          {RARITY_LABEL[m.rarity]}
                        </span>
                        {m.is_pro_only && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-white">
                            Pro
                          </span>
                        )}
                      </div>

                      {/* Título da missão */}
                      <h3 className="text-lg font-serif font-bold text-black leading-snug mb-1">
                        {m.title}
                      </h3>

                      {/* Descrição */}
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {m.description}
                      </p>

                      {/* Footer estruturado: reward + fila + CTA */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
                          <Zap className="w-3.5 h-3.5" strokeWidth={2.2} />
                          +{m.xp_reward} XP
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                          <Users className="w-3.5 h-3.5" strokeWidth={2} />
                          {m.queue_size} na fila
                        </span>

                        <div className="ml-auto flex items-center gap-3">
                          {position ? (
                            <div className="text-right">
                              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 leading-none">Você</p>
                              <p className="text-base font-serif font-bold text-black leading-tight">#{position}</p>
                            </div>
                          ) : locked ? (
                            <button
                              disabled
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-full cursor-not-allowed"
                            >
                              <Lock className="w-3.5 h-3.5" strokeWidth={2} />
                              Só Pro
                            </button>
                          ) : (
                            <button
                              onClick={() => apply(m)}
                              disabled={pendingId === m.id || !user}
                              className="px-4 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-colors disabled:opacity-40"
                            >
                              {pendingId === m.id ? 'Enviando...' : 'Candidatar-se'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* ── CTA POSTAR VAGA (futuro) ──────────────────────── */}
        <div className="bg-black text-white rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
          <div>
            <p className="text-sm font-bold">Tem uma vaga ou projeto pra oferecer?</p>
            <p className="text-xs text-white/60">Membros Pro podem postar missões direto pra guilda.</p>
          </div>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-gray-100 transition-colors self-start md:self-auto disabled:opacity-40" disabled={!isPro}>
            {isPro ? 'Postar vaga' : (<><Lock className="w-3.5 h-3.5" strokeWidth={2} />Só Pro</>)}
          </button>
        </div>

      </div>
    </div>
  )
}
