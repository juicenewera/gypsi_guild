'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { cn, timeAgo } from '@/lib/utils'
import { Bell, CheckCheck } from 'lucide-react'
import type { Notification } from '@/lib/pocketbase/types'

const typeIcons: Record<string, string> = {
  upvote: '👍',
  comment: '💬',
  badge: '🏅',
  xp: '⚡',
  mention: '📢',
}

export default function NotificationsPage() {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return
      try {
        const { getClient } = await import('@/lib/pocketbase/client')
        const pb = getClient()
        const result = await pb.collection('notifications').getFullList({
          filter: `user = "${user.id}"`,
          sort: '-created',
        })
        setNotifications(result as unknown as Notification[])
      } catch { /* skip */ }
      setLoading(false)
    }
    load()
  }, [user])

  async function markAllRead() {
    if (!user) return
    try {
      const { getClient } = await import('@/lib/pocketbase/client')
      const pb = getClient()
      const unread = notifications.filter(n => !n.is_read)
      await Promise.all(unread.map(n => pb.collection('notifications').update(n.id, { is_read: true })))
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch { /* skip */ }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-text-primary mb-1">
            Notificacoes
          </h1>
          <p className="text-sm text-text-secondary">Fique por dentro</p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <button
            className="btn btn-ghost inline-flex items-center gap-1.5 text-sm"
            onClick={markAllRead}
          >
            <CheckCheck className="w-4 h-4" />
            Marcar todas
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card h-16 animate-pulse bg-bg-elevated" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell className="w-8 h-8 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-muted">Nenhuma notificacao.</p>
        </div>
      ) : (
        <div className="space-y-2 stagger-children">
          {notifications.map(n => (
            <div
              key={n.id}
              className={cn(
                'card p-3',
                !n.is_read && 'border-l-4 border-l-mago-500'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">{typeIcons[n.type] || '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium',
                    n.is_read ? 'text-text-secondary' : 'text-text-primary'
                  )}>
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="text-xs text-text-muted mt-0.5">{n.body}</p>
                  )}
                </div>
                <span className="text-xs text-text-muted shrink-0">{timeAgo(n.created)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
