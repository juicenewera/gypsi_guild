'use client'

export default function CalendarioPage() {
  const currentMonth = "Abril 2026"
  const timezone = "6:45pm Horário de Brasília"

  // Para efeito de UI, vamos criar um array de 35 dias (5 semanas) da segunda-feira à domingo.
  const days = Array.from({ length: 35 }, (_, i) => {
    let day = i - 1 // começa offset
    return day > 0 && day <= 30 ? day : ''
  })

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

        {/* ── CALENDAR WRAPPER ───────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Calendar Header Controls */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
            <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors">
              Hoje
            </button>
            
            <div className="flex items-center gap-6">
              <button className="text-gray-400 hover:text-black">{'<'}</button>
              <div className="text-center">
                <h2 className="font-serif font-bold text-lg text-black">{currentMonth}</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{timezone}</p>
              </div>
              <button className="text-gray-400 hover:text-black">{'>'}</button>
            </div>

            <div className="flex items-center gap-2 border border-gray-200 rounded-full p-1 bg-gray-50">
              <button className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-black">Mês</button>
              <button className="px-3 py-1 bg-white shadow-sm font-bold text-xs text-black rounded-full">Semana</button>
            </div>
          </div>

          {/* Calendar Grid Header */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="py-3 text-center text-xs font-bold text-black uppercase tracking-widest bg-gray-50">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid Body */}
          <div className="grid grid-cols-7">
            {days.map((dayNum, i) => {
              const isEmpty = dayNum === ''
              const isToday = dayNum === 16
              const hasEventoQuaDom = dayNum !== '' && (i % 7 === 2 || i % 7 === 6) // Quartas e Domingos

              return (
                <div key={i} className={`min-h-[120px] p-2 border-b border-r border-gray-100 ${isEmpty ? 'bg-gray-50/50' : 'bg-white hover:bg-blue-50/30 transition-colors cursor-pointer group'}`}>
                  
                  {/* Day Number */}
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

                  {/* Events */}
                  {hasEventoQuaDom && (
                    <div className="mt-1 space-y-1">
                      <div className="px-2 py-1 bg-blue-50 border border-blue-100 rounded text-[10px] font-bold text-blue-600 truncate">
                        11:00 - 🔒 Mentoria IA
                      </div>
                    </div>
                  )}
                  {dayNum === 20 && (
                    <div className="mt-1 space-y-1">
                      <div className="px-2 py-1 bg-purple-50 border border-purple-100 rounded text-[10px] font-bold text-purple-600 truncate">
                        19:00 - Workshop N8N
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </div>
  )
}
