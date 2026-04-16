'use client'

import { create } from 'zustand'
import { getSupabaseClient, clearSupabaseAuth } from '@/lib/supabase/client'
import type { Profile } from '@/lib/pocketbase/types'

interface AuthState {
  user: Profile | null
  isAuthenticated: boolean
  isLoading: boolean
  initialized: boolean

  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string, path: 'ladino' | 'mago' | 'mercador') => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  initialized: false,

  initialize: async () => {
    try {
      const supabase = getSupabaseClient()

      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          set({
            user: profile as unknown as Profile,
            isAuthenticated: true,
            initialized: true,
          })
        } else {
          set({ initialized: true })
        }
      } else {
        set({ initialized: true })
      }
    } catch (error) {
      set({ initialized: true })
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Login failed')
      }

      const { profile } = await response.json()

      if (profile) {
        set({
          user: profile as unknown as Profile,
          isAuthenticated: true,
          isLoading: false,
        })
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (email: string, password: string, username: string, path: 'ladino' | 'mago' | 'mercador') => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, path }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Registration failed')
      }

      const { profile } = await response.json()

      if (profile) {
        set({
          user: profile as unknown as Profile,
          isAuthenticated: true,
          isLoading: false,
        })
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    const supabase = getSupabaseClient()
    supabase.auth.signOut()
    set({ user: null, isAuthenticated: false })
  },

  refreshUser: async () => {
    try {
      const supabase = getSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        set({ user: null, isAuthenticated: false })
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        set({ user: profile as unknown as Profile })
      }
    } catch {
      // silent fail
    }
  },
}))
