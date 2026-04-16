import Image from 'next/image'
import Link from 'next/link'

const FOOTER_LINKS = [
  {
    group: 'Plataforma',
    links: [
      { label: 'Guild', href: '#section-guild' },
      { label: 'Cursos', href: '#section-educacao' },
      { label: 'Ventures', href: '#section-ventures' },
      { label: 'Consultoria', href: '#section-consultoria' },
    ],
  },
  {
    group: 'Legal',
    links: [
      { label: 'Termos', href: '/terms' },
      { label: 'Privacidade', href: '/privacy' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-gipsy-dark text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <p className="[font-family:var(--font-pixel)] text-sm text-white">
              GIPSY VIP
            </p>
            <p className="text-white/50 text-xs leading-relaxed max-w-xs">
              You missed the internet. You missed mobile. Don&apos;t miss AI.
            </p>
            <div className="flex items-center gap-3 pt-2">
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

          {/* Links */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.group} className="space-y-4">
              <p className="text-white/30 text-xs uppercase tracking-widest">{group.group}</p>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/60 text-sm hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            &copy; Gipsy VIP 2026 | by @cigano.agi
          </p>
          {/* Social placeholders — assets F3 pendentes */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" aria-hidden="true" />
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" aria-hidden="true" />
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" aria-hidden="true" />
          </div>
        </div>
      </div>
    </footer>
  )
}
