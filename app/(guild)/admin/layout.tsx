'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Shield, BookOpen, Swords, Calendar, CheckCircle2, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'

const NAV = [
  { href: '/admin',           label: 'Visão geral', Icon: LayoutDashboard },
  { href: '/admin/cursos',    label: 'Cursos',      Icon: BookOpen },
  { href: '/admin/missoes',   label: 'Missões',     Icon: Swords },
  { href: '/admin/eventos',   label: 'Eventos',     Icon: Calendar },
  { href: '/admin/validacao', label: 'Validação',   Icon: CheckCircle2 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  const isStaff = !!(user as any)?.is_admin || !!(user as any)?.is_founder

  useEffect(() => {
    if (initialized && user && !isStaff) {
      router.replace('/feed')
    }
  }, [initialized, user, isStaff, router])

  if (!initialized || !user) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">Carregando...</div>
    )
  }

  if (!isStaff) {
    return (
      <div className="max-w-xl mx-auto p-10 text-center">
        <Shield className="w-10 h-10 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-serif text-black mb-2">Acesso restrito</h1>
        <p className="text-sm text-gray-500">
          Somente membros do Conselho da Guilda (admin/fundador) podem entrar aqui.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </span>
          <div>
            <h1 className="text-2xl font-serif text-black">Painel do Mestre</h1>
            <p className="text-xs text-gray-500">
              Você é {(user as any).is_admin ? 'Admin' : 'Fundador/Curador'} da Guilda.
            </p>
          </div>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2 mb-6">
        {NAV.map(({ href, label, Icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                active
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-500 border-gray-200 hover:text-black',
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div>{children}</div>
    </div>
  )
}
