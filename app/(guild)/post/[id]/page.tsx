'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  Crown,
  Sparkles,
  Trash2,
  ArrowUp,
  Square,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { cn, timeAgo } from '@/lib/utils'
import {
  fetchPostById,
  togglePostLike,
  incrementPostView,
  deleteOwnPost,
  fetchComments,
  createComment,
  deleteOwnComment,
  toggleCommentLike,
  type FeedPost,
  type FeedComment,
} from '@/lib/supabase/queries'

type CommentTree = FeedComment & { children: CommentTree[] }

function buildTree(flat: FeedComment[]): CommentTree[] {
  const byId = new Map<string, CommentTree>()
  const roots: CommentTree[] = []
  flat.forEach(c => byId.set(c.id, { ...c, children: [] }))
  byId.forEach(node => {
    if (node.parent_id && byId.has(node.parent_id)) {
      byId.get(node.parent_id)!.children.push(node)
    } else {
      roots.push(node)
    }
  })
  return roots
}

function AuthorAvatar({
  avatar_url,
  name,
  level,
  size = 'md',
}: {
  avatar_url: string | null | undefined
  name: string
  level?: number
  size?: 'md' | 'sm' | 'xs'
}) {
  const initials = name.slice(0, 2).toUpperCase()
  const sizes = {
    md: { box: 'w-12 h-12', badge: 'w-5 h-5 text-[10px]', text: 'text-sm' },
    sm: { box: 'w-10 h-10', badge: 'w-4 h-4 text-[9px]',  text: 'text-xs' },
    xs: { box: 'w-8 h-8',   badge: 'w-3.5 h-3.5 text-[8px]', text: 'text-xs' },
  }[size]

  return (
    <div className="relative shrink-0">
      <div className={cn(sizes.box, 'rounded-full bg-black text-white flex items-center justify-center font-bold overflow-hidden border border-gray-100 shadow-sm', sizes.text)}>
        {avatar_url
          ? <img src={avatar_url} alt={name} className="w-full h-full object-cover" />
          : initials}
      </div>
      {typeof level === 'number' && (
        <div className={cn('absolute -bottom-1 -right-1 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm', sizes.badge)}>
          {level}
        </div>
      )}
    </div>
  )
}

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined)

  const { user } = useAuthStore()

  const [post, setPost]         = useState<FeedPost | null>(null)
  const [loadingPost, setLoadingPost] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [comments, setComments] = useState<FeedComment[]>([])
  const [loadingComments, setLoadingComments] = useState(true)

  const [commentBody, setCommentBody] = useState('')
  const [replyTo, setReplyTo]         = useState<FeedComment | null>(null)
  const [posting, setPosting]         = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  const [likingPost, setLikingPost] = useState(false)
  const [likingComment, setLikingComment] = useState<string | null>(null)
  const [deletingComment, setDeletingComment] = useState<string | null>(null)
  const [deletingPost, setDeletingPost] = useState(false)

  useEffect(() => {
    if (!postId) return
    let cancelled = false
    setLoadingPost(true)
    fetchPostById(postId, user?.id ?? null).then(p => {
      if (cancelled) return
      if (!p) { setNotFound(true); setLoadingPost(false); return }
      setPost(p)
      setLoadingPost(false)
      incrementPostView(postId)
    })
    return () => { cancelled = true }
  }, [postId, user?.id])

  useEffect(() => {
    if (!postId) return
    let cancelled = false
    setLoadingComments(true)
    fetchComments(postId, user?.id ?? null).then(cs => {
      if (cancelled) return
      setComments(cs)
      setLoadingComments(false)
    })
    return () => { cancelled = true }
  }, [postId, user?.id])

  const tree = useMemo(() => buildTree(comments), [comments])

  async function handleLikePost() {
    if (!user || !post || likingPost) return
    const prevLiked = !!post.liked_by_me
    const prevLikes = post.likes
    setLikingPost(true)
    setPost({ ...post, liked_by_me: !prevLiked, likes: prevLiked ? Math.max(prevLikes - 1, 0) : prevLikes + 1 })
    try {
      const res = await togglePostLike(post.id)
      setPost(p => p ? { ...p, liked_by_me: res.liked, likes: res.likes } : p)
    } catch {
      setPost(p => p ? { ...p, liked_by_me: prevLiked, likes: prevLikes } : p)
    } finally {
      setLikingPost(false)
    }
  }

  async function handleSendComment() {
    if (!user || !post || !commentBody.trim() || posting) return
    setPosting(true)
    setCommentError(null)
    try {
      const c = await createComment({
        postId: post.id,
        body: commentBody.trim(),
        parentId: replyTo?.id ?? null,
      })
      setComments(prev => [...prev, c])
      setPost(p => p ? { ...p, comments_count: p.comments_count + 1 } : p)
      setCommentBody('')
      setReplyTo(null)
    } catch (e: any) {
      setCommentError(e?.message || 'Erro ao comentar.')
    } finally {
      setPosting(false)
    }
  }

  async function handleDeleteComment(c: FeedComment) {
    if (!user || deletingComment === c.id) return
    if (c.user_id !== user.id) return
    if (!confirm('Excluir este comentário?')) return
    setDeletingComment(c.id)
    const snapshot = comments
    const removedIds = new Set<string>()
    const markToRemove = (id: string) => {
      removedIds.add(id)
      comments.filter(x => x.parent_id === id).forEach(ch => markToRemove(ch.id))
    }
    markToRemove(c.id)
    setComments(prev => prev.filter(x => !removedIds.has(x.id)))
    setPost(p => p ? { ...p, comments_count: Math.max(p.comments_count - removedIds.size, 0) } : p)
    try {
      await deleteOwnComment(c.id)
    } catch (e: any) {
      setComments(snapshot)
      alert(e?.message || 'Erro ao excluir comentário.')
    } finally {
      setDeletingComment(null)
    }
  }

  async function handleToggleCommentLike(c: FeedComment) {
    if (!user || likingComment === c.id) return
    const prevLiked = !!c.liked_by_me
    const prevLikes = c.likes
    setLikingComment(c.id)
    setComments(prev => prev.map(x =>
      x.id === c.id ? { ...x, liked_by_me: !prevLiked, likes: prevLiked ? Math.max(prevLikes - 1, 0) : prevLikes + 1 } : x
    ))
    try {
      const res = await toggleCommentLike(c.id)
      setComments(prev => prev.map(x => x.id === c.id ? { ...x, liked_by_me: res.liked, likes: res.likes } : x))
    } catch {
      setComments(prev => prev.map(x => x.id === c.id ? { ...x, liked_by_me: prevLiked, likes: prevLikes } : x))
    } finally {
      setLikingComment(null)
    }
  }

  async function handleDeletePost() {
    if (!user || !post || deletingPost) return
    if (post.user_id !== user.id) return
    if (!confirm('Excluir esta publicação? Essa ação é permanente.')) return
    setDeletingPost(true)
    try {
      await deleteOwnPost(post.id)
      router.push('/feed')
    } catch (e: any) {
      alert(e?.message || 'Erro ao excluir.')
      setDeletingPost(false)
    }
  }

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] pb-32">
        <div className="max-w-4xl mx-auto px-6 pt-6">
          <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mb-6" />
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="h-14 w-full bg-gray-100 rounded mb-4 animate-pulse" />
            <div className="h-40 w-full bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] pb-32">
        <div className="max-w-4xl mx-auto px-6 pt-10 text-center">
          <p className="text-gray-500 text-sm">Publicação não encontrada ou removida.</p>
          <Link href="/feed" className="text-sm font-semibold text-black hover:underline mt-3 inline-block">
            ← Voltar para o Feed
          </Link>
        </div>
      </div>
    )
  }

  const a = post.author
  const authorName = a?.display_name || a?.username || 'Membro'
  const typeLabel =
    post.type === 'adventure'  ? 'Aventura' :
    post.type === 'discussion' ? 'Discussão' : 'Pergunta'

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32">

      {/* ── BACK NAV ──────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 pt-6 mb-4">
        <Link href="/feed" className="text-sm font-semibold text-gray-400 hover:text-black transition-colors">
          ← Voltar para o Feed
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6">

        {/* ── MAIN POST ─────────────────────────────────────── */}
        <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">

          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <Link href={`/perfil?u=${a?.username ?? ''}`}>
                  <AuthorAvatar avatar_url={a?.avatar_url} name={authorName} level={a?.level} size="md" />
                </Link>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/perfil?u=${a?.username ?? ''}`} className="font-bold text-black hover:underline">
                      {authorName}
                    </Link>
                    {a?.is_founder && (
                      <span className="inline-flex items-center gap-1 text-orange-500">
                        <Crown className="w-3.5 h-3.5 fill-orange-500" strokeWidth={1.6} />
                      </span>
                    )}
                    {a?.is_pro && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-white">
                        Pro
                      </span>
                    )}
                    {post.is_validated && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                        <Sparkles className="w-3 h-3" /> Validado
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    {timeAgo(post.created)} • <span className="text-gray-600">{typeLabel}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                {user?.id === post.user_id && (
                  <button
                    onClick={handleDeletePost}
                    disabled={deletingPost}
                    className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors disabled:opacity-40"
                    aria-label="Excluir publicação"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button className="p-2 hover:bg-gray-50 rounded-full transition-colors" aria-label="Mais opções">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Title & Body */}
            {post.title && (
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-black mb-4">
                {post.title}
              </h1>
            )}

            {post.content && (
              <div className="text-[15px] leading-relaxed text-gray-700 whitespace-pre-wrap mb-6">
                {post.content}
              </div>
            )}

            {post.image_url && (
              <div className="w-full rounded-xl overflow-hidden bg-gray-100 relative mb-8 border border-gray-200">
                <img src={post.image_url} alt="Imagem do post" className="w-full max-h-[680px] object-cover" />
              </div>
            )}

            {/* Post Footer / Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={handleLikePost}
                disabled={!user || likingPost}
                className={cn(
                  'flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold transition-colors disabled:opacity-40',
                  post.liked_by_me
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                <Heart size={16} className={cn(post.liked_by_me && 'fill-current')} />
                <span>Curtir</span>
                <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-xs">{post.likes}</span>
              </button>
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                <MessageSquare size={16} /> {post.comments_count} comentário{post.comments_count === 1 ? '' : 's'}
              </div>
            </div>
          </div>
        </article>

        {/* ── COMMENTS ──────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Create Comment Input */}
          {user ? (
            <div className="flex gap-4">
              <AuthorAvatar
                avatar_url={(user as any).avatar_url ?? null}
                name={(user as any).display_name || (user as any).username || 'Você'}
                level={(user as any).level}
                size="sm"
              />
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-2 flex flex-col">
                {replyTo && (
                  <div className="flex items-center justify-between px-3 py-1.5 text-[11px] text-gray-500 bg-gray-50 border-b border-gray-100 rounded-t-xl">
                    <span>
                      Respondendo a <span className="font-semibold text-black">{replyTo.author?.display_name || replyTo.author?.username || 'membro'}</span>
                    </span>
                    <button
                      className="text-gray-400 hover:text-black transition-colors"
                      onClick={() => setReplyTo(null)}
                    >
                      cancelar
                    </button>
                  </div>
                )}
                <textarea
                  className="w-full bg-transparent p-3 outline-none text-sm resize-none text-black placeholder-gray-400"
                  placeholder={replyTo ? 'Escreva sua resposta...' : 'Escreva um comentário...'}
                  rows={2}
                  value={commentBody}
                  onChange={e => setCommentBody(e.target.value)}
                  onKeyDown={e => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                      e.preventDefault()
                      handleSendComment()
                    }
                  }}
                />
                <div className="flex items-center justify-between p-2 border-t border-gray-50">
                  {commentError ? (
                    <span className="text-[11px] text-red-500">{commentError}</span>
                  ) : <span />}
                  <button
                    onClick={handleSendComment}
                    disabled={!commentBody.trim() || posting}
                    className="px-5 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-colors disabled:opacity-40 flex items-center gap-2"
                  >
                    {posting ? <Square className="size-3.5 fill-current" /> : <ArrowUp className="size-3.5" />}
                    Comentar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <p className="text-sm text-gray-500">
                <Link href="/login" className="font-semibold text-black hover:underline">Entre</Link> para comentar.
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="pt-6 space-y-6">
            {loadingComments ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />
              ))
            ) : tree.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                <p className="text-gray-500 text-sm">Nenhum comentário ainda.</p>
                <p className="text-gray-400 text-xs mt-1">Seja o primeiro a comentar.</p>
              </div>
            ) : (
              tree.map(comment => (
                <CommentNode
                  key={comment.id}
                  comment={comment}
                  currentUserId={user?.id}
                  onReply={setReplyTo}
                  onDelete={handleDeleteComment}
                  onLike={handleToggleCommentLike}
                  deletingId={deletingComment}
                  likingId={likingComment}
                  depth={0}
                />
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

function CommentNode({
  comment,
  currentUserId,
  onReply,
  onDelete,
  onLike,
  deletingId,
  likingId,
  depth,
}: {
  comment: CommentTree
  currentUserId?: string | null
  onReply: (c: FeedComment) => void
  onDelete: (c: FeedComment) => void
  onLike: (c: FeedComment) => void
  deletingId: string | null
  likingId: string | null
  depth: number
}) {
  const a = comment.author
  const name = a?.display_name || a?.username || 'Membro'
  const isOwn = currentUserId && comment.user_id === currentUserId

  return (
    <div className="flex gap-4">
      <AuthorAvatar
        avatar_url={a?.avatar_url}
        name={name}
        level={a?.level}
        size={depth > 0 ? 'xs' : 'sm'}
      />

      <div className="flex-1 min-w-0">
        <div className={cn(
          'rounded-2xl border p-4',
          depth > 0 ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100 shadow-sm',
        )}>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Link href={`/perfil?u=${a?.username ?? ''}`} className="font-bold text-black text-sm hover:underline">
              {name}
            </Link>
            {a?.is_pro && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-white">
                Pro
              </span>
            )}
            <span className="text-[11px] text-gray-400">• {timeAgo(comment.created)}</span>
          </div>
          <p className="text-[14px] text-gray-800 leading-relaxed whitespace-pre-wrap">
            {comment.body}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-2 px-2">
          <button
            onClick={() => onLike(comment)}
            disabled={!currentUserId || likingId === comment.id}
            className={cn(
              'flex items-center gap-1.5 text-xs font-bold transition-colors disabled:opacity-40',
              comment.liked_by_me ? 'text-red-500' : 'text-gray-500 hover:text-red-500',
            )}
          >
            <Heart size={14} className={cn(comment.liked_by_me && 'fill-current')} />
            {comment.likes}
          </button>
          <button
            onClick={() => onReply(comment)}
            disabled={!currentUserId}
            className="text-xs font-bold text-gray-500 hover:text-black transition-colors disabled:opacity-40"
          >
            Responder
          </button>
          {isOwn && (
            <button
              onClick={() => onDelete(comment)}
              disabled={deletingId === comment.id}
              className="ml-auto text-xs font-bold text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
            >
              Excluir
            </button>
          )}
        </div>

        {comment.children.length > 0 && (
          <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
            {comment.children.map(child => (
              <CommentNode
                key={child.id}
                comment={child}
                currentUserId={currentUserId}
                onReply={onReply}
                onDelete={onDelete}
                onLike={onLike}
                deletingId={deletingId}
                likingId={likingId}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
