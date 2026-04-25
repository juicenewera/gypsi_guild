'use client'

import { useEffect, useState } from 'react'
import { Check, Trash2, Sparkles } from 'lucide-react'
import {
  fetchPendingPosts,
  setPostValidation,
  deletePostAdmin,
  type AdminPendingPost,
} from '@/lib/supabase/queries'
import { cn, timeAgo } from '@/lib/utils'

export default function AdminValidacaoPage() {
  const [posts, setPosts] = useState<AdminPendingPost[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingPosts().then(ps => { setPosts(ps); setLoading(false) })
  }, [])

  async function validate(id: string) {
    setBusyId(id)
    try {
      await setPostValidation(id, true)
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch (e: any) {
      alert(e.message)
    } finally {
      setBusyId(null)
    }
  }

  async function remove(id: string) {
    if (!confirm('Remover esse post permanentemente?')) return
    setBusyId(id)
    try {
      await deletePostAdmin(id)
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch (e: any) {
      alert(e.message)
    } finally {
      setBusyId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-white border border-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
        <Sparkles className="w-6 h-6 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Nenhum post aguardando validação.</p>
        <p className="text-xs text-gray-400 mt-1">Volte mais tarde ou publique algo no feed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        Posts validados ganham selo e +100 XP pro autor. Remover só em casos de spam/quebra de regra.
      </p>
      {posts.map(p => (
        <article key={p.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold overflow-hidden">
              {p.author?.avatar_url
                ? <img src={p.author.avatar_url} alt="" className="w-full h-full object-cover" />
                : (p.author?.display_name || p.author?.username || '??').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-black truncate">
                {p.author?.display_name || p.author?.username || 'Membro'}
              </p>
              <p className="text-xs text-gray-400">
                {p.type} · {timeAgo(p.created)} · {p.likes} ♥
              </p>
            </div>
          </div>

          {p.title && <h3 className="text-lg font-serif font-bold text-black mb-1">{p.title}</h3>}
          <p className="text-sm font-serif italic text-gray-700 whitespace-pre-wrap">{p.content}</p>

          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-50">
            <button
              onClick={() => validate(p.id)}
              disabled={busyId === p.id}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-colors',
                'bg-black text-white hover:bg-gray-800 disabled:opacity-40',
              )}
            >
              <Check className="w-3.5 h-3.5" />
              Validar (+100 XP ao autor)
            </button>
            <button
              onClick={() => remove(p.id)}
              disabled={busyId === p.id}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remover
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
