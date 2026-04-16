import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionDark from '@/components/ui/SectionDark'
import SectionLight from '@/components/ui/SectionLight'
import PageHero from '@/components/sections/PageHero'
import CTABanner from '@/components/sections/CTABanner'
import ButtonRPG from '@/components/ui/ButtonRPG'

export const metadata: Metadata = {
  title: 'Biblioteca de Agentes de IA | Gipsy VIP',
  description: 'Agentes de IA construídos e testados em batalha pelos membros da Guild. Use, adapte e contribua.',
}

const CATEGORIES = [
  { icon: '💼', name: 'Vendas & CRM' },
  { icon: '✍️', name: 'Copywriting' },
  { icon: '📊', name: 'Análise de Dados' },
  { icon: '📬', name: 'Atendimento' },
  { icon: '⚙️', name: 'Automação' },
  { icon: '💻', name: 'Desenvolvimento' },
]

const AGENTS = [
  {
    name: 'SARGENTO AI',
    category: 'Vendas & CRM',
    categoryColor: 'text-gipsy-blue',
    desc: 'Prospecta, qualifica leads e agenda reuniões de forma totalmente automatizada.',
    author: '@cigano.agi',
    uses: '1.2k',
  },
  {
    name: 'Prospec-Bot',
    category: 'Vendas & CRM',
    categoryColor: 'text-gipsy-blue',
    desc: 'Coleta e enriquece dados de prospecção em múltiplas plataformas simultaneamente.',
    author: '@rafael_ia',
    uses: '847',
  },
  {
    name: 'Copy-Mago',
    category: 'Copywriting',
    categoryColor: 'text-gipsy-purple',
    desc: 'Gera copy de alta conversão para anúncios, emails e landing pages com base no público-alvo.',
    author: '@ana_builds',
    uses: '634',
  },
  {
    name: 'Data-Scout',
    category: 'Análise de Dados',
    categoryColor: 'text-gipsy-gold',
    desc: 'Analisa planilhas e bancos de dados, gera relatórios e insights automáticos em segundos.',
    author: '@carlos_m',
    uses: '521',
  },
  {
    name: 'Reply-Fast',
    category: 'Atendimento',
    categoryColor: 'text-gipsy-green',
    desc: 'Responde mensagens de clientes com tom personalizado e escala para humanos quando necessário.',
    author: '@lucia_ops',
    uses: '412',
  },
  {
    name: 'Vibe-Dev',
    category: 'Desenvolvimento',
    categoryColor: 'text-red-400',
    desc: 'Gera, refatora e documenta código em múltiplas linguagens com contexto de negócio.',
    author: '@felipe_s',
    uses: '389',
  },
]

const SUBMIT_STEPS = [
  {
    num: '01',
    title: 'Documente seu agente',
    body: 'Descreva o que ele faz, quais ferramentas usa e os resultados que entrega.',
  },
  {
    num: '02',
    title: 'Submeta para revisão',
    body: 'Nossa equipe testa o agente em produção antes de publicar na biblioteca.',
  },
  {
    num: '03',
    title: 'Ganhe reconhecimento',
    body: 'Agentes aprovados rendem XP, badge de Contributor e destaque no leaderboard.',
  },
]

export default function AgentesPage() {
  return (
    <>
      <Navbar />

      <PageHero
        tag="BIBLIOTECA DE AGENTES"
        tagColor="purple"
        headline={"Agentes de IA\nconstruídos em\nbatalha."}
        sub="Testados por quem usa no dia a dia. Prontos para você usar, adaptar e melhorar."
        ctaPrimary={{ label: 'Explorar Biblioteca →', href: '#agentes' }}
        ctaSecondary={{ label: 'Submeter Agente', href: '#contribuir' }}
        imageSrc="/images/heroes/hero-home.png"
        overlayOpacity={0.5}
      />

      {/* S2 — Categorias */}
      <SectionLight>
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-gipsy-dark">
              Explorar por categoria
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="glass-light rounded-2xl p-6 flex items-center gap-4 border border-gray-100 cursor-pointer hover:border-gray-300 transition-colors"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-gipsy-dark font-semibold text-sm">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionLight>

      {/* S3 — Agentes em destaque */}
      <SectionDark id="agentes">
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-center">
            Agentes em destaque
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AGENTS.map((agent) => (
              <div key={agent.name} className="glass rounded-2xl p-6 space-y-4 flex flex-col">
                <div className="space-y-1">
                  <span className={`text-xs ${agent.categoryColor} font-semibold uppercase tracking-wider`}>
                    {agent.category}
                  </span>
                  <h3 className="[font-family:var(--font-pixel)] text-sm text-white leading-tight">
                    {agent.name}
                  </h3>
                </div>
                <p className="text-white/70 text-sm leading-relaxed flex-1">{agent.desc}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-white/40 text-xs">{agent.author}</span>
                  <span className="text-white/40 text-xs">{agent.uses} usos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionDark>

      {/* S4 — Como contribuir */}
      <SectionLight id="contribuir">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-gipsy-dark">
              Construiu um agente que funciona?
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Submeta para a biblioteca e ajude outros membros a escalar mais rápido.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {SUBMIT_STEPS.map((step) => (
              <div key={step.num} className="space-y-4 text-center">
                <span className="[font-family:var(--font-pixel)] text-3xl text-gipsy-blue block">
                  {step.num}
                </span>
                <h3 className="[font-family:var(--font-pixel)] text-sm text-gipsy-dark">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <ButtonRPG href="/register">Submeter Agente</ButtonRPG>
          </div>
        </div>
      </SectionLight>

      <CTABanner
        headline={"Acesso completo\ncom cadastro gratuito."}
        sub="Sem cartão de crédito. Sem período de teste. É gratuito de verdade."
        ctaLabel="CRIAR CONTA GRÁTIS →"
        ctaHref="/register"
      />

      <Footer />
    </>
  )
}
