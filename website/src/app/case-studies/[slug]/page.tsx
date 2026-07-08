import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { caseStudies, getCaseStudy } from '@/data/caseStudies'
import { CaseStudyDetail } from '@/components/case-studies'
import { pageMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/siteConfig'

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)

  if (!study) {
    return { title: 'Case Study Not Found', robots: { index: false } }
  }

  return pageMetadata({
    title: study.title,
    description: study.description,
    path: `/case-studies/${study.slug}`,
    ogType: 'article',
    ogTitle: `${study.title} · ${study.company}`,
  })
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const study = getCaseStudy(slug)

  if (!study) notFound()

  const url = `${siteConfig.url}/case-studies/${study.slug}`
  const publisher = {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon-512.png`,
  }

  // Article establishes the case study as brand-authored content; BreadcrumbList
  // gives search engines the Home > Case Studies > {title} trail for SERP display.
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: study.title,
    description: study.description,
    about: study.company,
    author: publisher,
    publisher,
    url,
    mainEntityOfPage: url,
  }

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
      { '@type': 'ListItem', position: 3, name: study.title, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CaseStudyDetail study={study} />
    </>
  )
}
