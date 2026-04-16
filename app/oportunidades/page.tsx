import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionDark from '@/components/ui/SectionDark'
import SectionLight from '@/components/ui/SectionLight'
import PageHero from '@/components/sections/PageHero'
import CTABanner from '@/components/sections/CTABanner'

export const metadata: Metadata = {
  title: 'Marketplace de Oportunidades | Gipsy VIP',
  description: 'Jobs, freelas e bounties de IA para quem sabe o que faz.',
}

const TIPOS = [
  {
    name: 'BOUNTIES',
    color: 'text-gipsy-gold',
    border: 'border-amber-200',
    desc: 'Tarefas pontuais com recompensa fixa. Entregou, recebeu. Simples assim.',
    badge: 'De R$200 a R$5.000',
  },
  {
    name: 'FREELAS',
    color: 'text-gipsy-blue',
    border: 'border-blue-200',
    desc: 'Projetos de curto a médio prazo. Escopo definido, pagamento combinado.',
    badge: 'De R$1.000 a R$30.000',
  },
  {
    name: 'CLT · PJ',
    color: 'text-gipsy-green',
    border: 'border-green-200',
    desc: 'Posições fixas em empresas que já operam com IA no core do negócio.',
    badge: 'De R$4.000 a R$25.000/mês',
  },
]

const OPORTUNIDADES = [
  {
    empresa: 'Fintech Alpha',
    cargo: 'Engenheiro de Agentes de IA',
    valor: 'R$15.000/mês',
    tipo: 'PJ Remoto',
    tipoColor: 'text-gipsy-green',
  },
  {
    empresa: 'E-commerce Beta',
    cargo: 'Automação de Atendimento (Bounty)',
    valor: 'R$3.500 fixo',
    tipo: 'Bounty',
    tipoColor: 'text-gipsy-gold',
  },
  {
    empresa: 'SaaS Gama',
    cargo: 'Consultor de Implementação de IA',
    valor: 'R$8.000/projeto',
    tipo: 'Freela',
    tipoColor: 'text-gipsy-blue',
  },
  {
    empresa: 'Agência Delta',
    cargo: 'Especialista em Copy + IA',
    valor: 'R$6.000/mês',
    tipo: 'CLT Remoto',
    tipoColor: 'text-gipsy-green',
  },
  {
    empresa: 'Startup Epsilon',
    cargo: 'Arquiteto de Sistemas de IA',
    valor: 'R$20.000/mês',
    tipo: 'PJ Remoto',
    tipoColor: 'text-gipsy-green',
  },
]

const DIFERENCIAIS_EMPRESA = [
  {
    icon: '🎯',
    title: 'Candidatos qualificados',
    body: 'Todos os membros passaram pelo onboarding de classe. Zero perfis genéricos.',
  },
  {
    icon: '⚡',
    title: 'Resposta em 48h',
    body: 'Nossa comunidade é ativa. Vagas preenchidas mais rápido que qualquer board convencional.',
  },
  {
    icon: '🔒',
    title: 'Perfis verificados',
    body: 'XP real, projetos publicados, reputação na comunidade. Você sabe quem está contratando.',
  },
]

export default function OportunidadesPage() {
  return (
    <>
      <Navbar />

      <PageHero
        tag="MARKETPLACE"
        tagColor="gold"
        headline={"Trabalhos de IA\npara quem sabe\no que faz."}
        sub="Bounties, freelas e posições fixas das empresas que constroem com IA."
        ctaPrimary={{ label: 'Ver Oportunidades →', href: '#oportunidades' }}
        ctaSecondary={{ label: 'Para Empresas', href: '#empresas' }}
        imageSrc="/images/heroes/hero-home.png"
        overlayOpacity={0.5}
      />

      {/* S2 — Tipos */}
      <SectionLight>
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-gipsy-dark text-center">
            Três tipos de oportunidade
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TIPOS.map((tipo) => (
              <div
                key={tipo.name}
                className={`rounded-2xl border-2 ${tipo.border} p-8 space-y-4`}
              >
                <h3 className={`[font-family:var(--font-pixel)] text-lg ${tipo.color}`}>
                  {tipo.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{tipo.desc}</p>
                <span
                  className={`inline-block text-xs font-semibold ${tipo.color} bg-current/10 px-3 py-1 rounded-full`}
                  style={{ backgroundColor: 'transparent', border: '1px solid currentColor' }}
                >
                  {tipo.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SectionLight>

      {/* S3 — Oportunidades em destaque */}
      <SectionDark id="oportunidades">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-center">
            Oportunidades abertas
          </h2>
          <div className="space-y-4">
            {OPORTUNIDADES.map((op) => (
              <div
                key={op.cargo}
                className="glass rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="text-white/40 text-xs uppercase tracking-widest">{op.empresa}</p>
                  <h3 className="text-white font-semibold text-sm">{op.cargo}</h3>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className={`text-xs font-semibold ${op.tipoColor}`}>{op.tipo}</span>
                  <span className="[font-family:var(--font-pixel)] text-xs text-gipsy-gold">
                    {op.valor}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-white/40 text-sm">
            + 40 oportunidades disponíveis para membros verificados
          </p>
        </div>
      </SectionDark>

      {/* S4 — Para Empresas */}
      <SectionLight id="empresas">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-gipsy-dark">
              Você é uma empresa?
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Publique sua vaga e alcance os builders de IA mais qualificados do Brasil.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {DIFERENCIAIS_EMPRESA.map((d) => (
              <div key={d.title} className="space-y-3 text-center">
                <span className="text-3xl block">{d.icon}</span>
                <h3 className="[font-family:var(--font-pixel)] text-xs text-gipsy-dark">{d.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{d.body}</p>
              </div>
            ))}
          </div>
          <div className="max-w-lg mx-auto">
            <form
              action="mailto:contato@gypsi.vip"
              method="post"
              encType="text/plain"
              className="space-y-4"
            >
              <input
                type="text"
                name="empresa"
                placeholder="Nome da empresa"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gipsy-dark placeholder-gray-400 outline-none focus:border-gipsy-blue transition-colors"
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail de contato"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gipsy-dark placeholder-gray-400 outline-none focus:border-gipsy-blue transition-colors"
              />
              <textarea
                name="vaga"
                placeholder="Descreva a oportunidade"
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gipsy-dark placeholder-gray-400 outline-none focus:border-gipsy-blue transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gipsy-dark text-white [font-family:var(--font-pixel)] text-xs hover:bg-gipsy-blue transition-colors"
              >
                PUBLICAR VAGA →
              </button>
            </form>
          </div>
        </div>
      </SectionLight>

      <CTABanner
        headline={"Ver todas as\noportunidades"}
        sub="Cadastro gratuito. Acesso imediato ao mural completo."
        ctaLabel="VER TODAS AS OPORTUNIDADES →"
        ctaHref="/register"
      />

      <Footer />
    </>
  )
}
