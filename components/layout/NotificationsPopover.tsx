'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Bell, CheckCheck, ThumbsUp, MessageCircle, Award, Zap, Megaphone,
  type LucideIcon,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useNotificationsStore } from '@/store/notifications'
import { cn, timeAgo } from '@/lib/utils'
import { fetchNotifications, markNotificationsRead } from '@/lib/supabase/queries'
import { getSupabaseClient } from '@/lib/supabase/client'

const TYPE_ICONS: Record<string, LucideIcon> = {
  upvote:  ThumbsUp,
  comment: MessageCircle,
  badge:   Award,
  xp:      Zap,
  mention: Megaphone,
  system:  Bell,
}

const TYPE_COLORS: Record<string, string> = {
  upvote:  'bg-rose-50 text-rose-600 border-rose-100',
  comment: 'bg-blue-50 text-blue-600 border-blue-100',
  badge:   'bg-amber-50 text-amber-600 border-amber-100',
  xp:      'bg-emerald-50 text-emerald-700 border-emerald-100',
  mention: 'bg-violet-50 text-violet-600 border-violet-100',
  system:  'bg-gray-50 text-gray-600 border-gray-100',
}

export function NotificationsPopover() {
  const user = useAuthStore(s => s.user)
  const { notifications, unreadCount, setNotifications, markAllRead } = useNotificationsStore()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const buttonRef  = useRef<HTMLButtonElement | null>(null)

  // Primeira carga + refetch sempre que o user muda
  useEffect(() => {
    if (!user) return
    let cancelled = false
    setLoading(true)
    fetchNotifications(user.id, 30).then(rows => {
      if (cancelled) return
      setNotifications(rows as any)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [user?.id, setNotifications])

  // Realtime: assina INSERTs na sua própria linha de notificações
  useEffect(() => {
    if (!user) return
    const sb = getSupabaseClient()
    const channel = sb
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        async () => {
          const rows = await fetchNotifications(user.id, 30)
          setNotifications(rows as any)
        },
      )
      .subscribe()
    return () => { sb.removeChannel(channel) }
  }, [user?.id, setNotifications])

  // Fechar no outside click + ESC
  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node
      if (popoverRef.current?.contains(t)) return
      if (buttonRef.current?.contains(t))  return
      setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function handleMarkAll() {
    if (!user) return
    markAllRead() // atualização otimista
    try {
      await markNotificationsRead(user.id)
    } catch {
      // rollback suave: refetch
      const rows = await fetchNotifications(user.id, 30)
      setNotifications(rows as any)
    }
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(v => !v)}
        className="relative p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-gray-100"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={unreadCount > 0 ? `${unreadCount} notificações não lidas` : 'Notificações'}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 text-[9px] font-bold bg-black text-white rounded-full border-2 border-bg-primary flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={popoverRef}
          role="menu"
          className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-2xl shadow-xl z-[60] overflow-hidden animate-[guPopIn_.18s_ease-out]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-bold text-black">Notificações</p>
              <p className="text-[11px] text-gray-500">
                {unreadCount > 0 ? `${unreadCount} não lida${unreadCount === 1 ? '' : 's'}` : 'Tudo em dia'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-black px-2.5 py-1 rounded-full border border-gray-200 hover:border-black transition-colors"
              >
                <CheckCheck className="w-3 h-3" />
                Marcar todas
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[440px] overflow-y-auto overscroll-contain">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <div className="mx-auto w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                  <Bell className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Nenhuma notificação ainda.</p>
                <p className="text-xs text-gray-400 mt-1">Interações com seus posts aparecem aqui.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {notifications.slice(0, 15).map(n => {
                  const Icon = TYPE_ICONS[n.type] ?? Bell
                  const pill = TYPE_COLORS[n.type] ?? TYPE_COLORS.system
                  return (
                    <li key={n.id}>
                      <button
                        onClick={() => {
                          // fechamento otimista; markAll cobre o resto
                          setOpen(false)
                        }}
                        className={cn(
                          'w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50',
                          !n.is_read && 'bg-blue-50/40',
                        )}
                      >
                        <span className={cn('mt-0.5 w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0', pill)}>
                          <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm leading-tight', n.is_read ? 'text-gray-600' : 'text-black font-semibold')}>
                            {n.title}
                          </p>
                          {n.body && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                          )}
                          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
                            {timeAgo(n.created)}
                          </p>
                        </div>
                        {!n.is_read && (
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" aria-hidden />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
            <Link
              href="/notificacoes"
              onClick={() => setOpen(false)}
              className="block text-center text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 hover:text-black transition-colors"
            >
              Ver histórico completo →
            </Link>
          </div>

          <style>{`
            @keyframes guPopIn {
              from { opacity: 0; transform: translateY(-6px) scale(.98); }
              to   { opacity: 1; transform: translateY(0)    scale(1);   }
            }
          `}</style>
        </div>
      )}
    </div>
  )
}
