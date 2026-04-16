'use client'

import { cn } from '@/lib/utils'

interface XPBarProps {
  current: number
  max: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const sizeStyles = {
  xs: 'h-1.5',
  sm: 'h-2.5',
  md: 'h-4',
  lg: 'h-6',
}

export function XPBar({
  current,
  max,
  size = 'md',
  showLabel = false,
  className,
}: XPBarProps) {
  const percentage = Math.min(Math.max((current / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Evolution Progress</span>
          <span className="text-[10px] font-black text-text-primary uppercase tracking-[0.1em]">
            {current} / {max} XP
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-bg-surface border border-black/10 relative overflow-hidden',
          sizeStyles[size]
        )}
      >
        <div
          className="h-full bg-black transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
        {/* Subtle grid pattern overlay for that pixel/technical feel */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[length:4px_4px] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)]" />
      </div>
    </div>
  )
}
