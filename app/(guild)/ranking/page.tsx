'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function RankingPage() {
  const MOCK_LEADERBOARD = [
    { rank: 1, name: 'Cigano.agi', xp: 473, isHot: true },
    { rank: 2, name: 'Shiv pratap', xp: 433, isHot: true },
    { rank: 3, name: 'Jason E Jess', xp: 316, isHot: false },
    { rank: 4, name: 'Mark Noah', xp: 306, isHot: false },
    { rank: 5, name: 'Juli Hayunga', xp: 305, isHot: false },
    { rank: 6, name: 'Myra Davis', xp: 233, isHot: false },
  ]

  const MOCK_LEVELS = [
    { level: 1, title: 'Recruta', percentage: '89%' },
    { level: 2, title: 'Aprendiz', percentage: '5%' },
    { level: 3, title: 'Iniciado', percentage: '1%' },
    { level: 4, title: 'Aventureiro', percentage: '1%' },
    { level: 5, title: 'Veterano', percentage: '1%' },
    { level: 6, title: 'Especialista', percentage: '1%' },
    { level: 7, title: 'Mestre', percentage: '1%' },
    { level: 8, title: 'Arquimago', percentage: '0%' },
    { level: 9, title: 'Lendário', percentage: '1%', unlocks: 'Chat with members' },
  ]

  const user = {
    name: 'Cigano AGI',
    level: 8,
    pointsToNext: 1550,
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10 text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ── TOP HEAD ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center lg:items-start gap-12">
          
          {/* User Profile Summary */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full border-[6px] border-blue-50 bg-gray-100 flex items-center justify-center font-serif text-3xl font-bold">
                CI
              </div>
              <div className="absolute bottom-0 right-2 w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center border-2 border-white shadow-sm">
                {user.level}
              </div>
            </div>
            <h2 className="text-2xl font-serif font-bold text-black">{user.name}</h2>
            <p className="font-bold text-blue-500 text-sm mt-1">Level {user.level}</p>
            <p className="text-xs text-gray-500 mt-2"><span className="font-bold text-black">{user.pointsToNext}</span> points to level up</p>
          </div>

          {/* Level List */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full lg:pl-12 lg:border-l border-gray-100">
            {MOCK_LEVELS.map(l => (
              <div key={l.level} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  l.level <= user.level 
                    ? 'bg-[#F2DB76] text-black' // Yellow for unlocked/current
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}>
                  {l.level <= user.level ? l.level : '🔒'}
                </div>
                <div>
                  <p className="font-bold text-sm text-black">Level {l.level}</p>
                  <p className="text-[10px] text-gray-500">
                    {l.unlocks ? `Unlock ${l.unlocks} ` : ''} 
                    {l.percentage} of members
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 italic">Last updated: Apr 16th 2026 6:40pm</p>

        {/* ── LEADERBOARDS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {[
            { title: 'Leaderboard (7-day)', highlight: '+50' },
            { title: 'Leaderboard (30-day)', highlight: '+208' },
            { title: 'Leaderboard (all-time)', highlight: '473' },
          ].map((board, idx) => (
            <div key={board.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-black mb-6">{board.title}</h3>
              
              <div className="space-y-4">
                {MOCK_LEADERBOARD.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-6 flex justify-center">
                      {i < 3 ? (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm
                          ${i === 0 ? 'bg-[#F2DB76]' : i === 1 ? 'bg-[#9CA3AF]' : 'bg-[#CD7F32]'}`}
                        >
                          {i + 1}
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-gray-400">{i + 1}</span>
                      )}
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs shrink-0">
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <p className="font-bold text-sm text-black truncate group-hover:underline">
                        {item.name}
                      </p>
                      {item.isHot && <span className="text-orange-500 text-xs">🔥</span>}
                    </div>
                    
                    <span className="text-sm font-bold text-blue-500">
                      {idx < 2 ? `+${item.xp}` : item.xp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  )
}
