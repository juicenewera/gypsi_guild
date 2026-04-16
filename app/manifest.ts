import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gipsy VIP',
    short_name: 'Gipsy VIP',
    description: 'A maior guild de builders de IA do Brasil',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#3B82F6',
    icons: [
      { src: '/images/logo-icon.png', sizes: '192x192', type: 'image/png' },
      { src: '/images/logo-icon.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
