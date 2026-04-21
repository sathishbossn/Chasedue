'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { DashboardInvoiceRow } from '@/app/dashboard/actions'
import { formatInrFromCents } from '@/lib/money'
import { invoiceNeedsChase } from '@/lib/chase'
import { invoiceStatusLabel, statusPillVisual } from '@/components/dashboard/invoice-status'
import InvoicePayLinkButton from '@/components/payments/invoice-pay-link-button'
import ChasePaymentButton from '@/components/payments/chase-payment-button'
import MarkInvoicePaidButton from '@/components/payments/mark-invoice-paid-button'
import PaymentThankYouButton from '@/components/payments/payment-thank-you-button'
import WhatsappDeliveryStatus from '@/components/dashboard/whatsapp-delivery-status'
import DownloadInvoicePdfButton from '@/components/invoices/download-invoice-pdf-button'
import { archivedInvoicesSorted, partitionInvoiceViews, visibleMainInvoices } from '@/lib/invoice-dashboard-view'
import { isPaidInvoiceStatus } from '@/lib/invoice-paid'

function formatReminderAt(iso: string | null | undefined): string {
  if (!iso) return '—'
  const parsed = Date.parse(iso)
  if (!Number.isFinite(parsed)) return iso
  return new Date(parsed).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function InvoiceEssentialGrid({
  invoices,
}: {
  invoices: DashboardInvoiceRow[]
}) {
  const [showPaid, setShowPaid] = useState(false)

  const { active, recentPaid } = useMemo(() => partitionInvoiceViews(invoices), [invoices])
  const mainRows = useMemo(
    () => visibleMainInvoices(invoices, showPaid).slice(0, 9),
    [invoices, showPaid]
  )
  const archivedRows = useMemo(() => archivedInvoicesSorted(invoices).slice(0, 6), [invoices])

  if (invoices.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.1] bg-white/[0.04] p-8 text-center backdrop-blur-md">
        <p className="font-display text-lg text-white">No invoices yet</p>
        <p className="mt-2 text-sm text-slate-soft">
          Your latest invoice activity will appear here. Use Request payment on the dashboard or create an invoice to get
          started.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-lg font-semibold text-white">Recent invoices</h2>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-soft">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-brand-500 focus:ring-brand-500/40"
              checked={showPaid}
              onChange={(e) => setShowPaid(e.target.checked)}
            />
            Show paid invoices
          </label>
        </div>
        <Link
          href="/dashboard/invoices"
          className="text-sm font-medium text-brand-400 hover:text-brand-300"
        >
          View all →
        </Link>
      </div>

      {mainRows.length === 0 && active.length === 0 && recentPaid.length > 0 && !showPaid ? (
        <div className="mb-6 rounded-xl border border-brand-500/25 bg-brand-500/10 px-4 py-4 text-sm text-slate-200">
          <p className="font-medium text-white">All caught up on active debt</p>
          <p className="mt-1 text-slate-soft">
            You have paid invoices in the last 24 hours. Turn on <strong>Show paid invoices</strong> to see them here,
            or open <Link href="/dashboard/invoices" className="text-brand-400 underline-offset-2 hover:underline">All invoices</Link>.
          </p>
        </div>
      ) : null}

      {mainRows.length === 0 ? (
        <div className="rounded-xl border border-white/[0.1] bg-white/[0.04] p-8 text-center backdrop-blur-md">
          <p className="text-sm text-slate-soft">No invoices match this view.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {mainRows.map((inv) => {
            const clientLabel = inv.clients
              ? `${inv.clients.name}${inv.clients.company ? ` · ${inv.clients.company}` : ''}`
              : 'Unknown client'
            const label = invoiceStatusLabel(inv.status)
            const amountCents = Math.round(Number(inv.total_amount ?? 0) * 100)
            const showChaseRow = invoiceNeedsChase(inv.status)
            return (
              <div
                key={inv.id}
                className="rounded-xl border border-white/[0.1] bg-white/[0.05] p-5 shadow-lg shadow-black/20 backdrop-blur-md transition hover:border-brand-500/25"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/clients/${inv.client_id}`}
                      className="block truncate font-medium text-white hover:text-brand-400"
                    >
                      {clientLabel}
                    </Link>
                    <Link
                      href={`/dashboard/invoices/${inv.id}`}
                      className="mt-1 block text-xs text-slate-soft hover:text-brand-400"
                    >
                      Invoice details →
                    </Link>
                    <p
                      className="mt-2 line-clamp-2 text-xs leading-snug text-slate-soft/95"
                      title={inv.description?.trim() || 'No description'}
                    >
                      {inv.description?.trim() ? inv.description.trim() : 'No description'}
                    </p>
                  </div>
                  {statusPillVisual(label)}
                </div>
                <p className="mt-3 font-display text-2xl font-bold text-brand-400">
                  {formatInrFromCents(amountCents)}
                </p>
                {inv.whatsapp_delivery ? (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-soft">WhatsApp</span>
                    <WhatsappDeliveryStatus delivery={inv.whatsapp_delivery} />
                  </div>
                ) : null}
                <p className="mt-2 text-xs leading-relaxed text-slate-soft">
                  <span className="font-medium text-slate-300">Reminders:</span> {inv.reminder_count ?? 0}
                  <br />
                  <span className="font-medium text-slate-300">Last reminder:</span>{' '}
                  {formatReminderAt(inv.last_reminder_sent)}
                  <br />
                  <span className="font-medium text-slate-300">Last chased:</span>{' '}
                  {formatReminderAt(inv.last_chased_at)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.08] pt-4">
                  <DownloadInvoicePdfButton invoice={inv} size="sm" />
                  {!isPaidInvoiceStatus(inv.status) ? <MarkInvoicePaidButton invoiceId={inv.id} /> : null}
                  {showChaseRow ? (
                    <>
                      <InvoicePayLinkButton invoiceId={inv.id} paymentLinkUrl={inv.payment_link_url} />
                      <ChasePaymentButton
                        invoiceId={inv.id}
                        amount={Number(inv.total_amount)}
                        dueDate={inv.due_date}
                        statusRaw={inv.status}
                        clientName={inv.clients?.name}
                        whatsappNumber={inv.clients?.whatsapp_number}
                        phone={inv.clients?.phone}
                      />
                    </>
                  ) : (
                    <PaymentThankYouButton
                      invoiceId={inv.id}
                      amount={Number(inv.total_amount)}
                      statusRaw={inv.status}
                      clientName={inv.clients?.name}
                      whatsappNumber={inv.clients?.whatsapp_number}
                      phone={inv.clients?.phone}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {archivedRows.length > 0 ? (
        <div className="mt-10">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-soft">
            Archived (paid 24h+ ago)
          </h3>
          <p className="mt-1 text-xs text-slate-soft/90">
            Auto-archived so your dashboard stays focused on money still due.
          </p>
          <ul className="mt-4 space-y-2 rounded-xl border border-white/[0.08] bg-black/20 p-4">
            {archivedRows.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium text-white">
                  <Link href={`/clients/${inv.client_id}`} className="hover:text-brand-400">
                    {inv.clients?.name ?? 'Client'}
                  </Link>
                  {' · '}
                  <Link href={`/dashboard/invoices/${inv.id}`} className="text-slate-soft hover:text-brand-400">
                    {formatInrFromCents(Math.round(Number(inv.total_amount) * 100))}
                  </Link>
                </span>
                <span className="text-xs text-slate-soft">
                  Paid {inv.paid_at ? new Date(inv.paid_at).toLocaleDateString('en-IN') : '—'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
