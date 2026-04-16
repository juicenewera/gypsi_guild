'use client'

import Link from 'next/link'
import { timeAgo, formatCurrency, truncate } from '@/lib/utils'
import { ArrowUp, MessageSquare, Sparkles } from 'lucide-react'

// Utilizando um formato any para evitar dependência do PocketBase types
interface PostCardProps {
  post: any
}

export function PostCard({ post }: PostCardProps) {
  const author = post.author
  const category = post.category
  const isAdventure = post.type === 'adventure'

  const initials = (author?.username || 'U').slice(0, 2).toUpperCase()
  const pathName = author?.path ? author.path.charAt(0).toUpperCase() + author.path.slice(1) : 'Builder'

  return (
    <Link href={`/post/${post.id}`} className="block group">
      <article className="bg-[#111] border border-white/10 rounded-2xl p-7 md:p-9 transition-all duration-300 hover:bg-[#161616] hover:border-white/20">
        
        {/* Author Meta */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-none mb-1">
                {author?.name || author?.username}
              </span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {pathName} · Nível {author?.level || 1}
              </span>
            </div>
          </div>
          
          <span className="text-xs font-medium text-gray-500">
            {timeAgo(post.created)}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h3 className="text-3xl md:text-4xl font-serif font-medium text-white leading-tight group-hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
          <p className="text-base text-gray-400 leading-relaxed max-w-3xl">
            {truncate(post.body, 180)}
          </p>
        </div>

        {/* Adventure Metrics highlight (If specific) */}
        {isAdventure && post.revenue_amount && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 my-8 py-6 border-y border-white/10">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Revenue</span>
              <span className="text-2xl font-serif font-medium text-[#10B981]">
                {formatCurrency(post.revenue_amount)}
              </span>
            </div>
            
            {post.client_niche && (
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nicho</span>
                <span className="text-lg font-medium text-white">{post.client_niche}</span>
              </div>
            )}

            {post.days_to_close && (
              <div className="flex flex-col hidden md:flex">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Ciclo de Venda</span>
                <span className="text-lg font-medium text-white">{post.days_to_close} dias</span>
              </div>
            )}
          </div>
        )}

        {/* Systems Tag Section */}
        {isAdventure && post.system_used && post.system_used.length > 0 && (
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Systems:</span>
            {post.system_used.map((sys: string) => (
              <span key={sys} className="text-[11px] font-medium text-gray-300 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                {sys}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
              <ArrowUp className="w-5 h-5" />
              <span className="text-sm font-medium">{post.upvotes || 0}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments_count || 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             {post.is_validated && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full">
                <Sparkles size={12} fill="currentColor" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Validado</span>
              </div>
            )}
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/5 rounded-full px-3 py-1 border border-white/10">
              {category?.name || 'Geral'}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
