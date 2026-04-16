import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionDark from '@/components/ui/SectionDark'
import SectionLight from '@/components/ui/SectionLight'
import PixelBg from '@/components/ui/PixelBg'
import ButtonGlass from '@/components/ui/ButtonGlass'
import ButtonRPG from '@/components/ui/ButtonRPG'

export default function Home() {
  return (
    <>
      <Navbar />

      {/* S1 — Hero */}
      <SectionDark className="relative min-h-screen flex items-center justify-center text-center">
        <PixelBg src="/images/heroes/hero-home.png" alt="Gipsy VIP hero" priority overlay />
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 animate-fade-up">
          <span className="[font-family:var(--font-pixel)] text-xs text-gipsy-gold tracking-widest uppercase">
            Guild dos Builders de IA
          </span>
          <h1 className="[font-family:var(--font-pixel)] text-3xl md:text-5xl leading-tight text-white">
            Aprenda IA,<br />Vibe Code e<br />construa o futuro
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            A maior guild de freelancers de IA do Brasil. Aprenda, conecte-se e construa ativos de alto valor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <ButtonRPG href="/register">Entrar na Guild</ButtonRPG>
            <ButtonGlass href="#section-educacao">Explorar</ButtonGlass>
          </div>
        </div>
      </SectionDark>

      {/* S2 — Educação */}
      <SectionLight id="theme-trigger" className="scroll-mt-[72px]">
        <div id="section-educacao" className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <Image
              src="/images/cards/card-educacao.png"
              alt="Educação"
              width={1200}
              height={900}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <span className="[font-family:var(--font-pixel)] text-xs text-gipsy-blue tracking-widest uppercase">Educação</span>
            <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-gipsy-dark leading-tight">
              Pare de brincar com o ChatGPT.<br />Aprenda IA de verdade.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Cursos, lives e classes com gamificação RPG. Do prompt engineering até automações que geram renda.
            </p>
            <ButtonRPG href="/cursos">Ver Cursos</ButtonRPG>
          </div>
        </div>
      </SectionLight>

      {/* S3 — Ventures */}
      <SectionDark id="section-ventures">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <span className="[font-family:var(--font-pixel)] text-xs text-gipsy-purple tracking-widest uppercase">Ventures</span>
            <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-white leading-tight">
              Ferramentas que procuramos,<br />não achamos, e criamos.
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              SARGENTO AI e outros produtos nascidos da necessidade real de quem trabalha com IA todos os dias.
            </p>
            <ButtonGlass href="/ventures">Ver Ventures</ButtonGlass>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[4/3] order-1 md:order-2">
            <Image
              src="/images/cards/card-ventures.png"
              alt="Ventures"
              width={1200}
              height={900}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </SectionDark>

      {/* S4 — Consultoria */}
      <SectionLight id="section-consultoria">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <Image
              src="/images/cards/card-consultoria.png"
              alt="Consultoria"
              width={1200}
              height={900}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <span className="[font-family:var(--font-pixel)] text-xs text-gipsy-gold tracking-widest uppercase">Consultoria</span>
            <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-gipsy-dark leading-tight">
              Diagnóstico e implementação<br />de IA no seu negócio.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Empresas que implementam IA estão tendo resultados extraordinários. A Gipsy VIP foi criada pra você fazer parte desse grupo.
            </p>
            <ButtonRPG href="/consultoria">Falar com a Gente</ButtonRPG>
          </div>
        </div>
      </SectionLight>

      {/* S5 — Guild */}
      <SectionDark className="relative min-h-[70vh] flex items-center justify-center text-center" id="section-guild">
        <PixelBg src="/images/heroes/hero-guild.jpg" alt="Guild" overlay overlayOpacity={0.5} />
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <span className="[font-family:var(--font-pixel)] text-xs text-gipsy-green tracking-widest uppercase">Comunidade</span>
          <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-4xl text-white leading-tight">
            A maior guild de builders de IA do Brasil
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: '200+', label: 'Membros' },
              { value: '3', label: 'Classes' },
              { value: '10K+', label: 'XP Acumulado' },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <p className="[font-family:var(--font-pixel)] text-2xl text-gipsy-gold">{s.value}</p>
                <p className="text-white/60 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
          <ButtonRPG href="/register">Entrar na Guild (grátis)</ButtonRPG>
        </div>
      </SectionDark>

      {/* S6 — Social Proof */}
      <SectionLight id="section-social-proof">
        <div className="max-w-6xl mx-auto space-y-12">
          <h2 className="[font-family:var(--font-pixel)] text-2xl text-gipsy-dark text-center">
            O que dizem os membros
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
            {[
              {
                quote: 'A Guild mudou como eu trabalho com IA. Em 2 meses triplicou minha receita.',
                author: 'Carlos M.',
                role: 'Automação de Vendas',
              },
              {
                quote: 'Finalmente uma comunidade que entrega resultado. Sem enrolação.',
                author: 'Ana R.',
                role: 'Freelancer de IA',
              },
              {
                quote: 'O SARGENTO e os cursos da Guild são o combo que faltava no mercado.',
                author: 'Felipe S.',
                role: 'Dev + IA',
              },
            ].map((t, i) => (
              <div
                key={i}
                className="min-w-[300px] max-w-[380px] snap-start glass-light rounded-2xl p-8 space-y-4 flex-shrink-0"
              >
                <p className="text-gray-700 text-base leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gipsy-dark">{t.author}</p>
                  <p className="text-gray-400 text-sm">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionLight>

      <Footer />
    </>
  )
}
