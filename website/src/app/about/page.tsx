import {
  AboutCompany,
  AboutFounder,
  AboutMethod,
  AboutHowWeOperate,
  AboutQuestions,
  AboutCTA,
} from '@/components/about'
import { aboutQuestions } from '@/data/about'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'About',
  description:
    'The company, the founder, and the method behind Simplefysed Solutions: a German software and AI engineering company where the person you call is the person who builds.',
  path: '/about',
})

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: aboutQuestions.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <AboutCompany />
      <AboutFounder />
      <AboutMethod />
      <AboutHowWeOperate />
      <AboutQuestions />
      <AboutCTA />
    </>
  )
}
