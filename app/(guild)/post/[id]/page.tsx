'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ThumbsUp, MessageSquare, CornerDownRight, MoreHorizontal, Bell, Crown, Star, Bot } from 'lucide-react'

// MOCK DATA TO AVOID POCKETBASE CRASHES IN DEVELOPMENT
const MOCK_POST = {
  id: 'msg-1',
  author: { name: 'Albert Shiney', avatar: 'https://i.pravatar.cc/150?u=albert', level: 9 },
  title: 'Sell fully autonomous agents for $15k',
  body: `I know a couple of dudes...\n\nThey do 1 day of work, where they set this up...\n$15k upfront...\n\nHere's what they are selling:\nhttps://www.youtube.com/watch?v=CmjaOzsTqr4`,
  category: 'AI Agency Challenge',
  timeAgo: '1d (edited)',
  upvotes: 56,
  comments_count: 59,
  videoThumb: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80', // placeholder
}

const MOCK_COMMENTS = [
  {
    id: 'c1',
    author: { name: 'Esayas Tesfaye', avatar: 'https://i.pravatar.cc/150?u=esa', level: 4 },
    timeAgo: '1d',
    body: 'Wow',
    upvotes: 6,
    replies: [
      {
        id: 'r1',
        author: { name: 'Kunmi Oduola', avatar: 'https://i.pravatar.cc/150?u=kun', level: 7 },
        timeAgo: '1d',
        body: '@Esayas Tesfaye Looking good',
        upvotes: 3,
      }
    ]
  },
  {
    id: 'c2',
    author: { name: 'Lucas_Dev', avatar: 'https://i.pravatar.cc/150?u=luc', level: 5 },
    timeAgo: '14h',
    body: 'Where can we find more info about the exact stack they used?',
    upvotes: 12,
    replies: []
  }
]

export default function PostPage() {
  const [commentBody, setCommentBody] = useState('')

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
                
                {/* Avatar with level badge inside */}
                <div className="relative">
                  <img src={MOCK_POST.author.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" />
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {MOCK_POST.author.level}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black">{MOCK_POST.author.name}</span>
                    <span className="inline-flex items-center gap-1 text-orange-500">
                      <Crown className="w-3.5 h-3.5 fill-orange-500" strokeWidth={1.6} />
                      <Star className="w-3.5 h-3.5 fill-orange-500" strokeWidth={1.6} />
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    {MOCK_POST.timeAgo} • <span className="text-gray-600">{MOCK_POST.category}</span>
                  </div>
                </div>

              </div>

              <div className="flex items-center gap-2 text-gray-400">
                <button className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Bell size={18} /></button>
                <button className="p-2 hover:bg-gray-50 rounded-full transition-colors"><MoreHorizontal size={18} /></button>
              </div>
            </div>

            {/* Title & Body */}
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-black mb-4">
              {MOCK_POST.title}
            </h1>
            
            <div className="text-[15px] leading-relaxed text-gray-700 whitespace-pre-wrap mb-6">
              {MOCK_POST.body}
            </div>

            {/* Video Thumbnail block */}
            <div className="w-full max-w-lg h-56 rounded-xl overflow-hidden bg-gray-100 relative mb-8 border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity">
               <img src={MOCK_POST.videoThumb} alt="Video" className="w-full h-full object-cover" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-14 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
                   <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                 </div>
               </div>
            </div>

            {/* Post Footer / Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
                <ThumbsUp size={16} /> <span>Like</span> <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-xs">{MOCK_POST.upvotes}</span>
              </button>
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                <MessageSquare size={16} /> {MOCK_POST.comments_count} comments
              </div>
            </div>
          </div>
        </article>

        {/* ── COMMENTS COMPONENT OUTPUT ─────────────────────── */}
        <div className="space-y-4">
          
          {/* Create Comment Input */}
          <div className="flex gap-4">
            <div className="relative shrink-0">
               {/* Current User Avatar Placeholder */}
               <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center font-bold text-gray-500">CI</div>
               <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">8</div>
            </div>
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-2 flex flex-col">
              <textarea 
                className="w-full bg-transparent p-3 outline-none text-sm resize-none text-black placeholder-gray-400"
                placeholder="Write a comment..."
                rows={2}
                value={commentBody}
                onChange={e => setCommentBody(e.target.value)}
              />
              <div className="flex justify-end p-2 border-t border-gray-50">
                <button className="px-5 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-colors">
                  Comment
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="pt-6 space-y-6">
            {MOCK_COMMENTS.map(comment => (
              <div key={comment.id} className="flex gap-4">
                
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img src={comment.author.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100" />
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {comment.author.level}
                  </div>
                </div>

                <div className="flex-1">
                  {/* First Line Comment Area */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-black text-sm">{comment.author.name}</span>
                      <span className="text-[11px] text-gray-400">• {comment.timeAgo}</span>
                    </div>
                    <p className="text-[14px] text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {comment.body}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-2 px-2">
                    <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition-colors">
                      <ThumbsUp size={14} /> {comment.upvotes}
                    </button>
                    <button className="text-xs font-bold text-gray-500 hover:text-black transition-colors">
                      Reply
                    </button>
                  </div>

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex gap-3">
                          
                          <div className="relative shrink-0 mt-1">
                            <img src={reply.author.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover shadow-sm border border-gray-100" />
                            <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-white">
                              {reply.author.level}
                            </div>
                          </div>

                          <div className="flex-1">
                             <div className="bg-gray-50 rounded-2xl border border-gray-100 p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-black text-xs">{reply.author.name}</span>
                                <span className="text-[10px] text-gray-400">• {reply.timeAgo}</span>
                              </div>
                              <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {reply.body}
                              </p>
                            </div>

                            <div className="flex items-center gap-4 mt-1.5 px-2">
                              <button className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-black transition-colors">
                                <ThumbsUp size={12} /> {reply.upvotes}
                              </button>
                              <button className="text-[11px] font-bold text-gray-500 hover:text-black transition-colors">
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
