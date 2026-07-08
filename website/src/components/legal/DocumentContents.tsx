'use client'

interface ContentsItem {
  id: string
  index: string
  title: string
}

// In-page jump index for the legal documents. Uses button + scrollIntoView
// (not #hash links) per the project's in-page-jump convention, so next/link and
// HashScroll do not both fire and overshoot. Targets carry scroll-mt-24 to clear
// the fixed 64px header.
export function DocumentContents({ sections }: { sections: ContentsItem[] }) {
  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }

  return (
    <nav aria-label="Contents">
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
        Contents
      </div>
      <ul className="grid border-t border-ink/10 sm:grid-cols-2 sm:gap-x-12">
        {sections.map((s) => (
          <li key={s.id} className="border-b border-ink/10">
            <button
              type="button"
              onClick={() => jumpTo(s.id)}
              className="group flex w-full cursor-pointer items-baseline gap-4 py-3 text-left"
            >
              <span className="font-mono text-[11px] text-ink-muted">{s.index}</span>
              <span className="text-[15px] leading-snug text-ink transition-colors group-hover:text-rust">
                {s.title}
              </span>
              <span
                aria-hidden="true"
                className="mx-1 flex-1 self-center border-b border-dotted border-ink/25 transition-colors group-hover:border-rust/40"
              />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
