'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Swords, Trophy, Plus, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/feed', label: 'Feed', icon: Home },
  { href: '/adventures', label: 'Adventures', icon: Swords },
  { href: '/post/new', label: 'Novo', icon: Plus, highlight: true },
  { href: '/ranking', label: 'Ranking', icon: Trophy },
  { href: '/perfil', label: 'Perfil', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-bg-primary/90 backdrop-blur-md border-t border-border-default">
      <ul className="flex items-center justify-around h-16">
        {navItems.map(item => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

          if (item.highlight) {
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-center w-11 h-11 bg-cta rounded-full -mt-4 shadow-lg transition-transform active:scale-95"
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5 text-white" />
                </Link>
              </li>
            )
          }

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 transition-colors',
                  isActive
                    ? 'text-text-primary'
                    : 'text-text-muted'
                )}
                aria-label={item.label}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">
                  {item.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
