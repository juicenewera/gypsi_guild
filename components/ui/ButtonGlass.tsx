'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ButtonGlassProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  light?: boolean
}

const sizeClasses = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export default function ButtonGlass({
  children,
  href,
  onClick,
  className,
  size = 'md',
  light = false,
}: ButtonGlassProps) {
  const base = cn(
    'relative overflow-hidden inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300',
    'hover:scale-105 hover:border-white/25',
    light
      ? 'bg-black/5 border border-black/10 text-gipsy-dark backdrop-blur-[12px] [-webkit-backdrop-filter:blur(12px)]'
      : 'bg-white/5 border border-white/12 text-white backdrop-blur-[12px] [-webkit-backdrop-filter:blur(12px)]',
    sizeClasses[size],
    className
  )

  const inner = (
    <>
      <span
        className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent to-white/10 skew-x-12 transition-all duration-500 group-hover:left-full pointer-events-none"
        aria-hidden="true"
      />
      {children}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={cn(base, 'group')}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={cn(base, 'group')}>
      {inner}
    </button>
  )
}
