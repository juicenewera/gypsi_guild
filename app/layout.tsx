import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://gypsi.vip'),
  title: 'Gipsy VIP — A Guild dos Builders de IA',
  description: 'A maior guild de freelancers de IA do Brasil. Aprenda, conecte-se e construa com inteligência artificial.',
  keywords: ['inteligência artificial', 'freelancer IA', 'vibe coding', 'guild IA', 'cursos IA', 'automação IA', 'comunidade IA Brasil'],
  authors: [{ name: '@cigano.agi' }],
  creator: '@cigano.agi',
  openGraph: {
    title: 'Gipsy VIP',
    description: 'A maior guild de builders de IA do Brasil.',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630 }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gipsy VIP — A Guild dos Builders de IA',
    description: 'A maior guild de freelancers de IA do Brasil.',
    images: ['/images/og-image.png'],
    creator: '@cigano_agi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
