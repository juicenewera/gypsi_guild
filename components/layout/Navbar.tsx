'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import ButtonGlass from '@/components/ui/ButtonGlass'

const NAV_LINKS = [
  { label: 'Comunidade', href: '/guild' },
  { label: 'Cursos', href: '/cursos' },
  { label: 'Agentes', href: '/agentes' },
  { label: 'Oportunidades', href: '/oportunidades' },
]

export default function Navbar() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const trigger = document.getElementById('theme-trigger')
    if (!trigger) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setTheme(entry.isIntersecting ? 'light' : 'dark')
      },
      { threshold: 0.1 }
    )

    observerRef.current.observe(trigger)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  const isDark = theme === 'dark'

  return (
    <header
      data-theme={theme}
      className={cn(
        'fixed top-0 w-full z-50 h-[72px] flex items-center justify-between px-6 md:px-10 transition-colors duration-300',
        isDark
          ? 'text-white bg-transparent'
          : 'text-gipsy-dark bg-white/90 backdrop-blur-[12px] [-webkit-backdrop-filter:blur(12px)] border-b border-black/8'
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        className="[font-family:var(--font-pixel)] text-sm tracking-wider shrink-0"
      >
        GIPSY VIP
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              'text-sm font-medium transition-colors duration-200 hover:opacity-100',
              isDark ? 'text-white/70 hover:text-white' : 'text-gipsy-dark/60 hover:text-gipsy-dark'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Desktop CTA */}
      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/login"
          className={cn(
            'text-sm font-medium transition-colors duration-200',
            isDark ? 'text-white/70 hover:text-white' : 'text-gipsy-dark/60 hover:text-gipsy-dark'
          )}
        >
          Login
        </Link>
        <ButtonGlass href="/register" size="sm" light={!isDark}>
          Entrar na Guild
        </ButtonGlass>
      </div>

      {/* Mobile Hamburger */}
      <button
        type="button"
        aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setMenuOpen((v) => !v)}
        className="md:hidden flex flex-col gap-1.5 p-2"
      >
        <span
          className={cn(
            'block h-0.5 w-6 transition-all duration-300',
            isDark ? 'bg-white' : 'bg-gipsy-dark',
            menuOpen && 'rotate-45 translate-y-2'
          )}
        />
        <span
          className={cn(
            'block h-0.5 w-6 transition-all duration-300',
            isDark ? 'bg-white' : 'bg-gipsy-dark',
            menuOpen && 'opacity-0'
          )}
        />
        <span
          className={cn(
            'block h-0.5 w-6 transition-all duration-300',
            isDark ? 'bg-white' : 'bg-gipsy-dark',
            menuOpen && '-rotate-45 -translate-y-2'
          )}
        />
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className={cn(
            'absolute top-[72px] left-0 right-0 flex flex-col gap-4 px-6 py-6 md:hidden',
            isDark ? 'bg-gipsy-dark border-t border-white/10' : 'bg-white border-t border-black/8'
          )}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'text-base font-medium transition-colors',
                isDark ? 'text-white/70 hover:text-white' : 'text-gipsy-dark/60 hover:text-gipsy-dark'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            <Link href="/login" className={cn('text-sm font-medium', isDark ? 'text-white/70' : 'text-gipsy-dark/60')}>
              Login
            </Link>
            <ButtonGlass href="/register" size="md" light={!isDark}>
              Entrar na Guild
            </ButtonGlass>
          </div>
        </div>
      )}
    </header>
  )
}
