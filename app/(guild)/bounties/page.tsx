'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { PixelBadge } from '@/components/ui/PixelBadge'
import { PixelButton } from '@/components/ui/PixelButton'
import { formatCurrency, cn, timeAgo } from '@/lib/utils'
import { Briefcase, Zap, Filter, Plus, Lock, Inbox } from 'lucide-react'
import {
  fetchBounties,
  fetchMyBountyApplications,
  applyToBounty,
  type Bounty,
} from '@/lib/supabase/queries'

export default function BountiesPage() {
  const { user } = useAuthStore()
  const isPro = !!(user as any)?.is_pro
  const [bounties, setBounties]   = useState<Bounty[]>([])
  const [applied, setApplied]     = useState<Record<string, number>>({})
  const [loading, setLoading]     = useState(true)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [error, setError]         = useState<string | null>(null)
  const [filter, setFilter]       = useState<'all' | Bounty['category']>('all')

  useEffect(() => {
    async function load() {
      const [bs, apps] = await Promise.all([
        fetchBounties('open'),
        user ? fetchMyBountyApplications(user.id) : Promise.resolve([]),
      ])
      setBounties(bs)
      setApplied(Object.fromEntries(apps.map(a => [a.bounty_id, a.position])))
      setLoading(false)
    }
    load()
  }, [user])

  async function apply(b: Bounty) {
    if (b.is_pro_only && !isPro) return
    setError(null)
    setPendingId(b.id)
    try {
      const pos = await applyToBounty(b.id)
      setApplied(prev => ({ ...prev, [b.id]: pos }))
      setBounties(prev => prev.map(x => x.id === b.id ? { ...x, queue_size: pos } : x))
    } catch (err: any) {
      setError(err?.message || 'Erro ao candidatar-se')
    } finally {
      setPendingId(null)
    }
  }

  const visible = bounties.filter(b => filter === 'all' || b.category === filter)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
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

      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card h-32 animate-pulse bg-bg-elevated" />
            ))
          ) : visible.length === 0 ? (
            <div className="card p-12 text-center bg-bg-surface border-dashed">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                <Inbox className="w-6 h-6 text-gray-500" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Nenhum contrato ativo</h3>
              <p className="text-sm text-text-secondary">O mural está limpo por enquanto.</p>
            </div>
          ) : (
            visible.map((b) => {
              const locked   = !!b.is_pro_only && !isPro
              const position = applied[b.id]
              return (
                <div key={b.id} className={cn(
                  'card p-5 group transition-all duration-300 bg-bg-primary',
                  locked ? 'border-border-subtle opacity-90' : 'hover:border-mago-400'
                )}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                          {b.company_name || '—'}
                        </span>
                        {b.is_external && (
                          <PixelBadge variant="default" size="sm">Externo</PixelBadge>
                        )}
                        {b.is_pro_only && (
                          <PixelBadge variant="mago" size="sm">Pro</PixelBadge>
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
                      {position ? (
                        <div className="mt-4 text-right">
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Na fila</p>
                          <p className="text-lg font-bold text-text-primary">#{position}</p>
                          <p className="text-[10px] text-text-muted">de {b.queue_size}</p>
                        </div>
                      ) : locked ? (
                        <PixelButton variant="outline" size="sm" className="mt-4" disabled>
                          <Lock className="w-3 h-3 mr-1.5" />
                          Só Pro
                        </PixelButton>
                      ) : (
                        <PixelButton
                          variant="primary"
                          size="sm"
                          className="mt-4"
                          onClick={() => apply(b)}
                          disabled={pendingId === b.id || !user}
                        >
                          {pendingId === b.id ? 'Enviando...' : 'Candidate-se agora'}
                        </PixelButton>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

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
                <span className="text-sm font-bold text-xp-600">
                  {formatCurrency(bounties.reduce((s, b) => s + Number(b.reward_amount || 0), 0))}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
