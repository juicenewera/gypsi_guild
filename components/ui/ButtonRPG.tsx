'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ButtonRPGProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

export default function ButtonRPG({
  children,
  href,
  onClick,
  className,
}: ButtonRPGProps) {
  const base = cn(
    'inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300',
    'bg-gradient-to-r from-gipsy-blue to-gipsy-purple',
    '[box-shadow:0_4px_15px_rgba(59,130,246,0.3)]',
    'hover:translate-y-[-2px] hover:[box-shadow:0_8px_25px_rgba(59,130,246,0.45)]',
    '[font-family:var(--font-pixel)] text-xs',
    className
  )

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={base}>
      {children}
    </button>
  )
}
