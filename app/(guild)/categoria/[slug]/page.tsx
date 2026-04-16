'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { PostCard } from '@/components/post/PostCard'
import { FeedSkeleton } from '@/components/ui/Skeleton'
import type { Post, Category } from '@/lib/pocketbase/types'

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [category, setCategory] = useState<Category | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadData = useCallback(async (pageNum: number) => {
    try {
      const { getClient } = await import('@/lib/pocketbase/client')
      const pb = getClient()
      const cat = await pb.collection('categories').getFirstListItem(`slug = "${slug}"`)
      setCategory(cat as unknown as Category)
      const result = await pb.collection('posts').getList(pageNum, 20, {
        filter: `category = "${cat.id}"`,
        sort: '-created',
        expand: 'author,category',
      })
      const items = result.items as unknown as Post[]
      setPosts(prev => pageNum === 1 ? items : [...prev, ...items])
      setHasMore(pageNum < result.totalPages)
    } catch { setPosts([]); setHasMore(false) }
    setLoading(false)
  }, [slug])

  useEffect(() => { setPage(1); setLoading(true); loadData(1) }, [loadData])

  if (loading && !category) return <div className="max-w-3xl mx-auto"><FeedSkeleton /></div>

  return (
    <div className="max-w-3xl mx-auto">
      {category && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">{category.icon}</span>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-text-primary">
              {category.name}
            </h1>
          </div>
          <p className="text-sm text-text-secondary">{category.description}</p>
        </div>
      )}

      {posts.length === 0 && !loading ? (
        <div className="card p-12 text-center">
          <p className="text-sm text-text-muted">Nenhum post nesta categoria ainda.</p>
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
            onClick={() => { const n = page + 1; setPage(n); loadData(n) }}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Carregar mais'}
          </button>
        </div>
      )}
    </div>
  )
}
