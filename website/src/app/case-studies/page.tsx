import { CaseStudiesListing } from '@/components/case-studies'
import { pageMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/siteConfig'

export const metadata = pageMetadata({
  title: 'Case Studies',
  description:
    'Real projects, real numbers. Booking platforms, civil-protection systems, AI products, and automations we have built for real businesses.',
  path: '/case-studies',
  ogTitle: 'Case Studies | Simplefysed Solutions',
  ogDescription: 'Real projects, real numbers. A look at what we have shipped.',
})

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Case Studies',
      item: `${siteConfig.url}/case-studies`,
    },
  ],
}

export default function CaseStudiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CaseStudiesListing />
    </>
  )
}
