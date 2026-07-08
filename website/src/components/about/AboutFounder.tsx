'use client'

import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { AboutFolio } from './AboutFolio'

const fadeUp: Variants = {
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

const glance = [
  'Full-stack web, mobile & AI engineering',
  'Focused on state-of-the-art technology',
  'Runs open-source models on his own GPU',
  'GDPR & German compliance from day one',
  'Works in English & German',
]

export function AboutFounder() {
  return (
    <section
      data-surface="paper"
      className="relative border-t border-ink bg-paper px-8 py-20 sm:px-12 lg:py-24 lg:pl-32 lg:pr-24 xl:pl-40"
    >
      {/* Anchor target offset above the section so hash landings clear the
          fixed header. Next.js Link hash scrolling ignores scroll-margin. */}
      <span
        id="founder"
        aria-hidden="true"
        className="absolute left-0"
        style={{ top: '-6rem' }}
      />

      <AboutFolio left="The Founder" right="In his own words" />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="mb-14 lg:mb-16"
      >
        {/* One line, one claim: single point of contact, workshop behind him */}
        <h2 className="max-w-3xl font-serif text-4xl font-medium leading-[1.06] tracking-[-0.02em] text-ink sm:text-5xl lg:text-[3.6rem]">
          One face. A few more <span className="text-rust">hands.</span>
        </h2>
        <p className="mt-5 font-serif text-xl italic leading-snug text-ink-muted">
          You will always talk to Vin. The rest prefer the workshop.
        </p>
      </motion.div>

      <div className="grid gap-x-10 gap-y-12 lg:grid-cols-12">
        {/* Portrait rail */}
        <div className="lg:col-span-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="max-w-sm lg:sticky lg:top-24"
          >
            <figure>
              {/* Print plate with registration marks in the corners */}
              <div className="relative">
                <span aria-hidden="true" className="absolute -left-2 -top-2 h-4 w-4 border-l border-t border-ink/40" />
                <span aria-hidden="true" className="absolute -right-2 -top-2 h-4 w-4 border-r border-t border-ink/40" />
                <span aria-hidden="true" className="absolute -bottom-2 -left-2 h-4 w-4 border-b border-l border-ink/40" />
                <span aria-hidden="true" className="absolute -bottom-2 -right-2 h-4 w-4 border-b border-r border-ink/40" />
                <div className="relative aspect-[4/5] border border-ink/15 bg-paper-card p-2">
                  {/* Portrait plate. grayscale + multiply keeps the photo on
                      the Paper & Ink palette; object-cover fills the 4:5 frame
                      without changing its scale. */}
                  <div className="relative h-full w-full overflow-hidden border border-ink/10">
                    <Image
                      src="/founder-vin-mangelsdorf.jpg"
                      alt="Vin Mangelsdorf, founder of Simplefysed Solutions"
                      fill
                      sizes="(max-width: 640px) 90vw, 384px"
                      className="object-cover grayscale mix-blend-multiply"
                    />
                  </div>
                </div>
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-ink/10 pt-2.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink">
                  Vin Mangelsdorf &middot; Founder
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                  Germany
                </span>
              </figcaption>
            </figure>

            <div className="mt-10">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                At a glance
              </div>
              <ul className="border-t border-ink/10 divide-y divide-ink/10">
                {glance.map((item) => (
                  <li key={item} className="py-2.5 text-sm leading-snug text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Founder letter */}
        <div className="lg:col-span-7 lg:col-start-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="max-w-2xl border-t border-ink/10 pt-6"
          >
            <div className="mb-8 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
              From the founder
            </div>

            <p className="text-lg leading-relaxed text-ink first-letter:float-left first-letter:mt-1 first-letter:pr-3 first-letter:font-serif first-letter:text-[3.1em] first-letter:font-medium first-letter:leading-[0.78] first-letter:text-ink">
              I take software apart for a living. Before I write a single
              line, I want to know why the current system deserves to exist.
              Most of the time, nobody can tell me. That answer, or the
              silence where it should be, is where every Simplefysed project
              begins.
            </p>

            <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-ink-muted">
              <p>
                The habit started with an inbox. A French hotel evaluation
                firm was spending fifteen to twenty minutes on every inquiry
                email, hundreds of times a month: reading, sorting,
                copy-pasting into Word templates. Everyone assumed they needed
                better software. They didn&rsquo;t. Six of the steps
                didn&rsquo;t need software at all. They needed to stop
                existing. We removed them, automated what remained, and the
                documents now write themselves in seconds. The team reviews
                finished work instead of producing it.
              </p>
              <p>
                That project settled the rule the whole company runs on:
                understand the process before you touch a tool. A rule like
                that decides who does the work. Understanding does not
                delegate. I could have grown a
                normal agency around it. Hire juniors, sell hours, put an
                account manager between you and the code. I chose not to, and
                that choice costs me revenue every month. Simplefysed stays
                deliberately small: three productized solutions, fixed scope,
                and a team you can count on one hand. Two or three
                specialists build behind the scenes. I carry every project
                from the first call to production, and I stay the one person
                you deal with.
              </p>
              <p>
                You are right to wonder what you lose with a team this
                small. Small does not mean narrow. MandateOS, my campaign
                operating system for German elections, is one product across
                three clients on a single backend: a web command center for
                campaign leadership, and native iOS and Android apps for
                volunteers in the field, all of it under German party-finance
                and data-protection law. I built and shipped all three myself.
                And small does not mean behind. I run open-source models on my
                own GPU, install the frameworks the week they release, and test
                them against my own workflows first. You get the state of the
                art after it has survived my desk.
              </p>
              <p>
                So here is the honest filter. If you want a vendor that
                disappears behind a ticket system, we will frustrate you. If
                you want the person who understood your problem to be the
                person who solves it, that is not a feature of this company.
                It is the company.
              </p>
            </div>

            {/* Signature block */}
            <div className="mt-12 border-t border-ink/10 pt-8">
              <div className="font-serif text-3xl italic text-ink">Vin Mangelsdorf</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                Founder, Simplefysed Solutions
              </div>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                <a
                  href="https://www.linkedin.com/in/vin-m-587a70256/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 self-start px-0.5 py-1 text-[15px] font-semibold text-ink border-b-[1.6px] border-ink hover:text-rust hover:border-rust transition-colors"
                >
                  Verify on LinkedIn
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="mailto:vin@simplefysed.com"
                  className="self-start text-[15px] text-ink-muted transition-colors hover:text-rust"
                >
                  Or write to me directly: vin@simplefysed.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
