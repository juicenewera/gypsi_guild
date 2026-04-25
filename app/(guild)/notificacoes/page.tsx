'use client'

import { useEffect, useState } from 'react'
import { Bell, CheckCheck, ThumbsUp, MessageCircle, Award, Zap, Megaphone, type LucideIcon } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { cn, timeAgo } from '@/lib/utils'
import { fetchNotifications, markNotificationsRead, type Notification } from '@/lib/supabase/queries'

const TYPE_ICONS: Record<string, LucideIcon> = {
  upvote:  ThumbsUp,
  comment: MessageCircle,
  badge:   Award,
  xp:      Zap,
  mention: Megaphone,
  system:  Bell,
}

export default function NotificationsPage() {
  const { user } = useAuthStore()
  const [items, setItems] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetchNotifications(user.id, 50).then(ns => {
      setItems(ns)
      setLoading(false)
    })
  }, [user?.id])

  async function markAllRead() {
    if (!user) return
    await markNotificationsRead(user.id)
    setItems(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const hasUnread = items.some(n => !n.is_read)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-black">Notificações</h1>
          <p className="text-sm text-gray-500">Avisos do bando.</p>
        </div>
        {hasUnread && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black px-3 py-1.5 rounded-full border border-gray-200"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Marcar todas
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" strokeWidth={1.6} />
          <p className="text-sm text-gray-500">Nenhuma notificação.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(n => {
            const Icon = TYPE_ICONS[n.type] ?? Bell
            return (
              <div
                key={n.id}
                className={cn(
                  'bg-white border rounded-2xl p-3 transition-colors',
                  n.is_read ? 'border-gray-100' : 'border-l-4 border-l-black border-gray-100'
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-gray-600" strokeWidth={2} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm font-medium',
                      n.is_read ? 'text-gray-500' : 'text-black'
                    )}>
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="text-xs text-gray-400 mt-0.5">{n.body}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{timeAgo(n.created)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
