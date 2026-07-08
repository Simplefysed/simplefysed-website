import { LinktreeCard } from '@/components/linktree'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Vin Mangelsdorf',
  description:
    'Everything about the founder of Simplefysed Solutions in one place: the company, the writing, and a direct line to a 30-minute call.',
  path: '/linktree',
  ogType: 'profile',
  ogTitle: 'Vin Mangelsdorf | Simplefysed Solutions',
  ogDescription: 'The company, the writing, and a direct line to a 30-minute call.',
})

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vin Mangelsdorf',
  jobTitle: 'Founder',
  worksFor: {
    '@type': 'Organization',
    name: 'Simplefysed Solutions',
    url: 'https://simplefysed.com',
  },
  sameAs: [
    'https://www.linkedin.com/in/vin-m-587a70256/',
    'https://www.instagram.com/vin696',
  ],
}

export default function LinktreePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <LinktreeCard />
    </>
  )
}
