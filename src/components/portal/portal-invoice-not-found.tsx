import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function PortalInvoiceNotFound({ invoiceId }: { invoiceId?: string }) {
  const short = invoiceId?.trim() ? `${invoiceId.slice(0, 8)}…` : null
  return (
    <div className="flex min-h-[100dvh] min-h-screen flex-col items-center justify-center bg-[#0B1220] px-4 pb-[max(2rem,env(safe-area-inset-bottom,0px))] pt-[max(1.5rem,env(safe-area-inset-top,0px))] text-center text-white">
      <div className="mx-auto max-w-md rounded-2xl border border-white/[0.1] bg-white/[0.04] p-8 shadow-xl backdrop-blur-md">
        <FileQuestion className="mx-auto h-14 w-14 text-brand-400/90" aria-hidden />
        <h1 className="mt-5 font-display text-xl font-bold text-white">Invoice not found</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-soft">
          This link may be wrong, expired, or the invoice may have been removed. If you were sent this URL, ask the sender
          for an updated link.
        </p>
        {short ? (
          <p className="mt-4 font-mono text-[11px] text-slate-500">
            Reference: <span className="text-slate-400">{short}</span>
          </p>
        ) : null}
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-xl border border-brand-500/40 bg-brand-500/15 px-5 py-2.5 text-sm font-semibold text-brand-200 transition hover:bg-brand-500/25"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
