'use client'

import { cn } from '@/lib/utils'
import { Loader2, ChevronRight } from 'lucide-react'

type ButtonVariant = 'primary' | 'mago' | 'guerreiro' | 'ghost' | 'danger' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  showArrow?: boolean
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn btn-primary',
  mago: 'btn btn-mago',
  guerreiro: 'btn btn-guerr',
  ghost: 'btn btn-ghost',
  danger: 'btn btn-danger',
  outline: 'btn btn-outline',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
}

export function PixelButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  showArrow = false,
  disabled,
  className,
  children,
  ...props
}: PixelButtonProps) {
  return (
    <button
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
      {showArrow && <ChevronRight className="w-4 h-4" />}
    </button>
  )
}
