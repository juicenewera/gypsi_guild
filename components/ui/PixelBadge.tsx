import { cn } from '@/lib/utils'

interface PixelBadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'mago' | 'guerreiro' | 'ladino' | 'xp' | 'danger'
  size?: 'sm' | 'md'
  className?: string
}

const variantStyles = {
  default: 'bg-bg-elevated text-text-secondary border-black/10',
  mago: 'bg-text-primary text-white border-black',
  guerreiro: 'bg-black text-white border-black',
  ladino: 'bg-black text-white border-black',
  xp: 'bg-black text-white border-black',
  danger: 'bg-danger-600 text-white border-black',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[9px]',
  md: 'px-3 py-1 text-[11px]',
}

export function PixelBadge({
  children,
  variant = 'default',
  size = 'sm',
  className,
}: PixelBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-black uppercase tracking-[0.15em] border text-pixel',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  )
}
