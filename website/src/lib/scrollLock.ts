// Viewport scroll lock that never shifts the page sideways.
//
// Hiding the page scrollbar (classic Windows scrollbars) widens the viewport
// and the whole layout jumps right. html has scrollbar-gutter: stable, which
// Firefox honors even while overflow is hidden, but Chromium drops the
// reserved gutter on the root. So: lock first, measure how much width
// actually appeared, and publish exactly that as --removed-scrollbar.
// Elements that span the viewport (body, the fixed header, modal containers)
// consume it as padding-right, which is 0px wherever the engine already
// keeps the gutter.
let locks = 0

export function lockScroll() {
  locks++
  if (locks > 1) return
  const root = document.documentElement
  // Calibrate against real LAYOUT width (the body box), never clientWidth:
  // with the gutter reserved, Chromium keeps layout at the gutted width while
  // documentElement.clientWidth misleadingly grows by the gutter, which would
  // fake a delta and over-compensate.
  const bodyBefore = document.body.offsetWidth
  root.style.overflow = 'hidden'
  const gained = document.body.offsetWidth - bodyBefore
  if (gained > 0) {
    root.style.setProperty('--removed-scrollbar', `${gained}px`)
  }
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks > 0) return
  const root = document.documentElement
  root.style.overflow = ''
  root.style.removeProperty('--removed-scrollbar')
}
