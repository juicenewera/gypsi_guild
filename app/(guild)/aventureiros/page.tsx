'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Sparkles, Swords, Gem, Shield, MapPin, MessageCircle, Camera,
  ArrowUpRight, type LucideIcon,
} from 'lucide-react'
import { cn, truncate } from '@/lib/utils'
import { fetchMatilha, type MemberCard } from '@/lib/supabase/queries'

const PATH_ICON: Record<'mago' | 'ladino' | 'mercador', LucideIcon> = {
  mago:     Sparkles,
  ladino:   Swords,
  mercador: Gem,
}
const PATH_COLOR = {
  mago:     'bg-blue-50 text-blue-700 border-blue-100',
  ladino:   'bg-red-50 text-red-700 border-red-100',
  mercador: 'bg-emerald-50 text-emerald-700 border-emerald-100',
} as const

export default function AventureirosPage() {
  const [filter, setFilter]   = useState<'todos' | 'mago' | 'ladino' | 'mercador'>('todos')
  const [search, setSearch]   = useState('')
  const [members, setMembers] = useState<MemberCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatilha().then(ms => {
      setMembers(ms)
      setLoading(false)
    })
  }, [])

  const filtered = members.filter(m =>
    (filter === 'todos' || m.path === filter) &&
    (search === '' ||
      m.username.toLowerCase().includes(search.toLowerCase()) ||
      (m.display_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.location || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.bio || '').toLowerCase().includes(search.toLowerCase()))
  )

  const rankMap = new Map(members.map((m, idx) => [m.id, idx + 1]))

  const byCity = filtered.reduce<Record<string, number>>((acc, m) => {
    const key = m.location && m.location.trim() ? m.location : 'Não informado'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10 text-black">
      <div className="max-w-6xl mx-auto space-y-6">

        <div>
          <h1 className="text-4xl lg:text-5xl font-serif font-medium text-black">Aventureiros</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Conheça quem está construindo junto. Toque em um card para ver o perfil completo.
          </p>
        </div>

        {/* Distribuição geográfica */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            Distribuição da Guilda · {filtered.length} aventureiros
          </p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(byCity).sort((a, b) => b[1] - a[1]).map(([city, count]) => (
              <div key={city} className="bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
                <span className="text-sm font-semibold text-black">{city}</span>
                <span className="text-xs text-gray-400">· {count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {(['todos', 'mago', 'ladino', 'mercador'] as const).map(f => {
              const Icon = f === 'todos' ? Shield : PATH_ICON[f]
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm border capitalize',
                    filter === f
                      ? 'bg-black border-black text-white'
                      : 'bg-white border-gray-200 text-gray-500 hover:text-black'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                  {f === 'todos' ? 'Todos' : `${f}s`}
                </button>
              )
            })}
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome, cidade ou descrição..."
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-500 text-sm">Nenhum aventureiro encontrado.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(m => {
              const name     = m.display_name || m.username
              const rank     = rankMap.get(m.id) || '—'
              const wa       = (m.whatsapp  || '').replace(/\D/g, '')
              const insta    = (m.instagram || '').replace(/^@/, '')
              const PathIcon = PATH_ICON[m.path]
              const headline = m.bio?.trim() || 'Aventureiro da Guilda'

              return (
                <Link
                  key={m.id}
                  href={`/perfil?u=${m.username}`}
                  className="group relative block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all"
                >
                  <ArrowUpRight
                    className="absolute top-4 right-4 w-4 h-4 text-gray-300 group-hover:text-black transition-colors"
                    strokeWidth={2}
                  />

                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs overflow-hidden">
                        {m.avatar_url
                          ? <img src={m.avatar_url} alt={name} className="w-full h-full object-cover" />
                          : name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                        <PathIcon className="w-3 h-3 text-gray-700" strokeWidth={2.2} />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pr-5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-sm font-bold text-black truncate">{name}</p>
                        {m.is_pro && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-black text-white">
                            Pro
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">@{m.username}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 min-h-[32px] mb-3">
                    {truncate(headline, 110)}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize', PATH_COLOR[m.path])}>
                      {m.path}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                      Nv. {m.level}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                      #{rank}
                    </span>
                  </div>

                  {m.location && (
                    <div className="flex items-center text-xs text-gray-400 mb-3">
                      <MapPin className="w-3 h-3 mr-1" strokeWidth={2} />
                      {m.location}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-50">
                    {wa && (
                      <a
                        href={`https://wa.me/${wa}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        <MessageCircle className="w-3.5 h-3.5" strokeWidth={2.2} />
                        WhatsApp
                      </a>
                    )}
                    {insta && (
                      <a
                        href={`https://instagram.com/${insta}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 hover:text-pink-700"
                      >
                        <Camera className="w-3.5 h-3.5" strokeWidth={2.2} />
                        @{insta}
                      </a>
                    )}
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-black ml-auto transition-colors">
                      Ver currículo →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
