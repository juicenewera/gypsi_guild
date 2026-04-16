'use client'

import Link from 'next/link'
import { cn, timeAgo, formatCurrency, truncate, getAvatarUrl } from '@/lib/utils'
import { ArrowUp, MessageSquare, Sparkles } from 'lucide-react'
import type { Post } from '@/lib/pocketbase/types'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const author = post.expand?.author
  const category = post.expand?.category
  const isAdventure = post.type === 'adventure'

  return (
    <Link href={`/post/${post.id}`} className="block group">
      <article className="card-donos p-8 md:p-12 bg-bg-primary transition-all duration-300">
        {/* Author Meta */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-black/5">
          <div className="flex items-center gap-4">
             {author && (
              <img
                src={getAvatarUrl(author.avatar, author.id)}
                alt={author.username}
                className="w-10 h-10 border border-black grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            )}
            <div className="flex flex-col">
              <span className="text-[13px] font-black text-black uppercase tracking-tight leading-none mb-1">
                {author?.name || author?.username}
              </span>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">
                {author?.path || 'builder'} · LVL {author?.level || 1}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">
              {timeAgo(post.created)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h3 className="text-3xl md:text-5xl font-normal text-black leading-[1.1] uppercase tracking-tighter group-hover:bg-black group-hover:text-white transition-all inline-block px-1">
            {post.title}
          </h3>

          <p className="text-lg md:text-xl text-text-secondary leading-snug font-medium italic max-w-3xl">
            {truncate(post.body, 180)}
          </p>
        </div>

        {/* Adventure Metrics */}
        {isAdventure && post.revenue_amount && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mt-12 py-10 border-y-2 border-black bg-bg-surface px-6">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em]">Revenue</span>
              <span className="text-3xl font-bold text-black text-pixel">
                {formatCurrency(post.revenue_amount)}
              </span>
            </div>
            
            {post.client_niche && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em]">Niche</span>
                <span className="text-2xl font-bold text-black uppercase text-pixel">{post.client_niche}</span>
              </div>
            )}

            {post.days_to_close && (
              <div className="flex flex-col gap-2 hidden md:flex">
                <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em]">Cycle</span>
                <span className="text-2xl font-bold text-black text-pixel">{post.days_to_close}D</span>
              </div>
            )}
          </div>
        )}

        {/* Systems Tag Section */}
        {isAdventure && post.system_used && post.system_used.length > 0 && (
          <div className="flex items-center gap-4 mt-10">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Systems:</span>
            <div className="flex gap-2">
              {post.system_used.map(sys => (
                <span key={sys} className="text-[11px] font-black text-black border border-black px-2 py-0.5 bg-white uppercase">
                  {sys}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-12 pt-8">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 text-text-secondary hover:text-black transition-colors">
              <ArrowUp className="w-5 h-5 stroke-[2.5]" />
              <span className="text-sm font-black text-pixel">{post.upvotes || 0}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <MessageSquare className="w-5 h-5 stroke-[2.5]" />
              <span className="text-sm font-black text-pixel">{post.comments_count || 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {post.is_validated && (
              <div className="flex items-center gap-2 px-3 py-1 bg-black text-white">
                <Sparkles size={12} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified</span>
              </div>
            )}
            <span className="text-[11px] font-black text-black uppercase tracking-widest bg-bg-elevated px-3 py-1 border border-black/10 text-pixel">
              {category?.name || 'Feed'}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
