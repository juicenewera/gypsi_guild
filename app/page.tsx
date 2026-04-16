import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Users, Zap, Trophy, Check } from 'lucide-react'

function LandingNavbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 text-white max-w-7xl mx-auto w-full">
      <div className="font-serif font-bold text-3xl">Guild</div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-90">
        <Link href="#missoes" className="hover:opacity-70 transition-opacity">Missões</Link>
        <Link href="#cursos" className="hover:opacity-70 transition-opacity">Cursos</Link>
        <Link href="#newsletter" className="hover:opacity-70 transition-opacity">Newsletter</Link>
        <Link href="#sobre" className="hover:opacity-70 transition-opacity">Sobre</Link>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/login" className="text-sm font-medium hover:opacity-70 transition-opacity">
          Entrar
        </Link>
        <Link href="/register" className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-full shadow-lg hover:bg-gray-900 transition-all">
          Entrar na Guild →
        </Link>
      </div>
    </nav>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* ── HERO SECTION ───────────────────────────────────── */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden">
        {/* Usando uma imagem da web que remeta ao aspecto "castelo pixel art" brilhante */}
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <LandingNavbar />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-12">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-xs font-bold text-gray-700 shadow-sm mb-8">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            A rede de quem já está construindo com IA
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-medium text-white leading-[1.1] mb-6 drop-shadow-lg">
            Fora da Guilda, você é apenas<br className="hidden md:block" /> um NPC do seu mercado.
          </h1>

          <p className="text-lg md:text-xl text-white font-medium mb-10 max-w-2xl mx-auto drop-shadow-md leading-relaxed">
            Não é curso. Não é comunidade de estudo.<br />
            É onde practitioners de IA no Brasil se encontram,<br />
            colaboram e fecham negócio.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Link href="/register" className="px-8 py-3.5 bg-black text-white rounded-full font-bold text-sm shadow-xl hover:bg-gray-900 transition-all flex items-center gap-2">
              Entrar na Guild →
            </Link>
            <Link href="#newsletter" className="px-8 py-3.5 bg-white text-black rounded-full font-bold text-sm shadow-xl hover:bg-gray-50 transition-all">
              Newsletter gratuita
            </Link>
          </div>

          <p className="text-xs text-white/80 font-medium tracking-wide drop-shadow-md mt-6">
            Critério de entrada: qual agente você já construiu?
          </p>
        </div>
      </section>

      {/* ── ALVO SECTION (LIGHT) ───────────────────────────── */}
      <section className="py-24 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-6 lg:sticky lg:top-24">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">Para quem é</p>
            <h2 className="text-5xl lg:text-6xl font-serif font-medium text-black leading-tight italic">
              A Guild não é para <br/> todo mundo.<br/>
              <span className="text-blue-600 not-italic font-sans text-3xl font-black uppercase tracking-tight block mt-4">De propósito.</span>
            </h2>
            <div className="w-full max-w-md h-64 rounded-2xl overflow-hidden mt-8 shadow-sm">
              <img src="https://images.unsplash.com/photo-1542314831-c6a4d14d2350?auto=format&fit=crop&w=800&q=80" alt="Pixel city placeholder" className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-500 italic mt-4">
              Curadoria de entrada mantém a rede relevante.<br/>
              Você entra porque já faz — não porque quer aprender.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { num: '01', title: 'Você já fez pelo menos um agente', desc: 'Automação, GPT customizado, n8n, Make, CrewAI — não importa a ferramenta. Importa que você executou.' },
              { num: '02', title: 'Você quer clientes, não certificados', desc: 'A rede tem quem compra, quem terceiriza e quem colabora. Não é escola, é mercado.' },
              { num: '03', title: 'Você sente que trabalha isolado', desc: 'Sem ninguém no entorno que entende o que você está construindo. A Guild muda isso.' },
              { num: '04', title: 'Você quer o mercado, não o hype', desc: 'Aqui você encontra os projetos reais antes de virarem post no LinkedIn.' },
            ].map(card => (
              <div key={card.num} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-500 mb-4 block tracking-widest">{card.num}</span>
                  <h3 className="text-xl font-serif font-bold text-black mb-4 leading-snug">{card.title}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── COMO FUNCIONA (DARK) ───────────────────────────── */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-4">Como funciona</p>
          <h2 className="text-5xl font-serif font-medium text-white italic mb-16">
            Três pilares. Zero fluff.
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', icon: <Users className="w-5 h-5 text-purple-400" />, bg: 'bg-purple-500/10', title: 'R$ 97/mês. Tudo incluso.', desc: 'Comunidade curada, feed de missões, job board da rede, histórico de cohorts. Sem upsell, sem decisão paralela.' },
              { num: '02', icon: <Zap className="w-5 h-5 text-orange-400" />, bg: 'bg-orange-500/10', title: 'Cohorts ao vivo a cada 8 semanas.', desc: 'Com deadline, com entregável. Você sai com algo pronto — não com conteúdo para estudar depois.' },
              { num: '03', icon: <Trophy className="w-5 h-5 text-green-400" />, bg: 'bg-green-500/10', title: 'Missão concluída = resultado real.', desc: 'O feed que só tem resultado real. Cada post tem desafio, solução e resultado mensurável. Sem vago.' },
            ].map(card => (
              <div key={card.num} className="bg-[#111111] border border-white/5 rounded-2xl p-8 text-left relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}>
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-mono text-gray-600">{card.num}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white italic mb-4 relative z-10">{card.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed relative z-10">{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── PROGRESSÃO (LIGHT) ─────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">Progressão</p>
          <h2 className="text-5xl font-serif font-medium text-black italic mb-2">XP que vale algo.</h2>
          <p className="text-lg text-gray-500 italic mb-12">
            Aqui XP não mede quanto você posta. Mede quanto<br/> você entrega.
          </p>

          <div className="space-y-3">
            {[
              { level: 'Aprendiz', desc: 'Aprovado no onboarding', perks: 'Feed, missões, 1 cohort/ano', color: 'bg-gray-400', txt: 'text-gray-400', bgTab: 'bg-gray-50 border-gray-100' },
              { level: 'Builder', desc: '1 missão validada', perks: 'Job board, canais exclusivos, 2 cohorts/ano', color: 'bg-blue-500', txt: 'text-blue-500', bgTab: 'bg-blue-50/30 border-blue-100' },
              { level: 'Mestre', desc: '3 missões validadas', perks: 'Acesso antecipado, badge verificado', color: 'bg-amber-500', txt: 'text-amber-500', bgTab: 'bg-amber-50/30 border-amber-100' },
              { level: 'Fresco pro max', desc: 'Curadoria editorial', perks: 'Cohort fechada + menção na newsletter', color: 'bg-emerald-400', txt: 'text-emerald-500', bgTab: 'bg-emerald-50/30 border-emerald-100' },
            ].map(row => (
              <div key={row.level} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 rounded-xl border ${row.bgTab}`}>
                <div className="flex items-center gap-12 w-1/2">
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <div className={`w-2 h-2 rounded-full ${row.color}`}></div>
                    <span className={`text-xs font-mono uppercase tracking-wider font-bold ${row.txt}`}>{row.level}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600 hidden sm:block">{row.desc}</span>
                </div>
                <div className="flex items-center justify-between w-full sm:w-1/2 mt-4 sm:mt-0">
                  <span className="text-sm italic text-gray-500">{row.perks}</span>
                  <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${row.color} w-3/4 opacity-50`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-12">
            Nível 2 não tem mais acesso porque ficou mais tempo. Tem porque entregou mais.
          </p>
        </div>
      </section>

      {/* ── SOCIAL PROOF (DARK) ────────────────────────────── */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-4">Social Proof</p>
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-white italic mb-2">
                O que membros<br/> estão construindo.
              </h2>
              <p className="text-gray-400 italic">Métricas reais. Sem "aprendi muito".</p>
            </div>
            <button className="px-5 py-2 border border-white/10 text-[10px] text-white font-mono uppercase tracking-widest hover:bg-white/5 transition-colors rounded">
              Ver todas as missões →
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { id: 1, title: '"Automatizar prospecção B2B para SaaS de RH"' },
              { id: 2, title: '"Agente de atendimento que não parece robô"' },
              { id: 3, title: '"Pipeline de conteúdo para agência digital"' },
            ].map(card => (
              <div key={card.id} className="bg-[#111111] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[9px] font-mono text-blue-400 border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 rounded tracking-widest uppercase">Missão Concluída</span>
                  <span className="text-orange-500 text-xs">✦</span>
                </div>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">Desafio</p>
                <h3 className="text-xl font-serif font-bold text-white italic">{card.title}</h3>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── NEWSLETTER (LIGHT) ─────────────────────────────── */}
      <section id="newsletter" className="py-32 bg-[#F9FAFB] border-t border-gray-100 flex items-center justify-center">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="p-8 border border-blue-200/50 border-dashed rounded-2xl bg-white focus-within:border-blue-400 transition-colors">
            <p className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-6">Newsletter Gratuita</p>
            <h2 className="text-4xl font-serif font-medium text-black italic mb-4">
              Antes de entrar na Guild,<br/> leia o que sai dela.
            </h2>
            <p className="text-sm text-gray-500 italic mb-8">
              Toda semana: o que builders de IA estão construindo no BR.<br/>
              Casos reais, sem hype, sem notícia requentada.
            </p>
            <form className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 focus-within:border-gray-800 transition-colors">
              <input type="email" placeholder="Seu melhor email" className="flex-1 px-4 py-3 outline-none text-sm font-medium text-black placeholder-gray-400" required />
              <button type="submit" className="bg-black text-white px-6 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors">
                Quero receber →
              </button>
            </form>
            <div className="flex items-center justify-center gap-6 mt-6">
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">+ 800 Leitores</span>
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">Toda terça-feira</span>
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">Abertura 47%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER / CTA (DARK) ────────────────────────────── */}
      <footer className="bg-[#0A0A0A] pt-32 pb-12 flex flex-col items-center">
        <div className="text-center mb-12 px-6">
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-6">Última Chamada</p>
          <h2 className="text-5xl md:text-7xl font-serif font-medium text-white italic mb-10">
            Não perca o mercado<br/> de IA.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/register" className="px-8 py-4 bg-blue-500 text-white rounded font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-blue-600 transition-colors inline-block w-full sm:w-auto">
              Entrar na Guild - R$ 97/mês →
            </Link>
            <Link href="#newsletter" className="text-[10px] font-mono text-gray-500 underline underline-offset-4 hover:text-white transition-colors uppercase tracking-widest">
              Newsletter gratuita
            </Link>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center">
          <div className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center text-white/50 mb-8 hover:text-white hover:border-white/50 transition-colors cursor-pointer">
            G
          </div>
          <p className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.2em] mb-4">
            © 2026 Gypsi Guild • Cigano.agi
          </p>
          <div className="flex items-center gap-6 text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em]">
            <Link href="/termos" className="hover:text-gray-400">Termos</Link>
            <Link href="/privacidade" className="hover:text-gray-400">Privacidade</Link>
            <Link href="/contato" className="hover:text-gray-400">Contato</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
