'use client'

import { useToastStore, type Toast } from '@/store/toast'
import { Sparkles, CheckCircle2, Info, X, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICONS = {
  xp:      Sparkles,
  success: CheckCircle2,
  info:    Info,
  error:   AlertTriangle,
} as const

const STYLES: Record<Toast['kind'], string> = {
  xp:      'bg-black text-white border-black',
  success: 'bg-emerald-600 text-white border-emerald-700',
  info:    'bg-white text-black border-gray-200',
  error:   'bg-red-600 text-white border-red-700',
}

export function Toaster() {
  const toasts  = useToastStore(s => s.toasts)
  const dismiss = useToastStore(s => s.dismiss)

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex flex-col gap-3 w-[calc(100vw-2.5rem)] max-w-sm">
      {toasts.map(t => {
        const Icon = ICONS[t.kind]
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto relative flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg animate-[guToastIn_.25s_cubic-bezier(.4,0,.2,1)]',
              STYLES[t.kind],
            )}
          >
            <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', t.kind === 'xp' && 'text-amber-300')} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight">{t.title}</p>
              {t.body && <p className={cn('text-xs mt-1 leading-snug', t.kind === 'info' ? 'text-gray-600' : 'text-white/85')}>{t.body}</p>}
            </div>
            <button
              aria-label="Fechar"
              onClick={() => dismiss(t.id)}
              className={cn(
                'flex-shrink-0 rounded-full p-1 transition-colors',
                t.kind === 'info' ? 'hover:bg-gray-100 text-gray-400 hover:text-black' : 'hover:bg-white/15 text-white/70 hover:text-white',
              )}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}

      <style>{`
        @keyframes guToastIn {
          from { opacity: 0; transform: translateY(10px) scale(.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
      `}</style>
    </div>
  )
}
