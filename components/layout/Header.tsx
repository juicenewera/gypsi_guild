'use client'

import Link from 'next/link'
import { Bell, Search, Plus, Menu } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useNotificationsStore } from '@/store/notifications'
import { getAvatarUrl } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

export function Header() {
  const { user } = useAuthStore()
  const { unreadCount } = useNotificationsStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-30 h-[var(--header-height)] bg-bg-primary border-b border-border-subtle flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search resources... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-donos pl-9 h-9 text-[13px] bg-bg-surface border-none focus:bg-bg-primary focus:ring-1 focus:ring-text-primary transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link
          href="/notificacoes"
          className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-text-primary rounded-full border-2 border-bg-primary"></span>
          )}
        </Link>

        <div className="h-4 w-[1px] bg-border-subtle mx-1"></div>

        {user && (
          <Link href="/perfil" className="flex items-center gap-3 pl-2 group">
            <div className="text-right hidden md:block">
              <p className="text-[11px] font-bold text-text-primary leading-none uppercase tracking-tight">{user.name || user.username}</p>
              <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mt-1">View Profile</p>
            </div>
            <img
              src={getAvatarUrl(user.avatar, user.id)}
              alt={user.username}
              className="w-7 h-7 rounded-full border border-border-subtle group-hover:border-text-primary transition-colors"
            />
          </Link>
        )}
      </div>
    </header>
  )
}
