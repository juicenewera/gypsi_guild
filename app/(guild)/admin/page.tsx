'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabase/client'
import { BookOpen, Swords, Calendar, CheckCircle2, Users } from 'lucide-react'

type Stats = {
  courses: number
  missions: number
  events: number
  pending_posts: number
  members: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const sb = getSupabaseClient()
    async function load() {
      const [c, m, e, p, u] = await Promise.all([
        sb.from('courses').select('id', { count: 'exact', head: true }),
        sb.from('missions').select('id', { count: 'exact', head: true }),
        sb.from('events').select('id', { count: 'exact', head: true }),
        sb.from('posts').select('id', { count: 'exact', head: true }).eq('is_validated', false),
        sb.from('profiles').select('id', { count: 'exact', head: true }),
      ])
      setStats({
        courses: c.count ?? 0,
        missions: m.count ?? 0,
        events: e.count ?? 0,
        pending_posts: p.count ?? 0,
        members: u.count ?? 0,
      })
    }
    load()
  }, [])

  const cards = [
    { label: 'Cursos ativos',        value: stats?.courses ?? '—',       Icon: BookOpen,      href: '/admin/cursos' },
    { label: 'Missões',              value: stats?.missions ?? '—',      Icon: Swords,        href: '/admin/missoes' },
    { label: 'Eventos',              value: stats?.events ?? '—',        Icon: Calendar,      href: '/admin/eventos' },
    { label: 'Posts aguardando',     value: stats?.pending_posts ?? '—', Icon: CheckCircle2,  href: '/admin/validacao' },
    { label: 'Membros da Guilda',    value: stats?.members ?? '—',       Icon: Users,         href: '/aventureiros' },
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map(({ label, value, Icon, href }) => (
        <Link
          key={label}
          href={href}
          className="block bg-white border border-gray-100 rounded-2xl p-5 hover:border-black transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
              <p className="text-3xl font-serif text-black mt-2">{value}</p>
            </div>
            <span className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500">
              <Icon className="w-4 h-4" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
