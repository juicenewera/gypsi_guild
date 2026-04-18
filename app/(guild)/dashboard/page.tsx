'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { getLevelForXP, getLevelTitle } from '@/lib/xp'
import { cn, timeAgo } from '@/lib/utils'
import { fetchNotifications, type Notification } from '@/lib/supabase/queries'
import {
  Zap, Target, Award, Bell,
  ThumbsUp, MessageCircle, Megaphone,
  type LucideIcon,
} from 'lucide-react'

const MISSIONS: { id: string; Icon: LucideIcon; title: string; rarity: string; xp: number }[] = [
  { id: '1', Icon: Zap,    title: 'Missão de boas-vindas', rarity: 'Bronze', xp: 150 },
  { id: '2', Icon: Target, title: 'Primeiro agente vivo',  rarity: 'Prata',  xp: 300 },
  { id: '3', Icon: Award,  title: 'Missão validada',       rarity: 'Ouro',   xp: 500 },
]

const MOCK_STATS = { posts: 14, comments: 87, upvotes: 320, adventures: 5 }
const MOCK_RANKING = { position: 12, prevPosition: 15, userXp: 3450, weeklyXp: 280, aboveUser: 'Aventureiro Acima', aboveXp: 3795 }

const NOTIF_ICONS: Record<string, LucideIcon> = {
  upvote:  ThumbsUp,
  comment: MessageCircle,
  badge:   Award,
  xp:      Zap,
  mention: Megaphone,
}

type TabId = 'notificacoes' | 'visao-geral'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState<TabId>('notificacoes')
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!user) return
    fetchNotifications(user.id, 10).then(setNotifications)
  }, [user])

  if (!mounted || !user) return null

  const xp    = (user as any).xp ?? 3450
  const level = getLevelForXP(xp)
  const path  = ((user as any).path ?? 'mago') as 'ladino' | 'mago' | 'mercador'
  const title = getLevelTitle(level.level, path)
  const xpToNext = level.xpNext - level.xpCurrent
  const progress = Math.min((level.xpCurrent / level.xpNext) * 100, 100)
  const firstName = ((user as any).name || (user as any).username || 'Viajante').split(' ')[0]

  // Métricas semanais (deriva do store; fallback nos mocks caso backend não responda)
  const weeklyXp   = MOCK_RANKING.weeklyXp
  const weeklyPct  = xp > 0 ? Math.round((weeklyXp / Math.max(xp - weeklyXp, 1)) * 100) : 0
  const rankDelta  = MOCK_RANKING.prevPosition - MOCK_RANKING.position
  const unreadCount = notifications.filter(n => !n.is_read).length

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

        {/* ── TABS ───────────────────────────────────────────── */}
        <div className="flex gap-2 border-b border-gray-100">
          {[
            { id: 'notificacoes' as TabId, label: 'Notificações', badge: unreadCount },
            { id: 'visao-geral'  as TabId, label: 'Visão Geral',  badge: 0 },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'relative px-4 py-2.5 text-sm font-semibold transition-colors -mb-px border-b-2',
                tab === t.id ? 'text-black border-black' : 'text-gray-400 border-transparent hover:text-gray-600'
              )}
            >
              {t.label}
              {t.badge > 0 && (
                <span className="ml-2 inline-flex items-center justify-center text-[10px] font-bold bg-black text-white rounded-full w-4 h-4">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === 'notificacoes' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Últimas Notificações
              </p>
              <Link href="/notificacoes" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">
                Ver todas →
              </Link>
            </div>
            {notifications.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-gray-400 text-sm">Sem notificações novas. Quando alguém interagir com seus posts, aparece aqui.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.slice(0, 5).map(n => {
                  const NIcon = NOTIF_ICONS[n.type] ?? Bell
                  return (
                  <div key={n.id} className={cn(
                    'flex items-start gap-3 px-6 py-4 hover:bg-gray-50/50 transition-colors',
                    !n.is_read && 'bg-blue-50/30'
                  )}>
                    <span className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <NIcon className="w-3.5 h-3.5 text-gray-600" strokeWidth={2} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm', n.is_read ? 'text-gray-500' : 'text-black font-semibold')}>
                        {n.title}
                      </p>
                      {n.body && <p className="text-xs text-gray-400 mt-0.5 truncate">{n.body}</p>}
                    </div>
                    <span className="text-[10px] text-gray-300 flex-shrink-0">{timeAgo(n.created)}</span>
                  </div>
                )})}
              </div>
            )}
          </div>
        )}

        {/* ── MÉTRICAS SEMANAIS ──────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">XP · 7 dias</p>
            <p className="text-3xl font-serif font-medium text-black">+{weeklyXp}</p>
            <p className="text-xs text-emerald-600 mt-1 font-semibold">↑ {weeklyPct}% vs semana anterior</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Ranking · Δ semanal</p>
            <p className="text-3xl font-serif font-medium text-black">
              {rankDelta > 0 ? `+${rankDelta}` : rankDelta}
            </p>
            <p className={cn('text-xs mt-1 font-semibold', rankDelta >= 0 ? 'text-emerald-600' : 'text-red-500')}>
              {rankDelta >= 0 ? '↑ subiu' : '↓ caiu'} {Math.abs(rankDelta)} {Math.abs(rankDelta) === 1 ? 'posição' : 'posições'}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm col-span-2 lg:col-span-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Streak</p>
            <p className="text-3xl font-serif font-medium text-black">{(user as any).streak_days ?? 0} dias</p>
            <p className="text-xs text-gray-400 mt-1 font-semibold">+5 XP por dia de login</p>
          </div>
        </div>

        {/* ── XP + RANKING ───────────────────────────────────── */}
        <div className="grid lg:grid-cols-[3fr_2fr] gap-6">

          {/* XP Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center flex-shrink-0 relative">
                <div className="w-16 h-20 bg-[#F3F4F6] rounded-xl flex items-center justify-center border border-gray-200">
                  <span className="text-4xl font-serif font-medium text-black">{level.level}</span>
                </div>
                <div className="absolute -bottom-2 bg-black text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">
                  Nível
                </div>
              </div>

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

            <div className="bg-[#F9FAFB] rounded-xl px-4 py-3 mb-3 border border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-serif font-medium text-black">#{MOCK_RANKING.position}</span>
                <div>
                  <p className="text-sm font-bold text-black">Você</p>
                  <p className="text-xs text-gray-500">{MOCK_RANKING.userXp.toLocaleString('pt-BR')} XP total</p>
                </div>
                {rankDelta !== 0 && (
                  <span className={cn(
                    'ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full',
                    rankDelta > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                  )}>
                    {rankDelta > 0 ? `↑ ${rankDelta}` : `↓ ${Math.abs(rankDelta)}`}
                  </span>
                )}
              </div>
            </div>

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

          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5">
              Próximas Missões
            </p>
            <div className="space-y-3">
              {MISSIONS.map(m => (
                <Link
                  key={m.id}
                  href="/missoes"
                  className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 border border-gray-100 transition-colors shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <m.Icon className="w-4 h-4 text-orange-600" strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black truncate">{m.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">{m.rarity} · +{m.xp} XP</p>
                  </div>
                  <span className="text-gray-300 text-sm">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
