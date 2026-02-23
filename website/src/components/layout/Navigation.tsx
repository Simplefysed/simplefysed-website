'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Opportunities', href: '/#opportunities' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-8">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'relative text-sm font-medium transition-colors duration-300',
              isActive
                ? 'text-neon-cyan'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {item.label}
            {isActive && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-cyan rounded-full" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export { navItems }
