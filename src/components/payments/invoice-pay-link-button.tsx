'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Link2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { saveInvoicePortalPaymentLink } from '@/app/invoices/actions'
import { getBrowserOriginForPortalLink } from '@/lib/public-url'

const copyClass =
  'inline-flex items-center gap-1.5 rounded-lg border border-brand-500/35 bg-[#F97316]/15 px-2.5 py-1.5 text-xs font-semibold text-brand-300 transition hover:bg-brand-500/25 disabled:opacity-50 disabled:pointer-events-none'

const generateClass =
  'inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] bg-white/[0.06] px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.1] disabled:opacity-50 disabled:pointer-events-none'

/** Dashboard invoice list: save portal URL for the current site, then copy to share. */
export default function InvoicePayLinkButton({
  invoiceId,
  paymentLinkUrl,
  classNameCopy,
  classNameGenerate,
}: {
  invoiceId: string
  paymentLinkUrl: string | null | undefined
  classNameCopy?: string
  classNameGenerate?: string
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  /** Optimistic URL after generate, before RSC refresh completes */
  const [localUrl, setLocalUrl] = useState<string | null>(null)

  const savedUrl = (paymentLinkUrl?.trim() || localUrl?.trim()) ?? ''

  async function onGenerate() {
    const origin = getBrowserOriginForPortalLink()
    if (!origin) {
      toast.error('Could not read the current site URL. Refresh and try again.')
      return
    }
    setGenerating(true)
    try {
      const res = await saveInvoicePortalPaymentLink(invoiceId, origin)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      setLocalUrl(res.url)
      startTransition(() => router.refresh())
    } finally {
      setGenerating(false)
    }
  }

  async function onCopy() {
    if (!savedUrl) return
    try {
      await navigator.clipboard.writeText(savedUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy — select the link from your browser or try again.')
    }
  }

  if (savedUrl) {
    return (
      <div className="relative inline-flex">
        <button
          type="button"
          onClick={onCopy}
          className={classNameCopy ?? copyClass}
          title={copied ? 'Copied!' : 'Copy portal payment link'}
          aria-describedby={copied ? 'invoice-link-copied-tip' : undefined}
        >
          <Copy className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Copy
        </button>
        {copied ? (
          <span
            id="invoice-link-copied-tip"
            role="status"
            className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-emerald-500/40 bg-emerald-950/95 px-2 py-1 text-[11px] font-semibold text-emerald-100 shadow-lg"
          >
            Copied!
          </span>
        ) : null}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onGenerate}
      disabled={generating}
      className={classNameGenerate ?? generateClass}
      title="Create a payment link for this invoice using this website's address"
    >
      {generating ? (
        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden />
      ) : (
        <Link2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
      )}
      Generate
    </button>
  )
}
