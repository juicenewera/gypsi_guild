import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionDark from '@/components/ui/SectionDark'
import SectionLight from '@/components/ui/SectionLight'
import PageHero from '@/components/sections/PageHero'
import CTABanner from '@/components/sections/CTABanner'
import ButtonRPG from '@/components/ui/ButtonRPG'

export const metadata: Metadata = {
  title: 'Ventures | Gipsy VIP',
  description: 'Ferramentas de IA que criamos porque precisávamos. SARGENTO AI e outros produtos nascidos da necessidade real.',
}

export default function VenturesPage() {
  return (
    <>
      <Navbar />

      <PageHero
        tag="VENTURES"
        tagColor="purple"
        headline={"Ferramentas que\ncriamos porque\nprecisávamos."}
        sub="Quando não encontramos o que precisávamos, construímos. Produtos nascidos da necessidade real de quem trabalha com IA."
        ctaPrimary={{ label: 'Ver Produtos →', href: '#produtos' }}
        imageSrc="/images/heroes/hero-ventures.png"
        overlayOpacity={0.5}
      />

      {/* S2 — Produtos */}
      <SectionLight id="produtos">
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-gipsy-dark text-center">
            Nossos produtos
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* SARGENTO AI */}
            <div className="glass-light rounded-2xl overflow-hidden border border-gray-100 flex flex-col">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src="/images/cards/card-ventures.png"
                  alt="SARGENTO AI"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-8 space-y-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="[font-family:var(--font-pixel)] text-sm text-gipsy-dark leading-tight">
                    SARGENTO AI
                  </h3>
                  <span className="shrink-0 text-xs font-semibold text-gipsy-green bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    Disponível
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                  Agente de prospecção e qualificação de leads. Prospecta, qualifica e agenda reuniões de forma
                  totalmente automatizada. Mais de 1.200 usos e contando.
                </p>
                <ul className="space-y-2">
                  {[
                    'Integração com CRMs populares',
                    'Qualificação automática por ICP',
                    'Agendamento com Google Calendar',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-gipsy-green">▸</span> {f}
                    </li>
                  ))}
                </ul>
                <ButtonRPG href="/register" className="mt-2">
                  Acessar SARGENTO AI →
                </ButtonRPG>
              </div>
            </div>

            {/* Próximo produto */}
            <div className="rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12 space-y-6 text-center min-h-[400px]">
              <span className="text-5xl">🔧</span>
              <span className="text-xs font-semibold text-gipsy-gold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Em Desenvolvimento
              </span>
              <h3 className="[font-family:var(--font-pixel)] text-sm text-gipsy-dark leading-tight">
                Próximo Produto
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Algo novo está sendo construído. Os membros da Guild são os primeiros a saber e testar.
              </p>
              <a
                href="/register"
                className="text-gipsy-blue text-xs font-semibold underline-offset-2 hover:underline"
              >
                Entrar na Guild para saber primeiro
              </a>
            </div>
          </div>
        </div>
      </SectionLight>

      {/* S3 — Storytelling */}
      <SectionDark>
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <span className="[font-family:var(--font-pixel)] text-xs text-gipsy-purple tracking-widest uppercase">
            Por que construímos
          </span>
          <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-white leading-tight">
            Nossas próprias ferramentas
          </h2>
          <div className="space-y-6 text-left">
            <p className="text-white/70 text-base leading-relaxed">
              Quando começamos a trabalhar com IA em escala, percebemos que as ferramentas existentes
              eram genéricas demais ou caras demais para o que precisávamos. Então construímos as nossas.
            </p>
            <p className="text-white/70 text-base leading-relaxed">
              O SARGENTO AI nasceu de uma necessidade real de prospecção automatizada. Depois que testamos
              com nossos próprios clientes e os resultados foram consistentes, abrimos para a comunidade.
            </p>
            <p className="text-white/70 text-base leading-relaxed">
              Não somos uma empresa de software tentando vender para quem trabalha com IA.
              Somos builders de IA que constroem ferramentas para outros builders.
              Essa diferença muda tudo.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
            {[
              { value: '1.200+', label: 'Usos do SARGENTO' },
              { value: '98%', label: 'Taxa de satisfação' },
              { value: '0', label: 'Reuniões de vendas' },
            ].map((s) => (
              <div key={s.label} className="space-y-2">
                <p className="[font-family:var(--font-pixel)] text-xl text-gipsy-gold">{s.value}</p>
                <p className="text-white/50 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionDark>

      <CTABanner
        headline={"Acessar as\nferramentas"}
        sub="Cadastro gratuito na Guild. Acesso ao SARGENTO AI incluso."
        ctaLabel="ACESSAR AS FERRAMENTAS →"
        ctaHref="/register"
      />

      <Footer />
    </>
  )
}
