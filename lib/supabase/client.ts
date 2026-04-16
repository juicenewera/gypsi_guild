'use client'

import { createBrowserClient } from '@supabase/ssr'

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
  }
  return supabaseClient
}

export function clearSupabaseAuth() {
  if (supabaseClient) {
    supabaseClient.auth.signOut()
    supabaseClient = null
  }
}
