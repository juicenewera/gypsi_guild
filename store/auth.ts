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
    } catch {
      set({ initialized: true })
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const supabase = getSupabaseClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      if (!data.user) throw new Error('Login failed')

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      // Update last_seen_at
      if (profile) {
        await supabase
          .from('profiles')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', data.user.id)
      }

      set({
        user: profile as unknown as Profile,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (email: string, password: string, username: string, path: 'ladino' | 'mago' | 'mercador') => {
    set({ isLoading: true })
    try {
      const supabase = getSupabaseClient()

      // Sign up — email confirmation disabled by default on Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: username,
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Registration failed')

      // Create profile with path
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username,
          display_name: username,
          email,
          name: username,
          path,
          level: 1,
          xp: 0,
        })
        .select()
        .single()

      if (profileError) throw profileError

      // Sign in immediately after registration
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInData.user && profile) {
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
    clearSupabaseAuth()
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
