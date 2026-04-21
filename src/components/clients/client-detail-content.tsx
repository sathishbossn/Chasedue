'use client'

import Link from 'next/link'
import { ArrowLeft, Building2, Mail, Phone } from 'lucide-react'
import type { ClientDetailInvoiceRow, ClientRecord } from '@/app/clients/actions'
import { formatInrFromCents } from '@/lib/money'
import { invoiceStatusLabel, statusPillVisual } from '@/components/dashboard/invoice-status'

function formatDate(ymd: string) {
  if (!ymd) return '—'
  const [y, m, d] = ymd.split('-').map(Number)
  if (!y || !m || !d) return ymd
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  const parsed = Date.parse(iso)
  if (!Number.isFinite(parsed)) return iso
  return new Date(parsed).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ClientDetailContent({
  client,
  invoices,
}: {
  client: ClientRecord
  invoices: ClientDetailInvoiceRow[]
}) {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/clients"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-400 hover:text-brand-300"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All clients
        </Link>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">{client.name}</h1>
        {client.company ? (
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-soft">
            <Building2 className="h-4 w-4 shrink-0 text-slate-soft/70" aria-hidden />
            {client.company}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-soft">
          {client.email ? (
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-brand-500/80" aria-hidden />
              {client.email}
            </span>
          ) : null}
          {client.phone ? (
            <span className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-brand-500/80" aria-hidden />
              {client.phone}
            </span>
          ) : null}
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-white">Invoices</h2>
        <p className="mt-1 text-sm text-slate-soft">All invoices for this client.</p>

        {invoices.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/[0.12] bg-[#0F172A]/80 px-6 py-12 text-center">
            <p className="text-sm text-slate-soft">No invoices yet for this client.</p>
            <Link
              href={`/invoices/new?client_id=${encodeURIComponent(client.id)}`}
              className="btn-premium btn-premium-primary mt-4 inline-flex items-center gap-2"
            >
              Create invoice
            </Link>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0F172A]/80">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="border-b border-white/[0.08] text-xs font-semibold uppercase tracking-wide text-slate-soft">
                <tr>
                  <th className="px-4 py-3 sm:px-5">Invoice</th>
                  <th className="px-4 py-3 text-right sm:px-5">Amount</th>
                  <th className="px-4 py-3 sm:px-5">Due</th>
                  <th className="px-4 py-3 text-center sm:px-5">Reminders</th>
                  <th className="px-4 py-3 sm:px-5">Last reminder</th>
                  <th className="px-4 py-3 sm:px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {invoices.map((inv, i) => {
                  const label = invoiceStatusLabel(inv.status)
                  const cents = Math.round(Number(inv.total_amount) * 100)
                  return (
                    <tr key={inv.id} className={i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}>
                      <td className="px-4 py-3 sm:px-5">
                        <Link
                          href={`/dashboard/invoices/${inv.id}`}
                          className="font-medium text-white hover:text-brand-400"
                        >
                          {inv.description?.trim() || 'No description'}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right font-display font-semibold text-brand-400 sm:px-5">
                        {formatInrFromCents(cents)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-soft sm:px-5">{formatDate(inv.due_date)}</td>
                      <td className="px-4 py-3 text-center tabular-nums text-slate-soft sm:px-5">
                        {inv.reminder_count ?? 0}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-soft sm:px-5">
                        {formatDateTime(inv.last_reminder_sent ?? inv.last_chased_at)}
                      </td>
                      <td className="px-4 py-3 sm:px-5">{statusPillVisual(label)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
