'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { lockScroll, unlockScroll } from '@/lib/scrollLock'
import { navItems } from './Navigation'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [openItem, setOpenItem] = useState<string | null>(null)
  const pathname = usePathname()

  // Close the drawer and collapse any expanded sub-list together, so a reopen
  // starts clean. Called from every close path (scrim, buttons, links).
  const closeMenu = () => {
    setIsOpen(false)
    setOpenItem(null)
  }

  // Lock the page behind the drawer (shift-free; the fixed header already
  // consumes --removed-scrollbar, and on touch devices the delta is 0).
  useEffect(() => {
    if (!isOpen) return
    lockScroll()
    return () => unlockScroll()
  }, [isOpen])

  return (
    <div className="lg:hidden">
      <button
        onClick={() => (isOpen ? closeMenu() : setIsOpen(true))}
        className="p-2 text-ink hover:text-rust transition-colors"
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
              className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-40"
              onClick={closeMenu}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-sm flex-col border-l border-ink/10 bg-paper"
            >
              <div className="flex shrink-0 justify-end p-6 pb-2">
                <button
                  onClick={closeMenu}
                  className="p-2 text-ink hover:text-rust transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 overflow-y-auto overscroll-contain px-6 pb-10">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href
                  const hasChildren = Boolean(item.children?.length)
                  const isExpanded = openItem === item.href
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className={cn(
                            'flex-1 rounded-lg px-4 py-3 text-lg font-medium transition-all duration-300',
                            isActive
                              ? 'bg-rust/10 text-ink'
                              : 'text-ink-muted hover:text-ink hover:bg-ink/5'
                          )}
                        >
                          {item.label}
                        </Link>
                        {hasChildren && (
                          <button
                            type="button"
                            onClick={() =>
                              setOpenItem(isExpanded ? null : item.href)
                            }
                            className="shrink-0 p-3 text-ink-muted transition-colors hover:text-ink"
                            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.label}`}
                            aria-expanded={isExpanded}
                          >
                            <ChevronDown
                              className={cn(
                                'h-5 w-5 transition-transform duration-300',
                                isExpanded && 'rotate-180'
                              )}
                            />
                          </button>
                        )}
                      </div>

                      {hasChildren && (
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: 0.25,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="overflow-hidden"
                            >
                              <div className="ml-6 mt-1 border-l border-ink/10">
                                {item.children!.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={closeMenu}
                                    className="flex items-baseline gap-3 py-2.5 pl-4 pr-2 text-[15px] text-ink-muted transition-colors hover:text-ink"
                                  >
                                    <span className="font-mono text-[10px] text-ink-muted">
                                      {child.index}
                                    </span>
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
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
