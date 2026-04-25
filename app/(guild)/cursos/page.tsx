'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { Medal, Lock, Play } from 'lucide-react'
import { fetchCourses, submitCourseRequest, type Course } from '@/lib/supabase/queries'

// 10% off para qualquer membro da Guilda
const MEMBER_DISCOUNT = 0.10

export default function CursosPage() {
  const { user } = useAuthStore()
  const [filter, setFilter] = useState('todos')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showRequest, setShowRequest] = useState(false)
  const [requestText, setRequestText] = useState('')
  const [requestState, setRequestState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const isPro = !!(user as any)?.is_pro

  const FILTERS = [
    { id: 'todos', label: 'Todos' },
    { id: 'IA Aplicada', label: 'IA Aplicada' },
    { id: 'Cloud', label: 'Cloud' },
    { id: 'Automação', label: 'Automação' },
    { id: 'Vendas com IA', label: 'Vendas' },
  ]

  useEffect(() => {
    fetchCourses().then(cs => {
      setCourses(cs)
      setLoading(false)
    })
  }, [])

  async function sendRequest() {
    if (!user || !requestText.trim()) return
    setRequestState('sending')
    try {
      await submitCourseRequest(user.id, requestText.trim())
      setRequestState('sent')
      setRequestText('')
      setTimeout(() => { setShowRequest(false); setRequestState('idle') }, 1500)
    } catch {
      setRequestState('error')
    }
  }

  const onlyCourses = courses.filter(c => (c.type ?? 'course') === 'course')
  const onlyLives = courses.filter(c => c.type === 'live')

  const visible = filter === 'todos'
    ? onlyCourses
    : onlyCourses.filter(c => c.tag === filter)

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── HEADER & FILTROS ──────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-serif font-medium text-black">
              Cursos
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Aprenda construindo. Cada curso tem entregável real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm border',
                  filter === f.id
                    ? 'bg-white border-black text-black'
                    : 'bg-white border-gray-200 text-gray-500 hover:text-black'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── AVISO DE DESCONTO DA GUILDA ──────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black text-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <Medal className="w-5 h-5 text-white" strokeWidth={2} />
            </span>
            <div>
              <p className="text-sm font-bold">Membros da Guilda pagam 10% menos em todos os cursos.</p>
              <p className="text-xs text-white/60">Desconto aplicado automaticamente no checkout.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowRequest(s => !s)}
              className="px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              Pedir curso
            </button>
            {isPro && (
              <Link
                href="/cursos/submeter"
                className="px-4 py-2 border border-white/30 text-white text-xs font-bold rounded-full hover:bg-white/10 transition-colors"
              >
                Submeter curso (Pro)
              </Link>
            )}
          </div>
        </div>

        {showRequest && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-black mb-2">Qual curso você quer ver na Guilda?</p>
            <p className="text-xs text-gray-500 mb-3">Se muita gente pedir, a equipe valida e produz. Pedidos de membros Pro têm prioridade.</p>
            <textarea
              value={requestText}
              onChange={e => setRequestText(e.target.value)}
              placeholder="Ex: curso de construção de SaaS com Supabase + Stripe"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm min-h-[80px] focus:outline-none focus:border-black transition-colors"
            />
            <div className="flex items-center justify-between mt-3">
              <span className={cn('text-xs font-semibold',
                requestState === 'sent'   && 'text-emerald-600',
                requestState === 'error'  && 'text-red-600',
                requestState === 'sending' && 'text-gray-400',
              )}>
                {requestState === 'sent'    && 'Pedido enviado. Obrigado!'}
                {requestState === 'error'   && 'Erro ao enviar. Tenta de novo.'}
                {requestState === 'sending' && 'Enviando...'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowRequest(false); setRequestText(''); setRequestState('idle') }}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-black"
                >
                  Cancelar
                </button>
                <button
                  onClick={sendRequest}
                  disabled={!requestText.trim() || !user || requestState === 'sending'}
                  className="px-4 py-2 bg-black text-white text-xs font-bold rounded-full disabled:opacity-40"
                >
                  Enviar pedido
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── BANNER ────────────────────────────────────────── */}
        <div className="w-full h-48 md:h-72 rounded-2xl overflow-hidden relative shadow-sm border border-gray-200 bg-[#E5E7EB]">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-90 mix-blend-multiply"></div>
        </div>

        {/* ── COURSE GRID ───────────────────────────────────── */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-96 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 mt-8">
            <p className="text-gray-500 text-sm">Nenhum curso nessa categoria ainda.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {visible.map(curso => {
              const discounted = Math.round(Number(curso.price) * (1 - MEMBER_DISCOUNT))
              return (
                <div key={curso.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col transition-all hover:shadow-md">
                  <div className={cn("h-40 relative flex items-center justify-center", curso.cover_color)}>
                    {curso.is_featured && (
                      <span className="absolute top-4 left-4 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Em destaque
                      </span>
                    )}
                    <span className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                      +{curso.xp_reward} XP
                    </span>
                    <span className="text-6xl filter drop-shadow-md">{curso.emoji}</span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-blue-500 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                          {curso.tag}
                        </span>
                        {curso.duration && (
                          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                            {curso.duration}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-serif font-bold text-black mb-2">{curso.title}</h3>
                      <p className="text-sm text-gray-500 mb-6">{curso.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-end gap-2">
                        {curso.old_price && (
                          <span className="text-xs text-gray-400 line-through mb-0.5">R$ {curso.old_price}</span>
                        )}
                        <div className="flex flex-col">
                          <span className="text-xl font-serif font-bold text-black">
                            R$ {discounted}
                          </span>
                          <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">
                            -10% membros · era R$ {curso.price}
                          </span>
                        </div>
                      </div>
                      {curso.is_affiliate && curso.affiliate_url ? (
                        <a
                          href={curso.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-colors"
                        >
                          Acessar →
                        </a>
                      ) : (
                        <Link
                          href={`/cursos/${curso.slug}`}
                          className={cn(
                            'px-5 py-2 text-xs font-bold rounded-full transition-colors',
                            curso.is_featured
                              ? 'bg-black text-white hover:bg-gray-800'
                              : 'bg-white border border-gray-200 text-black hover:bg-gray-50',
                          )}
                        >
                          {curso.is_featured ? 'Acessar →' : 'Ver curso'}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── CONSELHOS GRAVADOS (LIVES) ──────────────────────── */}
        {onlyLives.length > 0 && (
          <>
            <div className="flex items-end justify-between mt-16 mb-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-serif font-medium text-black">
                  Conselhos gravados
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                  Lives, workshops e aulas que já rolaram na Guilda. Assista on-demand.
                </p>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden md:block">
                {onlyLives.length} gravadas
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {onlyLives.map(live => {
                const locked = false
                return (
                  <div
                    key={live.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col transition-all hover:shadow-md"
                  >
                    <div className={cn('h-40 relative flex items-center justify-center', live.cover_color)}>
                      <span className="absolute top-4 left-4 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Gravada
                      </span>
                      <span className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                        +{live.xp_reward} XP
                      </span>
                      <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-black ml-0.5" strokeWidth={2.2} fill="currentColor" />
                      </div>
                      {live.duration && (
                        <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {live.duration}
                        </span>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                            {live.tag}
                          </span>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-black mb-2">{live.title}</h3>
                        <p className="text-sm text-gray-500 mb-6">{live.description}</p>
                      </div>

                      <div className="flex items-center justify-end pt-4 border-t border-gray-50">
                        {locked ? (
                          <button
                            disabled
                            className="inline-flex items-center gap-1.5 px-5 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-full cursor-not-allowed"
                          >
                            <Lock className="w-3.5 h-3.5" strokeWidth={2} />
                            Só Pro
                          </button>
                        ) : (
                          <Link
                            href={`/cursos/${live.slug}`}
                            className="px-5 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-colors"
                          >
                            Assistir →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
