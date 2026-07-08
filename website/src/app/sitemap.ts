import type { MetadataRoute } from 'next'
import { siteConfig, SITE_UPDATED } from '@/lib/siteConfig'
import { caseStudies } from '@/data/caseStudies'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = SITE_UPDATED

  const staticRoutes = ['', '/about', '/solutions', '/case-studies', '/linktree', '/privacy', '/terms']
  const staticPages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.7,
  }))

  const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${siteConfig.url}/case-studies/${study.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...caseStudyPages]
}
