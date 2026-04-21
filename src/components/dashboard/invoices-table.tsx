'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { DashboardInvoiceRow } from '@/app/dashboard/actions'
import { invoiceNeedsChase } from '@/lib/chase'
import { formatInrFromCents } from '@/lib/money'
import { invoiceStatusLabel, statusPillVisual } from '@/components/dashboard/invoice-status'
import InvoicePayLinkButton from '@/components/payments/invoice-pay-link-button'
import ChasePaymentButton from '@/components/payments/chase-payment-button'
import PaymentThankYouButton from '@/components/payments/payment-thank-you-button'
import DownloadInvoicePdfButton from '@/components/invoices/download-invoice-pdf-button'
import MarkInvoicePaidButton from '@/components/payments/mark-invoice-paid-button'
import { archivedInvoicesSorted, visibleMainInvoices } from '@/lib/invoice-dashboard-view'
import { isPaidInvoiceStatus } from '@/lib/invoice-paid'

function shortId(id: string): string {
  return `${id.slice(0, 8)}…`
}

function formatDate(d: string | null | undefined): string {
  if (!d) return '—'
  const parsed = Date.parse(d)
  if (!Number.isFinite(parsed)) return d
  return new Date(parsed).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(d: string | null | undefined): string {
  if (!d) return '—'
  const parsed = Date.parse(d)
  if (!Number.isFinite(parsed)) return d
  return new Date(parsed).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function InvoicesTable({
  invoices,
}: {
  invoices: DashboardInvoiceRow[]
}) {
  const [showPaid, setShowPaid] = useState(false)

  const mainRows = useMemo(() => visibleMainInvoices(invoices, showPaid), [invoices, showPaid])
  const archivedRows = useMemo(() => archivedInvoicesSorted(invoices), [invoices])

  if (invoices.length === 0) {
    return (
      <div className="glass-panel rounded-xl border border-white/10 p-10 text-center shadow-card">
        <p className="font-display text-lg text-white">No invoices yet</p>
        <p className="mt-2 text-sm text-slate-soft">Create an invoice to see it listed here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04] shadow-card backdrop-blur-md">
        <div className="flex flex-col gap-3 border-b border-white/[0.08] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-white">Your invoices</h2>
            <p className="mt-1 text-sm text-slate-soft">
              Pending &amp; overdue by default — toggle to include recently paid (last 24h). Older paid invoices appear in
              Archived below.
            </p>
          </div>
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/25 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                <th className="px-4 py-3 sm:px-5">Invoice</th>
                <th className="whitespace-nowrap px-4 py-3 sm:px-5">PDF</th>
                <th className="px-4 py-3 sm:px-5">Client</th>
                <th className="max-w-[220px] px-4 py-3 sm:px-5">Description</th>
                <th className="px-4 py-3 sm:px-5 text-right">Total (incl. GST)</th>
                <th className="px-4 py-3 sm:px-5">Due</th>
                <th className="px-4 py-3 sm:px-5">Status</th>
                <th className="px-4 py-3 sm:px-5">Pay / thank you</th>
                <th className="px-4 py-3 sm:px-5 text-center">Reminders</th>
                <th className="px-4 py-3 sm:px-5" title="Last manual WhatsApp reminder (Chase Payment).">
                  Last reminder
                </th>
                <th className="px-4 py-3 sm:px-5" title="Last chase touchpoint (payment verified or manual reminder).">
                  Last chased
                </th>
                <th className="px-4 py-3 sm:px-5">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {mainRows.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-slate-soft sm:px-6">
                    No invoices in this view. Try <strong className="text-white">Show paid invoices</strong> or create
                    a new invoice.
                  </td>
                </tr>
              ) : null}
              {mainRows.map((inv, i) => {
                const clientLabel = inv.clients
                  ? `${inv.clients.name}${inv.clients.company ? ` · ${inv.clients.company}` : ''}`
                  : '—'
                const amountCents = Math.round(Number(inv.total_amount ?? 0) * 100)
                const showChase = invoiceNeedsChase(inv.status)
                return (
                  <tr
                    key={inv.id}
                    className={i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}
                  >
                    <td className="px-4 py-3 font-mono text-xs sm:px-5" title={inv.id}>
                      <Link
                        href={`/dashboard/invoices/${inv.id}`}
                        className="text-brand-400 underline-offset-2 hover:text-brand-300 hover:underline"
                      >
                        {shortId(inv.id)}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <DownloadInvoicePdfButton invoice={inv} size="sm" label="PDF" />
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-white sm:px-5" title={clientLabel}>
                      <Link
                        href={`/clients/${inv.client_id}`}
                        className="font-medium text-white hover:text-brand-400"
                      >
                        {clientLabel}
                      </Link>
                    </td>
                    <td className="max-w-[220px] px-4 py-3 text-sm text-slate-soft sm:px-5">
                      <span className="line-clamp-2" title={inv.description?.trim() || 'No description'}>
                        {inv.description?.trim() ? inv.description.trim() : 'No description'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-display font-semibold text-brand-400 sm:px-5">
                      {formatInrFromCents(amountCents)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-soft sm:px-5">
                      {formatDate(inv.due_date)}
                    </td>
                    <td className="px-4 py-3 sm:px-5">{statusPillVisual(invoiceStatusLabel(inv.status))}</td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                        {!isPaidInvoiceStatus(inv.status) ? (
                          <MarkInvoicePaidButton invoiceId={inv.id} />
                        ) : null}
                        {showChase ? (
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
                        ) : null}
                        {isPaidInvoiceStatus(inv.status) ? (
                          <PaymentThankYouButton
                            invoiceId={inv.id}
                            amount={Number(inv.total_amount)}
                            statusRaw={inv.status}
                            clientName={inv.clients?.name}
                            whatsappNumber={inv.clients?.whatsapp_number}
                            phone={inv.clients?.phone}
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center tabular-nums text-slate-soft sm:px-5">
                      {inv.reminder_count ?? 0}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-soft sm:px-5">
                      {formatDateTime(inv.last_reminder_sent)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-soft sm:px-5">
                      {formatDateTime(inv.last_chased_at)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-soft sm:px-5">
                      {formatDateTime(inv.created_at)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="border-t border-white/[0.08] px-4 py-3 text-xs text-slate-soft sm:px-6">
          {mainRows.length} invoice{mainRows.length === 1 ? '' : 's'} in this view
        </p>
      </div>

      {archivedRows.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/20 shadow-card backdrop-blur-md">
          <div className="border-b border-white/[0.08] px-4 py-4 sm:px-6">
            <h3 className="font-display text-lg font-semibold text-white">Archived invoices</h3>
            <p className="mt-1 text-sm text-slate-soft">
              Paid for more than 24 hours — hidden from the main list by default.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3 sm:px-5">Invoice</th>
                  <th className="px-4 py-3 sm:px-5">Client</th>
                  <th className="px-4 py-3 sm:px-5 text-right">Amount</th>
                  <th className="px-4 py-3 sm:px-5">Paid at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {archivedRows.map((inv) => (
                  <tr key={inv.id} className="text-slate-200">
                    <td className="px-4 py-3 font-mono text-xs sm:px-5">
                      <Link
                        href={`/dashboard/invoices/${inv.id}`}
                        className="text-brand-400 hover:text-brand-300 hover:underline"
                      >
                        {shortId(inv.id)}
                      </Link>
                    </td>
                    <td className="max-w-[240px] truncate px-4 py-3 text-white sm:px-5">
                      {inv.clients?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-display text-brand-400 sm:px-5">
                      {formatInrFromCents(Math.round(Number(inv.total_amount) * 100))}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-soft sm:px-5">
                      {formatDateTime(inv.paid_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  )
}
