'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function CursosPage() {
  const [filter, setFilter] = useState('ia_aplicada')

  const FILTERS = [
    { id: 'todos', label: 'Todos' },
    { id: 'ia_aplicada', label: 'IA Aplicada' },
    { id: 'agentes', label: 'Agentes' },
    { id: 'automacao', label: 'Automação' },
  ]

  const CURSOS = [
    {
      id: 'c1',
      title: 'Agentes de IA na Prática',
      description: 'Construa, teste e deploy de agentes reais. Do zero ao cliente pagante.',
      emoji: '🤖',
      color: 'bg-blue-200',
      tag: 'IA Aplicada',
      duration: '8 semanas',
      xp: '+500 XP',
      isDestaque: true,
      price: '197',
      oldPrice: '297',
    },
    {
      id: 'c2',
      title: 'N8N + Make Avançado',
      description: 'Fluxos de trabalho que fazem dinheiro enquanto você dorme.',
      emoji: '⚡',
      color: 'bg-purple-200',
      tag: 'Automação',
      xp: '+300 XP',
      price: '147',
    },
    {
      id: 'c3',
      title: 'Prospecção Automatizada',
      description: 'Clay + GPT-4o para gerar leads qualificados 24/7.',
      emoji: '🎯',
      color: 'bg-emerald-300',
      tag: 'Vendas com IA',
      xp: '+250 XP',
      price: '97',
    }
  ]

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

        {/* ── BANNER ────────────────────────────────────────── */}
        <div className="w-full h-48 md:h-72 rounded-2xl overflow-hidden relative shadow-sm border border-gray-200 bg-[#E5E7EB]">
          {/* Substituir pelo arquivo correto depois se existir (ex: /images/cursos-banner.png) */}
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-90 mix-blend-multiply"></div>
        </div>

        {/* ── COURSE GRID ───────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {CURSOS.map(curso => (
            <div key={curso.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col transition-all hover:shadow-md">
              
              {/* TOP COLOR AREA */}
              <div className={cn("h-40 relative flex items-center justify-center", curso.color)}>
                {curso.isDestaque && (
                  <span className="absolute top-4 left-4 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Em destaque
                  </span>
                )}
                <span className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                  {curso.xp}
                </span>

                <span className="text-6xl filter drop-shadow-md">{curso.emoji}</span>
              </div>

              {/* BOTTOM CONTENT */}
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
                    {curso.oldPrice && (
                      <span className="text-xs text-gray-400 line-through mb-0.5">R$ {curso.oldPrice}</span>
                    )}
                    <span className="text-xl font-serif font-bold text-black">R$ {curso.price}</span>
                  </div>
                  {curso.isDestaque ? (
                    <button className="px-5 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-colors">
                      Acessar →
                    </button>
                  ) : (
                    <button className="px-5 py-2 bg-white border border-gray-200 text-black text-xs font-bold rounded-full hover:bg-gray-50 transition-colors">
                      Ver curso
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
