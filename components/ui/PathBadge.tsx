import { cn, getPathIcon } from '@/lib/utils'
import { getLevelTitle } from '@/lib/xp'

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

export function PathBadge({ path, level, className }: PathBadgeProps) {
  const icon = getPathIcon(path)
  const title = getLevelTitle(level, path)

  return (
    <div
      className={cn(
        'path-badge',
        pathBadgeClass[path] || 'path-badge-mago',
        className
      )}
    >
      <span>{icon}</span>
      <span>{title} Nível {level}</span>
    </div>
  )
}
