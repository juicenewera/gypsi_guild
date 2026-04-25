'use client'

import { create } from 'zustand'

export type ToastKind = 'xp' | 'info' | 'success' | 'error'

export interface Toast {
  id: string
  kind: ToastKind
  title: string
  body?: string | null
  durationMs: number
}

interface ToastState {
  toasts: Toast[]
  push: (input: Omit<Toast, 'id' | 'durationMs'> & { durationMs?: number }) => string
  dismiss: (id: string) => void
  clear: () => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  push: input => {
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const duration = input.durationMs ?? 5000
    const toast: Toast = { id, kind: input.kind, title: input.title, body: input.body ?? null, durationMs: duration }
    set(s => ({ toasts: [...s.toasts, toast] }))
    if (typeof window !== 'undefined' && duration > 0) {
      window.setTimeout(() => get().dismiss(id), duration)
    }
    return id
  },

  dismiss: id => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

  clear: () => set({ toasts: [] }),
}))

export function toastXpGain(amount: number, label?: string) {
  if (!amount || amount <= 0) return
  useToastStore.getState().push({
    kind: 'xp',
    title: `+${amount} XP`,
    body: label ?? null,
  })
}

export function toastMessage(kind: ToastKind, title: string, body?: string) {
  useToastStore.getState().push({ kind, title, body: body ?? null })
}
