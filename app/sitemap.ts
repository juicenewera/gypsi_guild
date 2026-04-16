import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://gypsi.vip', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://gypsi.vip/guild', lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: 'https://gypsi.vip/cursos', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: 'https://gypsi.vip/agentes', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.80 },
    { url: 'https://gypsi.vip/oportunidades', lastModified: new Date(), changeFrequency: 'daily', priority: 0.80 },
    { url: 'https://gypsi.vip/consultoria', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: 'https://gypsi.vip/ventures', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: 'https://gypsi.vip/sobre', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
  ]
}
