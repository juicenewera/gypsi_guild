import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionDark from '@/components/ui/SectionDark'
import SectionLight from '@/components/ui/SectionLight'
import PageHero from '@/components/sections/PageHero'
import CTABanner from '@/components/sections/CTABanner'

export const metadata: Metadata = {
  title: 'Consultoria em IA | Gipsy VIP',
  description: 'Diagnóstico e implementação de IA no seu negócio. Do mapeamento à automação em produção.',
}

const PILARES = [
  {
    num: '01',
    title: 'DIAGNÓSTICO',
    color: 'text-gipsy-blue',
    desc: 'Mapeamos seus processos, identificamos gargalos e encontramos onde a IA vai gerar o maior retorno com menor fricção.',
    entregavel: 'Relatório de diagnóstico + roadmap de implementação',
  },
  {
    num: '02',
    title: 'AUTOMAÇÃO',
    color: 'text-gipsy-gold',
    desc: 'Construímos e integramos os agentes e automações no seu fluxo real. Sem teoria, só implementação que funciona em produção.',
    entregavel: 'Agentes em produção + documentação técnica',
  },
  {
    num: '03',
    title: 'CAPACITAÇÃO',
    color: 'text-gipsy-green',
    desc: 'Treinamos seu time para operar, ajustar e escalar as soluções de forma independente. IA que você controla.',
    entregavel: 'Treinamento gravado + suporte por 30 dias',
  },
]

const PERFIS = [
  {
    icon: '🚀',
    title: 'Startups',
    desc: 'Você precisa escalar rápido sem contratar mais. A IA pode fazer o trabalho de 3 pessoas desde o início.',
  },
  {
    icon: '🏢',
    title: 'PMEs',
    desc: 'Processos repetitivos, atendimento e vendas podem ser automatizados. Libere seu time para o que realmente importa.',
  },
  {
    icon: '🏗️',
    title: 'Empresas estabelecidas',
    desc: 'Você tem processos consolidados e quer adicionar IA sem quebrar o que já funciona. É exatamente nosso foco.',
  },
]

const FAQ = [
  {
    q: 'Quanto tempo leva uma consultoria?',
    a: 'O diagnóstico leva entre 1 e 2 semanas. A implementação varia de 30 a 90 dias dependendo da complexidade.',
  },
  {
    q: 'Minha empresa precisa ter uma equipe técnica?',
    a: 'Não. Trabalhamos com empresas de todos os perfis técnicos. Nosso processo inclui capacitação para que você consiga operar as soluções de forma independente.',
  },
  {
    q: 'Qual é o investimento mínimo?',
    a: 'Cada projeto é orçado individualmente após o diagnóstico. Agende uma conversa gratuita para entendermos seu caso.',
  },
  {
    q: 'Vocês trabalham com empresas fora do Brasil?',
    a: 'Sim. Atendemos clientes em português e inglês em qualquer país.',
  },
  {
    q: 'O que acontece após a implementação?',
    a: 'Oferecemos suporte por 30 dias após a entrega. Projetos maiores incluem planos de manutenção contínua.',
  },
]

export default function ConsultoriaPage() {
  return (
    <>
      <Navbar />

      <PageHero
        tag="CONSULTORIA"
        tagColor="gold"
        headline={"IA no seu negócio,\ndo diagnóstico\nà implementação."}
        sub="Não vendemos relatórios. Entregamos automações em produção."
        ctaPrimary={{ label: 'Agendar Diagnóstico →', href: '/register' }}
        ctaSecondary={{ label: 'Como Funciona', href: '#como-funciona' }}
        imageSrc="/images/heroes/hero-consultoria.jpg"
        overlayOpacity={0.45}
      />

      {/* S2 — 3 Pilares */}
      <SectionLight id="como-funciona">
        <div className="max-w-5xl mx-auto space-y-16">
          <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-gipsy-dark text-center">
            Nossa metodologia
          </h2>
          <div className="space-y-8">
            {PILARES.map((pilar) => (
              <div
                key={pilar.num}
                className="grid md:grid-cols-[120px_1fr_1fr] gap-6 items-start p-8 rounded-2xl border border-gray-100 glass-light"
              >
                <div>
                  <span className={`[font-family:var(--font-pixel)] text-4xl ${pilar.color}`}>
                    {pilar.num}
                  </span>
                  <h3 className={`[font-family:var(--font-pixel)] text-xs ${pilar.color} mt-2`}>
                    {pilar.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{pilar.desc}</p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Entregável</p>
                  <p className="text-gipsy-dark text-sm font-semibold">{pilar.entregavel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionLight>

      {/* S3 — Founder */}
      <SectionDark>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <span className="[font-family:var(--font-pixel)] text-xs text-gipsy-gold tracking-widest uppercase">
                Quem vai te atender
              </span>
              <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-white leading-tight">
                @cigano.agi
              </h2>
              <p className="text-white/70 text-base leading-relaxed">
                Builder de IA com projetos entregues para empresas de médio porte a grandes corporações.
                Fundador da Gipsy VIP, da Guild e criador do SARGENTO AI.
              </p>
              <p className="text-white/70 text-base leading-relaxed">
                Não terceirizamos. Você fala diretamente com quem vai fazer o trabalho.
              </p>
              <ul className="space-y-2">
                {['200+ membros na Guild', 'R$2M+ gerados pelos membros', 'SARGENTO AI: 1.200+ usos'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                    <span className="text-gipsy-gold text-xs">▸</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center gap-4 order-1 md:order-2">
              <Image
                src="/images/avatar-founder.png"
                alt="Fundador Gipsy VIP"
                width={400}
                height={400}
                className="rounded-full w-64 h-64 object-cover"
              />
              <div className="flex items-center gap-2">
                <Image
                  src="/images/selo-brasil.png"
                  alt="Feito no Brasil"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-white/40 text-xs">Feito no Brasil</span>
              </div>
            </div>
          </div>
        </div>
      </SectionDark>

      {/* S4 — Para quem é + FAQ */}
      <SectionLight>
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="space-y-12">
            <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-gipsy-dark text-center">
              Para quem é
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {PERFIS.map((p) => (
                <div key={p.title} className="glass-light rounded-2xl p-8 space-y-4 border border-gray-100">
                  <span className="text-3xl block">{p.icon}</span>
                  <h3 className="[font-family:var(--font-pixel)] text-xs text-gipsy-dark">{p.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="[font-family:var(--font-pixel)] text-2xl text-gipsy-dark text-center">
              Perguntas frequentes
            </h2>
            <div className="space-y-4">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group border border-gray-200 rounded-2xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none">
                    <span className="text-gipsy-dark font-semibold text-sm pr-4">{item.q}</span>
                    <span className="text-gray-400 text-xl shrink-0 transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </SectionLight>

      <CTABanner
        headline={"Agendar\nDiagnóstico"}
        sub="Conversa gratuita de 30 minutos. Sem compromisso."
        ctaLabel="AGENDAR DIAGNÓSTICO →"
        ctaHref="/register"
      />

      <Footer />
    </>
  )
}
