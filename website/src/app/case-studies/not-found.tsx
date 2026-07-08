import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CaseStudyNotFound() {
  return (
    <section
      data-surface="paper"
      className="flex min-h-dvh flex-col justify-center bg-paper px-8 py-32 sm:px-12 lg:pl-32 lg:pr-24 xl:pl-40"
    >
      <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
        Error 404
      </p>
      <h1 className="max-w-2xl font-serif text-5xl font-medium leading-[1.04] tracking-[-0.02em] text-ink sm:text-6xl">
        Case study <span className="text-rust">not found.</span>
      </h1>
      <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
        The case study you are looking for does not exist or may have moved.
      </p>
      <div className="mt-9">
        <Link
          href="/case-studies"
          className="group inline-flex items-center gap-2 px-0.5 py-1 text-[15px] font-semibold text-ink border-b-[1.6px] border-ink transition-colors hover:text-rust hover:border-rust"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Case Studies
        </Link>
      </div>
    </section>
  )
}
