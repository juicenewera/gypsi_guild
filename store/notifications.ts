'use client'

import { create } from 'zustand'

interface NotificationItem {
  id: string
  type: 'upvote' | 'comment' | 'badge' | 'xp' | 'mention'
  title: string
  body: string
  is_read: boolean
  created: string
}

interface NotificationsState {
  notifications: NotificationItem[]
  unreadCount: number
  setNotifications: (notifications: NotificationItem[]) => void
  markAsRead: (id: string) => void
  markAllRead: () => void
  addNotification: (notification: NotificationItem) => void
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => {
    set({
      notifications,
      unreadCount: notifications.filter(n => !n.is_read).length,
    })
  },

  markAsRead: (id) => {
    const { notifications } = get()
    const updated = notifications.map(n =>
      n.id === id ? { ...n, is_read: true } : n
    )
    set({
      notifications: updated,
      unreadCount: updated.filter(n => !n.is_read).length,
    })
  },

  markAllRead: () => {
    const { notifications } = get()
    set({
      notifications: notifications.map(n => ({ ...n, is_read: true })),
      unreadCount: 0,
    })
  },

  addNotification: (notification) => {
    const { notifications } = get()
    set({
      notifications: [notification, ...notifications],
      unreadCount: get().unreadCount + (notification.is_read ? 0 : 1),
    })
  },
}))
