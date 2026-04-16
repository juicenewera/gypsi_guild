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
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10 animate-fade-in text-black">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── TOP HEADER ─────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Cidadão da Guild · {path.charAt(0).toUpperCase() + path.slice(1)}
            </p>
            <h1 className="text-5xl lg:text-6xl font-serif font-medium text-black leading-tight">
              Olá, {firstName}.
            </h1>
            <p className="text-gray-500 text-base mt-2">
              Sua jornada continua. O que vamos construir hoje?
            </p>
          </div>
          <Link
            href="/post/new"
            className="mt-2 px-6 py-2.5 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-colors whitespace-nowrap shadow-sm"
          >
            + Novo Post
          </Link>
        </div>

        {/* ── XP + RANKING ───────────────────────────────────── */}
        <div className="grid lg:grid-cols-[3fr_2fr] gap-6">

          {/* XP Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-8">
              {/* Level Badge */}
              <div className="flex flex-col items-center flex-shrink-0 relative">
                <div className="w-16 h-20 bg-[#F3F4F6] rounded-xl flex items-center justify-center border border-gray-200">
                  <span className="text-4xl font-serif font-medium text-black">{level.level}</span>
                </div>
                <div className="absolute -bottom-2 bg-black text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">
                  Nível
                </div>
              </div>

              {/* XP Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Evolução</p>
                    <h2 className="text-2xl font-serif font-medium text-black">{title}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">XP</p>
                    <span className="text-sm font-bold text-black border-b-2 border-black pb-0.5">
                      {xp.toLocaleString('pt-BR')} / {(level.xpNext + level.xpCurrent).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 w-full bg-gray-100 rounded-full h-1 overflow-hidden relative">
                  <div
                    className="bg-black h-full rounded-full transition-all duration-700 absolute left-0 top-0"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3 font-medium">
                  Faltam {xpToNext.toLocaleString('pt-BR')} XP para o nível {level.level + 1}
                </p>
              </div>
            </div>
          </div>

          {/* Ranking Card */}
          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Posição no Ranking
            </p>

            {/* My position */}
            <div className="bg-[#F9FAFB] rounded-xl px-4 py-3 mb-3 border border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-serif font-medium text-black">#{MOCK_RANKING.position}</span>
                <div>
                  <p className="text-sm font-bold text-black">Você</p>
                  <p className="text-xs text-gray-500">{MOCK_RANKING.userXp.toLocaleString('pt-BR')} XP total</p>
                </div>
              </div>
            </div>

            {/* Next user */}
            <div className="px-4 py-2 mb-4">
              <div className="flex items-center gap-4">
                <span className="text-xl font-serif font-medium text-gray-300">#{MOCK_RANKING.position - 1}</span>
                <div>
                  <p className="text-sm font-medium text-gray-400">{MOCK_RANKING.aboveUser}</p>
                  <p className="text-xs text-gray-400">
                    +{(MOCK_RANKING.aboveXp - MOCK_RANKING.userXp).toLocaleString('pt-BR')} XP
                  </p>
                </div>
              </div>
            </div>

            <Link href="/ranking" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors uppercase tracking-widest">
              Ver ranking completo →
            </Link>
          </div>
        </div>

        {/* ── STATS ROW ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Posts',        value: MOCK_STATS.posts },
            { label: 'Comentários',  value: MOCK_STATS.comments },
            { label: 'Upvotes',      value: MOCK_STATS.upvotes },
            { label: 'Adventures',   value: MOCK_STATS.adventures },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-2">
              <p className="text-5xl font-serif font-medium text-black">{stat.value}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── ACTIVITY + MISSIONS ────────────────────────────── */}
        <div className="grid lg:grid-cols-[3fr_2fr] gap-6">

          {/* Activity */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center min-h-[250px]">
             <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">Nenhuma atividade recente</p>
              <p className="text-gray-400 text-xs mb-6">Seus posts e comentários aparecerão aqui.</p>
              <Link
                href="/post/new"
                className="inline-block px-6 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors"
              >
                Começar agora
              </Link>
            </div>
          </div>

          {/* Missions */}
          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5">
              Próximas Missões
            </p>
            <div className="space-y-3">
              {MISSIONS.map(m => (
                <div
                  key={m.id}
                  className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 border border-gray-100 transition-colors shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{m.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black truncate">{m.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">{m.rarity} · +{m.xp} XP</p>
                  </div>
                  <span className="text-gray-300 text-sm">→</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
