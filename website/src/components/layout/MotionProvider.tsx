'use client'

import { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'

// framer-motion 12 respects the OS "reduce motion" preference by default, and
// in this version that path leaves every element frozen at its `initial`
// style (opacity 0 / offset transforms), which blanks the whole site and
// strands the mobile menu off-screen for reduced-motion users. The site's
// motion is gentle editorial fades, so we opt out here and keep reduced
// motion handled where it matters: the CSS block in globals.css tames CSS
// animations, and StudioSection renders its 3D scene instantly.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>
}
