export const XP_REWARDS = {
  post_discussion: 25,
  post_adventure: 75,
  post_validated: 150,
  comment: 10,
  upvote_received: 5,
  mission_complete: 50,
  daily_login: 5,
  streak_7: 50,
  streak_30: 200,
} as const

export const LEVELS: readonly { level: number; xp: number; title: string }[] = [
  { level: 1, xp: 0, title: 'Recruta' },
  { level: 2, xp: 100, title: 'Aprendiz' },
  { level: 3, xp: 300, title: 'Iniciado' },
  { level: 4, xp: 600, title: 'Aventureiro' },
  { level: 5, xp: 1000, title: 'Veterano' },
  { level: 6, xp: 1500, title: 'Especialista' },
  { level: 7, xp: 2200, title: 'Mestre' },
  { level: 8, xp: 3000, title: 'Arquimago / Campeão' },
  { level: 9, xp: 4500, title: 'Lendário' },
  { level: 10, xp: 7000, title: 'Guardião da Guilda' },
]

export function getLevelForXP(xp: number): { level: number; title: string; xpCurrent: number; xpNext: number } {
  let current = LEVELS[0]
  let next = LEVELS[1]

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) {
      current = LEVELS[i]
      next = LEVELS[i + 1] || LEVELS[i]
      break
    }
  }

  return {
    level: current.level,
    title: current.title,
    xpCurrent: xp - current.xp,
    xpNext: next.xp - current.xp,
  }
}

export function getLevelTitle(level: number, path: 'ladino' | 'mago' | 'mercador'): string {
  if (level === 8) {
    if (path === 'mago') return 'Arquimago'
    if (path === 'ladino') return 'Campeão'
    return 'Magnata'
  }
  const found = LEVELS.find(l => l.level === level)
  return found?.title || 'Recruta'
}

export function getXpToNextLevel(level: number): number {
  const current = LEVELS.find(l => l.level === level)
  const next = LEVELS.find(l => l.level === level + 1)
  if (!current || !next) return 0
  return next.xp - current.xp
}
