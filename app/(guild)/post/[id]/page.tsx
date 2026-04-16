'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { PixelBadge } from '@/components/ui/PixelBadge'
import { PathBadge } from '@/components/ui/PathBadge'
import { PostCardSkeleton } from '@/components/ui/Skeleton'
import { useAuthStore } from '@/store/auth'
import { cn, timeAgo, formatCurrency, getAvatarUrl } from '@/lib/utils'
import { XP_REWARDS } from '@/lib/xp'
import { ArrowBigUp, MessageSquare, Eye, Zap, Send } from 'lucide-react'
import type { Post, Comment } from '@/lib/pocketbase/types'

export default function PostPage() {
  const params = useParams()
  const { user, refreshUser } = useAuthStore()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentBody, setCommentBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [hasUpvoted, setHasUpvoted] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const { getClient } = await import('@/lib/pocketbase/client')
        const pb = getClient()
        const p = await pb.collection('posts').getOne(params.id as string, { expand: 'author,category' })
        setPost(p as unknown as Post)
        // Incrementar views
        await pb.collection('posts').update(params.id as string, { 'views+': 1 })
        // Carregar comentarios
        const c = await pb.collection('comments').getFullList({
          filter: `post = "${params.id}"`,
          sort: '-created',
          expand: 'author',
        })
        setComments(c as unknown as Comment[])
        // Verificar upvote
        if (user) {
          try {
            await pb.collection('post_upvotes').getFirstListItem(
              `user = "${user.id}" && post = "${params.id}"`
            )
            setHasUpvoted(true)
          } catch { /* nao fez upvote */ }
        }
      } catch { /* skip */ }
      setLoading(false)
    }
    load()
  }, [params.id, user])

  async function handleUpvote() {
    if (!user || !post) return
    try {
      const { getClient } = await import('@/lib/pocketbase/client')
      const pb = getClient()
      if (hasUpvoted) {
        const rec = await pb.collection('post_upvotes').getFirstListItem(
          `user = "${user.id}" && post = "${post.id}"`
        )
        await pb.collection('post_upvotes').delete(rec.id)
        await pb.collection('posts').update(post.id, { upvotes: Math.max(0, (post.upvotes || 0) - 1) })
        setPost(prev => prev ? { ...prev, upvotes: Math.max(0, (prev.upvotes || 0) - 1) } : null)
        setHasUpvoted(false)
      } else {
        await pb.collection('post_upvotes').create({ user: user.id, post: post.id })
        await pb.collection('posts').update(post.id, { upvotes: (post.upvotes || 0) + 1 })
        setPost(prev => prev ? { ...prev, upvotes: (prev.upvotes || 0) + 1 } : null)
        setHasUpvoted(true)
      }
    } catch { /* skip */ }
  }

  async function handleComment() {
    if (!user || !post || !commentBody.trim()) return
    setSubmitting(true)
    try {
      const { getClient } = await import('@/lib/pocketbase/client')
      const pb = getClient()
      const c = await pb.collection('comments').create(
        { post: post.id, author: user.id, body: commentBody },
        { expand: 'author' }
      )
      setComments(prev => [c as unknown as Comment, ...prev])
      setCommentBody('')

      // Atualizar contador de comentarios no post
      await pb.collection('posts').update(post.id, {
        comments_count: (post.comments_count || 0) + 1,
      })
      setPost(prev => prev ? { ...prev, comments_count: (prev.comments_count || 0) + 1 } : null)

      // Conceder XP ao comentarista
      await pb.collection('users').update(user.id, { 'xp+': XP_REWARDS.comment })
      await pb.collection('xp_log').create({
        user: user.id,
        amount: XP_REWARDS.comment,
        reason: 'comment',
        reference_id: c.id,
      })
      await refreshUser()
    } catch { /* skip */ }
    setSubmitting(false)
  }

  if (loading) return <div className="max-w-3xl mx-auto"><PostCardSkeleton /></div>

  if (!post) return (
    <div className="max-w-3xl mx-auto text-center py-16">
      <p className="text-sm text-text-muted">Post nao encontrado</p>
    </div>
  )

  const author = post.expand?.author
  const category = post.expand?.category
  const isAdventure = post.type === 'adventure'

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Post */}
      <article className={cn('card p-6', isAdventure && 'card-guerr')}>
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          {author && (
            <img
              src={getAvatarUrl(author.avatar, author.id)}
              alt={author.username}
              className="w-10 h-10 rounded-full border border-border-default object-cover shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-text-primary">
                {author?.name || author?.username}
              </span>
              {author && (
                <PathBadge path={author.path || 'mago'} level={author.level || 1} className="scale-75 origin-left" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
              {category && <span>{category.icon} {category.name}</span>}
              <span>· {timeAgo(post.created)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isAdventure && <PixelBadge variant="guerreiro" size="sm">⚔️ Adventure</PixelBadge>}
            {post.is_validated && <PixelBadge variant="xp" size="sm">✓ Validado</PixelBadge>}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-text-primary mb-4">{post.title}</h1>

        {/* Adventure revenue */}
        {isAdventure && post.revenue_amount && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-guerr-50 border border-guerr-400 rounded-lg">
            <span className="text-sm font-semibold text-guerr-600">
              💰 {formatCurrency(post.revenue_amount)}
            </span>
            {post.client_niche && (
              <PixelBadge variant="default" size="sm">{post.client_niche}</PixelBadge>
            )}
            {post.days_to_close && (
              <span className="text-xs text-text-muted">⏱️ {post.days_to_close} dias</span>
            )}
          </div>
        )}

        {/* Systems used */}
        {isAdventure && post.system_used?.length > 0 && (
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {post.system_used.map(s => (
              <PixelBadge key={s} variant="mago" size="sm">{s}</PixelBadge>
            ))}
          </div>
        )}

        {/* Validated banner */}
        {post.is_validated && (
          <div className="mb-4 p-3 bg-xp-50 border border-xp-400 rounded-lg flex items-center gap-2">
            <span className="text-sm font-medium text-xp-600">
              ✓ Adventure Validado pelo Mestre
            </span>
          </div>
        )}

        {/* Body */}
        <div className="prose max-w-none mb-4 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
          {post.body}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {post.tags.map(t => (
              <span
                key={t}
                className="px-2 py-0.5 text-xs text-text-muted bg-bg-elevated border border-border-subtle rounded-full"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Footer stats */}
        <div className="flex items-center gap-4 pt-3 border-t border-border-subtle">
          <button
            onClick={handleUpvote}
            className={cn(
              'flex items-center gap-1.5 transition-colors',
              hasUpvoted ? 'text-mago-500' : 'text-text-muted hover:text-mago-500'
            )}
          >
            <ArrowBigUp className={cn('w-5 h-5', hasUpvoted && 'fill-current')} />
            <span className="text-sm font-medium">{post.upvotes || 0}</span>
          </button>
          <span className="flex items-center gap-1.5 text-text-muted">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">{post.comments_count || 0}</span>
          </span>
          <span className="flex items-center gap-1.5 text-text-muted">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">{post.views || 0}</span>
          </span>
          {post.xp_awarded > 0 && (
            <span className="flex items-center gap-1.5 text-xp-600 ml-auto">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">+{post.xp_awarded} XP</span>
            </span>
          )}
        </div>
      </article>

      {/* Caixa de comentario */}
      {user && (
        <div className="card p-4">
          <div className="flex gap-3">
            <img
              src={getAvatarUrl(user.avatar, user.id)}
              alt=""
              className="w-8 h-8 rounded-full border border-border-default object-cover shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={commentBody}
                onChange={e => setCommentBody(e.target.value)}
                rows={3}
                className="input w-full resize-y"
                placeholder="Comente..."
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-text-muted">+{XP_REWARDS.comment} XP ao comentar</span>
                <button
                  onClick={handleComment}
                  disabled={submitting || !commentBody.trim()}
                  className="btn btn-primary inline-flex items-center gap-1.5 text-sm py-1.5 px-3"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-3 stagger-children">
        {comments.map(c => {
          const cAuthor = c.expand?.author
          return (
            <div key={c.id} className="card p-4">
              <div className="flex items-start gap-3">
                {cAuthor && (
                  <img
                    src={getAvatarUrl(cAuthor.avatar, cAuthor.id)}
                    alt=""
                    className="w-7 h-7 rounded-full border border-border-default object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-text-primary">
                      {cAuthor?.name || cAuthor?.username}
                    </span>
                    <span className="text-xs text-text-muted">{timeAgo(c.created)}</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {c.body}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
