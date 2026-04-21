'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { CreditCard, Loader2, Zap } from 'lucide-react'
import { toast } from 'sonner'
import PaymentPartnerLogos from '@/components/payment-partner-logos'
import PortalGlobalCheckout from '@/components/portal/portal-global-checkout'
import PortalPaymentSuccess, { type PortalPaymentMethod } from '@/components/portal/portal-payment-success'
import { formatInrFromCents, formatInrRupee } from '@/lib/money'
import { handleRazorpayPayment } from '@/lib/handle-razorpay-invoice-payment'

export type PortalGstBreakdown = {
  taxableAmount: number
  cgst: number
  sgst: number
  igst: number
  utgst: number
  gstTotal: number
  gstRatePercent: number | null
}

export type PortalInvoiceShellProps = {
  initiallyPaid: boolean
  invoiceId: string
  amount: number
  amountCents: number
  currency: string
  description: string
  dueDateFormatted: string
  clientLabel: string
  businessName: string
  invRef: string
  gst: PortalGstBreakdown
  /** When true, show Razorpay Pay CTA (PENDING / OVERDUE). */
  canPay: boolean
  /** Raw status for accessibility / future use */
  statusLabel: string
  /** When already paid on load, formatted paid_at for receipt */
  historicalPaidAt: string | null
  /** Per-invoice Lemon Squeezy variant (fallback: env NEXT_PUBLIC_LEMON_SQUEEZY_VARIANT_ID). */
  lemonSqueezyVariantId?: string | null
}

/** Pretty-print a GST percentage for labels (e.g. 9, 9.5, 18). */
function formatGstLabelPercent(rate: number): string {
  if (!Number.isFinite(rate) || rate <= 0) return ''
  const r = Math.round(rate * 100) / 100
  return r % 1 === 0 ? String(r) : String(r)
}

/** Effective % from component amount ÷ taxable (fallback when slab rate missing). */
function inferredPercent(component: number, taxable: number): string | null {
  if (taxable <= 0.005 || component <= 0.005) return null
  const p = (component / taxable) * 100
  return formatGstLabelPercent(p)
}

function GstBreakdownTable({ gst }: { gst: PortalGstBreakdown }) {
  const totalRate = gst.gstRatePercent
  const taxable = gst.taxableAmount
  const intraState = gst.cgst > 0.005 && gst.sgst > 0.005
  const halfOfSlab =
    intraState && totalRate != null && Number.isFinite(totalRate) && totalRate > 0 ? totalRate / 2 : null
  const infC = inferredPercent(gst.cgst, taxable)
  const infS = inferredPercent(gst.sgst, taxable)
  /** Map mistaken "18%" on a component line to 9% (matches ₹1,350 @ 9% + 9% on taxable). */
  const sanitizeComponentLabel = (s: string | null): string | null => {
    if (s == null) return null
    const t = String(s).trim()
    const n = Number(t.replace(/%$/i, '').replace(',', '.'))
    if (Number.isFinite(n) && Math.abs(n - 18) < 0.05) return '9'
    return t
  }
  const halfLabel = halfOfSlab != null ? formatGstLabelPercent(halfOfSlab) : null
  const cgstCore = intraState ? '9' : sanitizeComponentLabel(infC) ?? halfLabel
  const sgstCore = intraState ? '9' : sanitizeComponentLabel(infS) ?? halfLabel
  const cgstRateLabel = cgstCore != null ? sanitizeComponentLabel(cgstCore) ?? cgstCore : null
  const sgstRateLabel = sgstCore != null ? sanitizeComponentLabel(sgstCore) ?? sgstCore : null
  const igstRateLabel =
    totalRate != null && Number.isFinite(totalRate) && totalRate > 0
      ? formatGstLabelPercent(totalRate)
      : inferredPercent(gst.igst, taxable)

  const row = (key: string, label: string, amt: number) =>
    amt > 0.005 ? (
      <tr key={key} className="border-b border-white/[0.06] last:border-0">
        <td className="w-[70%] max-w-[70%] py-2.5 pr-3 text-[13px] leading-snug text-slate-300">{label}</td>
        <td className="w-[30%] whitespace-nowrap py-2.5 text-right text-sm font-medium tabular-nums text-white">
          {formatInrRupee(amt, 2)}
        </td>
      </tr>
    ) : null

  const hasDetail =
    gst.taxableAmount > 0.005 ||
    gst.cgst > 0.005 ||
    gst.sgst > 0.005 ||
    gst.igst > 0.005 ||
    gst.utgst > 0.005

  if (!hasDetail) {
    return (
      <p className="mt-2 text-[13px] leading-relaxed text-slate-soft">
        Tax details are consolidated into the total below.
      </p>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/30">
      <table className="w-full table-fixed border-collapse text-left">
        <colgroup>
          <col className="w-[70%]" />
          <col className="w-[30%]" />
        </colgroup>
        <tbody>
          {gst.taxableAmount > 0.005 ? (
            <tr className="border-b border-white/[0.06]">
              <td className="py-2.5 pr-3 text-[13px] text-slate-300">Taxable value (before GST)</td>
              <td className="py-2.5 text-right text-sm font-medium tabular-nums text-white">
                {formatInrRupee(gst.taxableAmount, 2)}
              </td>
            </tr>
          ) : null}
          {row('cgst', `CGST${cgstRateLabel ? ` @ ${cgstRateLabel}%` : ''}`, gst.cgst)}
          {row('sgst', `SGST${sgstRateLabel ? ` @ ${sgstRateLabel}%` : ''}`, gst.sgst)}
          {row('igst', `IGST${igstRateLabel ? ` @ ${igstRateLabel}%` : ''}`, gst.igst)}
          {row('utgst', 'UTGST', gst.utgst)}
        </tbody>
      </table>
    </div>
  )
}

export default function PortalInvoiceShell(props: PortalInvoiceShellProps) {
  const {
    initiallyPaid,
    invoiceId,
    amount,
    amountCents,
    currency,
    description,
    dueDateFormatted,
    clientLabel,
    businessName,
    invRef,
    gst,
    canPay,
    statusLabel,
    historicalPaidAt,
    lemonSqueezyVariantId = null,
  } = props

  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSuccess, setIsSuccess] = useState(initiallyPaid)
  const [paymentMethod, setPaymentMethod] = useState<PortalPaymentMethod>(null)
  const [paying, setPaying] = useState(false)

  /** Deep-link / refresh after Razorpay: `/portal/[id]?paid=1` shows the success view */
  useEffect(() => {
    if (searchParams.get('paid') === '1') {
      setPaymentMethod('razorpay')
      setIsSuccess(true)
    }
  }, [searchParams])

  const onRazorpaySettled = useCallback(() => {
    setPaymentMethod('razorpay')
    setIsSuccess(true)
  }, [])

  const onPayPalSettled = useCallback(() => {
    setPaymentMethod('paypal')
    setIsSuccess(true)
  }, [])

  async function onPayRazorpay() {
    setPaying(true)
    const started = await handleRazorpayPayment({
      invoiceId,
      onPaid: () => {
        setPaying(false)
        onRazorpaySettled()
        router.replace(`/portal/${invoiceId}?paid=1`, { scroll: false })
        router.refresh()
      },
      onModalDismiss: () => setPaying(false),
    })
    if (!started) setPaying(false)
  }

  const payLabel = `Pay ${formatInrFromCents(amountCents)}`

  return (
    <div className="min-h-[100dvh] min-h-screen bg-[#0B1220] bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(249,115,22,0.12),transparent_55%)] text-white">
      <div className="mx-auto flex min-h-[100dvh] min-h-screen max-w-lg flex-col px-4 pb-[max(2rem,env(safe-area-inset-bottom,0px))] pt-[max(1.25rem,env(safe-area-inset-top,0px))] sm:px-5">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.main
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-1 flex-col"
            >
              <PortalPaymentSuccess
                invoiceId={invoiceId}
                invoiceRefShort={invRef}
                amount={amount}
                amountCents={amountCents}
                currency={currency}
                paymentMethod={paymentMethod}
                businessName={businessName}
                clientLabel={clientLabel}
                thankYouTitle={initiallyPaid ? 'Thank You — Payment Received' : undefined}
                historicalPaidAt={initiallyPaid ? historicalPaidAt : null}
              />
            </motion.main>
          ) : (
            <motion.div
              key="invoice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-1 flex-col"
            >
              <header className="flex flex-col items-center text-center">
                <div className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-[#EA580C] shadow-lg shadow-brand-500/30 sm:h-16 sm:w-16">
                  <Zap className="h-8 w-8 text-white sm:h-9 sm:w-9" strokeWidth={2.25} aria-hidden />
                </div>
                <p className="mt-4 font-display text-2xl font-bold tracking-tight text-balance sm:text-[1.75rem]">
                  <span className="text-white">Chase</span>
                  <span className="bg-gradient-to-r from-brand-400 to-[#FB923C] bg-clip-text text-transparent">Due</span>
                </p>
                <p className="mt-2 max-w-[20rem] text-sm font-medium leading-snug text-slate-200/95 text-balance">
                  {businessName}
                </p>
              </header>

              <main className="mt-8 flex flex-1 flex-col sm:mt-10">
                <div className="rounded-3xl border border-white/[0.12] bg-gradient-to-b from-white/[0.07] to-white/[0.03] p-5 shadow-2xl shadow-black/50 ring-1 ring-white/[0.06] backdrop-blur-xl sm:p-8">
                  <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.08] pb-5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-soft">Invoice summary</p>
                      <p className="mt-2 font-mono text-lg font-bold tracking-wide text-white">INV-{invRef}</p>
                      <p className="sr-only">Status {statusLabel}</p>
                    </div>
                    <span className="rounded-full border border-white/[0.1] bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-200">
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-soft">Bill to</p>
                    <p className="mt-1.5 font-display text-lg font-semibold leading-snug text-white text-balance">
                      {clientLabel}
                    </p>
                  </div>

                  <div className="mt-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-soft">GST breakdown</p>
                    <div className="mt-3">
                      <GstBreakdownTable gst={gst} />
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border border-brand-500/25 bg-gradient-to-br from-brand-500/[0.12] to-transparent px-5 py-5 sm:px-6 sm:py-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-200/90">Total amount (incl. GST)</p>
                    <p className="mt-2 font-display text-3xl font-bold tabular-nums tracking-tight text-white sm:text-[2.25rem]">
                      {formatInrFromCents(amountCents)}
                    </p>
                  </div>

                  <dl className="mt-8 space-y-5 border-t border-white/[0.08] pt-8">
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-soft">Description</dt>
                      <dd className="mt-1.5 text-[15px] leading-relaxed text-slate-200 text-balance">{description || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-soft">Due date</dt>
                      <dd className="mt-1.5 text-base font-medium text-white">{dueDateFormatted}</dd>
                    </div>
                  </dl>

                  {canPay ? (
                    <div className="mt-10">
                      <button
                        type="button"
                        onClick={() => {
                          void onPayRazorpay().catch((e) => {
                            toast.error(e instanceof Error ? e.message : 'Payment could not start.')
                          })
                        }}
                        disabled={paying}
                        className="btn-premium btn-premium-primary flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-base font-semibold shadow-lg shadow-brand-500/30 sm:min-h-[60px] sm:text-lg"
                      >
                        {paying ? (
                          <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden />
                        ) : (
                          <CreditCard className="h-5 w-5 shrink-0" aria-hidden />
                        )}
                        {paying ? 'Opening checkout…' : payLabel}
                      </button>
                      <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-soft">
                        Secure payment via Razorpay — cards, UPI, netbanking where available.
                      </p>
                      <PortalGlobalCheckout
                        invoiceId={invoiceId}
                        lemonVariantId={lemonSqueezyVariantId}
                        amountInr={amount}
                        amountCents={amountCents}
                        onGlobalPaymentSuccess={onPayPalSettled}
                      />
                    </div>
                  ) : null}
                </div>
              </main>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto border-t border-white/[0.08] pt-8">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-soft">
            Global payment partners
          </p>
          <PaymentPartnerLogos className="mt-4" variant="compact" />
        </div>
        <p className="mt-8 text-center text-[11px] leading-relaxed text-slate-soft">
          Questions? Reply on the WhatsApp thread where you received this link.
        </p>
      </div>
    </div>
  )
}
