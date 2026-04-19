'use client'

import Link from 'next/link'
import { Bell, Search, PanelLeftOpen } from 'lucide-react'
import { useNotificationsStore } from '@/store/notifications'
import { useUIStore } from '@/store/ui'
import { useState, useRef, useEffect } from 'react'

export function Header() {
  const { unreadCount } = useNotificationsStore()
  const { sidebarCollapsed, hydrated, hydrate, toggleSidebar } = useUIStore()
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => { hydrate() }, [hydrate])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-30 h-[var(--header-height)] bg-bg-primary border-b border-border-subtle flex items-center justify-between px-6">
      <div className="flex items-center gap-3 flex-1">
        {hydrated && sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="hidden lg:inline-flex p-2 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
            aria-label="Abrir menu"
            title="Abrir menu"
          >
            <PanelLeftOpen className="w-4 h-4" strokeWidth={2} />
          </button>
        )}

        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search resources... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 text-black placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
      </div>

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
      </div>
    </header>
  )
}
