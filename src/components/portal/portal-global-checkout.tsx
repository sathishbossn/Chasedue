'use client'

import dynamic from 'next/dynamic'
import { CreditCard, Globe } from 'lucide-react'
import { useMemo, useState } from 'react'
import PaymentPartnerLogos from '@/components/payment-partner-logos'
import {
  buildLemonSqueezyCheckoutUrl,
  formatUsdFromInr,
  getInrPerUsd,
} from '@/lib/global-payment'
import { formatInrFromCents } from '@/lib/money'

const PortalPayPalButtons = dynamic(() => import('./portal-paypal-buttons'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[52px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs text-slate-soft">
      Loading PayPal…
    </div>
  ),
})

type CurrencyView = 'inr' | 'usd'

export default function PortalGlobalCheckout({
  invoiceId,
  lemonVariantId,
  amountInr,
  amountCents,
  onGlobalPaymentSuccess,
}: {
  invoiceId: string
  /** Optional; merged into NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL as /checkout/buy/{id} */
  lemonVariantId?: string | null
  amountInr: number
  amountCents: number
  onGlobalPaymentSuccess?: () => void
}) {
  const [currencyView, setCurrencyView] = useState<CurrencyView>('usd')
  const inrPerUsd = useMemo(() => getInrPerUsd(), [])
  const lemonHref = useMemo(
    () => buildLemonSqueezyCheckoutUrl(invoiceId, lemonVariantId ?? null),
    [invoiceId, lemonVariantId]
  )

  const usdEstimate = useMemo(() => formatUsdFromInr(amountInr, inrPerUsd), [amountInr, inrPerUsd])

  return (
    <section
      id="global-payment-options"
      className="mt-10 scroll-mt-6 rounded-2xl border border-brand-500/30 bg-gradient-to-b from-brand-500/[0.12] via-[#0B1220] to-[#070d16] p-5 shadow-[0_0_48px_-10px_rgba(249,115,22,0.45)] ring-1 ring-brand-500/15 sm:p-6"
      aria-labelledby="global-payment-heading"
    >
      <div className="flex flex-wrap items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/15 text-brand-300">
          <Globe className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-300/90">International</p>
          <h2 id="global-payment-heading" className="mt-1 font-display text-xl font-semibold tracking-tight text-white sm:text-[1.35rem]">
            Global Payment Options
          </h2>
          <p className="mt-3 text-base font-medium leading-relaxed text-white">
            For international payers: amounts are converted from INR to USD.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-soft">
            The estimate below uses the exchange rate configured for this site (1 USD ={' '}
            {inrPerUsd.toLocaleString('en-IN', { maximumFractionDigits: 2 })} INR). Your invoice total stays in INR;
            PayPal charges in USD.
          </p>
        </div>
      </div>

      <div className="mt-5 flex justify-center border-y border-white/[0.08] bg-black/20 py-4">
        <PaymentPartnerLogos variant="compact" className="gap-6 opacity-[0.95]" />
      </div>

      <div className="mt-6 rounded-2xl border border-white/[0.12] bg-white/[0.05] p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-soft">Estimated total</p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Display currency">
          <button
            type="button"
            onClick={() => setCurrencyView('inr')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              currencyView === 'inr'
                ? 'bg-brand-500/25 text-brand-200 ring-1 ring-brand-500/40'
                : 'bg-white/[0.06] text-slate-soft hover:bg-white/[0.1]'
            }`}
          >
            INR (invoice)
          </button>
          <button
            type="button"
            onClick={() => setCurrencyView('usd')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              currencyView === 'usd'
                ? 'bg-brand-500/25 text-brand-200 ring-1 ring-brand-500/40'
                : 'bg-white/[0.06] text-slate-soft hover:bg-white/[0.1]'
            }`}
          >
            USD (PayPal)
          </button>
        </div>
        <p className="mt-4 font-display text-2xl font-bold tabular-nums text-white sm:text-3xl">
          {currencyView === 'usd' ? usdEstimate : formatInrFromCents(amountCents)}
        </p>
        {currencyView === 'usd' ? (
          <p className="mt-2 text-[11px] leading-relaxed text-slate-soft">
            <span className="text-slate-400">Conversion: </span>
            {formatInrFromCents(amountCents)} ÷ {inrPerUsd.toLocaleString('en-IN', { maximumFractionDigits: 4 })} INR per USD
            ≈ <span className="font-semibold tabular-nums text-slate-100">{usdEstimate}</span> (matches PayPal checkout).
          </p>
        ) : (
          <p className="mt-1 text-[11px] leading-relaxed text-slate-soft">
            Switch to USD to preview the amount sent to PayPal — it uses the same rate as checkout above.
          </p>
        )}
      </div>

      <div className="mt-6 space-y-5">
        <div className="rounded-2xl border border-white/[0.1] bg-[#0d1424]/90 p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-soft">PayPal</p>
          <p className="mt-1 text-xs text-slate-soft">
            After you approve payment, we capture the order and mark this invoice{' '}
            <span className="text-emerald-300/95">paid</span> in our system.
          </p>
          <div className="mt-5 w-full min-w-0">
            <PortalPayPalButtons invoiceId={invoiceId} onSuccess={onGlobalPaymentSuccess} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.1] bg-[#0d1424]/90 p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-soft">Lemon Squeezy</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-soft">
            Invoice total is <span className="text-slate-200">INR</span> in ChaseDue; Lemon opens your hosted checkout
            (configure a variant that matches your pricing).
          </p>
          {lemonHref ? (
            <>
              <a
                href={lemonHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl border border-violet-500/35 bg-violet-500/15 px-4 py-3 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/25"
              >
                <CreditCard className="h-4 w-4 shrink-0" aria-hidden />
                Pay with Card (Global)
              </a>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-soft">
                Opens in a new tab. Your invoice ID is included for tracking.
              </p>
            </>
          ) : (
            <p className="mt-3 text-xs leading-relaxed text-slate-soft">
              Global card checkout via Lemon Squeezy isn&apos;t linked for this deployment yet. You can still pay with
              PayPal above or use the India payment option.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
