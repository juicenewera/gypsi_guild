'use client'

import Link from 'next/link'
import { Heart, MessageSquare } from 'lucide-react'

interface PostCardProps {
  post: any
}

export function PostCard({ post }: PostCardProps) {
  const author = post.author
  const initials = (author?.username || 'U').slice(0, 2).toUpperCase()

  return (
    <Link href={`/post/${post.id}`} className="block group">
      <article className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md flex flex-col md:flex-row gap-6 md:gap-8">
        
        {/* Author Sidebar (Left) */}
        <div className="flex md:flex-col items-center md:w-32 flex-shrink-0 text-center gap-3 md:gap-2 border-b md:border-b-0 md:border-r border-gray-50 pb-4 md:pb-0 md:pr-4">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
            {initials}
          </div>
          <div className="flex flex-col md:mt-2 text-left md:text-center">
            <span className="text-[11px] font-bold text-black uppercase tracking-widest leading-tight">
              {author?.username}
            </span>
            <span className="text-[10px] text-gray-400 capitalize mt-0.5">
              {author?.path}
            </span>
          </div>
        </div>

        {/* Content (Right) */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {post.title && (
              <h3 className="text-xl font-serif font-medium text-black mb-2">
                {post.title}
              </h3>
            )}
            <p className="text-sm md:text-[15px] font-serif italic text-gray-700 leading-relaxed">
              {post.body}
            </p>
          </div>

          {/* Footer Metrics */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4 fill-current" />
              <span className="text-xs font-semibold">{post.upvotes || 0}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs font-semibold">{post.comments_count || 0}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
