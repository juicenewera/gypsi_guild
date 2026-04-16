'use client'

import { useState, useEffect, useCallback } from 'react'
import { PostCard } from '@/components/post/PostCard'
import { FeedSkeleton } from '@/components/ui/Skeleton'
import type { Post } from '@/lib/pocketbase/types'

export default function AdventuresPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadPosts = useCallback(async (pageNum: number) => {
    try {
      const { getClient } = await import('@/lib/pocketbase/client')
      const pb = getClient()
      const result = await pb.collection('posts').getList(pageNum, 20, {
        filter: 'type = "adventure"',
        sort: '-is_validated,-created',
        expand: 'author,category',
      })
      const items = result.items as unknown as Post[]
      setPosts(prev => pageNum === 1 ? items : [...prev, ...items])
      setHasMore(pageNum < result.totalPages)
    } catch { setPosts([]); setHasMore(false) }
    setLoading(false)
  }, [])

  useEffect(() => { loadPosts(1) }, [loadPosts])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-text-primary mb-1">
          Adventures
        </h1>
        <p className="text-sm text-text-secondary">
          Relatos reais de vendas e conquistas. Prove que voce executou.
        </p>
      </div>

      {loading && posts.length === 0 ? (
        <FeedSkeleton />
      ) : posts.length === 0 ? (
        <div className="card p-12 text-center animate-fade-in">
          <div className="text-5xl mb-4">⚔️</div>
          <h3 className="text-base font-semibold text-text-primary mb-2">Nenhum Adventure ainda</h3>
          <p className="text-sm text-text-secondary mb-6">
            Seja o primeiro a relatar uma conquista!
          </p>
          <a href="/post/new">
            <button className="btn btn-primary">Criar Adventure</button>
          </a>
        </div>
      ) : (
        <div className="space-y-4 stagger-children">
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}

      {hasMore && posts.length > 0 && (
        <div className="mt-6 text-center">
          <button
            className="btn btn-ghost"
            onClick={() => { const n = page + 1; setPage(n); loadPosts(n) }}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Carregar mais'}
          </button>
        </div>
      )}
    </div>
  )
}
