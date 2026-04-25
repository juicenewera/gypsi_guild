'use client'

import { useMemo } from 'react'
import { ExternalLink } from 'lucide-react'

type Provider = 'youtube' | 'drive' | 'vimeo' | 'bunny' | 'mp4' | 'unknown'

type DetectResult = {
  provider: Provider
  embedUrl: string
  originalUrl: string
}

function detect(url: string): DetectResult {
  const u = url.trim()

  // YouTube: youtube.com/watch?v=ID | youtu.be/ID | youtube.com/embed/ID
  const ytWatch = u.match(/(?:youtube\.com\/watch\?[^#]*[?&]?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/)
  if (ytWatch) {
    return { provider: 'youtube', embedUrl: `https://www.youtube.com/embed/${ytWatch[1]}`, originalUrl: u }
  }

  // Google Drive: /file/d/ID/view  |  open?id=ID
  const driveFile = u.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (driveFile) {
    return { provider: 'drive', embedUrl: `https://drive.google.com/file/d/${driveFile[1]}/preview`, originalUrl: u }
  }
  const driveOpen = u.match(/drive\.google\.com\/open\?id=([^&]+)/)
  if (driveOpen) {
    return { provider: 'drive', embedUrl: `https://drive.google.com/file/d/${driveOpen[1]}/preview`, originalUrl: u }
  }

  // Vimeo: vimeo.com/ID | player.vimeo.com/video/ID
  const vimeo = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) {
    return { provider: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeo[1]}`, originalUrl: u }
  }

  // Bunny Stream: iframe.mediadelivery.net/embed/LIB/VID
  if (/iframe\.mediadelivery\.net\/embed\//i.test(u)) {
    return { provider: 'bunny', embedUrl: u, originalUrl: u }
  }

  // Direct MP4/WebM/MOV
  if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(u)) {
    return { provider: 'mp4', embedUrl: u, originalUrl: u }
  }

  return { provider: 'unknown', embedUrl: u, originalUrl: u }
}

export function detectVideoProvider(url: string): Provider {
  return detect(url).provider
}

export function VideoEmbed({ url, title }: { url: string; title?: string }) {
  const { provider, embedUrl, originalUrl } = useMemo(() => detect(url), [url])

  if (!url) {
    return (
      <div className="aspect-video w-full rounded-2xl bg-gray-900 flex items-center justify-center text-gray-400 text-sm">
        Sem vídeo disponível.
      </div>
    )
  }

  if (provider === 'mp4') {
    return (
      <video
        src={embedUrl}
        controls
        playsInline
        className="aspect-video w-full rounded-2xl bg-black"
      />
    )
  }

  if (provider === 'unknown') {
    return (
      <div className="aspect-video w-full rounded-2xl bg-gray-900 text-white flex flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-sm">Provedor de vídeo não reconhecido.</p>
        <a
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-full"
        >
          Abrir em nova aba <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    )
  }

  return (
    <iframe
      src={embedUrl}
      title={title || 'Vídeo da aula'}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className="aspect-video w-full rounded-2xl bg-black border-0"
    />
  )
}
