'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PixelImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  fill?: boolean
  width?: number
  height?: number
  aspectRatio?: string
}

export function PixelImage({
  src,
  alt,
  className,
  priority = false,
  fill = false,
  width,
  height,
  aspectRatio = 'aspect-video'
}: PixelImageProps) {
  return (
    <div className={cn(
      "pixel-dither overflow-hidden bg-bg-surface border-2 border-black",
      !fill && aspectRatio,
      className
    )}>
      <div className="relative w-full h-full grayscale brightness-110 contrast-125">
        <Image
          src={src}
          alt={alt}
          fill={fill || !width}
          width={width}
          height={height}
          priority={priority}
          className="object-cover"
        />
      </div>
    </div>
  )
}
