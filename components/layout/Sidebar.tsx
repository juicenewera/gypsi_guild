'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { cn, getAvatarUrl } from '@/lib/utils'
import { useEffect, useState } from 'react'

const mainNav = [
  { href: '/', label: 'Dashboard', emoji: '⚡' },
  { href: '/feed', label: 'Feed', emoji: '📝' },
  { href: '/cursos', label: 'Cursos', emoji: '🎓' },
  { href: '/ranking', label: 'Ranking', emoji: '🏆' },
  { href: '/missoes', label: 'Missões', emoji: '⚔️' },
  { href: '/chat', label: 'Chat', emoji: '💬' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !user) return null

  const initials = user.username?.slice(0, 2).toUpperCase() || 'CI'
  const role = user.is_founder ? 'Fundador' : 'Membro'

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-100 z-40 flex flex-col hidden lg:flex">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 py-6 border-b border-gray-100">
        <h1 className="font-bold text-xl text-black">Guild</h1>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Navigation */}
        <nav className="px-3 py-6 space-y-1">
          {mainNav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors',
                (pathname === item.href || (item.href === '/' && pathname === '/')) && 'bg-gray-100 text-gray-900 font-semibold'
              )}
            >
              <span className="text-base">{item.emoji}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom User Section */}
        <div className="mt-auto px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name || user.username}
              </p>
              <p className="text-xs text-gray-400">
                {role}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full mt-4 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  )
}
