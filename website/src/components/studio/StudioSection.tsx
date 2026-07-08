'use client'

import {
  Component,
  ReactNode,
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { useContactStore } from '@/stores/contactStore'

const StudioCanvas = dynamic(() => import('./StudioCanvas'), { ssr: false })

const CALENDLY_URL = 'https://calendly.com/vin-simplefysed/30min'

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}
const getReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
const getServerReducedMotion = () => false

// Two readable 3D button blocks need desktop width; below lg the same two
// actions render as regular DOM buttons over the stage (which also keeps
// them reachable for keyboard and assistive tech on small screens).
function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia('(min-width: 1024px)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}
const getDesktop = () => window.matchMedia('(min-width: 1024px)').matches
const getServerDesktop = () => false

const subscribeNoop = () => () => {}
const getMounted = () => true
const getServerMounted = () => false

// R3F rethrows WebGL renderer failures into React render. Without a boundary
// that would take down the whole home page on machines without WebGL; with
// it, the stage quietly stays an empty paper field.
class StageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

// The studio: a paper photo-studio room where the nameplate drops in, letter
// by letter, followed by two block buttons. Replaces the legacy neon atom
// section.
export function StudioSection() {
  const stageRef = useRef<HTMLDivElement>(null)
  // Start late on purpose: the drop should begin in front of the user, not
  // while the stage is still mostly below the fold. If a fast scroll skips
  // the threshold, crossing it on the way back up still triggers.
  const inView = useInView(stageRef, { once: true, amount: 0.7 })
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  )
  const boxButtons = useSyncExternalStore(
    subscribeDesktop,
    getDesktop,
    getServerDesktop,
  )
  const mounted = useSyncExternalStore(subscribeNoop, getMounted, getServerMounted)
  const [runId, setRunId] = useState(0)
  const [settled, setSettled] = useState(false)

  const openModal = useContactStore((s) => s.openModal)
  const handleSettled = useCallback(() => setSettled(true), [])
  const replay = useCallback(() => {
    setSettled(false)
    setRunId((n) => n + 1)
  }, [])

  return (
    <section data-surface="paper" className="border-b border-ink bg-paper">
      <h2 className="sr-only">The Simplefysed nameplate</h2>

      {/* Desktop (>=1024px) only: the full-height 3D stage + sticky caption.
          The heavy StudioCanvas chunk is dynamic-imported, so gating its
          render on boxButtons keeps three.js off phones and tablets entirely
          (they get the static band below). Keeping the tall container present
          before hydration (!mounted) preserves the desktop layout exactly:
          the stage was always h-dvh from first paint and the canvas simply
          fades in after hydration, as it does today.

          Stage + caption bar fill one full viewport (the hero rule: dvh,
          content slides under the translucent fixed header). The caption row
          takes its natural height and the stage flexes to the rest; the
          caption is sticky so it stays pinned to the fold while the section's
          end is still below the viewport and settles into its natural place
          exactly when the fold is clean. */}
      {(!mounted || boxButtons) && (
        <div className="flex h-dvh min-h-[520px] flex-col">
          <div className="relative min-h-0 flex-1">
            {/* The stage; rendering pauses once the word settles, and replay
                happens only via the caption button below. */}
            <div ref={stageRef} aria-hidden="true" className="h-full w-full">
              <StageBoundary>
                {boxButtons && (
                  <StudioCanvas
                    playing={inView}
                    instant={reducedMotion}
                    settled={settled}
                    runId={runId}
                    withButtons={boxButtons}
                    onSettled={handleSettled}
                    onStartProject={openModal}
                  />
                )}
              </StageBoundary>
            </div>
          </div>

          {/* Plate caption */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="sticky bottom-0 flex shrink-0 flex-col gap-2 border-t border-ink/10 bg-paper px-8 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:px-12 lg:pl-32 lg:pr-24 xl:pl-40"
          >
            <p className="font-serif text-lg italic leading-snug text-ink">
              Everything lands where it should.
            </p>
            {reducedMotion ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                The nameplate, at rest
              </span>
            ) : (
              <button
                type="button"
                onClick={replay}
                className="-mx-2 -my-2 self-start px-2 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted transition-colors hover:text-ink sm:self-auto"
              >
                Drop it again
              </button>
            )}
          </motion.div>
        </div>
      )}

      {/* Mobile (<1024px): a compact static closing CTA band. No WebGL and no
          empty stage; the same two actions the desktop dome offers, plus the
          caption line, laid out as an ordinary Paper & Ink closing register. */}
      {mounted && !boxButtons && (
        <div className="px-8 py-20 sm:px-12 sm:py-24">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-ink/25" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">
              The Next Step
            </span>
          </div>

          <p className="mt-6 max-w-xl font-serif text-[2rem] font-medium leading-[1.08] tracking-[-0.02em] text-ink sm:text-4xl">
            Everything lands where it should.
          </p>

          <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Button
              variant="rust"
              onClick={() => openModal()}
              className="rounded-none px-[30px] py-4 text-[15px] font-semibold"
            >
              Start Your Project
            </Button>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border-b-[1.6px] border-ink px-0.5 py-1 text-[15px] font-semibold text-ink transition-colors hover:border-rust hover:text-rust"
            >
              Schedule a Discovery Call
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      )}
    </section>
  )
}
