'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, MessageSquare, Sparkles, Image as ImageIcon, Flame } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { cn, timeAgo } from '@/lib/utils'
import {
  fetchPosts,
  createPost,
  togglePostLike,
  type FeedPost,
  type PostType,
} from '@/lib/supabase/queries'

type FilterType = 'all' | PostType

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all',         label: 'Tudo' },
  { id: 'adventure',   label: 'Aventuras' },
  { id: 'discussion',  label: 'Discussões' },
  { id: 'question',    label: 'Perguntas' },
]

export default function FeedPage() {
  const { user } = useAuthStore()
  const [filter, setFilter]     = useState<FilterType>('all')
  const [posts, setPosts]       = useState<FeedPost[]>([])
  const [loading, setLoading]   = useState(true)
  const [composerType, setComposerType] = useState<PostType>('adventure')
  const [composerText, setComposerText] = useState('')
  const [publishing, setPublishing]     = useState(false)
  const [composerError, setComposerError] = useState<string | null>(null)
  const [likingId, setLikingId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchPosts({
      type: filter === 'all' ? undefined : filter,
      currentUserId: user?.id ?? null,
    }).then(ps => {
      setPosts(ps)
      setLoading(false)
    })
  }, [filter, user?.id])

  async function handlePublish() {
    if (!user || !composerText.trim()) return
    setPublishing(true)
    setComposerError(null)
    try {
      const post = await createPost({
        userId: user.id,
        content: composerText.trim(),
        type: composerType,
      })
      setComposerText('')
      setPosts(prev => [post, ...prev])
    } catch (e: any) {
      setComposerError(e?.message || 'Erro ao publicar.')
    } finally {
      setPublishing(false)
    }
  }

  async function handleLike(post: FeedPost) {
    if (!user || likingId === post.id) return
    const prevLiked = post.liked_by_me
    const prevLikes = post.likes
    setLikingId(post.id)

    // Atualização otimista
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
      // rollback
      setPosts(prev => prev.map(p =>
        p.id === post.id ? { ...p, liked_by_me: prevLiked, likes: prevLikes } : p
      ))
    } finally {
      setLikingId(null)
    }
  }

  const currentUsername = (user as any)?.display_name || (user as any)?.username || 'Você'
  const currentInitials = currentUsername.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">

      {/* ── BANNER ────────────────────────────────────────── */}
      <div className="w-full max-w-5xl mx-auto px-6 pt-10 pb-4">
        <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden relative shadow-sm border border-gray-200 bg-gray-100 flex items-center justify-center">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1542314831-c6a4d14d2350?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <span className="absolute text-white font-serif text-3xl font-bold tracking-widest uppercase opacity-50">Tavern</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6">

        <div className="text-center mb-6 mt-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            Últimas Atividades do Bando
          </p>
        </div>

        {/* ── COMPOSER ──────────────────────────────────────── */}
        {user && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                {currentInitials}
              </div>
              <div className="flex-1 min-w-0">
                <textarea
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  placeholder="O que você construiu hoje?"
                  rows={3}
                  className="w-full font-serif italic text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none resize-none"
                />

                <div className="flex flex-wrap gap-2 mt-2">
                  {(['adventure', 'discussion', 'question'] as PostType[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setComposerType(t)}
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-colors',
                        composerType === t
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-500 border-gray-200 hover:text-black'
                      )}
                    >
                      {t === 'adventure' ? 'Aventura' : t === 'discussion' ? 'Discussão' : 'Pergunta'}
                    </button>
                  ))}
                </div>

                {composerError && (
                  <p className="text-xs text-red-600 mt-2">{composerError}</p>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <div className="flex gap-4 text-gray-300">
                    <button type="button" disabled title="Em breve: anexar imagem">
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button type="button" disabled title="Em breve: destacar">
                      <Flame className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handlePublish}
                    disabled={!composerText.trim() || publishing}
                    className="px-5 py-2 bg-black text-white text-xs font-bold rounded-full shadow-sm hover:bg-gray-800 transition-colors disabled:opacity-40"
                  >
                    {publishing ? 'Publicando...' : 'Publicar feito →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FILTROS ───────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-semibold border transition-colors shadow-sm',
                filter === f.id
                  ? 'bg-black border-black text-white'
                  : 'bg-white border-gray-200 text-gray-500 hover:text-black'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── FEED ───────────────────────────────────────────── */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-36 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <p className="text-gray-500 text-sm">Nenhum feito publicado ainda.</p>
              <p className="text-gray-400 text-xs mt-1">Seja o primeiro do bando.</p>
            </div>
          ) : (
            posts.map(post => {
              const author = post.author
              const name = author?.display_name || author?.username || 'Membro'
              const initials = name.slice(0, 2).toUpperCase()
              const role = author?.is_founder ? 'Fundador' : author?.path ?? 'Recruta'
              const typeLabel =
                post.type === 'adventure'  ? 'Aventura' :
                post.type === 'discussion' ? 'Discussão' : 'Pergunta'

              return (
                <article key={post.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 transition-all hover:shadow-md">
                  <div className="flex gap-4">
                    {/* Autor */}
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
                            <Sparkles className="w-3 h-3" /> Validado
                          </span>
                        )}
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100">
                          {typeLabel}
                        </span>
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
    </div>
  )
}
