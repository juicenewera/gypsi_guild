'use client'

import { useAuthStore } from '@/store/auth'
import { PathBadge } from '@/components/ui/PathBadge'
import { XPBar } from '@/components/ui/XPBar'
import { getAvatarUrl } from '@/lib/utils'
import { getLevelForXP, getLevelTitle } from '@/lib/xp'
import { Swords, BookOpen, Flame, Brain, Zap, ShoppingCart, Database, FileText, Megaphone, LogOut } from 'lucide-react'

const attributes = [
  { key: 'attr_ai', label: 'AI', icon: Brain, colorClass: 'text-mago-500' },
  { key: 'attr_automacao', label: 'Automacao', icon: Zap, colorClass: 'text-cyan-500' },
  { key: 'attr_vendas', label: 'Vendas', icon: ShoppingCart, colorClass: 'text-guerr-500' },
  { key: 'attr_database', label: 'Database', icon: Database, colorClass: 'text-xp-500' },
  { key: 'attr_conteudo', label: 'Conteudo', icon: FileText, colorClass: 'text-mago-300' },
  { key: 'attr_marketing', label: 'Marketing', icon: Megaphone, colorClass: 'text-guerr-300' },
] as const

export default function ProfilePage() {
  const { user, logout } = useAuthStore()

  if (!user) return null

  const level = getLevelForXP(user.xp || 0)
  const title = getLevelTitle(level.level, user.path || 'mago')
  const isLadino = user.path === 'ladino'
  const maxAttr = Math.max(
    ...attributes.map(a => (user as unknown as Record<string, number>)[a.key] || 0),
    1
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-text-primary">
        Meu Perfil
      </h1>

      {/* Character Sheet */}
      <div className={isLadino ? 'card card-guerr p-6' : 'card border-mago-400 p-6'}>
        {/* Avatar + Nome */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative shrink-0">
            <img
              src={getAvatarUrl(user.avatar, user.id)}
              alt={user.username}
              className="w-16 h-16 rounded-full border-2 border-border-default object-cover"
            />
            <span className="absolute -bottom-1 -right-1 text-lg">
              {isLadino ? '⚔️' : '🔮'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-text-primary">{user.name || user.username}</h2>
            <p className="text-sm text-text-muted">@{user.username}</p>
            <PathBadge path={user.path || 'mago'} level={level.level} className="mt-2" />
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
              const val = (user as unknown as Record<string, number>)[attr.key] || 0
              const pct = maxAttr > 0 ? (val / maxAttr) * 100 : 0
              return (
                <div key={attr.key} className="flex items-center gap-3">
                  <attr.icon className={`w-4 h-4 shrink-0 ${attr.colorClass}`} />
                  <span className="text-sm text-text-secondary w-24 shrink-0">{attr.label}</span>
                  <div className="flex-1 h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full bg-mago-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
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
            { icon: Swords, label: 'Adventures', value: user.adventures_count || 0 },
            { icon: BookOpen, label: 'Missoes', value: user.missions_count || 0 },
            { icon: Flame, label: 'Streak', value: `${user.streak_days || 0}d` },
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
      {user.bio && (
        <div className="card p-4">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">Bio</h3>
          <p className="text-sm text-text-secondary">{user.bio}</p>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={logout}
        className="btn w-full inline-flex items-center justify-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
      >
        <LogOut className="w-4 h-4" />
        Sair da Guilda
      </button>
    </div>
  )
}
