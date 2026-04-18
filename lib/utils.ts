import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export function timeAgo(date: string): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: ptBR,
  })
}

export function formatCurrency(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trimEnd() + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getAvatarUrl(avatar: string | null | undefined, userId: string): string {
  // Supabase guarda a URL completa em avatar_url. Fallback é dicebear pixel-art.
  if (avatar && /^https?:\/\//.test(avatar)) return avatar
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${userId}&backgroundColor=1a1a35`
}

export function getPathColor(path: 'ladino' | 'mago' | 'mercador'): string {
  if (path === 'mago') return 'mago'
  if (path === 'ladino') return 'guerr'
  return 'merc'
}
