'use client'

import { toast } from 'sonner'
import { dispatchInvoiceSync } from '@/lib/chasedue-sync'
import { parseResponseJson } from '@/lib/safe-fetch-json'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void; on: (ev: string, fn: () => void) => void }
  }
}

const CHECKOUT_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'

function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Razorpay is only available in the browser.'))
  }
  if (window.Razorpay) return Promise.resolve()

  const existing = document.querySelector(`script[src="${CHECKOUT_SCRIPT}"]`) as HTMLScriptElement | null
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Razorpay script failed to load.')), { once: true })
    })
  }

  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = CHECKOUT_SCRIPT
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Could not load Razorpay Checkout.'))
    document.body.appendChild(s)
  })
}

function waitForRazorpayReady(): Promise<void> {
  return loadRazorpayScript().then(
    () =>
      new Promise((resolve, reject) => {
        let n = 0
        const id = window.setInterval(() => {
          if (window.Razorpay) {
            window.clearInterval(id)
            resolve()
          } else if (++n > 200) {
            window.clearInterval(id)
            reject(new Error('Razorpay Checkout did not initialize.'))
          }
        }, 50)
      })
  )
}

export type OpenRazorpayCheckoutParams = {
  keyId: string
  orderId: string
  amountPaise: number
  currency: string
  invoiceId: string
  /** Called after verify succeeds and toast is shown */
  onComplete?: () => void
  /** Checkout closed without completing (or after dismiss) */
  onModalDismiss?: () => void
}

export type RazorpaySuccessPayload = {
  invoiceId: string
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

/**
 * Server verifies the Razorpay signature and updates the invoice (status PAID, last_chased_at).
 * Call only from the browser after `response.razorpay_payment_id` is present.
 */
export async function verifyRazorpayPaymentAndUpdateInvoice(
  payload: RazorpaySuccessPayload
): Promise<{ ok: true; alreadyPaid?: boolean } | { ok: false; error: string }> {
  const res = await fetch('/api/razorpay/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const parsed = await parseResponseJson<{ error?: string; ok?: boolean; alreadyPaid?: boolean }>(res)
  if (!parsed.ok) {
    return { ok: false, error: parsed.error }
  }
  const data = parsed.data
  if (!res.ok) {
    return { ok: false, error: data.error ?? 'Payment verification failed.' }
  }
  return { ok: true, alreadyPaid: data.alreadyPaid === true }
}

function resolveKeyId(serverKeyId: string): string {
  const pub = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  if (serverKeyId?.trim()) return serverKeyId.trim()
  if (pub?.trim()) return pub.trim()
  if (typeof window !== 'undefined') {
    console.log('[ChaseDue] Missing env: NEXT_PUBLIC_RAZORPAY_KEY_ID (and no keyId from create-order response)')
  }
  return ''
}

/**
 * Opens Razorpay Checkout for an order created via POST /api/razorpay/create-order.
 * On success, `verifyRazorpayPaymentAndUpdateInvoice` runs (server-side Supabase update).
 */
export async function openRazorpayCheckout(params: OpenRazorpayCheckoutParams): Promise<void> {
  if (typeof window === 'undefined') return
  await waitForRazorpayReady()

  const { keyId, orderId, amountPaise, currency, invoiceId, onComplete, onModalDismiss } = params
  const key = resolveKeyId(keyId)
  if (!key) {
    toast.error('Razorpay key is not configured (NEXT_PUBLIC_RAZORPAY_KEY_ID).')
    return
  }

  const options: Record<string, unknown> = {
    key,
    amount: String(amountPaise),
    currency: currency || 'INR',
    name: 'ChaseDue',
    description: `Invoice ${invoiceId.slice(0, 8)}…`,
    order_id: orderId,
    theme: { color: '#F97316' },
    handler: async (response: {
      razorpay_payment_id: string
      razorpay_order_id: string
      razorpay_signature: string
    }) => {
      const result = await verifyRazorpayPaymentAndUpdateInvoice({
        invoiceId,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      if (result.alreadyPaid) {
        toast.success('This invoice was already marked paid.')
      } else {
        toast.success('Payment Successful! Invoice Updated.')
      }
      dispatchInvoiceSync()
      onComplete?.()
    },
    modal: {
      ondismiss: () => {
        onModalDismiss?.()
      },
    },
  }

  const rzp = new window.Razorpay(options)
  rzp.open()
}
