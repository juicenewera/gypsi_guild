'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Lock, Search, CheckCircle2, Clock, PlayCircle, BookOpenCheck, Radio,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import {
  fetchCourseBySlug,
  fetchCourseLessons,
  markLessonCompleted,
  type Course,
  type CourseLesson,
} from '@/lib/supabase/queries'
import { VideoEmbed } from '@/components/video/VideoEmbed'

function formatDuration(sec: number | null | undefined) {
  if (!sec || sec <= 0) return ''
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (h > 0) return `${h}h ${m}min`
  return `${m} min`
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch { return '' }
}

export default function CoursePlayerPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug as string
  const router = useRouter()
  const { user, refreshUser } = useAuthStore()

  const [course, setCourse]   = useState<Course | null>(null)
  const [lessons, setLessons] = useState<CourseLesson[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [marking, setMarking] = useState(false)

  const isPro   = !!(user as any)?.is_pro
  const isAdmin = !!(user as any)?.is_admin

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetchCourseBySlug(slug).then(async c => {
      if (!c) { setLoading(false); return }
      setCourse(c)
      const ls = await fetchCourseLessons(c.id, user?.id ?? null)
      setLessons(ls)
      setActiveId(ls[0]?.id ?? null)
      setLoading(false)
    })
  }, [slug, user?.id])

  const sorted = useMemo(() => {
    if (!course) return lessons
    if (course.type === 'live') {
      return [...lessons].sort((a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    }
    return [...lessons].sort((a, b) => a.order_index - b.order_index)
  }, [lessons, course])

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted
    const q = search.toLowerCase()
    return sorted.filter(l =>
      l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q))
  }, [sorted, search])

  const active = useMemo(
    () => sorted.find(l => l.id === activeId) || sorted[0] || null,
    [sorted, activeId],
  )

  const locked = !!(active?.is_pro_only && !isPro && !isAdmin)

  async function handleComplete() {
    if (!active || !user || marking) return
    setMarking(true)
    try {
      await markLessonCompleted(active.id, active.duration_sec ?? 0)
      setLessons(prev => prev.map(l =>
        l.id === active.id ? { ...l, completed_at: new Date().toISOString() } : l))
      refreshUser()
    } catch {
      /* noop */
    } finally {
      setMarking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-4">
            <div className="h-10 w-40 bg-white rounded-full animate-pulse" />
            <div className="aspect-video rounded-2xl bg-gray-200 animate-pulse" />
            <div className="h-24 bg-white rounded-2xl animate-pulse" />
          </div>
          <div className="h-[520px] bg-white rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-12 text-center border border-gray-100">
          <p className="text-gray-500 text-sm">Grimório não encontrado.</p>
          <Link href="/cursos" className="mt-4 inline-block text-xs font-bold text-black underline">
            Voltar ao Grimório
          </Link>
        </div>
      </div>
    )
  }

  const isLive = course.type === 'live'
  const sidebarLabel = isLive ? 'Lista dos Conselhos' : 'Pergaminhos do Tomo'

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      <div className="max-w-7xl mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

        {/* ── MAIN ─────────────────────────────────────────── */}
        <div className="space-y-4 min-w-0">

          {/* Voltar + breadcrumb */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/cursos')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.2} />
              Voltar ao Grimório
            </button>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {isLive
                ? <><Radio className="w-3 h-3" /> Conselho da Guilda</>
                : <><BookOpenCheck className="w-3 h-3" /> Tomo</>}
            </span>
          </div>

          {/* Player */}
          {locked ? (
            <div className="aspect-video w-full rounded-2xl bg-gray-900 flex flex-col items-center justify-center gap-3 text-white p-8 text-center">
              <Lock className="w-6 h-6" />
              <p className="text-sm font-bold">Este pergaminho é só pra membros Pro.</p>
              <Link
                href="/cursos?upgrade=1"
                className="px-5 py-2 bg-white text-black text-xs font-bold rounded-full"
              >
                Virar Pro
              </Link>
            </div>
          ) : active ? (
            <VideoEmbed url={active.external_url} title={active.title} />
          ) : (
            <div className="aspect-video w-full rounded-2xl bg-gray-900 text-white flex items-center justify-center text-sm">
              Nenhum pergaminho ainda.
            </div>
          )}

          {/* Header do ativo */}
          {active && !locked && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-900 text-white">
                  {course.tag || (isLive ? 'Live' : 'Curso')}
                </span>
                {active.duration_sec ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-gray-500">
                    <Clock className="w-3 h-3" /> {formatDuration(active.duration_sec)}
                  </span>
                ) : null}
                {active.instructor && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-gray-500">
                    {active.instructor}
                  </span>
                )}
                {active.is_pro_only && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-white">
                    Pro
                  </span>
                )}
                {active.completed_at && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" /> Concluído
                  </span>
                )}
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  +{active.xp_reward} XP
                </span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-black leading-tight mb-1">
                {active.title}
              </h1>
              <p className="text-xs text-gray-400 mb-4">
                Publicado em {formatDate(active.published_at)}
              </p>

              {active.description && (
                <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {active.description}
                </p>
              )}

              {!active.completed_at && user && (
                <button
                  onClick={handleComplete}
                  disabled={marking}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2 bg-black text-white text-xs font-bold rounded-full disabled:opacity-40"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {marking ? 'Marcando...' : `Marcar como concluído · +${active.xp_reward} XP`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── SIDEBAR ──────────────────────────────────────── */}
        <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col self-start lg:sticky lg:top-6 max-h-[calc(100vh-3rem)]">

          <div className="p-4 border-b border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              {sidebarLabel}
            </p>
            <h2 className="text-lg font-serif font-bold text-black leading-tight">
              {course.title}
            </h2>
          </div>

          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={2.2} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar pergaminho..."
                className="w-full pl-9 pr-3 py-2 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <p className="p-6 text-center text-xs text-gray-400">
                Nenhum pergaminho encontrado.
              </p>
            ) : filtered.map((l, idx) => {
              const isActive   = l.id === active?.id
              const isCompleted = !!l.completed_at
              const isLocked    = l.is_pro_only && !isPro && !isAdmin
              return (
                <button
                  key={l.id}
                  onClick={() => setActiveId(l.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 transition-colors flex gap-3',
                    isActive ? 'bg-black text-white' : 'hover:bg-gray-50',
                  )}
                >
                  <span className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0',
                    isActive ? 'bg-white text-black' : isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500',
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> :
                     isLocked    ? <Lock         className="w-3.5 h-3.5" /> :
                                   <PlayCircle  className="w-4 h-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('text-[9px] font-bold uppercase tracking-wider', isActive ? 'text-white/60' : 'text-gray-400')}>
                        {isLive ? `Conselho #${idx + 1}` : `Pergaminho ${idx + 1}`}
                      </span>
                      {l.is_pro_only && (
                        <span className={cn(
                          'text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full',
                          isActive ? 'bg-white/20 text-white' : 'bg-black text-white',
                        )}>Pro</span>
                      )}
                    </div>
                    <p className={cn('text-sm font-bold leading-tight truncate', isActive ? 'text-white' : 'text-black')}>
                      {l.title}
                    </p>
                    <p className={cn('text-[10px] mt-0.5', isActive ? 'text-white/60' : 'text-gray-400')}>
                      {formatDuration(l.duration_sec)}
                      {l.duration_sec && isLive ? ' · ' : ''}
                      {isLive ? formatDate(l.published_at) : ''}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

      </div>
    </div>
  )
}
