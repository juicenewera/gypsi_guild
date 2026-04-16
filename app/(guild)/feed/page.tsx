'use client'

import { useState, useEffect, useCallback } from 'react'
import { PostCard } from '@/components/post/PostCard'
import { FeedSkeleton } from '@/components/ui/Skeleton'
import { getClient } from '@/lib/pocketbase/client'
import type { Post } from '@/lib/pocketbase/types'
import { cn } from '@/lib/utils'
import { Filter, ArrowDown } from 'lucide-react'

type FilterType = 'all' | 'adventure' | 'discussion' | 'question' | 'showcase'

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'ALL_FEEDS' },
  { value: 'adventure', label: 'ADVENTURES' },
  { value: 'discussion', label: 'STRATEGIES' },
  { value: 'question', label: 'QUERIES' },
  { value: 'showcase', label: 'SHOWCASE' },
]

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadPosts = useCallback(async (pageNum: number, reset = false) => {
    try {
      setLoading(true)
      const pb = getClient()

      let filterStr = ''
      if (filter !== 'all') {
        filterStr = `type = "${filter}"`
      }

      const result = await pb.collection('posts').getList(pageNum, 15, {
        filter: filterStr,
        sort: '-created',
        expand: 'author,category',
      })

      const newPosts = result.items as unknown as Post[]

      if (reset) setPosts(newPosts)
      else setPosts(prev => [...prev, ...newPosts])
      
      setHasMore(pageNum < result.totalPages)
    } catch (err) {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    setPage(1)
    loadPosts(1, true)
  }, [loadPosts])

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-8 border-b-2 border-black">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-normal text-black uppercase tracking-tighter leading-none">
            Intelligence <br/> Feed
          </h1>
          <p className="text-xl text-text-secondary italic font-medium">Insights e execuções em tempo real.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 border-2 border-black p-1 bg-bg-surface h-fit">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all',
                filter === f.value
                  ? 'bg-black text-white'
                  : 'text-text-muted hover:text-black hover:bg-black/5'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      {loading && posts.length === 0 ? (
        <FeedSkeleton />
      ) : posts.length === 0 ? (
        <div className="card-donos p-20 text-center animate-fade-in">
          <div className="text-6xl mb-6">🛰️</div>
          <h3 className="text-3xl font-bold text-black uppercase text-pixel">No Signal</h3>
          <p className="text-text-secondary text-lg mt-4 italic">Seja o primeiro a transmitir conhecimento.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="mt-16 text-center pb-20">
          <button
            onClick={() => {
              const next = page + 1
              setPage(next)
              loadPosts(next)
            }}
            disabled={loading}
            className="btn-donos btn-donos-secondary px-12 h-14 text-lg"
          >
            {loading ? 'SYNCING...' : 'RETRIEVE MORE DATA'}
            <ArrowDown size={20} />
          </button>
        </div>
      )}
    </div>
  )
}
