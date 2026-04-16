'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import { XP_REWARDS } from '@/lib/xp'
import { useSFX } from '@/hooks/use-sfx'
import type { Category } from '@/lib/pocketbase/types'
import { AlertCircle, Send, Coins, Target, Rocket, Sparkles } from 'lucide-react'

const postSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres').max(200),
  body: z.string().min(20, 'Mínimo 20 caracteres'),
  type: z.enum(['discussion', 'question', 'adventure', 'showcase']),
  category: z.string().min(1, 'Selecione uma categoria'),
  tags: z.string().optional(),
  revenue_amount: z.string().optional(),
  client_niche: z.string().optional(),
  days_to_close: z.string().optional(),
})

type PostForm = z.infer<typeof postSchema>

const postTypes = [
  { value: 'adventure', label: 'Adventure', icon: '⚔️', desc: 'Relato de venda ou ROI' },
  { value: 'discussion', label: 'Discussão', icon: '💬', desc: 'Estratégia ou insight' },
  { value: 'question', label: 'Pergunta', icon: '❓', desc: 'Dúvida técnica ou venda' },
  { value: 'showcase', label: 'Vitrine', icon: '🏆', desc: 'Mostre seu sistema' },
] as const

const niches = [
  'Clínica Médica/Estética', 'Imobiliária', 'Infoproduto', 'Agência de Marketing', 
  'E-commerce', 'Advocacia', 'SaaS', 'Indústria', 'Varejo Local', 'Outro'
]

const systems = [
  { id: 'n8n', label: 'n8n' },
  { id: 'make', label: 'Make.com' },
  { id: 'python', label: 'Python' },
  { id: 'chatgpt', label: 'ChatGPT/OpenAI' },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'whatsapp', label: 'WhatsApp API' },
  { id: 'typeform', label: 'Typeform/Tally' },
  { id: 'pinecone', label: 'Vector DBs' },
]

export default function NewPostPage() {
  const router = useRouter()
  const { user, refreshUser } = useAuthStore()
  const { play } = useSFX()
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState('')
  const [selectedSystems, setSelectedSystems] = useState<string[]>([])

  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setValue } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: { type: 'adventure' },
  })

  const postType = watch('type')

  useEffect(() => {
    async function load() {
      try {
        const { getClient } = await import('@/lib/pocketbase/client')
        const pb = getClient()
        const r = await pb.collection('categories').getFullList({ sort: 'sort_order' })
        setCategories(r as unknown as Category[])
        
        // Auto-select category based on type if needed
        if (postType === 'adventure') {
          const advCat = (r as any).find((c: any) => c.slug === 'adventures')
          if (advCat) setValue('category', advCat.id)
        }
      } catch { /* skip */ }
    }
    load()
  }, [postType, setValue])

  function toggleSystem(id: string) {
    play('click', 0.2)
    setSelectedSystems(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  async function onSubmit(data: PostForm) {
    setError('')
    try {
      const { getClient } = await import('@/lib/pocketbase/client')
      const pb = getClient()
      const isAdv = data.type === 'adventure'
      const xpAmount = isAdv ? XP_REWARDS.post_adventure : XP_REWARDS.post_discussion

      const record = await pb.collection('posts').create({
        author: user?.id,
        category: data.category,
        title: data.title,
        body: data.body,
        type: data.type,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5) : [],
        revenue_amount: isAdv && data.revenue_amount ? parseFloat(data.revenue_amount) : null,
        client_niche: isAdv ? data.client_niche || '' : '',
        system_used: isAdv ? selectedSystems : [],
        days_to_close: isAdv && data.days_to_close ? parseInt(data.days_to_close) : null,
        xp_awarded: xpAmount,
      })

      // Conceder XP
      if (user?.id) {
        await pb.collection('users').update(user.id, { 'xp+': xpAmount })
        await pb.collection('xp_log').create({
          user: user.id,
          amount: xpAmount,
          reason: isAdv ? 'post_adventure' : 'post_discussion',
          reference_id: record.id,
        })
        await refreshUser()
      }

      play('post', 0.6)
      router.push(`/post/${record.id}`)
    } catch (err) {
      setError('Falha ao registrar seu feito no grimório. Tente novamente.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl text-text-primary tracking-tight">
            Registrar Feito
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Compartilhe seu conhecimento e ganhe XP na Guilda.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-xp-50 border border-xp-200 rounded-2xl">
          <Sparkles className="w-4 h-4 text-xp-500" />
          <span className="text-xs font-bold text-xp-600 uppercase tracking-tighter">
            {postType === 'adventure' ? `+${XP_REWARDS.post_adventure} XP` : `+${XP_REWARDS.post_discussion} XP`}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-8">
        <div className="space-y-6">
          {/* Card Principal */}
          <div className="card p-6 shadow-sm border-border-subtle bg-bg-primary">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-danger-100 border border-danger-400 text-danger-600 text-sm rounded-xl animate-fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Título & Categoria */}
              <div className="grid sm:grid-cols-[2fr_1fr] gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">
                    Título do Feito
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    className="input w-full h-12 text-base font-medium"
                    placeholder="Ex: Como fechei uma automação de R$5k em 3 dias"
                  />
                  {errors.title && <p className="text-[10px] text-danger-500 font-bold ml-1">{errors.title.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">
                    Categoria
                  </label>
                  <select {...register('category')} className="input w-full h-12 text-sm appearance-none bg-bg-surface">
                    <option value="">Selecione...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Editor */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">
                  Relato (Grimório)
                </label>
                <textarea
                  {...register('body')}
                  rows={12}
                  className="input w-full resize-none p-4 text-sm leading-relaxed font-mono bg-bg-surface border-dashed"
                  placeholder="Escreva como foi o processo, os desafios e o resultado... (Suporta Markdown)"
                />
                <div className="flex justify-between items-center px-1">
                  {errors.body ? <p className="text-[10px] text-danger-500 font-bold">{errors.body.message}</p> : <div/>}
                  <span className="text-[10px] text-text-muted font-medium">Use Markdown para formatar seu texto.</span>
                </div>
              </div>

              {/* Adventure Detail Section */}
              {postType === 'adventure' && (
                <div className="p-6 bg-guerr-50/50 border-2 border-dashed border-guerr-200 rounded-3xl space-y-6 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-guerr-100 rounded-xl">
                      <Coins className="w-5 h-5 text-guerr-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-guerr-600 uppercase tracking-tight">Métricas do Adventure</h3>
                      <p className="text-[10px] text-guerr-500 font-medium">Dados reais ajudam a validar sua autoridade.</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-guerr-600/60 uppercase tracking-widest ml-1">Faturamento (R$)</label>
                      <input type="number" {...register('revenue_amount')} className="input w-full bg-white border-guerr-200 focus:border-guerr-400" placeholder="0.00" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-guerr-600/60 uppercase tracking-widest ml-1">Nicho do Cliente</label>
                      <select {...register('client_niche')} className="input w-full bg-white border-guerr-200 focus:border-guerr-400">
                        <option value="">Selecione o nicho...</option>
                        {niches.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-guerr-600/60 uppercase tracking-widest ml-1">Sistemas Utilizados</label>
                    <div className="flex flex-wrap gap-2">
                      {systems.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleSystem(s.id)}
                          className={cn(
                            'px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all duration-200',
                            selectedSystems.includes(s.id)
                              ? 'bg-guerr-500 border-guerr-500 text-white shadow-md scale-105'
                              : 'bg-white border-guerr-100 text-guerr-500 hover:border-guerr-300'
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tags & Submit */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-border-subtle">
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    {...register('tags')}
                    className="input w-full h-10 text-xs bg-bg-surface border-none"
                    placeholder="Tags separadas por vírgula (ex: n8n, vendas, crm)"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'btn h-12 px-8 w-full sm:w-auto shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2',
                    postType === 'adventure' 
                      ? 'bg-guerr-500 hover:bg-guerr-600 text-white border-none shadow-guerr-500/20' 
                      : 'bg-mago-500 hover:bg-mago-600 text-white border-none shadow-mago-500/20'
                  )}
                >
                  {isSubmitting ? (
                    'Sincronizando...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Publicar no Mural
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar de Dicas */}
        <aside className="space-y-6">
          <div className="card p-5 bg-bg-surface border-border-subtle">
            <h3 className="text-xs font-black text-text-primary uppercase tracking-widest mb-4">Escolha o Tipo</h3>
            <div className="space-y-2">
              {postTypes.map(t => (
                <button
                  key={t.value}
                  onClick={() => {
                    play('click', 0.1)
                    setValue('type', t.value)
                  }}
                  className={cn(
                    'w-full p-3 rounded-2xl border-2 text-left transition-all duration-200',
                    postType === t.value
                      ? t.value === 'adventure'
                        ? 'border-guerr-400 bg-guerr-50 text-guerr-700'
                        : 'border-mago-400 bg-mago-50 text-mago-700'
                      : 'border-transparent bg-transparent hover:bg-bg-elevated text-text-secondary'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{t.icon}</span>
                    <div>
                      <p className="text-xs font-bold leading-none mb-1">{t.label}</p>
                      <p className="text-[10px] opacity-70 font-medium">{t.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5 bg-xp-50 border-xp-100">
            <div className="flex items-center gap-2 mb-3">
              <Rocket className="w-4 h-4 text-xp-600" />
              <h3 className="text-[10px] font-black text-xp-600 uppercase tracking-widest">Dica de Mestre</h3>
            </div>
            <p className="text-[11px] text-xp-700 leading-relaxed font-medium">
              Adventures bem detalhados com prints e sistemas podem ser **Validados** pela moderação, dobrando o XP recebido!
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
