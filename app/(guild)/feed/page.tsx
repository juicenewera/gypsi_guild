'use client'

import { useState } from 'react'
import { PostCard } from '@/components/post/PostCard'
import { cn } from '@/lib/utils'
import Image from 'next/image'

type FilterType = 'all' | 'adventure' | 'discussion' | 'question' | 'showcase'

export default function FeedPage() {
  const [filter, setFilter] = useState<FilterType>('all')

  const MOCK_POSTS = [
    {
      id: 'msg-1',
      author: { id: 'u1', username: 'Cigano AGI', path: 'Fundador', level: 8, avatar: '' },
      title: '',
      body: '"A rede de practitioners não é sobre estudar. É sobre resolver problemas reais. Ontem automatizei um pipeline usando 3 agentes — 14 reuniões agendadas em um domingo. ⚔️"',
      type: 'discussion',
      upvotes: 124,
      comments_count: 48,
      is_validated: true,
      category: { name: 'Estratégia' },
      created: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'msg-2',
      author: { id: 'u2', username: 'Elena_Code', path: 'Aventureira', level: 4, avatar: '' },
      title: '',
      body: '"Fechei meu primeiro contrato de R$ 5k usando o selo da Guild. Quando você diz que faz parte de um bando que constrói com rigor, a percepção de valor escala na hora. 🔥"',
      type: 'showcase',
      upvotes: 210,
      comments_count: 34,
      is_validated: false,
      category: { name: 'Vitrine' },
      created: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), 
    }
  ]

  const filteredPosts = MOCK_POSTS.filter(p => filter === 'all' || p.type === filter)

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      
      {/* ── BANNER ────────────────────────────────────────── */}
      <div className="w-full max-w-5xl mx-auto px-6 pt-10 pb-4">
        {/* Usando um gradiente placeholder elegante caso a imagem não exista, 
            idealmente substitua pela imagem real do tavern (ex: /images/tavern-banner.png) */}
        <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden relative shadow-sm border border-gray-200 bg-gray-100 flex items-center justify-center">
            {/* Imagem real */}
            {/* <img src="/images/feed-banner.png" alt="Guild Tavern" className="w-full h-full object-cover" /> */}
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1542314831-c6a4d14d2350?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-80 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            <span className="absolute text-white font-serif text-3xl font-bold tracking-widest uppercase opacity-50">Tavern</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        
        <div className="text-center mb-8 mt-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            Últimas Atividades do Bando
          </p>
        </div>

        {/* ── FEED LIST ─────────────────────────────────────── */}
        <div className="space-y-6">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post as any} />
          ))}

          {/* New Post Input Box component directly in the feed (matching image) */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mt-8">
            <h3 className="text-2xl font-serif font-medium text-black mb-1">
              O que você construiu hoje?
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Registrar feito no Grimório
            </p>
            
            <div className="w-full border-b border-gray-100 mb-4"></div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-4 opacity-50">
                <span>🖼️</span>
                <span>🔥</span>
              </div>
              <button className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full shadow-md hover:bg-gray-800 transition-colors">
                Publicar feito →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
