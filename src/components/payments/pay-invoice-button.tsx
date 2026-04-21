'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { handleRazorpayPayment } from '@/lib/handle-razorpay-invoice-payment'

export default function PayInvoiceButton({
  invoiceId,
  className,
  label = 'Pay',
  /** Called after Razorpay payment is verified server-side (portal success screen). */
  onPaymentSettled,
}: {
  invoiceId: string
  className?: string
  /** Button label (e.g. Pay Now on the public portal). */
  label?: string
  onPaymentSettled?: (detail: { method: 'razorpay' }) => void
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onClickPay() {
    setLoading(true)
    const started = await handleRazorpayPayment({
      invoiceId,
      onPaid: () => {
        setLoading(false)
        onPaymentSettled?.({ method: 'razorpay' })
        router.refresh()
      },
      onModalDismiss: () => setLoading(false),
    })
    if (!started) setLoading(false)
  }

  return (
    <button
      type="button"
      onClick={onClickPay}
      disabled={loading}
      className={
        className ??
        'inline-flex items-center gap-1.5 rounded-lg border border-brand-500/35 bg-[#F97316]/15 px-2.5 py-1.5 text-xs font-semibold text-brand-300 transition hover:bg-brand-500/25 disabled:opacity-50 disabled:pointer-events-none'
      }
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <CreditCard className="h-3.5 w-3.5" aria-hidden />}
      {label}
    </button>
  )
}
