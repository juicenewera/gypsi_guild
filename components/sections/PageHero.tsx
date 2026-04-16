import SectionDark from '@/components/ui/SectionDark'
import PixelBg from '@/components/ui/PixelBg'
import ButtonRPG from '@/components/ui/ButtonRPG'
import ButtonGlass from '@/components/ui/ButtonGlass'

const TAG_COLORS: Record<string, string> = {
  blue: 'text-gipsy-blue',
  gold: 'text-gipsy-gold',
  purple: 'text-gipsy-purple',
  green: 'text-gipsy-green',
}

interface PageHeroProps {
  tag: string
  tagColor?: 'blue' | 'gold' | 'purple' | 'green'
  headline: string
  sub: string
  ctaPrimary: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
  imageSrc: string
  overlayOpacity?: number
  minHeight?: string
}

export default function PageHero({
  tag,
  tagColor = 'blue',
  headline,
  sub,
  ctaPrimary,
  ctaSecondary,
  imageSrc,
  overlayOpacity = 0.45,
  minHeight = 'min-h-[80vh]',
}: PageHeroProps) {
  const colorClass = TAG_COLORS[tagColor] ?? TAG_COLORS.blue

  const headlineLines = headline.split('\n')

  return (
    <SectionDark className={`relative ${minHeight} flex items-center justify-center text-center`}>
      <PixelBg src={imageSrc} alt={tag} priority overlay overlayOpacity={overlayOpacity} />
      <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-6 animate-fade-up">
        <span className={`[font-family:var(--font-pixel)] text-xs ${colorClass} tracking-widest uppercase`}>
          {tag}
        </span>
        <h1 className="[font-family:var(--font-pixel)] text-3xl md:text-5xl text-white leading-tight">
          {headlineLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < headlineLines.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
          {sub}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <ButtonRPG href={ctaPrimary.href}>{ctaPrimary.label}</ButtonRPG>
          {ctaSecondary && (
            <ButtonGlass href={ctaSecondary.href}>{ctaSecondary.label}</ButtonGlass>
          )}
        </div>
      </div>
    </SectionDark>
  )
}
