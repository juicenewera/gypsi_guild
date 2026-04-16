'use client'

import { create } from 'zustand'
import { getSupabaseClient, clearSupabaseAuth } from '@/lib/supabase/client'
import type { Profile } from '@/lib/pocketbase/types'

// ─────────────────────────────────────────────────────────────
// MOCK USER — usado enquanto o Supabase Auth está sendo ajustado
// Troque NEXT_PUBLIC_MOCK_AUTH=false quando o Supabase estiver ok
// ─────────────────────────────────────────────────────────────
const MOCK_AUTH = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true'

const MOCK_USER: Profile = {
  id: 'mock-user-001',
  username: 'juicenewera',
  name: 'juicenewera',
  // @ts-ignore — campos extras do Supabase
  display_name: 'juicenewera',
  email: 'sf.prod.sf3@gmail.com',
  path: 'mago',
  level: 7,
  xp: 2400,
  onboarding_completed_at: '2026-01-01T00:00:00Z',
  avatar: null,
  bio: 'Construtor do Guild.',
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
} as unknown as Profile

const MOCK_CREDENTIALS = {
  email: 'sf.prod.sf3@gmail.com',
  password: 'senha123',
}

// ─────────────────────────────────────────────────────────────

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

  // ── INITIALIZE ──────────────────────────────────────────────
  initialize: async () => {
    if (MOCK_AUTH) {
      // Verifica sessão mock no localStorage
      try {
        const saved = typeof window !== 'undefined'
          ? localStorage.getItem('mock_session')
          : null
        if (saved) {
          set({ user: MOCK_USER, isAuthenticated: true, initialized: true })
        } else {
          set({ initialized: true })
        }
      } catch {
        set({ initialized: true })
      }
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

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

  // ── LOGIN ────────────────────────────────────────────────────
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })

    if (MOCK_AUTH) {
      await new Promise(r => setTimeout(r, 600)) // simula latência
      if (
        email === MOCK_CREDENTIALS.email &&
        password === MOCK_CREDENTIALS.password
      ) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('mock_session', 'active')
        }
        set({ user: MOCK_USER, isAuthenticated: true, isLoading: false })
      } else {
        set({ isLoading: false, error: 'Email ou senha incorretos.' })
        throw new Error('Email ou senha incorretos.')
      }
      return
    }

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

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user!.id)
        .single()

      await supabase
        .from('profiles')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', data.user!.id)

      set({ user: profile as unknown as Profile, isAuthenticated: true, isLoading: false })
    } catch (err: any) {
      set({ isLoading: false })
      throw err
    }
  },

  // ── REGISTER ─────────────────────────────────────────────────
  register: async (email, password, username, path) => {
    set({ isLoading: true, error: null })

    if (MOCK_AUTH) {
      await new Promise(r => setTimeout(r, 800))
      if (typeof window !== 'undefined') {
        localStorage.setItem('mock_session', 'active')
      }
      set({
        user: { ...MOCK_USER, username, email, path } as unknown as Profile,
        isAuthenticated: true,
        isLoading: false,
      })
      return
    }

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
          : authError.message.includes('rate limit') || authError.message.includes('email rate')
          ? 'Limite de emails do Supabase atingido. Use o mock auth (NEXT_PUBLIC_MOCK_AUTH=true) por enquanto.'
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
    } catch (err: any) {
      set({ isLoading: false })
      throw err
    }
  },

  // ── LOGOUT ───────────────────────────────────────────────────
  logout: () => {
    if (MOCK_AUTH) {
      if (typeof window !== 'undefined') localStorage.removeItem('mock_session')
      set({ user: null, isAuthenticated: false, error: null })
      return
    }
    clearSupabaseAuth()
    set({ user: null, isAuthenticated: false, error: null })
  },

  // ── REFRESH USER ─────────────────────────────────────────────
  refreshUser: async () => {
    if (MOCK_AUTH) {
      set({ user: MOCK_USER })
      return
    }
    try {
      const supabase = getSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { set({ user: null, isAuthenticated: false }); return }
      const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', session.user.id).single()
      if (profile) set({ user: profile as unknown as Profile })
    } catch { /* silent */ }
  },
}))
