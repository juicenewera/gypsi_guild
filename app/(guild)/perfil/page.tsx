'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { PathBadge } from '@/components/ui/PathBadge'
import { XPBar } from '@/components/ui/XPBar'
import { getAvatarUrl } from '@/lib/utils'
import { getLevelForXP, getLevelTitle } from '@/lib/xp'
import { fetchProfileByUsername, type PublicProfile } from '@/lib/supabase/queries'
import {
  Swords, BookOpen, Flame, Brain, Zap, ShoppingCart, Database, FileText,
  Megaphone, LogOut, MessageCircle, AtSign, Sparkles, ArrowLeft, Loader2, Gem,
  Settings, MapPin,
  type LucideIcon,
} from 'lucide-react'
import { EditProfileModal } from '@/components/profile/EditProfileModal'

const attributes = [
  { key: 'attr_ai',         label: 'AI',         icon: Brain,        colorClass: 'text-mago-500' },
  { key: 'attr_automacao',  label: 'Automacao',  icon: Zap,          colorClass: 'text-cyan-500' },
  { key: 'attr_vendas',     label: 'Vendas',     icon: ShoppingCart, colorClass: 'text-guerr-500' },
  { key: 'attr_database',   label: 'Database',   icon: Database,     colorClass: 'text-xp-500' },
  { key: 'attr_conteudo',   label: 'Conteudo',   icon: FileText,     colorClass: 'text-mago-300' },
  { key: 'attr_marketing',  label: 'Marketing',  icon: Megaphone,    colorClass: 'text-guerr-300' },
] as const

const PATH_ICON: Record<string, LucideIcon> = {
  mago:     Sparkles,
  ladino:   Swords,
  mercador: Gem,
}

type Profile = {
  id: string
  username: string
  display_name?: string | null
  name?: string | null
  bio?: string | null
  avatar_url?: string | null
  avatar?: string | null
  path?: 'mago' | 'ladino' | 'mercador' | null
  xp?: number
  is_pro?: boolean
  is_founder?: boolean
  whatsapp?: string | null
  instagram?: string | null
  location?: string | null
  streak_days?: number
  attr_ai?: number
  attr_automacao?: number
  attr_vendas?: number
  attr_database?: number
  attr_conteudo?: number
  attr_marketing?: number
  adventures_count?: number
  missions_count?: number
}

export default function ProfilePageWrapper() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto p-10 text-center text-text-muted">
        <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin" />
        Carregando perfil...
      </div>
    }>
      <ProfilePage />
    </Suspense>
  )
}

function ProfilePage() {
  const search = useSearchParams()
  const { user, logout } = useAuthStore()
  const u = search.get('u')

  const [other, setOther]     = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [editing, setEditing] = useState(false)

  const isOwn = !u || (user as any)?.username === u

  useEffect(() => {
    if (!u || isOwn) { setOther(null); return }
    setLoading(true); setError(null)
    fetchProfileByUsername(u).then(p => {
      if (!p) setError('Perfil não encontrado.')
      setOther(p)
      setLoading(false)
    })
  }, [u, isOwn])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center text-text-muted">
        <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin" />
        Carregando perfil...
      </div>
    )
  }

  if (u && !isOwn && error) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 p-6">
        <Link href="/aventureiros" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary">
          <ArrowLeft className="w-4 h-4" /> Voltar para Aventureiros
        </Link>
        <div className="card p-12 text-center">
          <p className="text-sm text-text-muted">{error}</p>
        </div>
      </div>
    )
  }

  const profile: Profile | null = isOwn
    ? (user as Profile | null)
    : (other as Profile | null)

  if (!profile) return null

  const xp = profile.xp || 0
  const level = getLevelForXP(xp)
  const title = getLevelTitle(level.level, profile.path || 'mago')
  const PathIcon = PATH_ICON[profile.path || 'mago'] ?? Sparkles
  const maxAttr = Math.max(
    ...attributes.map(a => (profile as Record<string, any>)[a.key] || 0),
    1
  )
  const displayName = profile.display_name || profile.name || profile.username

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {!isOwn && (
        <Link href="/aventureiros" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary">
          <ArrowLeft className="w-4 h-4" /> Voltar para Aventureiros
        </Link>
      )}

      <div className="flex items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-text-primary">
          {isOwn ? 'Meu Perfil' : `Perfil de ${displayName}`}
        </h1>
        {isOwn && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Settings className="w-3.5 h-3.5" strokeWidth={2.2} />
            Configurações
          </button>
        )}
      </div>

      {/* Character Sheet */}
      <div className={profile.path === 'ladino' ? 'card card-guerr p-6' : 'card border-mago-400 p-6'}>
        {/* Avatar + Nome */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative shrink-0">
            <img
              src={getAvatarUrl(profile.avatar_url ?? profile.avatar, profile.id)}
              alt={profile.username}
              className="w-16 h-16 rounded-full border-2 border-border-default object-cover"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
              <PathIcon className="w-3 h-3 text-gray-700" strokeWidth={2.2} />
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-text-primary">{displayName}</h2>
              {profile.is_pro && (
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-white">Pro</span>
              )}
              {profile.is_founder && (
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">Fundador</span>
              )}
            </div>
            <p className="text-sm text-text-muted">@{profile.username}</p>
            {profile.location && (
              <p className="text-xs text-text-muted mt-1 inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {profile.location}
              </p>
            )}
            <PathBadge path={profile.path || 'mago'} level={level.level} className="mt-2" />
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-text-primary">{title}</span>
            <span className="text-xs text-text-muted">Nivel {level.level}</span>
          </div>
          <XPBar current={level.xpCurrent} max={level.xpNext} size="lg" />
        </div>

        {/* Atributos */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
            Atributos
          </h3>
          <div className="space-y-2.5">
            {attributes.map(attr => {
              const val = (profile as Record<string, any>)[attr.key] || 0
              const pct = maxAttr > 0 ? (val / maxAttr) * 100 : 0
              return (
                <div key={attr.key} className="flex items-center gap-3">
                  <attr.icon className={`w-4 h-4 shrink-0 ${attr.colorClass}`} />
                  <span className="text-sm text-text-secondary w-24 shrink-0">{attr.label}</span>
                  <div className="flex-1 h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-mago-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-text-primary w-8 text-right">{val}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Swords,   label: 'Adventures', value: profile.adventures_count || 0 },
            { icon: BookOpen, label: 'Missoes',    value: profile.missions_count || 0 },
            { icon: Flame,    label: 'Streak',     value: `${profile.streak_days || 0}d` },
          ].map(stat => (
            <div key={stat.label} className="card p-3 text-center">
              <stat.icon className="w-4 h-4 mx-auto text-text-muted mb-1" />
              <p className="text-sm font-semibold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="card p-4">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">Bio</h3>
          <p className="text-sm text-text-secondary">{profile.bio}</p>
        </div>
      )}

      {/* Contato */}
      {(() => {
        const whatsapp  = (profile.whatsapp  || '').replace(/\D/g, '')
        const instagram = (profile.instagram || '').replace(/^@/, '')
        if (!whatsapp && !instagram) return null
        return (
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">Contato</h3>
            <div className="flex flex-wrap gap-2">
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn inline-flex items-center gap-2 text-sm border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
              {instagram && (
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn inline-flex items-center gap-2 text-sm border-pink-200 text-pink-700 hover:bg-pink-50"
                >
                  <AtSign className="w-4 h-4" />
                  {instagram}
                </a>
              )}
            </div>
          </div>
        )
      })()}

      {/* Logout — só no perfil próprio */}
      {isOwn && (
        <button
          onClick={logout}
          className="btn w-full inline-flex items-center justify-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Sair da Guilda
        </button>
      )}

      {isOwn && profile && (
        <EditProfileModal
          open={editing}
          onClose={() => setEditing(false)}
          initial={{
            id: profile.id,
            username: profile.username,
            display_name: profile.display_name,
            name: profile.name,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            avatar: profile.avatar,
            whatsapp: profile.whatsapp,
            instagram: profile.instagram,
            location: profile.location,
          }}
        />
      )}
    </div>
  )
}
