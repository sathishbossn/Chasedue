'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { markInvoicePaidManually } from '@/app/dashboard/actions'
import { dispatchInvoiceSync } from '@/lib/chasedue-sync'

type Props = {
  invoiceId: string
  className?: string
}

/**
 * Manual “mark settled” when payment happened outside Razorpay/PayPal (cash, bank, etc.).
 * Sets `status` to paid and `paid_at` to now (server action).
 */
export default function MarkInvoicePaidButton({ invoiceId, className }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await markInvoicePaidManually(invoiceId)
      if (res.ok === false) {
        toast.error(res.error)
        return
      }
      toast.success('Invoice marked as paid.')
      dispatchInvoiceSync()
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={loading}
      className={
        className ??
        'inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/25 disabled:pointer-events-none disabled:opacity-50'
      }
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
      ) : (
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
      )}
      Mark as paid
    </button>
  )
}
