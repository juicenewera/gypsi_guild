'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

const mainNav = [
  { href: '/dashboard', label: 'Dashboard', emoji: '⚡' },
  { href: '/feed',    label: 'Feed',      emoji: '📋' },
  { href: '/cursos',  label: 'Cursos',    emoji: '🎓' },
  { href: '/ranking', label: 'Ranking',   emoji: '🏆' },
  { href: '/calendario', label: 'Calendário', emoji: '📅' },
  { href: '/missoes', label: 'Missões',   emoji: '⚔️' },
  { href: '/chat',    label: 'Chat',      emoji: '💬' },
]

export function Sidebar() {
  const pathname  = usePathname()
  const { user, logout } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted || !user) return null

  const username = (user as any).username || (user as any).name || 'Usuário'
  const initials = username.slice(0, 2).toUpperCase()
  const role     = (user as any).is_founder ? 'Fundador' : (user as any).path
    ? (user as any).path.charAt(0).toUpperCase() + (user as any).path.slice(1)
    : 'Membro'

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-100 z-40 flex-col hidden lg:flex">

      <div className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-serif font-bold text-black tracking-tight">Guild</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-0.5 overflow-y-auto">
        {mainNav.map(item => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard' || pathname === '/'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors',
                isActive
                  ? 'bg-gray-100 text-black font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              )}
            >
              <span className="text-lg leading-none">{item.emoji}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom — User Section */}
      <div className="px-4 pb-5 pt-3 border-t border-gray-100">
        <Link
          href="/perfil"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
        >
          <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-black truncate">{username}</p>
            <p className="text-xs text-gray-400 capitalize">{role}</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
