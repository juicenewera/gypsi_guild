'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import {
  Compass,
  Newspaper,
  UsersRound,
  BookOpen,
  Trophy,
  Calendar,
  Swords,
  type LucideIcon,
} from 'lucide-react'
import { FeedbackWidget } from '@/components/feedback/FeedbackWidget'

type NavItem = { href: string; label: string; Icon: LucideIcon }

const mainNav: NavItem[] = [
  { href: '/dashboard',  label: 'Dashboard',  Icon: Compass },
  { href: '/feed',       label: 'Feed',       Icon: Newspaper },
  { href: '/matilha',    label: 'Matilha',    Icon: UsersRound },
  { href: '/cursos',     label: 'Cursos',     Icon: BookOpen },
  { href: '/ranking',    label: 'Ranking',    Icon: Trophy },
  { href: '/calendario', label: 'Calendário', Icon: Calendar },
  { href: '/missoes',    label: 'Missões',    Icon: Swords },
]

export function Sidebar() {
  const pathname  = usePathname()
  const { user } = useAuthStore()
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

      <nav className="flex-1 px-4 space-y-0.5 overflow-y-auto">
        {mainNav.map(({ href, label, Icon }) => {
          const isActive = href === '/dashboard'
            ? pathname === '/dashboard' || pathname === '/'
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors',
                isActive
                  ? 'bg-gray-100 text-black font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              )}
            >
              <Icon
                className={cn('w-[18px] h-[18px] flex-shrink-0', isActive ? 'stroke-[2.2]' : 'stroke-[1.6]')}
                strokeWidth={isActive ? 2.2 : 1.6}
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-4 pb-5 pt-3 border-t border-gray-100 space-y-3">
        <FeedbackWidget />
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
