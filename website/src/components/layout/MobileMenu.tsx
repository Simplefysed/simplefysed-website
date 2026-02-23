'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems } from './Navigation'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-text-primary hover:text-neon-cyan transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-bg-secondary border-l border-bg-tertiary z-50 p-6"
            >
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-text-primary hover:text-neon-cyan transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'block py-3 px-4 rounded-lg text-lg font-medium transition-all duration-300',
                          isActive
                            ? 'bg-neon-cyan/10 text-neon-cyan'
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
