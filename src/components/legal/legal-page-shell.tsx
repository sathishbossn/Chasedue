import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, Zap } from 'lucide-react'

export default function LegalPageShell({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#F97316]/[0.08] blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#fb923c]/[0.06] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#F97316] transition hover:text-brand-300"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to home
        </Link>

        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.06] shadow-lg shadow-black/30">
            <Zap className="h-6 w-6 text-[#F97316]" strokeWidth={2} aria-hidden />
          </div>
          <div>
            <p className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Chase<span className="gradient-text">Due</span>
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-slate-soft">Last updated: April 13, 2026</p>
          </div>
        </div>

        <article className="legal-content mt-10 space-y-8 rounded-2xl border border-white/[0.1] bg-white/[0.04] p-6 shadow-xl shadow-black/30 backdrop-blur-md sm:p-10">
          {children}
        </article>
      </div>
    </div>
  )
}
