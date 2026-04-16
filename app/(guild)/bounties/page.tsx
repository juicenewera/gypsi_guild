'use client'

import { useState, useEffect } from 'react'
import { getClient } from '@/lib/pocketbase/client'
import { PixelBadge } from '@/components/ui/PixelBadge'
import { PixelButton } from '@/components/ui/PixelButton'
import { formatCurrency, cn, timeAgo } from '@/lib/utils'
import { Briefcase, Zap, ExternalLink, Filter, Plus } from 'lucide-react'
interface IBounty {
  id: string
  title: string
  description: string
  reward_amount: number
  reward_currency: string
  company_name: string
  type: 'fixed' | 'commission' | 'hourly'
  category: 'automation' | 'sales_funnel' | 'custom_ai' | 'data_analysis'
  status: 'open' | 'in_progress' | 'completed' | 'expired'
  is_external: boolean
  created: string
}

export default function BountiesPage() {
  const [bounties, setBounties] = useState<IBounty[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'automation' | 'sales_funnel'>('all')

  useEffect(() => {
    async function load() {
      try {
        const pb = getClient()
        const result = await pb.collection('bounties').getList(1, 50, {
          sort: '-created',
          filter: 'status = "open"',
        })
        setBounties(result.items as unknown as IBounty[])
      } catch (err) {
        console.error('Error loading bounties:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl text-text-primary tracking-tight">
            Mural de Bounties
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Contratos de elite para Magos e Ladinos.
          </p>
        </div>
        <div className="flex gap-2">
           <PixelButton variant="outline" className="text-xs">
            <Filter className="w-3.5 h-3.5 mr-2" />
            Filtros
          </PixelButton>
          <PixelButton variant="primary" className="text-xs">
            <Plus className="w-3.5 h-3.5 mr-2" />
            Postar Bounty
          </PixelButton>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        {/* Main List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card h-32 animate-pulse bg-bg-elevated" />
            ))
          ) : bounties.length === 0 ? (
            <div className="card p-12 text-center bg-bg-surface border-dashed">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-lg font-bold text-text-primary">Nenhum contrato ativo</h3>
              <p className="text-sm text-text-secondary">O mural está limpo por enquanto.</p>
            </div>
          ) : (
            bounties.map((b) => (
              <div key={b.id} className="card p-5 group hover:border-mago-400 transition-all duration-300 bg-bg-primary">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                        {b.company_name}
                      </span>
                      {b.is_external && (
                        <PixelBadge variant="default" size="sm">Externo</PixelBadge>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-mago-500 transition-colors mb-1">
                      {b.title}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                      {b.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xp-600 font-bold text-sm">
                        <Zap className="w-4 h-4" />
                        {formatCurrency(b.reward_amount, b.reward_currency)}
                      </div>
                      <div className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">
                        Postado {timeAgo(b.created)}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <PixelBadge variant="mago" size="md">{b.category}</PixelBadge>
                    <PixelButton variant="outline" size="sm" className="mt-4">
                      Ver Detalhes
                    </PixelButton>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-6">
          <div className="card p-6 bg-text-primary text-white border-none shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-[family-name:var(--font-heading)] text-xl mb-2">Contrate a Elite</h3>
              <p className="text-xs text-white/70 mb-6 leading-relaxed">
                Tem um projeto de IA desafiador? Poste uma Bounty e acesse os melhores Magos e Ladinos do mercado.
              </p>
              <PixelButton variant="primary" className="w-full bg-white text-text-primary border-none hover:bg-gray-100">
                Postar Externamente
              </PixelButton>
            </div>
            {/* Decoration */}
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Briefcase size={120} />
            </div>
          </div>

          <div className="card p-5 border-border-subtle bg-bg-surface">
            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Estatísticas do Mural</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-secondary font-medium">Contratos Abertos</span>
                <span className="text-sm font-bold text-text-primary">{bounties.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-secondary font-medium">Faturamento Total</span>
                <span className="text-sm font-bold text-xp-600">R$ 42.500</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
