'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { Download, Printer, Zap } from 'lucide-react'
import PaymentSuccess from '@/components/payments/payment-success'
import { downloadPortalReceiptPdf } from '@/lib/generate-portal-receipt-pdf'
import { formatInrFromCents } from '@/lib/money'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export type PortalPaymentMethod = 'razorpay' | 'paypal' | 'card' | null

type Props = {
  invoiceId: string
  invoiceRefShort: string
  amount: number
  amountCents: number
  currency: string
  paymentMethod: PortalPaymentMethod
  businessName: string
  clientLabel: string
  /** When invoice was already paid before this session (e.g. opening /portal after payment). */
  thankYouTitle?: string
  /** Server `paid_at` when `thankYouTitle` is used */
  historicalPaidAt?: string | null
}

function methodLabel(m: PortalPaymentMethod): string {
  if (m === 'razorpay') return 'Razorpay'
  if (m === 'paypal') return 'PayPal'
  if (m === 'card') return 'Card'
  return '—'
}

export default function PortalPaymentSuccess({
  invoiceId,
  invoiceRefShort,
  amount,
  amountCents,
  currency,
  paymentMethod,
  businessName,
  clientLabel,
  thankYouTitle,
  historicalPaidAt,
}: Props) {
  useEffect(() => {
    console.log('Transaction Analytics: ', { id: invoiceId, amount })
  }, [invoiceId, amount])

  /** Burst animation after Razorpay / PayPal success (not for “already paid” portal loads). */
  useEffect(() => {
    if (thankYouTitle) return
    if (paymentMethod !== 'razorpay' && paymentMethod !== 'paypal') return
    const burst = () =>
      confetti({
        particleCount: 95,
        spread: 72,
        origin: { y: 0.52 },
        colors: ['#F97316', '#fb923c', '#34d399', '#ffffff'],
      })
    burst()
    const t1 = window.setTimeout(burst, 220)
    const t2 = window.setTimeout(burst, 480)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [thankYouTitle, paymentMethod])

  const amountFormatted = formatInrFromCents(amountCents)
  const methodText = methodLabel(paymentMethod)
  const paidDateLabel =
    historicalPaidAt?.trim() ||
    new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  const headline = thankYouTitle ?? 'Payment Successful!'

  async function handleDownloadPdf() {
    try {
      await downloadPortalReceiptPdf({
        invoiceId,
        invoiceRefShort,
        amountFormatted,
        currency,
        paymentMethodLabel: methodText,
        businessName,
        clientLabel,
        paidAtIso: new Date().toISOString(),
      })
    } catch (e) {
      console.error(e)
      window.alert('Could not download receipt PDF. Please try again.')
    }
  }

  function handlePrint() {
    const w = window.open('', '_blank', 'width=720,height=900')
    if (!w) return
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Receipt ${escapeHtml(invoiceRefShort)}</title>
      <style>
        body{font-family:system-ui,sans-serif;padding:2rem;max-width:40rem;margin:0 auto;color:#0f172a}
        h1{font-size:1.25rem;margin:0 0 .5rem}
        .brand{color:#ea580c;font-weight:700}
        dl{margin:1.5rem 0} dt{font-size:.65rem;text-transform:uppercase;color:#64748b;margin-top:.75rem} dd{margin:.25rem 0 0;font-weight:600}
        @media print{body{padding:1rem}}
      </style></head><body>
      <p class="brand">ChaseDue</p>
      <h1>Payment receipt</h1>
      <p><strong>Payment Successful</strong></p>
      <dl>
        <dt>Invoice ID</dt><dd>${escapeHtml(invoiceId)}</dd>
        <dt>Date</dt><dd>${escapeHtml(paidDateLabel)}</dd>
        <dt>Amount</dt><dd>${escapeHtml(amountFormatted)} ${escapeHtml(currency)}</dd>
        <dt>Status</dt><dd>Paid</dd>
        <dt>Business</dt><dd>${escapeHtml(businessName)}</dd>
        <dt>Bill to</dt><dd>${escapeHtml(clientLabel)}</dd>
        <dt>Reference</dt><dd>INV-${escapeHtml(invoiceRefShort)}</dd>
        <dt>Payment method</dt><dd>${escapeHtml(methodText)}</dd>
      </dl>
      <p style="font-size:12px;color:#64748b">Thank you for your payment.</p>
    </body></html>`
    w.document.write(html)
    w.document.close()
    window.setTimeout(() => {
      w.focus()
      w.print()
    }, 200)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center"
    >
      <div className="flex flex-col items-center">
        <div className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-[#EA580C] shadow-lg shadow-brand-500/30 sm:h-16 sm:w-16">
          <Zap className="h-8 w-8 text-white sm:h-9 sm:w-9" strokeWidth={2.25} aria-hidden />
        </div>
        <p className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-[1.75rem]">
          <span className="text-white">Chase</span>
          <span className="bg-gradient-to-r from-brand-400 to-[#FB923C] bg-clip-text text-transparent">Due</span>
        </p>
      </div>

      <div className="mt-8">
        <PaymentSuccess title={headline} />
      </div>

      <div className="mt-10 w-full max-w-md rounded-2xl border border-white/[0.12] bg-white/[0.06] px-6 py-6 text-left shadow-xl backdrop-blur-md sm:px-8">
        <dl className="space-y-4">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-soft">Invoice ID</dt>
            <dd className="mt-1 break-all font-mono text-sm text-white">{invoiceId}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-soft">Date</dt>
            <dd className="mt-1 text-sm font-medium text-white">{paidDateLabel}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-soft">Amount</dt>
            <dd className="mt-1 font-display text-xl font-bold tabular-nums text-white">{amountFormatted}</dd>
            <dd className="mt-0.5 text-xs text-slate-soft">{currency}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-soft">Status</dt>
            <dd className="mt-1 text-base font-semibold text-emerald-400">Paid</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-soft">Payment method</dt>
            <dd className="mt-1 text-base font-semibold text-white">{methodText}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-brand-500/40 bg-brand-500/20 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500/30"
          >
            <Download className="h-4 w-4 shrink-0" aria-hidden />
            Download Receipt
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            <Printer className="h-4 w-4 shrink-0" aria-hidden />
            Print receipt
          </button>
        </div>
      </div>
    </motion.div>
  )
}
