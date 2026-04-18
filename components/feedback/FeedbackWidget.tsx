'use client'

import { useState } from 'react'
import { Star, MessageSquarePlus, X, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { submitFeedback } from '@/lib/supabase/queries'

export function FeedbackWidget() {
  const [open, setOpen]         = useState(false)
  const [rating, setRating]     = useState(0)
  const [hover, setHover]       = useState(0)
  const [message, setMessage]   = useState('')
  const [sending, setSending]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [sent, setSent]         = useState(false)

  function reset() {
    setRating(0); setHover(0); setMessage('')
    setError(null); setSent(false)
  }
  function close() { setOpen(false); setTimeout(reset, 200) }

  async function send() {
    if (rating < 1 || message.trim().length < 3) {
      setError('Dê uma nota e escreva ao menos algumas palavras.')
      return
    }
    setError(null); setSending(true)
    try {
      await submitFeedback({ rating, message: message.trim() })
      setSent(true)
      setTimeout(close, 1600)
    } catch (e: any) {
      setError(e?.message || 'Falha ao enviar. Tente novamente.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm"
      >
        <MessageSquarePlus className="w-3.5 h-3.5" strokeWidth={2.2} />
        Avaliar & sugerir
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={close}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between px-5 pt-5 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-black">Sua avaliação</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Como está a plataforma? O que você gostaria de ver por aqui?
                </p>
              </div>
              <button
                onClick={close}
                className="text-gray-400 hover:text-black p-1 -mr-1 -mt-1"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            <div className="px-5 pb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Nota geral
              </p>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(n => {
                  const filled = (hover || rating) >= n
                  return (
                    <button
                      key={n}
                      type="button"
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(n)}
                      className="p-1 transition-transform hover:scale-110"
                      aria-label={`${n} estrela${n > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={cn(
                          'w-7 h-7 transition-colors',
                          filled ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                        )}
                        strokeWidth={1.6}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="px-5 pb-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Ideias, sugestões ou melhorias
              </p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="Qual função você gostaria de ver? O que pode melhorar?"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black resize-none"
              />
              <p className="text-[10px] text-gray-400 mt-1 text-right">{message.length}/2000</p>

              {error && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
            </div>

            <div className="px-5 pb-5 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
              <button
                onClick={close}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black rounded-full"
              >
                Cancelar
              </button>
              <button
                onClick={send}
                disabled={sending || sent}
                className="inline-flex items-center gap-2 px-5 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-colors disabled:opacity-60"
              >
                {sending ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Enviando...</>
                ) : sent ? (
                  <><Check className="w-3.5 h-3.5" strokeWidth={2.4} /> Obrigado!</>
                ) : (
                  'Enviar avaliação'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
