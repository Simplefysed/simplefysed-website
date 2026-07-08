// Single source of truth for site-wide SEO / social metadata.
// Consumed by the root layout, the manifest, robots, sitemap, and every page's
// metadata so the site name, URL, and default share card are defined once.
export const siteConfig = {
  name: 'Simplefysed Solutions',
  shortName: 'Simplefysed',
  url: 'https://simplefysed.com',
  description:
    'Simplefysed is a software and AI engineering company. We remove the steps that should not exist, then build and run the software that replaces them.',
  ogImage: '/og-image.png',
  ogImageAlt: 'Simplefysed Solutions, a software and AI engineering company',
  locale: 'en_US',
} as const

// Stable "content last updated" date for sitemap lastmod. Bump this when the
// site's content changes meaningfully, instead of using build time (`new Date()`)
// which resets every page's lastmod on every deploy.
export const SITE_UPDATED = new Date('2026-07-08')
