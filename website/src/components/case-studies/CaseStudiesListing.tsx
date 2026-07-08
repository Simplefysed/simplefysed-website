'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui'
import { caseStudies, caseStudyCategories } from '@/data/caseStudies'
import { CaseStudyCard } from './CaseStudyCard'
import { CaseStudiesCTA } from './CaseStudiesCTA'

export function CaseStudiesListing() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? caseStudies
      : caseStudies.filter((study) => study.category === activeCategory)

  return (
    <>
      {/* Hero: full viewport, left-aligned (Solutions family). The scope docket
          is the closing band pinned to the fold, so the grid section's border-t
          lands at the bottom of the first screen. */}
      <section
        data-surface="paper"
        className="flex min-h-dvh flex-col bg-paper px-8 pt-32 pb-14 sm:px-12 lg:pl-32 lg:pr-24 lg:pt-36 lg:pb-16 xl:pl-40"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 flex-col items-center justify-center text-center"
        >
          <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[0.98] tracking-[-0.02em] text-ink break-words sm:text-7xl lg:text-8xl">
            Real projects.
            <br />
            <span className="italic text-ink-muted">Real</span>{' '}
            <span className="text-rust">numbers.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
            A look at what we have shipped, grouped by the solution that built
            it. Real systems and real numbers, for real businesses across
            Germany, France, and America.
          </p>
          <Button
            variant="ink"
            onClick={() =>
              document
                .getElementById('work')
                ?.scrollIntoView({ behavior: 'instant', block: 'start' })
            }
            className="group mt-9 gap-2 rounded-none px-[30px] py-4 text-[15px] font-semibold"
          >
            Learn More
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </Button>
        </motion.div>

        {/* Scope docket: closing band pinned to the fold */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2 border-t border-ink/10 pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted"
        >
          <span className="text-ink">Selected use cases</span>
          <span>Germany &middot; France &middot; America</span>
          <span>Operations &amp; Product Engineering</span>
        </motion.div>
      </section>

      {/* Filter + grid. scroll-mt clears the fixed header when the hero's
          "Learn More" button scrolls here via scrollIntoView. */}
      <section
        id="work"
        data-surface="paper"
        className="scroll-mt-24 border-t border-ink bg-paper px-8 py-16 sm:px-12 lg:py-20 lg:pl-32 lg:pr-24 xl:pl-40"
      >
        {/* Category filter */}
        <div className="mb-12 flex flex-wrap gap-2">
          {caseStudyCategories.map((category) => {
            const active = activeCategory === category
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-none border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
                  active
                    ? 'border-ink bg-ink text-paper'
                    : 'border-ink/15 text-ink-muted hover:border-ink hover:text-ink'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((study, index) => (
              <CaseStudyCard key={study.slug} study={study} index={index} />
            ))}
          </motion.div>
        ) : (
          <div className="max-w-2xl border-t border-ink/10 pt-8">
            <p className="font-serif text-xl italic leading-snug text-ink-muted">
              Case studies in this category are on the way.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
              We are already building here. Tell us about your project and it
              could be the next one.
            </p>
          </div>
        )}
      </section>

      <CaseStudiesCTA />
    </>
  )
}
