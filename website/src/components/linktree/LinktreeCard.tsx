'use client'

import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Instagram, Linkedin, Mail } from 'lucide-react'
import { linktreeLinks, type LinkItem } from '@/data/linktree'
import { cn } from '@/lib/utils'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/vin-m-587a70256/',
    icon: Linkedin,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/vin696',
    icon: Instagram,
  },
  {
    label: 'Email',
    href: 'mailto:vin@simplefysed.com',
    icon: Mail,
  },
]

const langLabels: Record<string, string> = { de: 'German' }

function LinkRow({ item }: { item: LinkItem }) {
  const className = cn(
    'group flex min-h-14 w-full items-center justify-between gap-4 rounded-none border px-5 py-4 transition-colors',
    item.primary
      ? 'border-rust bg-rust hover:bg-rust/90'
      : 'border-ink/15 bg-paper-card hover:border-ink'
  )
  const Arrow = item.external ? ArrowUpRight : ArrowRight
  const langNote = item.lang ? (langLabels[item.lang] ?? item.lang) : null
  const inner = (
    <>
      <span className="min-w-0">
        <span
          className={cn(
            'block text-[15px] font-semibold leading-snug',
            item.primary ? 'text-paper' : 'text-ink'
          )}
        >
          {item.label}
        </span>
        {(item.sublabel || langNote) && (
          <span
            className={cn(
              'mt-1 block font-mono text-[10px] uppercase tracking-[0.1em]',
              item.primary ? 'text-paper/80' : 'text-ink-muted'
            )}
          >
            {item.sublabel}
            {item.sublabel && langNote && ' · '}
            {langNote}
          </span>
        )}
      </span>
      <Arrow
        className={cn(
          'h-4 w-4 shrink-0 transition-transform',
          item.external
            ? 'group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
            : 'group-hover:translate-x-1',
          item.primary ? 'text-paper' : 'text-ink'
        )}
      />
    </>
  )

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        hrefLang={item.lang}
        className={className}
      >
        {inner}
      </a>
    )
  }
  return (
    <Link href={item.href} className={className}>
      {inner}
    </Link>
  )
}

export function LinktreeCard() {
  return (
    <div data-surface="paper" className="min-h-dvh bg-paper">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto flex min-h-dvh w-full max-w-[26rem] flex-col px-6 py-12 sm:border-x sm:border-ink/10 sm:px-8 sm:py-16"
      >
        {/* Plate */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="relative">
            <span aria-hidden="true" className="absolute -left-1.5 -top-1.5 h-2.5 w-2.5 border-l border-t border-ink/40" />
            <span aria-hidden="true" className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 border-r border-t border-ink/40" />
            <span aria-hidden="true" className="absolute -bottom-1.5 -left-1.5 h-2.5 w-2.5 border-b border-l border-ink/40" />
            <span aria-hidden="true" className="absolute -bottom-1.5 -right-1.5 h-2.5 w-2.5 border-b border-r border-ink/40" />
            <div className="aspect-[4/5] w-36 border border-ink/15 bg-paper-card p-1">
              {/* Portrait plate. grayscale + multiply keeps the photo on the
                  Paper & Ink palette; object-cover fills the 4:5 frame. */}
              <div className="relative h-full w-full overflow-hidden border border-ink/10">
                <Image
                  src="/founder-vin-mangelsdorf.jpg"
                  alt="Vin Mangelsdorf"
                  fill
                  sizes="144px"
                  className="object-cover grayscale mix-blend-multiply"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Identity */}
        <motion.h1
          variants={itemVariants}
          className="mt-6 text-center font-serif text-3xl font-medium leading-tight tracking-[-0.01em] text-ink"
        >
          Vin Mangelsdorf
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-2.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted"
        >
          Founder, Simplefysed Solutions
        </motion.p>
        <motion.p
          variants={itemVariants}
          className="mx-auto mt-4 max-w-[19rem] text-center text-[15px] leading-relaxed text-ink-muted"
        >
          I build the systems that let companies run on less.
        </motion.p>

        <motion.span
          variants={itemVariants}
          aria-hidden="true"
          className="mx-auto mt-8 h-px w-10 bg-ink/20"
        />

        {/* Link stack */}
        <motion.nav
          variants={itemVariants}
          aria-label="Vin Mangelsdorf's links"
          className="mt-8 flex flex-col gap-3"
        >
          {linktreeLinks.map((item, i) => {
            const showGroup = item.group && item.group !== linktreeLinks[i - 1]?.group
            return (
              <Fragment key={item.href}>
                {showGroup && (
                  <div className="pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                    {item.group}
                  </div>
                )}
                <LinkRow item={item} />
              </Fragment>
            )
          })}
        </motion.nav>

        {/* Socials */}
        <motion.div variants={itemVariants} className="mt-10 flex justify-center gap-6">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="p-1 text-ink-muted transition-colors hover:text-rust"
            >
              <social.icon size={20} />
            </a>
          ))}
        </motion.div>

        {/* Colophon */}
        <motion.p
          variants={itemVariants}
          className="mt-auto pt-12 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted/70"
        >
          Simplefysed Solutions
        </motion.p>
      </motion.div>
    </div>
  )
}
