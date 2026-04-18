import { cn } from '@/lib/utils'
import { getLevelTitle } from '@/lib/xp'
import { Sparkles, Swords, Gem, type LucideIcon } from 'lucide-react'

interface PathBadgeProps {
  path: 'ladino' | 'mago' | 'mercador'
  level: number
  className?: string
}

const pathBadgeClass: Record<string, string> = {
  mago: 'path-badge-mago',
  ladino: 'path-badge-guerr',
  mercador: 'path-badge-merc',
}

const pathIcon: Record<string, LucideIcon> = {
  mago: Sparkles,
  ladino: Swords,
  mercador: Gem,
}

export function PathBadge({ path, level, className }: PathBadgeProps) {
  const Icon = pathIcon[path] ?? Sparkles
  const title = getLevelTitle(level, path)

  return (
    <div
      className={cn(
        'path-badge',
        pathBadgeClass[path] || 'path-badge-mago',
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2} />
      <span>{title} Nível {level}</span>
    </div>
  )
}
