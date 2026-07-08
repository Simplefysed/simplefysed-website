'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, Variants } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

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

// The site's destinations, numbered like pages in a broadsheet index.
const siteIndex = [
  { label: 'Home', href: '/', page: '01' },
  { label: 'Solutions', href: '/solutions', page: '02' },
  { label: 'Case Studies', href: '/case-studies', page: '03' },
  { label: 'About', href: '/about', page: '04' },
  { label: 'How We Operate', href: '/about#how-we-operate', page: '05' },
]

const elsewhere = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vin-m-587a70256/' },
  { label: 'Instagram', href: 'https://www.instagram.com/vin696' },
  { label: 'Book 30 minutes', href: 'https://calendly.com/vin-simplefysed/30min' },
]

// The back page of the sheet, printed in negative: the one ink-field section
// on the site. Paper text on ink, no buttons, and an imprint instead of a CTA.
export function Footer() {
  const pathname = usePathname()
  // /linktree is a standalone link-in-bio card without site chrome.
  if (pathname === '/linktree') return null

  return (
    <footer
      data-surface="ink"
      className="flex min-h-dvh flex-col border-t border-paper/10 bg-ink px-8 pb-6 pt-20 sm:px-12 lg:pl-32 lg:pr-24 lg:pt-24 xl:pl-40"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-12"
      >
        {/* Sign-off: the last word goes to the reader */}
        <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-7">
          <p className="max-w-3xl font-serif text-2xl font-medium leading-[1.1] tracking-[-0.01em] text-paper sm:text-3xl lg:text-4xl">
            <span className="block text-paper/45">We don&rsquo;t sell software.</span>
            <span className="block">We sell efficiency.</span>
            <span className="mt-5 block text-paper/45">We don&rsquo;t create workflows.</span>
            <span className="block">We optimize pipelines.</span>
            <span className="mt-5 block text-paper/45">We don&rsquo;t build automations.</span>
            <span className="block">
              We give back the <span className="text-rust">hours.</span>
            </span>
          </p>
          <p className="mt-10 max-w-xl text-base leading-relaxed text-paper/70 sm:text-lg">
            There is so much left to build. Simplefysed delivers the edge modern
            companies are built on: efficient software, automated operations,
            and AI-powered decisions.
          </p>
          <a
            href="mailto:info@simplefysed.com"
            className="group mt-8 inline-flex items-center gap-2 border-b-[1.6px] border-paper px-0.5 py-1 text-base font-semibold text-paper transition-colors hover:border-rust hover:text-rust"
          >
            info@simplefysed.com
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Link rail: both registers in one column behind a print column rule */}
        <div className="sm:col-span-2 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-paper/15 lg:pl-10">
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-1">
            {/* The index: dotted leaders and page numbers, like a table of contents */}
            <motion.nav variants={itemVariants} aria-label="Site index">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/50">
                The Index
              </div>
              <ul>
                {siteIndex.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-baseline py-2 text-[15px] text-paper/80 transition-colors hover:text-paper"
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="mx-3 flex-1 border-b border-dotted border-paper/25"
                      />
                      <span
                        aria-hidden="true"
                        className="font-mono text-[11px] text-paper/40 transition-colors group-hover:text-rust"
                      >
                        {item.page}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>

            {/* Off the page: same register anatomy, arrows instead of page numbers */}
            <motion.div variants={itemVariants}>
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/50">
                Elsewhere
              </div>
              <ul>
                {elsewhere.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline py-2 text-[15px] text-paper/80 transition-colors hover:text-paper"
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="mx-3 flex-1 border-b border-dotted border-paper/25"
                      />
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-3.5 w-3.5 self-center text-paper/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rust"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Spacer: absorbs the spare height so the footer always spans one screen,
          pinning the nameplate + imprint to the fold (the CLAUDE.md hero rule,
          applied to the footer). Keeps a minimum gap when content overflows. */}
      <div aria-hidden="true" className="min-h-16 flex-1 lg:min-h-20" />

      {/* Nameplate: the masthead reprinted on the back of the sheet */}
      <motion.p
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="whitespace-nowrap font-serif text-[clamp(2.75rem,11vw,9rem)] font-medium leading-none tracking-[-0.02em] text-paper"
      >
        Simplefysed<span className="text-rust">.</span>
      </motion.p>

      {/* Imprint: two rules of end matter, motto and print run first, legal last */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-8 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/45"
      >
        <div className="flex flex-col gap-2 border-t border-paper/15 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
          <span>Fewer tools &middot; Fewer people &middot; More output</span>
          <span>
            19 agents in production &middot; 3,876 tasks / month &middot; ~30
            hours returned / wk
          </span>
        </div>
        <div className="flex flex-col gap-2 border-t border-paper/15 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
          <span>
            &copy; {new Date().getFullYear()} Simplefysed Solutions &middot;
            Founded and run by Vin Mangelsdorf
          </span>
          <span className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-paper">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-paper">
              Terms
            </Link>
          </span>
        </div>
      </motion.div>
    </footer>
  )
}
