import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionDark from '@/components/ui/SectionDark'
import SectionLight from '@/components/ui/SectionLight'

export const metadata: Metadata = {
  title: 'Sobre | Gipsy VIP',
  description: 'Conheça a Gipsy VIP, o @cigano.agi e a missão de construir a infraestrutura da era da IA.',
}

const PILARES = [
  {
    name: 'Guild',
    href: '/guild',
    icon: '⚔️',
    color: 'text-gipsy-green',
    border: 'border-green-200',
    desc: 'Comunidade gratuita de builders de IA com progressão RPG.',
  },
  {
    name: 'Cursos',
    href: '/cursos',
    icon: '📚',
    color: 'text-gipsy-blue',
    border: 'border-blue-200',
    desc: 'Educação prática de IA com gamificação e missões reais.',
  },
  {
    name: 'Ventures',
    href: '/ventures',
    icon: '⚙️',
    color: 'text-gipsy-purple',
    border: 'border-purple-200',
    desc: 'Ferramentas de IA construídas para quem trabalha com IA.',
  },
  {
    name: 'Consultoria',
    href: '/consultoria',
    icon: '🎯',
    color: 'text-gipsy-gold',
    border: 'border-amber-200',
    desc: 'Diagnóstico e implementação de IA para empresas.',
  },
]

const SOCIAL = [
  { label: 'Instagram', handle: '@cigano.agi', href: 'https://instagram.com/cigano.agi' },
  { label: 'YouTube', handle: '@cigano.agi', href: 'https://youtube.com/@cigano.agi' },
  { label: 'X / Twitter', handle: '@cigano_agi', href: 'https://x.com/cigano_agi' },
  { label: 'GitHub', handle: 'Cigano-agi', href: 'https://github.com/Cigano-agi' },
]

export default function SobrePage() {
  return (
    <>
      <Navbar />

      {/* S1 — Hero (sem PixelBg, dark simples) */}
      <SectionDark className="min-h-[60vh] flex items-center justify-center text-center pt-[72px]">
        <div className="max-w-3xl mx-auto px-4 space-y-6 animate-fade-up">
          <span className="[font-family:var(--font-pixel)] text-xs text-gipsy-gold tracking-widest uppercase">
            @CIGANO.AGI
          </span>
          <h1 className="[font-family:var(--font-pixel)] text-3xl md:text-5xl text-white leading-tight">
            Construindo a<br />infraestrutura<br />da era da IA.
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
            Uma plataforma. Quatro pilares. Um objetivo: colocar builders de IA no centro da economia digital.
          </p>
        </div>
      </SectionDark>

      {/* S2 — Bio + Avatar */}
      <SectionLight>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="[font-family:var(--font-pixel)] text-xs text-gipsy-blue tracking-widest uppercase">
                Quem sou eu
              </span>
              <h2 className="[font-family:var(--font-pixel)] text-2xl text-gipsy-dark leading-tight">
                Builder, não influencer.
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Comecei trabalhando com automação e IA quando a maioria das pessoas ainda não sabia o que era
                um LLM. Aprendi na prática, errando rápido e construindo o que precisava quando não encontrava.
              </p>
              <p className="text-gray-600 text-base leading-relaxed">
                A Gipsy VIP nasceu da minha própria necessidade: uma comunidade séria, ferramentas reais e
                educação que realmente prepara para o mercado de IA.
              </p>
              <p className="text-gray-600 text-base leading-relaxed">
                Não sou o cara que faz cursos sobre IA sem ter usado IA para construir negócios. Cada produto
                e cada conteúdo é validado na prática antes de ser ensinado.
              </p>
            </div>
            <div className="flex flex-col items-center gap-6">
              <Image
                src="/images/avatar-founder.png"
                alt="Fundador Gipsy VIP — @cigano.agi"
                width={400}
                height={400}
                className="rounded-full w-64 h-64 object-cover"
              />
              <div className="flex items-center gap-3">
                <Image
                  src="/images/selo-brasil.png"
                  alt="Feito no Brasil"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <span className="text-gray-400 text-sm">Feito no Brasil</span>
              </div>
            </div>
          </div>
        </div>
      </SectionLight>

      {/* S3 — Quote + Missão */}
      <SectionDark>
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <blockquote className="space-y-4">
            <p className="[font-family:var(--font-pixel)] text-xl md:text-2xl text-white leading-tight">
              &ldquo;You missed the internet.<br />You missed mobile.<br />Don&apos;t miss AI.&rdquo;
            </p>
          </blockquote>
          <div className="pt-8 border-t border-white/10 space-y-6">
            <h2 className="[font-family:var(--font-pixel)] text-lg text-gipsy-gold">Nossa missão</h2>
            <p className="text-white/70 text-base leading-relaxed max-w-2xl mx-auto">
              Construir a maior comunidade de builders de IA do Brasil. Um ecossistema onde quem aprende
              também constrói, quem constrói também ensina, e quem ensina também cresce.
            </p>
          </div>
        </div>
      </SectionDark>

      {/* S4 — 4 Pilares */}
      <SectionLight>
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="[font-family:var(--font-pixel)] text-2xl text-gipsy-dark text-center">
            O ecossistema
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {PILARES.map((pilar) => (
              <Link
                key={pilar.name}
                href={pilar.href}
                className={`rounded-2xl border-2 ${pilar.border} p-8 space-y-3 hover:shadow-md transition-shadow block`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{pilar.icon}</span>
                  <h3 className={`[font-family:var(--font-pixel)] text-sm ${pilar.color}`}>
                    {pilar.name}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{pilar.desc}</p>
                <span className={`text-xs font-semibold ${pilar.color}`}>Saiba mais →</span>
              </Link>
            ))}
          </div>
        </div>
      </SectionLight>

      {/* S5 — Social + Email */}
      <SectionDark>
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <h2 className="[font-family:var(--font-pixel)] text-xl text-white">Onde me encontrar</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-2xl p-5 flex items-center justify-between hover:border-white/25 transition-colors"
              >
                <span className="text-white/60 text-sm">{s.label}</span>
                <span className="[font-family:var(--font-pixel)] text-xs text-gipsy-gold">{s.handle}</span>
              </a>
            ))}
          </div>
          <div className="pt-6 border-t border-white/10">
            <p className="text-white/40 text-sm">
              Email:{' '}
              <a
                href="mailto:contato@gypsi.vip"
                className="text-gipsy-blue hover:text-white transition-colors"
              >
                contato@gypsi.vip
              </a>
            </p>
          </div>
        </div>
      </SectionDark>

      <Footer />
    </>
  )
}
