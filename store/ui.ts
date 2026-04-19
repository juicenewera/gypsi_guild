'use client'

import { create } from 'zustand'

const STORAGE_KEY = 'guild_sidebar_collapsed'

interface UIState {
  sidebarCollapsed: boolean
  hydrated: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void
  hydrate: () => void
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarCollapsed: false,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      set({ sidebarCollapsed: saved === '1', hydrated: true })
    } catch {
      set({ hydrated: true })
    }
  },

  toggleSidebar: () => {
    const next = !get().sidebarCollapsed
    set({ sidebarCollapsed: next })
    try { localStorage.setItem(STORAGE_KEY, next ? '1' : '0') } catch {}
  },

  setSidebarCollapsed: (v) => {
    set({ sidebarCollapsed: v })
    try { localStorage.setItem(STORAGE_KEY, v ? '1' : '0') } catch {}
  },
}))
