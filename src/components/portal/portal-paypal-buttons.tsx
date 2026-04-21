'use client'

import { useCallback, useMemo } from 'react'
import { FUNDING, PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { parseResponseJson } from '@/lib/safe-fetch-json'

export default function PortalPayPalButtons({
  invoiceId,
  onSuccess,
}: {
  invoiceId: string
  /** After capture API marks invoice paid (portal shows success screen). */
  onSuccess?: () => void
}) {
  const router = useRouter()
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim()

  const createOrder = useCallback(async () => {
    let res: Response
    try {
      res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      })
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : 'Network error.')
    }
    const parsed = await parseResponseJson<{ orderId?: string; error?: string }>(res)
    if (!parsed.ok) {
      throw new Error(parsed.error)
    }
    const data = parsed.data
    if (!res.ok) {
      throw new Error(data.error ?? 'Could not create PayPal order.')
    }
    if (!data.orderId) throw new Error('Invalid PayPal response.')
    return data.orderId
  }, [invoiceId])

  const onApprove = useCallback(
    async (data: { orderID: string }) => {
      let res: Response
      try {
        res = await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderID: data.orderID, invoiceId }),
        })
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Network error.')
        return
      }
      const parsed = await parseResponseJson<{ ok?: boolean; error?: string; alreadyPaid?: boolean }>(res)
      if (!parsed.ok) {
        toast.error(parsed.error)
        return
      }
      const out = parsed.data
      if (!res.ok) {
        toast.error(out.error ?? 'Payment capture failed.')
        return
      }
      if (out.alreadyPaid) {
        toast.success('This invoice was already marked paid.')
      } else {
        toast.success('Payment received — invoice updated.')
      }
      onSuccess?.()
      router.refresh()
    },
    [invoiceId, onSuccess, router]
  )

  const onError = useCallback((err: unknown) => {
    console.error('PayPal checkout error', err)
    toast.error('PayPal could not complete. Try again or use another method.')
  }, [])

  /** PayPal-hosted iframes; we wrap in ChaseDue shells for alignment on dark UI. */
  const paypalStyle = useMemo(
    () =>
      ({
        layout: 'vertical',
        shape: 'rect',
        label: 'paypal',
        color: 'gold',
        tagline: false,
        height: 48,
        borderRadius: 10,
      }) as Record<string, string | number | boolean>,
    []
  )

  const cardStyle = useMemo(
    () =>
      ({
        layout: 'vertical',
        shape: 'rect',
        label: 'pay',
        color: 'black',
        tagline: false,
        height: 48,
        borderRadius: 10,
      }) as Record<string, string | number | boolean>,
    []
  )

  if (!clientId) {
    return (
      <p className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-soft">
        PayPal is not available on this page right now. Please use another payment method or contact the business.
      </p>
    )
  }

  /** Invoice is INR; PayPal order is settled in USD (converted server-side). SDK must use USD here. */
  return (
    <PayPalScriptProvider options={{ clientId, currency: 'USD', intent: 'capture' }}>
      <div className="flex w-full max-w-full flex-col gap-5">
        <div className="w-full min-w-0 space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">Pay with PayPal</p>
          <div className="rounded-xl border border-white/[0.1] bg-gradient-to-b from-[#141c2c]/95 to-[#0a101c] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex w-full min-h-[52px] min-w-0 items-center justify-center overflow-hidden [&_iframe]:min-h-[48px] [&_iframe]:w-full [&_iframe]:max-w-full">
              <PayPalButtons
                fundingSource={FUNDING.PAYPAL}
                style={paypalStyle}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
              />
            </div>
          </div>
        </div>
        <div className="w-full min-w-0 space-y-3 border-t border-white/[0.1] pt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
            Debit or credit card
          </p>
          <div className="rounded-xl border border-white/[0.1] bg-gradient-to-b from-[#1a1f2e]/98 to-[#0d121c] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="flex w-full min-h-[52px] min-w-0 items-center justify-center overflow-hidden [&_iframe]:min-h-[48px] [&_iframe]:w-full [&_iframe]:max-w-full">
              <PayPalButtons
                fundingSource={FUNDING.CARD}
                style={cardStyle}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
              />
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  )
}
