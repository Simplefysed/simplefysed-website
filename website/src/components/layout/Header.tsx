'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Navigation } from './Navigation'
import { MobileMenu } from './MobileMenu'
import { Button } from '@/components/ui'
import { useContactStore } from '@/stores/contactStore'

export function Header() {
  const openModal = useContactStore((s) => s.openModal)
  const pathname = usePathname()
  // /linktree is a standalone link-in-bio card without site chrome.
  if (pathname === '/linktree') return null
  return (
    <motion.header
      data-surface="paper"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-paper/85 backdrop-blur-md border-b border-ink/10 pr-[var(--removed-scrollbar,0px)]"
    >
      <div className="px-8 sm:px-12 lg:pl-32 xl:pl-40 lg:pr-24">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-mark.png"
              alt=""
              width={212}
              height={256}
              priority
              className="h-[26px] w-auto select-none"
            />
            <span className="whitespace-nowrap font-semibold text-lg sm:text-xl tracking-tight text-ink">
              Simplefysed <span className="text-rust">Solutions</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-10">
            <Navigation />
            <Button
              variant="ink"
              onClick={() => openModal()}
              className="rounded-none px-[24px] py-[12px] text-[14px] font-semibold whitespace-nowrap"
            >
              Get Started
            </Button>
          </div>

          <MobileMenu />
        </div>
      </div>
    </motion.header>
  )
}
