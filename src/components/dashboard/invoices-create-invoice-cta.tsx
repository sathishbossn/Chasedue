'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FilePlus2, Sparkles, X } from 'lucide-react'

type Props = {
  limitReached: boolean
  openFromQuery: boolean
}

export default function InvoicesCreateInvoiceCta({ limitReached, openFromQuery }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (openFromQuery && limitReached) setOpen(true)
  }, [openFromQuery, limitReached])

  function onCreateClick() {
    if (limitReached) {
      setOpen(true)
      return
    }
    router.push('/invoices/new')
  }

  return (
    <>
      <button
        type="button"
        onClick={onCreateClick}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F97316]/40 bg-gradient-to-r from-[#F97316] to-[#ea580c] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#F97316]/20 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
      >
        <FilePlus2 className="h-4 w-4" aria-hidden />
        Create New Invoice
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="limit-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-[101] w-full max-w-md overflow-hidden rounded-2xl border border-[#F97316]/35 bg-gradient-to-b from-[#1a0a00] to-[#0f0f0f] p-8 shadow-2xl shadow-[#F97316]/25">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-4 inline-flex rounded-full bg-[#F97316]/15 p-3 text-[#F97316]">
              <Sparkles className="h-7 w-7" aria-hidden />
            </div>
            <h2 id="limit-modal-title" className="font-display text-xl font-bold text-white">
              You&apos;ve reached your Starter limit
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/75">
              Upgrade to Pro for unlimited invoices!
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/10"
              >
                Not now
              </button>
              <Link
                href="/dashboard/billing"
                className="inline-flex items-center justify-center rounded-xl bg-[#F97316] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#F97316]/30 transition hover:brightness-110"
              >
                Upgrade to Pro
              </Link>
            </div>
            <p className="mt-5 text-center text-xs text-white/40">
              <Link href="/#pricing" className="text-[#F97316]/90 underline-offset-2 hover:underline">
                Compare plans on the homepage
              </Link>
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}
