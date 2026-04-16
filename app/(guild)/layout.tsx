'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { useAuthStore } from '@/store/auth'

export default function GuildLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initialized, initialize, user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    initialize()
  }, [initialize])

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.push('/login')
    }
  }, [initialized, isAuthenticated, router])

  useEffect(() => {
    if (initialized && isAuthenticated && user && !user.onboarding_completed_at && pathname !== '/onboarding') {
      router.push('/onboarding')
    }
  }, [initialized, isAuthenticated, user, pathname, router])

  if (!mounted || !initialized) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl text-text-primary mb-4">
            Guild
          </h1>
          <div className="flex items-center gap-2 justify-center">
            <div className="w-2 h-2 rounded-full bg-mago-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-guerr-500 animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-xp-500 animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-sm text-text-muted mt-3">
            Carregando...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-bg-surface">
      <Sidebar />
      <div className="lg:ml-[var(--sidebar-width)]">
        <Header />
        <main className="p-4 lg:p-6 pb-20 lg:pb-6 min-h-[calc(100vh-var(--header-height))]">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
