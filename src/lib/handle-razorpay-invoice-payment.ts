'use client'

import { toast } from 'sonner'
import { openRazorpayCheckout } from '@/lib/razorpay'
import { parseResponseJson } from '@/lib/safe-fetch-json'

export type HandleRazorpayInvoicePaymentOptions = {
  invoiceId: string
  /** After Razorpay verifies payment and the invoice is updated server-side */
  onPaid?: () => void
  onModalDismiss?: () => void
}

type CreateOrderJson = {
  error?: string
  keyId?: string
  orderId?: string
  amountPaise?: number
  currency?: string
  invoiceId?: string
}

/**
 * Starts Razorpay Checkout for an invoice (same flow as {@link PayInvoiceButton}).
 * @returns `true` if checkout opened (keep loading until `onPaid` / `onModalDismiss`), `false` if setup failed.
 */
export async function handleRazorpayPayment(options: HandleRazorpayInvoicePaymentOptions): Promise<boolean> {
  const { invoiceId, onPaid, onModalDismiss } = options

  let res: Response
  try {
    res = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId }),
    })
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Network error starting checkout.')
    return false
  }

  const parsed = await parseResponseJson<CreateOrderJson>(res)
  if (!parsed.ok) {
    toast.error(parsed.error)
    return false
  }
  const data = parsed.data

  if (!res.ok) {
    if (data.error === 'Missing API Keys') {
      console.log(
        '[ChaseDue] Razorpay create-order: see NEXT_PUBLIC_RAZORPAY_KEY_ID (or RAZORPAY_KEY_ID) and RAZORPAY_KEY_SECRET'
      )
    }
    toast.error(data.error ?? 'Could not start checkout.')
    return false
  }
  if (!data.keyId || !data.orderId || data.amountPaise == null) {
    toast.error('Invalid order response.')
    return false
  }

  await openRazorpayCheckout({
    keyId: data.keyId,
    orderId: data.orderId,
    amountPaise: data.amountPaise,
    currency: data.currency ?? 'INR',
    invoiceId: data.invoiceId ?? invoiceId,
    onComplete: onPaid,
    onModalDismiss,
  })
  return true
}
