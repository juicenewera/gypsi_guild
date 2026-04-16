import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionDark from '@/components/ui/SectionDark'
import SectionLight from '@/components/ui/SectionLight'
import PageHero from '@/components/sections/PageHero'
import CTABanner from '@/components/sections/CTABanner'

export const metadata: Metadata = {
  title: 'Guild — A Comunidade de Builders de IA | Gipsy VIP',
  description: '200+ membros. 3 classes. Um objetivo: construir com IA e faturar com isso.',
}

const STEPS = [
  {
    num: '01',
    title: 'Escolha sua Classe',
    body: 'Mago (automação), Guerreiro (vendas) ou Mercador (produtos). Cada classe tem habilidades e missões específicas.',
  },
  {
    num: '02',
    title: 'Complete Missões',
    body: 'Adventures semanais, challenges práticos e projetos reais. Cada missão completa ganha XP e sobe seu nível.',
  },
  {
    num: '03',
    title: 'Suba de Nível',
    body: 'XP acumulado desbloqueia badges, conteúdos exclusivos, acesso a oportunidades e reconhecimento da comunidade.',
  },
]

const FEATURES = [
  {
    icon: '💬',
    title: 'Feed da Comunidade',
    body: 'Cases reais, discussões técnicas, showcase de projetos. Zero ruído, só execução.',
  },
  {
    icon: '💼',
    title: 'Mural de Oportunidades',
    body: 'Jobs, freelas e bounties de empresas que já usam IA. Exclusivo para membros verificados.',
  },
  {
    icon: '🤖',
    title: 'Biblioteca de Agentes',
    body: 'Agentes de IA construídos e testados pelos membros. Use, adapte e contribua.',
  },
  {
    icon: '🏆',
    title: 'Ranking & Conquistas',
    body: 'XP, badges, leaderboard mensal. Seja reconhecido pelo que você constrói.',
  },
]

const CLASSES = [
  {
    name: 'MAGO',
    color: 'text-gipsy-purple',
    border: 'border-purple-200',
    tagline: 'System Architect',
    skills: ['Automação de processos', 'Arquitetura de agentes', 'Infraestrutura de IA'],
  },
  {
    name: 'GUERREIRO',
    color: 'text-red-500',
    border: 'border-red-200',
    tagline: 'Revenue Frontline',
    skills: ['Vendas com IA', 'Prospecção automatizada', 'Fechamento de alto ticket'],
  },
  {
    name: 'MERCADOR',
    color: 'text-gipsy-gold',
    border: 'border-amber-200',
    tagline: 'Asset Strategy',
    skills: ['Produtos digitais', 'SaaS e recorrência', 'Estratégia de negócio'],
  },
]

const STATS = [
  { value: '200+', label: 'Membros Ativos' },
  { value: '3', label: 'Classes' },
  { value: '50+', label: 'Missões' },
  { value: 'R$2M+', label: 'Gerado pelos membros' },
]

const TESTIMONIALS = [
  {
    q: 'Em 2 meses usando a Guild, fechei 3 contratos de automação. A comunidade acelera demais.',
    a: 'Carlos M.',
    role: 'Automação',
  },
  {
    q: 'Finalmente um lugar onde todo mundo entende o que você tá fazendo. Sem precisar explicar do zero.',
    a: 'Ana R.',
    role: 'Agentes de IA',
  },
  {
    q: 'O combo Guild + biblioteca de agentes é o diferencial que faltava. Uso toda semana.',
    a: 'Felipe S.',
    role: 'Dev + IA',
  },
]

export default function GuildPage() {
  return (
    <>
      <Navbar />

      <PageHero
        tag="COMUNIDADE GRATUITA"
        tagColor="green"
        headline={"A Guild dos\nBuilders de IA"}
        sub="200+ membros. 3 classes. Um objetivo: construir com IA e faturar com isso."
        ctaPrimary={{ label: 'Entrar Grátis →', href: '/register' }}
        ctaSecondary={{ label: 'Como Funciona', href: '#como-funciona' }}
        imageSrc="/images/heroes/hero-guild.jpg"
        overlayOpacity={0.45}
      />

      {/* S2 — Como funciona */}
      <SectionLight id="como-funciona">
        <div className="max-w-5xl mx-auto text-center space-y-16">
          <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-gipsy-dark">
            Sua jornada começa aqui
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="glass-light rounded-2xl p-8 space-y-4 text-left border border-gray-100"
              >
                <span className="[font-family:var(--font-pixel)] text-3xl text-gipsy-blue">
                  {step.num}
                </span>
                <h3 className="[font-family:var(--font-pixel)] text-sm text-gipsy-dark leading-tight">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionLight>

      {/* S3 — O que tem dentro */}
      <SectionDark>
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-center">
            O que tem lá dentro
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((item) => (
              <div key={item.title} className="glass rounded-2xl p-6 space-y-3">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="[font-family:var(--font-pixel)] text-sm text-gipsy-gold">
                  {item.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionDark>

      {/* S4 — Classes RPG */}
      <SectionLight>
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-gipsy-dark">
              Três caminhos. Uma Guild.
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Especialização é a única forma de atingir performance de elite na era da IA.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {CLASSES.map((cls) => (
              <div
                key={cls.name}
                className={`rounded-2xl border-2 ${cls.border} p-8 space-y-4`}
              >
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">{cls.tagline}</p>
                  <h3 className={`[font-family:var(--font-pixel)] text-xl ${cls.color} mt-1`}>
                    {cls.name}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {cls.skills.map((s) => (
                    <li key={s} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className={`text-xs ${cls.color}`}>▸</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </SectionLight>

      {/* S5 — Stats + Testimonials */}
      <SectionDark>
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="space-y-2">
                <p className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-gipsy-gold">
                  {s.value}
                </p>
                <p className="text-white/60 text-xs uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.a}
                className="glass rounded-2xl p-6 min-w-[280px] max-w-[340px] snap-start flex-shrink-0 space-y-3 text-left"
              >
                <p className="text-white/80 text-sm leading-relaxed italic">&ldquo;{t.q}&rdquo;</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.a}</p>
                  <p className="text-white/40 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionDark>

      <CTABanner
        headline={"Sua guilda\nestá esperando."}
        sub="Cadastro gratuito. Sem cartão. Sem enrolação."
        ctaLabel="ENTRAR NA GUILD AGORA →"
        ctaHref="/register"
      />

      <Footer />
    </>
  )
}
