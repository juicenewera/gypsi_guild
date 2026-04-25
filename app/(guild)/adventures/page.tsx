'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, MessageSquare, Sparkles, Swords } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { cn, timeAgo } from '@/lib/utils'
import {
  fetchPosts,
  togglePostLike,
  type FeedPost,
} from '@/lib/supabase/queries'

type Tab = 'validadas' | 'recentes'

export default function AdventuresPage() {
  const { user } = useAuthStore()
  const [tab, setTab] = useState<Tab>('validadas')
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [likingId, setLikingId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchPosts({
      type: 'adventure',
      currentUserId: user?.id ?? null,
      limit: 60,
    }).then(ps => {
      setPosts(ps)
      setLoading(false)
    })
  }, [user?.id])

  async function handleLike(post: FeedPost) {
    if (!user || likingId === post.id) return
    const prevLiked = post.liked_by_me
    const prevLikes = post.likes
    setLikingId(post.id)

    setPosts(prev => prev.map(p =>
      p.id === post.id
        ? { ...p, liked_by_me: !prevLiked, likes: prevLiked ? Math.max(prevLikes - 1, 0) : prevLikes + 1 }
        : p
    ))

    try {
      const res = await togglePostLike(post.id)
      setPosts(prev => prev.map(p =>
        p.id === post.id ? { ...p, liked_by_me: res.liked, likes: res.likes } : p
      ))
    } catch {
      setPosts(prev => prev.map(p =>
        p.id === post.id ? { ...p, liked_by_me: prevLiked, likes: prevLikes } : p
      ))
    } finally {
      setLikingId(null)
    }
  }

  const visible = tab === 'validadas'
    ? posts.filter(p => p.is_validated)
    : posts

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Swords className="w-5 h-5 text-black" strokeWidth={2} />
          <h1 className="font-serif text-2xl font-bold text-black">Aventuras</h1>
        </div>
        <p className="text-sm text-gray-500">
          Relatos reais de execução. Marca de validado é a prova.
        </p>
      </div>

      <div className="flex gap-2 mb-5">
        {(['validadas', 'recentes'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-semibold border transition-colors shadow-sm',
              tab === t
                ? 'bg-black border-black text-white'
                : 'bg-white border-gray-200 text-gray-500 hover:text-black'
            )}
          >
            {t === 'validadas' ? 'Validadas' : 'Recentes'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))
        ) : visible.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-500 text-sm">Nenhuma aventura {tab === 'validadas' ? 'validada' : 'publicada'} ainda.</p>
            <Link
              href="/post/new"
              className="inline-block mt-4 px-5 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800"
            >
              Relatar aventura
            </Link>
          </div>
        ) : (
          visible.map(post => {
            const author = post.author
            const name = author?.display_name || author?.username || 'Membro'
            const initials = name.slice(0, 2).toUpperCase()
            const role = author?.is_founder ? 'Fundador' : author?.path ?? 'Recruta'

            return (
              <article key={post.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 transition-all hover:shadow-md">
                <div className="flex gap-4">
                  <Link href={`/perfil?u=${author?.username ?? ''}`} className="flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                      {author?.avatar_url
                        ? <img src={author.avatar_url} alt={name} className="w-full h-full object-cover" />
                        : initials}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                      <span className="text-sm font-bold text-black">{name}</span>
                      <span className="text-xs text-gray-400 capitalize">· {role}</span>
                      {author?.is_pro && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-white">
                          Pro
                        </span>
                      )}
                      {post.is_validated && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                          <Sparkles className="w-3 h-3" /> Validada
                        </span>
                      )}
                      <span className="text-xs text-gray-400 ml-auto">{timeAgo(post.created)}</span>
                    </div>

                    {post.title && (
                      <h3 className="text-lg font-serif font-bold text-black leading-snug mb-1">
                        {post.title}
                      </h3>
                    )}

                    <Link href={`/post/${post.id}`} className="block">
                      <p className="text-[15px] font-serif italic text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>
                    </Link>

                    <div className="flex items-center gap-5 mt-4 pt-3 border-t border-gray-50">
                      <button
                        onClick={() => handleLike(post)}
                        disabled={!user || likingId === post.id}
                        className={cn(
                          'flex items-center gap-2 transition-colors disabled:opacity-40',
                          post.liked_by_me ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                        )}
                      >
                        <Heart className={cn('w-4 h-4', post.liked_by_me && 'fill-current')} />
                        <span className="text-xs font-semibold">{post.likes}</span>
                      </button>
                      <Link
                        href={`/post/${post.id}`}
                        className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs font-semibold">Comentar</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}
