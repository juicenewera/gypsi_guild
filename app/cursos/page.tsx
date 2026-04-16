import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionDark from '@/components/ui/SectionDark'
import SectionLight from '@/components/ui/SectionLight'
import PageHero from '@/components/sections/PageHero'
import CTABanner from '@/components/sections/CTABanner'

export const metadata: Metadata = {
  title: 'Cursos de IA | Gipsy VIP',
  description: 'Cursos práticos de IA com gamificação RPG. Do prompt engineering até automações que geram renda.',
}

const COURSES = [
  { title: 'Vibe Coding com IA', level: 'Nível 1', status: 'Disponível', statusColor: 'text-gipsy-green' },
  { title: 'Automação de Vendas com Agentes', level: 'Nível 2', status: 'Disponível', statusColor: 'text-gipsy-green' },
  { title: 'Arquitetura de Sistemas de IA', level: 'Nível 3', status: 'Em Breve', statusColor: 'text-gipsy-gold' },
  { title: 'Prospecção Automatizada', level: 'Nível 2', status: 'Disponível', statusColor: 'text-gipsy-green' },
  { title: 'Construindo Produtos com IA', level: 'Nível 3', status: 'Lista de Espera', statusColor: 'text-gipsy-purple' },
  { title: 'IA para Consultores', level: 'Nível 2', status: 'Disponível', statusColor: 'text-gipsy-green' },
]

const DIFERENCIAIS = [
  {
    icon: '🎮',
    title: 'Gamificado',
    body: 'XP, classes, missões. Cada aula completa sobe seu nível e desbloqueia conteúdo.',
  },
  {
    icon: '⚡',
    title: 'Aplicado',
    body: 'Zero teoria sem prática. Cada módulo termina com um entregável real.',
  },
  {
    icon: '🌐',
    title: 'Comunidade',
    body: 'Acesso à Guild: tire dúvidas, mostre projetos, colabore com outros builders.',
  },
]

const FAQ = [
  {
    q: 'Preciso saber programar para fazer os cursos?',
    a: 'Não. Temos cursos para todos os níveis, do iniciante ao avançado. O Nível 1 não exige nenhum conhecimento técnico prévio.',
  },
  {
    q: 'Os cursos têm prazo para serem concluídos?',
    a: 'Não. Após o acesso, o conteúdo fica disponível indefinidamente. Você estuda no seu ritmo.',
  },
  {
    q: 'Posso acessar pelo celular?',
    a: 'Sim. A plataforma é 100% responsiva e funciona em qualquer dispositivo.',
  },
  {
    q: 'Como funciona o sistema de XP?',
    a: 'Cada aula assistida, exercício entregue e missão completa concede XP. O XP sobe seu nível e desbloqueia badges e benefícios na Guild.',
  },
  {
    q: 'Tem certificado?',
    a: 'Sim. Ao completar um curso você recebe um certificado digital com validação na blockchain.',
  },
]

export default function CursosPage() {
  return (
    <>
      <Navbar />

      <PageHero
        tag="EDUCAÇÃO"
        tagColor="blue"
        headline={"Pare de brincar\ncom o ChatGPT."}
        sub="Cursos práticos de IA com progressão RPG. Do primeiro prompt ao agente que fatura por você."
        ctaPrimary={{ label: 'Ver Todos os Cursos →', href: '#cursos' }}
        ctaSecondary={{ label: 'Entrar Grátis', href: '/register' }}
        imageSrc="/images/heroes/hero-educacao.jpg"
        overlayOpacity={0.5}
      />

      {/* S2 — Grade de cursos */}
      <SectionLight id="cursos">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-gipsy-dark">
              Todos os cursos
            </h2>
            <p className="text-gray-500 text-lg">
              Cada curso é uma quest. Cada módulo, uma missão.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course) => (
              <div
                key={course.title}
                className="glass-light rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src="/images/cards/course-cover.png"
                    alt={course.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 uppercase tracking-widest">
                      {course.level}
                    </span>
                    <span className={`text-xs font-semibold ${course.statusColor}`}>
                      {course.status}
                    </span>
                  </div>
                  <h3 className="[font-family:var(--font-pixel)] text-xs text-gipsy-dark leading-tight flex-1">
                    {course.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionLight>

      {/* S3 — Diferenciais */}
      <SectionDark>
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-center">
            Por que é diferente
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {DIFERENCIAIS.map((d) => (
              <div key={d.title} className="glass rounded-2xl p-8 space-y-4 text-center">
                <span className="text-4xl block">{d.icon}</span>
                <h3 className="[font-family:var(--font-pixel)] text-sm text-gipsy-gold">
                  {d.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionDark>

      {/* S4 — FAQ */}
      <SectionLight>
        <div className="max-w-2xl mx-auto space-y-12">
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
      </SectionLight>

      <CTABanner
        headline={"Começar Agora"}
        sub="Crie sua conta grátis e acesse o primeiro módulo hoje."
        ctaLabel="COMEÇAR AGORA →"
        ctaHref="/register"
      />

      <Footer />
    </>
  )
}
