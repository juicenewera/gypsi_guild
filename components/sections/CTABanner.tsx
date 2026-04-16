import SectionDark from '@/components/ui/SectionDark'
import PixelBg from '@/components/ui/PixelBg'
import ButtonRPG from '@/components/ui/ButtonRPG'

interface CTABannerProps {
  headline: string
  sub?: string
  ctaLabel: string
  ctaHref: string
}

export default function CTABanner({ headline, sub, ctaLabel, ctaHref }: CTABannerProps) {
  const headlineLines = headline.split('\n')

  return (
    <SectionDark className="relative py-32 flex items-center justify-center text-center">
      <PixelBg src="/images/heroes/banner-cta.png" alt="CTA" overlay overlayOpacity={0.5} />
      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <h2 className="[font-family:var(--font-pixel)] text-2xl md:text-3xl text-white leading-tight">
          {headlineLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < headlineLines.length - 1 && <br />}
            </span>
          ))}
        </h2>
        {sub && <p className="text-white/70 text-lg leading-relaxed">{sub}</p>}
        <ButtonRPG href={ctaHref}>{ctaLabel}</ButtonRPG>
      </div>
    </SectionDark>
  )
}
