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
  onboarding_base: 100,
  onboarding_perfil: 50,
  onboarding_preferencias: 75,
  onboarding_negocio: 100,
} as const

// Três onboardings — ao completar, usuário é classificado automaticamente.
// A classificação é inferida das respostas, não selecionada manualmente.
export const ONBOARDINGS = {
  perfil: {
    slug: 'perfil',
    title: 'Perfil inicial',
    xp: XP_REWARDS.onboarding_perfil,
  },
  preferencias: {
    slug: 'preferencias',
    title: 'Preferências (filmes, jogos, etc.)',
    xp: XP_REWARDS.onboarding_preferencias,
  },
  negocio: {
    slug: 'negocio',
    title: 'Negócio (faturamento, pain points)',
    xp: XP_REWARDS.onboarding_negocio,
  },
} as const

export type OnboardingId = keyof typeof ONBOARDINGS

// Classificação automática baseada em respostas (mago/ladino/mercador).
// Cada entrada retorna pontos pra classe mais aderente; a classe vencedora ganha.
export function inferPathFromAnswers(answers: Record<string, unknown>): 'mago' | 'ladino' | 'mercador' {
  const score = { mago: 0, ladino: 0, mercador: 0 }

  const focus = String(answers.focus ?? '').toLowerCase()
  if (focus.includes('técnic') || focus.includes('ia') || focus.includes('código')) score.mago += 2
  if (focus.includes('venda') || focus.includes('tração')) score.ladino += 2
  if (focus.includes('negócio') || focus.includes('receita')) score.mercador += 2

  const revenue = String(answers.revenue_range ?? '')
  if (revenue.includes('100k+') || revenue.includes('500k+')) score.mercador += 2

  const pains = Array.isArray(answers.pain_points) ? (answers.pain_points as string[]) : []
  pains.forEach(p => {
    const s = p.toLowerCase()
    if (s.includes('prospec') || s.includes('lead')) score.ladino += 1
    if (s.includes('automa') || s.includes('integra')) score.mago += 1
    if (s.includes('faturamento') || s.includes('precif')) score.mercador += 1
  })

  const winner = (Object.entries(score).sort((a, b) => b[1] - a[1])[0][0]) as 'mago' | 'ladino' | 'mercador'
  return winner
}

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
