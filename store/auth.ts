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

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        const msg = error.message.includes('Invalid login credentials')
          ? 'Email ou senha incorretos.'
          : error.message.includes('Email not confirmed')
          ? 'Confirme seu email antes de entrar. Verifique sua caixa de entrada.'
          : error.message
        set({ isLoading: false, error: msg })
        throw new Error(msg)
      }

      if (!data.user) throw new Error('Login falhou.')

      // Busca o perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile) {
        // Perfil não existe ainda (trigger pode ter falhado) — tenta criar via update
        set({ isLoading: false, error: 'Perfil não encontrado. Tente registrar novamente.' })
        await supabase.auth.signOut()
        throw new Error('Perfil não encontrado.')
      }

      // Atualiza last_seen_at
      await supabase
        .from('profiles')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', data.user.id)

      set({
        user: profile as unknown as Profile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (err: any) {
      set({ isLoading: false })
      throw err
    }
  },

  register: async (
    email: string,
    password: string,
    username: string,
    path: 'ladino' | 'mago' | 'mercador'
  ) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()

      // signUp — passa tudo via user_metadata para o trigger no banco
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: username,
            path,
          },
        },
      })

      if (authError) {
        const msg = authError.message.includes('already registered')
          ? 'Este email já está cadastrado. Tente fazer login.'
          : authError.message.includes('Password should be')
          ? 'Senha fraca. Use pelo menos 8 caracteres.'
          : authError.message
        set({ isLoading: false, error: msg })
        throw new Error(msg)
      }

      if (!authData.user) {
        set({ isLoading: false, error: 'Falha ao criar usuário.' })
        throw new Error('Falha ao criar usuário.')
      }

      // Se email confirmation está ativado, não haverá sessão ainda.
      // Nesse caso, avisamos o usuário para confirmar o email.
      if (!authData.session) {
        set({
          isLoading: false,
          error: null,
          // Não autenticamos ainda — aguarda confirmação
        })
        throw new Error('CONFIRM_EMAIL')
      }

      // Com email confirmation OFF: session existe, trigger criou o perfil.
      // Aguarda o trigger propagar (pequeno delay)
      await new Promise((r) => setTimeout(r, 800))

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      // Se o trigger ainda não criou, faz upsert manual via service role não disponível
      // mas pelo menos loga o usuário
      set({
        user: (profile ?? { id: authData.user.id, username, path, level: 1, xp: 0 }) as unknown as Profile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (err: any) {
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
