'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { Lock } from 'lucide-react'
import { fetchEventsInMonth, type EventRow } from '@/lib/supabase/queries'

export default function CalendarioPage() {
  const { user } = useAuthStore()
  const isMember = !!(user as any)?.is_pro || !!(user as any)?.is_founder || !!(user as any)?.is_admin

  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() } // month: 0-11
  })
  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchEventsInMonth(cursor.year, cursor.month).then(es => {
      setEvents(es)
      setLoading(false)
    })
  }, [cursor.year, cursor.month])

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString('pt-BR', {
    month: 'long', year: 'numeric',
  })
  const timezone = 'Horário de Brasília'

  // Grid 5x7 = 35 células alinhadas Seg→Dom
  const firstDayOfMonth = new Date(cursor.year, cursor.month, 1).getDay() // 0=Dom ... 6=Sáb
  const mondayOffset = (firstDayOfMonth + 6) % 7 // quantos "vazios" antes do dia 1
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()

  const cells: (number | '')[] = []
  for (let i = 0; i < mondayOffset; i++) cells.push('')
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length < 35) cells.push('')

  // Agrupa eventos por dia do mês
  const eventsByDay = events.reduce<Record<number, EventRow[]>>((acc, e) => {
    const d = new Date(e.starts_at)
    if (d.getFullYear() === cursor.year && d.getMonth() === cursor.month) {
      const day = d.getDate()
      if (!acc[day]) acc[day] = []
      acc[day].push(e)
    }
    return acc
  }, {})

  const today = new Date()
  const isCurrentMonth = today.getFullYear() === cursor.year && today.getMonth() === cursor.month

  function prevMonth() {
    setCursor(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 })
  }
  function nextMonth() {
    setCursor(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 })
  }
  function goToday() {
    const now = new Date()
    setCursor({ year: now.getFullYear(), month: now.getMonth() })
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10 text-black">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-serif font-medium text-black">
              Calendário
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Eventos, lives e workshops ao vivo.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
            <button onClick={goToday} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors">
              Hoje
            </button>

            <div className="flex items-center gap-6">
              <button onClick={prevMonth} className="text-gray-400 hover:text-black">{'<'}</button>
              <div className="text-center">
                <h2 className="font-serif font-bold text-lg text-black capitalize">{monthLabel}</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{timezone}</p>
              </div>
              <button onClick={nextMonth} className="text-gray-400 hover:text-black">{'>'}</button>
            </div>

            <div className="flex items-center gap-2 border border-gray-200 rounded-full p-1 bg-gray-50">
              <button className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-black">Mês</button>
              <button className="px-3 py-1 bg-white shadow-sm font-bold text-xs text-black rounded-full">Semana</button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-gray-100">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="py-3 text-center text-xs font-bold text-black uppercase tracking-widest bg-gray-50">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {cells.map((dayNum, i) => {
              const isEmpty = dayNum === ''
              const isToday = isCurrentMonth && dayNum === today.getDate()
              const dayEvents = typeof dayNum === 'number' ? (eventsByDay[dayNum] || []) : []

              return (
                <div key={i} className={`min-h-[120px] p-2 border-b border-r border-gray-100 ${isEmpty ? 'bg-gray-50/50' : 'bg-white hover:bg-blue-50/30 transition-colors cursor-pointer group'}`}>
                  {!isEmpty && (
                    <div className="flex justify-start mb-2">
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                        isToday
                          ? 'bg-[#EF4444] text-white shadow-sm'
                          : 'text-gray-500 group-hover:text-black'
                      }`}>
                        {dayNum}
                      </span>
                    </div>
                  )}

                  <div className="mt-1 space-y-1">
                    {dayEvents.map(ev => {
                      const time = new Date(ev.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                      const locked = ev.is_private && !isMember
                      const color =
                        ev.kind === 'mentoria' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                        ev.kind === 'workshop' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                        ev.kind === 'live'     ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                                 'bg-gray-50 border-gray-100 text-gray-600'
                      return (
                        <div
                          key={ev.id}
                          className={`px-2 py-1 rounded text-[10px] font-bold truncate border inline-flex items-center gap-1 ${
                            locked ? 'bg-gray-50 border-gray-200 text-gray-400' : color
                          }`}
                          title={ev.title}
                        >
                          {locked && <Lock className="w-2.5 h-2.5 flex-shrink-0" strokeWidth={2.2} />}
                          <span className="truncate">{time} - {ev.title}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {loading && (
            <div className="px-6 py-3 text-xs text-gray-400">Carregando eventos...</div>
          )}
        </div>

        {!isMember && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <span className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 text-gray-600" strokeWidth={2} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-black">Mentorias privadas toda quarta e domingo.</p>
              <p className="text-xs text-gray-500">Complete um onboarding rápido e libere um evento gratuito pra conhecer.</p>
            </div>
            <a
              href="/onboarding"
              className="px-4 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-colors self-start md:self-auto"
            >
              Liberar evento gratuito
            </a>
          </div>
        )}

      </div>
    </div>
  )
}
