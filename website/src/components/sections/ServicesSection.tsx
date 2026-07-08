'use client'

import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { solutions, type Solution } from '@/data/solutions'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

function ProductRow({ product }: { product: Solution }) {
  return (
    <motion.article
      variants={itemVariants}
      className="grid gap-y-7 gap-x-10 py-12 lg:grid-cols-12 lg:py-14"
    >
      {/* Index + title */}
      <div className="flex items-start gap-5 lg:col-span-4">
        <span className="pt-1.5 font-mono text-sm text-ink-muted">
          {product.index}
        </span>
        <h3 className="font-serif text-3xl font-medium leading-[1.08] tracking-[-0.01em] text-ink lg:text-4xl">
          {product.title}
        </h3>
      </div>

      {/* Deck + description */}
      <div className="max-w-lg lg:col-span-5">
        <p className="mb-3 font-serif text-lg italic leading-snug text-ink">
          {product.deck}
        </p>
        <p className="text-[15px] leading-relaxed text-ink-muted">
          {product.description}
        </p>
        <Link
          href={`/solutions#${product.slug}`}
          className="group mt-6 inline-flex items-center gap-2 rounded-none bg-rust px-6 py-3 text-[14px] font-semibold text-paper transition-colors duration-300 hover:bg-rust/90"
        >
          Explore the Solution
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* What ships + best for */}
      <div className="lg:col-span-3">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
          What ships
        </div>
        <ul className="border-t border-ink/10 divide-y divide-ink/10">
          {product.ships.map((item) => (
            <li key={item} className="py-2.5 text-sm leading-snug text-ink">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-7 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
          Best for
        </div>
        <p className="mt-1 text-sm leading-snug text-ink-muted">
          {product.bestFor}
        </p>
      </div>
    </motion.article>
  )
}

export function ServicesSection() {
  return (
    <section
      id="services"
      data-surface="paper"
      className="scroll-mt-16 bg-paper px-8 pt-24 pb-20 sm:px-12 lg:pl-32 lg:pr-24 lg:pt-28 xl:pl-40"
    >
      <div>
        {/* Section header */}
        <div className="mb-14 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted"
          >
            Productized Solutions
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 font-serif text-4xl font-medium leading-[1.04] tracking-[-0.02em] text-ink sm:text-5xl lg:text-[3.6rem]"
          >
            We consult.
            <br />
            <span className="italic text-ink-muted">We architect.</span>
            <br />
            We <span className="text-rust">build.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl text-lg leading-relaxed text-ink-muted"
          >
            No sprawling catalog. No hourly guesswork. Three products carry
            every engagement from first workshop to running software, with
            state-of-the-art AI in every layer.
          </motion.p>
        </div>

        {/* Product index */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          className="border-y border-ink/10 divide-y divide-ink/10"
        >
          {solutions.map((product) => (
            <ProductRow key={product.slug} product={product} />
          ))}
        </motion.div>

        {/* Tertiary CTA */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 text-[15px] text-ink-muted"
        >
          Not sure which product fits?{' '}
          <a
            href="https://calendly.com/vin-simplefysed/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 border-b-[1.6px] border-ink font-semibold text-ink transition-colors hover:border-rust hover:text-rust"
          >
            Schedule a call
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.p>
      </div>
    </section>
  )
}
