'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { getLevelForXP, getLevelTitle } from '@/lib/xp'

const MISSIONS = [
  { id: '1', icon: '⚡', title: 'Missão de boas-vindas', rarity: 'Bronze', xp: 150 },
  { id: '2', icon: '🎯', title: 'Primeiro agente vivo',  rarity: 'Prata',  xp: 300 },
  { id: '3', icon: '🏅', title: 'Missão validada',       rarity: 'Ouro',   xp: 500 },
]

const MOCK_STATS = { posts: 14, comments: 87, upvotes: 320, adventures: 5 }
const MOCK_RANKING = { position: 12, userXp: 3450, aboveUser: 'Aventureiro Acima', aboveXp: 3795 }

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted || !user) return null

  const xp    = (user as any).xp ?? 3450
  const level = getLevelForXP(xp)
  const path  = ((user as any).path ?? 'mago') as 'ladino' | 'mago' | 'mercador'
  const title = getLevelTitle(level.level, path)
  const xpToNext = level.xpNext - level.xpCurrent
  const progress = Math.min((level.xpCurrent / level.xpNext) * 100, 100)
  const firstName = ((user as any).name || (user as any).username || 'Viajante').split(' ')[0]

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── TOP HEADER ─────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Cidadão da Guild · {path.charAt(0).toUpperCase() + path.slice(1)}
            </p>
            <h1 className="text-5xl lg:text-6xl font-serif font-medium text-white leading-tight">
              Olá, {firstName}.
            </h1>
            <p className="text-gray-400 text-base mt-2">
              Sua jornada continua. O que vamos construir hoje?
            </p>
          </div>
          <Link
            href="/post/new"
            className="mt-2 px-5 py-2.5 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            + Novo Post
          </Link>
        </div>

        {/* ── XP + RANKING ───────────────────────────────────── */}
        <div className="grid lg:grid-cols-[3fr_2fr] gap-4">

          {/* XP Card */}
          <div className="bg-white rounded-2xl p-7">
            <div className="flex items-start gap-6">
              {/* Level Badge */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-xl flex items-center justify-center">
                  <span className="text-4xl font-serif font-medium text-black">{level.level}</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Nível</span>
              </div>

              {/* XP Details */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Evolução</p>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-medium text-black">{title}</h2>
                  <span className="text-sm font-bold text-gray-500">
                    {xp.toLocaleString('pt-BR')} / {(level.xpNext + getLevelForXP(xp).xpCurrent + level.xpCurrent).toLocaleString('pt-BR')} XP
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-black h-full rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Faltam {xpToNext.toLocaleString('pt-BR')} XP para o nível {level.level + 1}
                </p>
              </div>
            </div>
          </div>

          {/* Ranking Card */}
          <div className="bg-white rounded-2xl p-7">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Posição no Ranking
            </p>

            {/* My position */}
            <div className="bg-[#F5F5F5] rounded-xl px-4 py-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-serif font-medium text-black">#{MOCK_RANKING.position}</span>
                <div>
                  <p className="text-sm font-bold text-black">Você</p>
                  <p className="text-xs text-gray-400">{MOCK_RANKING.userXp.toLocaleString('pt-BR')} XP total</p>
                </div>
              </div>
            </div>

            {/* Next user */}
            <div className="px-4 py-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-serif font-medium text-gray-300">#{MOCK_RANKING.position - 1}</span>
                <div>
                  <p className="text-sm text-gray-400">{MOCK_RANKING.aboveUser}</p>
                  <p className="text-xs text-gray-300">
                    +{(MOCK_RANKING.aboveXp - MOCK_RANKING.userXp).toLocaleString('pt-BR')} XP
                  </p>
                </div>
              </div>
            </div>

            <Link href="/ranking" className="text-sm font-semibold text-black hover:text-gray-600 transition-colors">
              Ver ranking completo →
            </Link>
          </div>
        </div>

        {/* ── STATS ROW ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Posts',        value: MOCK_STATS.posts },
            { label: 'Comentários',  value: MOCK_STATS.comments },
            { label: 'Upvotes',      value: MOCK_STATS.upvotes },
            { label: 'Adventures',   value: MOCK_STATS.adventures },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 text-center">
              <p className="text-5xl font-serif font-medium text-black mb-1">{stat.value}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── ACTIVITY + MISSIONS ────────────────────────────── */}
        <div className="grid lg:grid-cols-[3fr_2fr] gap-4">

          {/* Activity */}
          <div className="bg-white rounded-2xl p-7 flex flex-col min-h-64">
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <p className="text-gray-400 font-medium mb-1">Nenhuma atividade recente</p>
              <p className="text-gray-300 text-sm mb-6">Seus posts e comentários aparecerão aqui.</p>
              <Link
                href="/post/new"
                className="px-6 py-2 border border-gray-300 text-black text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Começar agora
              </Link>
            </div>
          </div>

          {/* Missions */}
          <div className="bg-[#0A0A0A] rounded-2xl p-7">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-5">
              Próximas Missões
            </p>
            <div className="space-y-3">
              {MISSIONS.map(m => (
                <div
                  key={m.id}
                  className="bg-white rounded-xl px-4 py-3.5 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl flex-shrink-0">{m.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black">{m.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.rarity} · +{m.xp} XP</p>
                  </div>
                  <span className="text-gray-400 text-sm">→</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
