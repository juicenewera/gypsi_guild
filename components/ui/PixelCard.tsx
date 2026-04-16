import { cn } from '@/lib/utils'

interface PixelCardProps {
  variant?: 'default' | 'mago' | 'guerreiro' | 'xp'
  className?: string
  children: React.ReactNode
  hover?: boolean
  onClick?: () => void
}

const variantClasses = {
  default: 'card',
  mago: 'card card-mago',
  guerreiro: 'card card-guerr',
  xp: 'card card-xp',
}

export function PixelCard({
  variant = 'default',
  className,
  children,
  hover = false,
  onClick,
}: PixelCardProps) {
  return (
    <div
      className={cn(
        variantClasses[variant],
        'p-4',
        hover && 'card-hover cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick() } : undefined}
    >
      {children}
    </div>
  )
}
