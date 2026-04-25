'use client'

import { create } from 'zustand'
import { getSupabaseClient, clearSupabaseAuth } from '@/lib/supabase/client'
import type { Profile } from '@/lib/pocketbase/types'

interface AuthState {
  user: Profile | null
  isAuthenticated: boolean
  isLoading: boolean
  initialized: boolean
  error: string | null

  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string, path: 'ladino' | 'mago' | 'mercador') => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  initialized: false,
  error: null,

  clearError: () => set({ error: null }),

  initialize: async () => {
    try {
      const supabase = getSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        let { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()

        if (!profile) {
          await supabase.from('profiles').insert({
            id: session.user.id,
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'membro',
            path: session.user.user_metadata?.path || 'mago',
            level: 1,
            xp: 0
          })
          const { data: fixedProfile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
          profile = fixedProfile
        }

        set({
          user: profile as unknown as Profile ?? null,
          isAuthenticated: !!profile,
          initialized: true,
        })
      } else {
        set({ initialized: true })
      }
    } catch {
      set({ initialized: true })
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null })

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        const msg = error.message.includes('Invalid login credentials')
          ? 'Email ou senha incorretos.'
          : error.message.includes('Email not confirmed')
          ? 'Confirme seu email antes de entrar.'
          : error.message
        set({ isLoading: false, error: msg })
        throw new Error(msg)
      }

      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user!.id)
        .maybeSingle()

      if (!profile) {
        await supabase.from('profiles').insert({
          id: data.user!.id,
          username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'membro',
          path: data.user.user_metadata?.path || 'mago',
          level: 1,
          xp: 0
        })
        const { data: fixedProfile } = await supabase.from('profiles').select('*').eq('id', data.user!.id).maybeSingle()
        profile = fixedProfile
      }

      await supabase
        .from('profiles')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', data.user!.id)

      set({ user: profile as unknown as Profile, isAuthenticated: true, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  register: async (email, password, username, path) => {
    set({ isLoading: true, error: null })

    try {
      const supabase = getSupabaseClient()
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username, display_name: username, path } },
      })

      if (authError) {
        const msg = authError.message.includes('already registered')
          ? 'Este email já está cadastrado. Tente fazer login.'
          : authError.message
        set({ isLoading: false, error: msg })
        throw new Error(msg)
      }

      if (!authData.session) {
        set({ isLoading: false })
        throw new Error('CONFIRM_EMAIL')
      }

      await new Promise(r => setTimeout(r, 800))
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user!.id)
        .single()

      set({
        user: (profile ?? { id: authData.user!.id, username, path, level: 1, xp: 0 }) as unknown as Profile,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  logout: () => {
    clearSupabaseAuth()
    set({ user: null, isAuthenticated: false, error: null })
  },

  refreshUser: async () => {
    try {
      const supabase = getSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { set({ user: null, isAuthenticated: false }); return }
      let { data: profile } = await supabase
        .from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      if (!profile) {
        await supabase.from('profiles').insert({
          id: session.user.id,
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'membro',
          path: session.user.user_metadata?.path || 'mago',
          level: 1,
          xp: 0
        })
        const { data: fixedProfile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
        profile = fixedProfile
      }
      if (profile) set({ user: profile as unknown as Profile })
    } catch { /* silent */ }
  },
}))
