'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Swords, Trophy, Map, User, LogOut, Lock, Briefcase, PlusCircle } from 'lucide-react'
import { XPBar } from '@/components/ui/XPBar'
import { useAuthStore } from '@/store/auth'
import { cn, getAvatarUrl } from '@/lib/utils'
import { getLevelForXP } from '@/lib/xp'
import { useEffect, useState } from 'react'
import type { Category } from '@/lib/pocketbase/types'

const mainNav = [
  { href: '/feed', label: 'Overview', icon: Home },
  { href: '/adventures', label: 'Adventures', icon: Swords },
  { href: '/bounties', label: 'Bounties', icon: Briefcase },
  { href: '/ranking', label: 'Leaderboard', icon: Trophy },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function loadCategories() {
      try {
        const { getClient } = await import('@/lib/pocketbase/client')
        const pb = getClient()
        const result = await pb.collection('categories').getFullList<Category>({
          sort: 'sort_order',
        })
        setCategories(result as Category[])
      } catch { /* skip */ }
    }
    loadCategories()
  }, [])

  const levelInfo = user ? getLevelForXP(user.xp || 0) : null

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[var(--sidebar-width)] bg-bg-primary border-r border-border-default z-40 flex flex-col hidden lg:flex">
      {/* Brand */}
      <div className="h-[var(--header-height)] flex items-center px-6 border-b border-border-subtle">
        <Link href="/feed" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-text-primary rounded-sm flex items-center justify-center text-[10px] text-white">G</div>
          <span className="font-bold text-sm tracking-tight uppercase">Guild</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        {/* User context */}
        {user && (
          <div className="mb-8 px-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={getAvatarUrl(user.avatar, user.id)}
                alt={user.username}
                className="w-8 h-8 rounded-full border border-border-subtle"
              />
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-text-primary truncate uppercase tracking-tight">
                  {user.name || user.username}
                </p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Level {levelInfo?.level || 1} · {user.path || 'Builder'}
                </p>
              </div>
            </div>
            {levelInfo && (
              <div className="px-0.5">
                <XPBar current={levelInfo.xpCurrent} max={levelInfo.xpNext} size="xs" showLabel={false} />
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-6">
          <div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] px-2 mb-3 block">Menu</span>
            <div className="space-y-1">
              {mainNav.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'nav-item-donos',
                    pathname === item.href && 'active'
                  )}
                >
                  <item.icon className="w-4 h-4 opacity-70" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] px-2 mb-3 block">Library</span>
            <div className="space-y-1">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/categoria/${cat.slug}`}
                  className={cn(
                    'nav-item-donos',
                    pathname === `/categoria/${cat.slug}` && 'active'
                  )}
                >
                  <span className="text-sm opacity-70">{cat.icon || '•'}</span>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto pt-6 space-y-1 border-t border-border-subtle">
          <Link
            href="/post/new"
            className="nav-item-donos text-text-primary font-bold"
          >
            <PlusCircle className="w-4 h-4" />
            New Post
          </Link>
          <Link
            href="/perfil"
            className="nav-item-donos"
          >
            <User className="w-4 h-4 opacity-70" />
            Profile
          </Link>
          <button
            onClick={logout}
            className="nav-item-donos w-full text-danger-600 hover:bg-danger-50"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}
