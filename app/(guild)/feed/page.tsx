'use client'

import { useState } from 'react'
import { PostCard } from '@/components/post/PostCard'
import { cn } from '@/lib/utils'

type FilterType = 'all' | 'adventure' | 'discussion' | 'question' | 'showcase'

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'adventure', label: 'Adventures' },
  { value: 'discussion', label: 'Estratégias' },
  { value: 'question', label: 'Dúvidas' },
  { value: 'showcase', label: 'Vitrines' },
]

// MOCK DATA PARA DESENVOLVIMENTO ENQUANTO O SUPABASE NÃO CARREGA OS POSTS REAIS
const MOCK_POSTS = [
  {
    id: 'msg-1',
    author: { id: 'u1', username: 'Cigano.agi', path: 'mago', level: 8, avatar: '' },
    title: 'Construindo o Gipsy VIP: Automação completa de Onboarding com N8N',
    body: 'Neste post vou destrinchar a exata arquitetura que usamos para receber novos alunos na Guild, automatizar os pagamentos e liberar os acessos no Discord integrando Typeform, Stripe e Supabase num único fluxo indestrutível de n8n.',
    type: 'adventure',
    revenue_amount: 8500,
    client_niche: 'Educação / Comunidade',
    days_to_close: 4,
    system_used: ['N8N', 'Stripe', 'Supabase', 'Discord API'],
    upvotes: 142,
    comments_count: 38,
    is_validated: true,
    category: { name: 'Automação' },
    created: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 horas atrás
  },
  {
    id: 'msg-2',
    author: { id: 'u2', username: 'LucasDev', path: 'ladino', level: 4, avatar: '' },
    title: 'Qual a melhor stack para agências locais hoje?',
    body: 'Estou fechando com uma clínica médica e eles querem um bot de WhatsApp que também faça o agendamento no Google Calendar. Voces preferem Make, N8N ou Typebot para isso?',
    type: 'question',
    upvotes: 12,
    comments_count: 5,
    is_validated: false,
    category: { name: 'Dúvidas' },
    created: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 dia atrás
  },
  {
    id: 'msg-3',
    author: { id: 'u3', username: 'Mariana.ai', path: 'mercador', level: 6, avatar: '' },
    title: 'Fechei meu primeiro contrato de R$ 5k recorrente!',
    body: 'A estratégia de prospecting pelo LinkedIn funcionou perfeitamente. Ofereci uma automação de triagem de leads com GPT-4 e qualificação automática. O cliente amou a demonstração gravada via Loom.',
    type: 'showcase',
    upvotes: 89,
    comments_count: 24,
    is_validated: true,
    category: { name: 'Negócios' },
    created: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 dias atrás
  }
]

export default function FeedPage() {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredPosts = MOCK_POSTS.filter(p => filter === 'all' || p.type === filter)

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        
        {/* ── HEADER ────────────────────────────────────────── */}
        <div className="mb-12">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            O coração da Guild
          </p>
          <h1 className="text-5xl lg:text-7xl font-serif font-medium text-white leading-tight">
            Intelligence Feed.
          </h1>
          <p className="max-w-xl text-gray-400 text-lg mt-4">
            Insights, aventuras validadas e execuções em tempo real da linha de frente dos construtores de IA.
          </p>
        </div>

        {/* ── FILTROS ───────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-white/10">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-semibold transition-all',
                filter === f.value
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── FEED LIST ─────────────────────────────────────── */}
        <div className="space-y-6 pb-20">
          {filteredPosts.length === 0 ? (
            <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
              <span className="text-4xl block mb-4">📡</span>
              <p className="text-lg font-serif text-white">Nenhum sinal captado.</p>
              <p className="text-gray-400 mt-2 text-sm">Tente mudar o filtro acima.</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard key={post.id} post={post as any} />
            ))
          )}
        </div>

      </div>
    </div>
  )
}
