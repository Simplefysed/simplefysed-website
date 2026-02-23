'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navigation } from './Navigation'
import { MobileMenu } from './MobileMenu'
import { Button, Logo } from '@/components/ui'
import { useContactStore } from '@/stores/contactStore'

export function Header() {
  const openModal = useContactStore((s) => s.openModal)
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-bg-tertiary/50"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Logo variant={4} size={32} />
            <span className="font-bold text-lg text-text-primary">
              Simplefysed
            </span>
          </Link>

          <Navigation />

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => openModal()}>
              Get Started
            </Button>
          </div>

          <MobileMenu />
        </div>
      </div>
    </motion.header>
  )
}
