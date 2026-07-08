import type { ReactNode } from 'react'
import { DocumentContents } from './DocumentContents'

// Shared inline-link idiom for legal prose: ink text with a faint underline that
// warms to rust on hover.
export const linkClass =
  'text-ink underline decoration-ink/30 underline-offset-2 transition-colors hover:text-rust hover:decoration-rust'

export function SubHead({ children }: { children: ReactNode }) {
  return <h3 className="font-serif text-lg font-medium text-ink">{children}</h3>
}

export interface LegalClause {
  id: string
  index: string
  title: string
  body: ReactNode
}

// One numbered clause in the register: index + serif heading on the left, prose
// filling a readable right-column measure. scroll-mt-24 makes the Contents jump
// land clear of the fixed header.
function Clause({ id, index, title, body }: LegalClause) {
  return (
    <div id={id} className="grid scroll-mt-24 gap-x-10 gap-y-4 py-10 lg:grid-cols-12 lg:py-12">
      <div className="lg:col-span-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
          {index}
        </div>
        <h2 className="mt-3 font-serif text-2xl font-medium leading-[1.1] tracking-[-0.01em] text-ink lg:text-3xl">
          {title}
        </h2>
      </div>
      <div className="space-y-4 text-[15px] leading-relaxed text-ink-muted lg:col-span-8 lg:pt-1.5">
        {body}
      </div>
    </div>
  )
}

interface LegalDocumentProps {
  title: string
  standfirst: string
  updated: string
  clauses: LegalClause[]
  complianceTag: string
  complianceNote: ReactNode
}

// The Paper & Ink shell shared by /privacy and /terms: a centered document
// masthead, a Contents jump-index, the numbered clause register, and a closing
// imprint. The register carries no heavy top rule of its own; the section seam
// (border-t border-ink) is the single divider above it.
export function LegalDocument({
  title,
  standfirst,
  updated,
  clauses,
  complianceTag,
  complianceNote,
}: LegalDocumentProps) {
  return (
    <>
      {/* Masthead */}
      <section
        data-surface="paper"
        className="bg-paper px-6 pt-32 pb-16 text-center sm:px-8 lg:pt-36 lg:pb-20"
      >
        <div className="flex items-center justify-center gap-4">
          <span aria-hidden="true" className="h-px w-10 bg-ink/25" />
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-muted">
            Legal
          </span>
          <span aria-hidden="true" className="h-px w-10 bg-ink/25" />
        </div>
        <h1 className="mt-8 font-serif text-5xl font-medium leading-[0.98] tracking-[-0.02em] text-ink sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">
          {standfirst}
        </p>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Last updated &middot; {updated}
        </p>
      </section>

      {/* Document */}
      <section
        data-surface="paper"
        className="border-t border-ink bg-paper px-8 py-16 sm:px-12 lg:py-20 lg:pl-32 lg:pr-24 xl:pl-40"
      >
        <DocumentContents
          sections={clauses.map(({ id, index, title }) => ({ id, index, title }))}
        />

        <div className="mt-12 divide-y divide-ink/10 border-b border-ink lg:mt-16">
          {clauses.map((clause) => (
            <Clause key={clause.id} {...clause} />
          ))}
        </div>

        {/* Imprint */}
        <div className="mt-12 border-t border-ink/10 pt-6">
          <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
            <span>Simplefysed Solutions &middot; Thuringia, Germany</span>
            <span>{complianceTag}</span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
            {complianceNote}
          </p>
        </div>
      </section>
    </>
  )
}
