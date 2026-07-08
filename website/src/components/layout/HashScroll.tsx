'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/* Deterministic hash scrolling. The global `scroll-behavior: smooth` CSS
   stalls both the browser's native fragment scroll and the App Router's
   hash handling (the animation starts, is repeatedly cancelled, and the
   page never moves). This component scrolls to the current hash target
   instantly, covering all three navigation paths:
   - full loads and route changes (pathname effect),
   - native fragment navigations (hashchange),
   - same-pathname hash clicks through next/link, which fire neither of
     the above (document click listener).
   Anchor offset is handled by the target elements themselves (invisible
   spans placed -6rem above their sections). */
export function HashScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const scrollToId = (id: string) => {
      const el = document.getElementById(decodeURIComponent(id))
      if (!el) return
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'instant', block: 'start' })
      })
    }

    const scrollToHash = () => {
      const id = window.location.hash.slice(1)
      if (id) scrollToId(id)
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as Element | null)?.closest('a')
      if (!anchor || !anchor.href) return
      const url = new URL(anchor.href)
      if (url.origin !== location.origin || !url.hash) return
      // Cross-page hash links are handled by the pathname effect after
      // the new route commits.
      if (url.pathname !== location.pathname) return
      setTimeout(() => scrollToId(url.hash.slice(1)), 0)
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    // Capture phase: next/link calls preventDefault for client navigation,
    // which would make a bubble-phase listener skip the event.
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('hashchange', scrollToHash)
      document.removeEventListener('click', onClick, true)
    }
  }, [pathname])

  return null
}
