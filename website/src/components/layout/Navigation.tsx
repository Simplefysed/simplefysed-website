'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { solutions } from '@/data/solutions'
import { caseStudies } from '@/data/caseStudies'
import { cn } from '@/lib/utils'

interface NavChild {
  label: string
  href: string
  index: string
}

interface NavItem {
  label: string
  href: string
  menuLabel?: string
  children?: NavChild[]
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Solutions',
    href: '/solutions',
    children: solutions.map((s) => ({
      label: s.title,
      href: `/solutions#${s.slug}`,
      index: s.index,
    })),
  },
  {
    label: 'Case Studies',
    href: '/case-studies',
    menuLabel: 'Selected Work',
    children: caseStudies.map((s, i) => ({
      label: s.title,
      href: `/case-studies/${s.slug}`,
      index: String(i + 1).padStart(2, '0'),
    })),
  },
  {
    label: 'About',
    href: '/about',
    menuLabel: 'The Company',
    children: [
      { label: 'The Founder', href: '/about#founder', index: '01' },
      { label: 'The Method', href: '/about#method', index: '02' },
      { label: 'Common Questions', href: '/about#questions', index: '03' },
    ],
  },
  { label: 'How We Operate', href: '/about#how-we-operate' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
      {navItems.map((item) => {
        const isActive = pathname === item.href

        if (!item.children) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative whitespace-nowrap text-[15px] font-medium transition-colors duration-300',
                isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
              )}
            >
              {item.label}
              {isActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-rust rounded-full" />
              )}
            </Link>
          )
        }

        return (
          <div key={item.href} className="group/nav relative flex h-16 items-center">
            <Link
              href={item.href}
              className={cn(
                'relative inline-flex items-center gap-1 whitespace-nowrap text-[15px] font-medium transition-colors duration-300',
                isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
              )}
            >
              {item.label}
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover/nav:rotate-180" />
              {isActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-rust rounded-full" />
              )}
            </Link>

            {/* Dropdown: hover- and focus-revealed, flush under the header hairline */}
            <div className="invisible absolute left-0 top-full w-72 translate-y-1.5 opacity-0 transition-all duration-200 group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100">
              <div
                data-surface="paper"
                className="border-x border-b border-ink/10 bg-paper shadow-[0_16px_32px_-16px_rgba(27,26,23,0.25)] divide-y divide-ink/10"
              >
                <div className="px-4 pt-3 pb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                  {item.menuLabel ?? 'Offered Solutions'}
                </div>
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="flex items-baseline gap-3 px-4 py-3 transition-colors hover:bg-ink/5"
                  >
                    <span className="font-mono text-[11px] text-ink-muted">
                      {child.index}
                    </span>
                    <span className="text-[14px] font-medium text-ink">
                      {child.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </nav>
  )
}

export { navItems }
