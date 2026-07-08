import { SolutionsHero, SolutionChapter, SolutionsCTA } from '@/components/solutions'
import { solutions } from '@/data/solutions'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Productized Solutions',
  description:
    'Three productized solutions in depth: Operations Engineering, Product Engineering, and AI Augmentation. What each one is, why it works, who it fits, and what it returns.',
  path: '/solutions',
})

export default function SolutionsPage() {
  return (
    <>
      <SolutionsHero />
      {solutions.map((solution) => (
        <SolutionChapter key={solution.slug} solution={solution} />
      ))}
      <SolutionsCTA />
    </>
  )
}
