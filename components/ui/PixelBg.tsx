import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PixelBgProps {
  src: string
  alt: string
  priority?: boolean
  overlay?: boolean
  overlayOpacity?: number
}

export default function PixelBg({
  src,
  alt,
  priority = false,
  overlay = false,
  overlayOpacity = 0.4,
}: PixelBgProps) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={85}
        className={cn('object-cover pixel-render')}
        sizes="100vw"
      />
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity}), rgba(0,0,0,${overlayOpacity * 0.5}))`,
          }}
        />
      )}
    </div>
  )
}
