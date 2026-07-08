'use client'

import { motion, Variants } from 'framer-motion'
import { AboutFolio } from './AboutFolio'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

interface DocketRow {
  label: string
  value: string
}

interface Arrangement {
  kicker: string
  recommended?: boolean
  title: string
  lead: string
  body: string
  docket: DocketRow[]
}

const arrangements: Arrangement[] = [
  {
    kicker: 'Arrangement A · Recommended',
    recommended: true,
    title: 'Managed',
    lead: 'We host it, we run it, we watch it.',
    body: 'Your automations, software, and databases live on our infrastructure for a flat monthly retainer, with error monitoring that catches failures before you would notice them. You get results as a service, and the fastest go-live of the three.',
    docket: [
      { label: 'Runs on', value: 'Our infrastructure' },
      { label: 'Maintained by', value: 'Us, monitoring included' },
      { label: 'Billing', value: 'Flat monthly retainer' },
      { label: 'Go-live', value: 'Fastest of the three' },
    ],
  },
  {
    kicker: 'Arrangement B',
    title: 'Handover',
    lead: 'We build it and run it first.',
    body: 'Once the system is proven in production, we migrate the entire workload onto your systems, with the transfer scoped from the start and documentation written for the next engineer.',
    docket: [
      { label: 'Runs on', value: 'Ours first, then yours' },
      { label: 'You receive', value: 'The entire workload' },
      { label: 'Ships with', value: 'Documentation and handover' },
      { label: 'Best when', value: 'Policy says in-house, speed says now' },
    ],
  },
  {
    kicker: 'Arrangement C',
    title: 'Owned from day one',
    lead: 'Built on your accounts from the first commit.',
    body: 'Your cloud, your automations, your code, your data. We work as contributors in a house you already own.',
    docket: [
      { label: 'Runs on', value: 'Your accounts' },
      { label: 'Yours from', value: 'The first commit' },
      { label: 'Our access', value: 'Scoped, auditable, revocable' },
      { label: 'Best when', value: 'Data may never leave your tenant' },
    ],
  },
]

export function AboutHowWeOperate() {
  return (
    <section
      data-surface="paper"
      className="relative border-t border-ink bg-paper px-8 py-20 sm:px-12 lg:py-24 lg:pl-32 lg:pr-24 xl:pl-40"
    >
      {/* Anchor target offset above the section so hash landings clear the
          fixed header. Next.js Link hash scrolling ignores scroll-margin. */}
      <span
        id="how-we-operate"
        aria-hidden="true"
        className="absolute left-0"
        style={{ top: '-6rem' }}
      />

      <AboutFolio left="How We Operate" right="Three arrangements" />

      <div className="mb-14 lg:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-serif text-4xl font-medium leading-[1.06] tracking-[-0.02em] text-ink sm:text-5xl lg:text-[3.6rem]"
        >
          Who holds the keys<span className="text-rust">?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted"
        >
          Everything we build runs under one of three arrangements. The build
          is the same. What changes is whose accounts it lives on, and who
          keeps it running.
        </motion.p>
      </div>

      {/* The register: three ledger entries between heavy ink rules. The
          recommended entry sits on a tinted full-bleed plate, not in a card. */}
      <motion.ol
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        className="border-y border-ink divide-y divide-ink/10"
      >
        {arrangements.map((arr) => (
          <motion.li
            key={arr.title}
            variants={itemVariants}
            className={
              arr.recommended
                ? 'grid gap-x-10 gap-y-6 py-8 lg:grid-cols-12 lg:py-10 bg-paper-card -mx-8 px-8 sm:-mx-12 sm:px-12 lg:-mx-8 lg:px-8'
                : 'grid gap-x-10 gap-y-6 py-8 lg:grid-cols-12 lg:py-10'
            }
          >
            {/* Designation */}
            <div className="lg:col-span-3">
              <div
                className={
                  arr.recommended
                    ? 'font-mono text-[10px] uppercase tracking-[0.14em] text-ink'
                    : 'font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted'
                }
              >
                {arr.kicker}
              </div>
              <h3
                className={
                  arr.recommended
                    ? 'mt-3 font-serif text-3xl font-medium leading-[1.08] tracking-[-0.01em] text-rust'
                    : 'mt-3 font-serif text-3xl font-medium leading-[1.08] tracking-[-0.01em] text-ink'
                }
              >
                {arr.title}
              </h3>
            </div>

            {/* Prose */}
            <div className="lg:col-span-5">
              <p className="max-w-xl text-[15px] leading-relaxed text-ink-muted">
                <span className="text-ink">{arr.lead}</span> {arr.body}
              </p>
            </div>

            {/* Docket */}
            <dl className="lg:col-span-4">
              {arr.docket.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-2.5 last:border-b-0 last:pb-0"
                >
                  <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                    {row.label}
                  </dt>
                  <dd className="max-w-[16rem] text-right text-sm text-ink">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.li>
        ))}
      </motion.ol>

      {/* No lock-in, stated once for all three */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
          Applies to all three
        </div>
        <p className="mt-2 max-w-2xl font-serif text-xl italic leading-snug text-ink">
          Every arrangement ships handover-ready. A becomes B whenever you
          ask, and you leave with everything.
        </p>
      </motion.div>
    </section>
  )
}
