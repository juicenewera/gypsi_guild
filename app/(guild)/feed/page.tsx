'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Heart, MessageSquare, Sparkles, Paperclip, ArrowUp, Square, X, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { toastXpGain, toastMessage } from '@/store/toast'
import { cn, timeAgo } from '@/lib/utils'
import {
  fetchPosts,
  createPost,
  togglePostLike,
  uploadPostImage,
  deleteOwnPost,
  type FeedPost,
  type PostType,
} from '@/lib/supabase/queries'
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from '@/components/ui/prompt-input'
import { Button } from '@/components/ui/button'

type FilterType = 'all' | PostType

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all',         label: 'Tudo' },
  { id: 'adventure',   label: 'Aventuras' },
  { id: 'discussion',  label: 'Discussões' },
  { id: 'question',    label: 'Perguntas' },
]

export default function FeedPage() {
  const { user, refreshUser } = useAuthStore()
  const [filter, setFilter]     = useState<FilterType>('all')
  const [posts, setPosts]       = useState<FeedPost[]>([])
  const [loading, setLoading]   = useState(true)
  const [composerType, setComposerType] = useState<PostType>('adventure')
  const [composerText, setComposerText] = useState('')
  const [publishing, setPublishing]     = useState(false)
  const [composerError, setComposerError] = useState<string | null>(null)
  const [likingId, setLikingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [composerImage, setComposerImage] = useState<File | null>(null)
  const [composerImagePreview, setComposerImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) { setComposerError('Arquivo precisa ser imagem.'); return }
    if (f.size > 8 * 1024 * 1024)     { setComposerError('Imagem acima de 8 MB.');       return }
    setComposerError(null)
    setComposerImage(f)
    setComposerImagePreview(URL.createObjectURL(f))
  }

  function clearComposerImage() {
    if (composerImagePreview) URL.revokeObjectURL(composerImagePreview)
    setComposerImage(null)
    setComposerImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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
    if (!user || (!composerText.trim() && !composerImage)) return
    setPublishing(true)
    setComposerError(null)
    const prevXp = Number((user as any)?.xp ?? 0)
    const hadFirstPostBonus = !!(user as any)?.first_post_awarded_at
    try {
      let imageUrl: string | null = null
      if (composerImage) {
        imageUrl = await uploadPostImage(composerImage)
      }
      const post = await createPost({
        userId: user.id,
        content: composerText.trim(),
        type: composerType,
        imageUrl,
      })
      setComposerText('')
      clearComposerImage()
      setPosts(prev => [post, ...prev])
      await refreshUser()

      const latest = useAuthStore.getState().user as any
      const delta = Math.max(Number(latest?.xp ?? 0) - prevXp, 0)
      if (!hadFirstPostBonus && latest?.first_post_awarded_at) {
        toastMessage('xp', 'Parabéns pelo primeiro post! 🎉', `+${delta || 50} XP de boas-vindas à Guilda.`)
      } else if (delta > 0) {
        const label =
          composerType === 'adventure'  ? 'Aventura registrada' :
          composerType === 'discussion' ? 'Discussão registrada' :
                                          'Pergunta registrada'
        toastXpGain(delta, label)
      } else {
        toastMessage('info', 'Publicado sem XP', 'Escreva mais de 50 caracteres pra ganhar XP no próximo post.')
      }
    } catch (e: any) {
      setComposerError(e?.message || 'Erro ao publicar.')
    } finally {
      setPublishing(false)
    }
  }

  async function handleDelete(post: FeedPost) {
    if (!user || deletingId === post.id) return
    if (post.user_id !== user.id) return
    if (!confirm('Excluir esta publicação? Essa ação é permanente.')) return
    setDeletingId(post.id)
    const snapshot = posts
    setPosts(prev => prev.filter(p => p.id !== post.id))
    try {
      await deleteOwnPost(post.id)
    } catch (e: any) {
      setPosts(snapshot)
      alert(e?.message || 'Erro ao excluir.')
    } finally {
      setDeletingId(null)
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
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3 px-1">
              <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                {currentInitials}
              </div>
              <span className="text-sm font-semibold text-black">{currentUsername}</span>
            </div>

            <PromptInput
              value={composerText}
              onValueChange={setComposerText}
              isLoading={publishing}
              onSubmit={handlePublish}
              className="w-full"
            >
              <PromptInputTextarea placeholder="O que você construiu hoje?" />

              {composerImagePreview && (
                <div className="relative mt-2 inline-block">
                  <img
                    src={composerImagePreview}
                    alt="Prévia da imagem"
                    className="max-h-60 rounded-xl border border-gray-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearComposerImage}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white shadow-md hover:bg-gray-700"
                    aria-label="Remover imagem"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <PromptInputAction tooltip="Anexar imagem">
                    <label
                      htmlFor="composer-file-upload"
                      className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="composer-file-upload"
                        onChange={onPickImage}
                        disabled={publishing}
                      />
                      <Paperclip className="text-primary size-4" />
                    </label>
                  </PromptInputAction>

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

                <PromptInputAction tooltip={publishing ? 'Publicando...' : 'Publicar feito'}>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={handlePublish}
                    disabled={(!composerText.trim() && !composerImage) || publishing}
                  >
                    {publishing ? (
                      <Square className="size-4 fill-current" />
                    ) : (
                      <ArrowUp className="size-4" />
                    )}
                  </Button>
                </PromptInputAction>
              </PromptInputActions>
            </PromptInput>

            {composerError && (
              <p className="text-xs text-red-600 mt-2 px-1">{composerError}</p>
            )}
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
                        {post.content && (
                          <p className="text-[15px] font-serif italic text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {post.content}
                          </p>
                        )}
                        {post.image_url && (
                          <div className="mt-3 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                            <img
                              src={post.image_url}
                              alt="Imagem do post"
                              loading="lazy"
                              className="w-full max-h-[520px] object-cover"
                            />
                          </div>
                        )}
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
                          <span className="text-xs font-semibold">
                            {post.comments_count > 0 ? post.comments_count : 'Comentar'}
                          </span>
                        </Link>
                        {user?.id === post.user_id && (
                          <button
                            onClick={() => handleDelete(post)}
                            disabled={deletingId === post.id}
                            className="ml-auto flex items-center gap-2 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40"
                            aria-label="Excluir publicação"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-xs font-semibold">Excluir</span>
                          </button>
                        )}
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
