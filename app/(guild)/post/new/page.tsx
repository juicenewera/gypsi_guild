'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Sparkles, Swords, MessageSquare, HelpCircle, type LucideIcon } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import { createPost, type PostType } from '@/lib/supabase/queries'

const TYPES: { value: PostType; label: string; Icon: LucideIcon; desc: string; xp: number }[] = [
  { value: 'adventure',  label: 'Aventura',  Icon: Swords,        desc: 'Relato real de execução',     xp: 50  },
  { value: 'discussion', label: 'Discussão', Icon: MessageSquare, desc: 'Estratégia ou insight',        xp: 25  },
  { value: 'question',   label: 'Pergunta',  Icon: HelpCircle,    desc: 'Dúvida técnica ou venda',      xp: 25  },
]

export default function NewPostPage() {
  const router = useRouter()
  const { user, refreshUser } = useAuthStore()

  const [type, setType] = useState<PostType>('adventure')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit() {
    if (!user) return
    setError(null)

    if (title.trim().length < 5) { setError('Título precisa de pelo menos 5 caracteres.'); return }
    if (content.trim().length < 20) { setError('Relato precisa de pelo menos 20 caracteres.'); return }

    setSubmitting(true)
    try {
      const post = await createPost({
        userId: user.id,
        title: title.trim(),
        content: content.trim(),
        type,
      })
      await refreshUser()
      router.push(`/post/${post.id}`)
    } catch (e: any) {
      setError(e?.message || 'Falha ao publicar.')
    } finally {
      setSubmitting(false)
    }
  }

  const xp = TYPES.find(t => t.value === type)?.xp ?? 25

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-black">Registrar feito</h1>
          <p className="text-sm text-gray-500 mt-1">
            Compartilhe sua execução com o bando.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">+{xp} XP</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_240px] gap-6">
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 space-y-5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
              Título
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={140}
              placeholder="Ex: Como fechei R$5k em 3 dias com automação WhatsApp"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
              Relato
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={10}
              maxLength={4000}
              placeholder="Conte como foi: contexto, processo, números reais, aprendizado…"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black resize-none font-serif leading-relaxed"
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">{content.length}/4000</p>
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black rounded-full"
            >
              Cancelar
            </button>
            <button
              onClick={onSubmit}
              disabled={submitting || !user}
              className="inline-flex items-center gap-2 px-5 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Publicando…' : 'Publicar feito'}
            </button>
          </div>
        </div>

        <aside>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Tipo de post
            </p>
            {TYPES.map(t => {
              const active = type === t.value
              return (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={cn(
                    'w-full text-left px-3 py-2.5 rounded-xl border transition-colors',
                    active
                      ? 'border-black bg-gray-50'
                      : 'border-gray-100 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <t.Icon className={cn('w-4 h-4', active ? 'text-black' : 'text-gray-400')} strokeWidth={2} />
                    <div>
                      <p className={cn('text-xs font-bold', active ? 'text-black' : 'text-gray-700')}>
                        {t.label}
                      </p>
                      <p className="text-[10px] text-gray-400">{t.desc}</p>
                    </div>
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
