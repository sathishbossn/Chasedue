import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getInvoiceByIdForUser } from '@/app/dashboard/actions'
import { invoiceStatusLabel, statusPillVisual } from '@/components/dashboard/invoice-status'
import DownloadInvoicePdfButton from '@/components/invoices/download-invoice-pdf-button'
import MarkInvoicePaidButton from '@/components/payments/mark-invoice-paid-button'
import PaymentThankYouButton from '@/components/payments/payment-thank-you-button'
import { formatInrFromCents } from '@/lib/money'
import { isPaidInvoiceStatus } from '@/lib/invoice-paid'

export default async function InvoiceDetailPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params
  const res = await getInvoiceByIdForUser(invoiceId)

  if (res.ok === false) {
    if (res.error === 'unauthorized') {
      redirect(`/login?next=/dashboard/invoices/${encodeURIComponent(invoiceId)}`)
    }
    if (res.error === 'not_found') {
      notFound()
    }
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {res.message ?? 'Could not load invoice.'}
        </p>
      </div>
    )
  }

  const inv = res.invoice
  const label = invoiceStatusLabel(inv.status)
  const clientLabel = inv.clients
    ? `${inv.clients.name}${inv.clients.company ? ` · ${inv.clients.company}` : ''}`
    : '—'
  const amountCents = Math.round(Number(inv.total_amount ?? 0) * 100)

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        href="/dashboard/invoices"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#F97316] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All invoices
      </Link>

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-soft">Invoice</p>
          <h1 className="mt-1 font-mono text-xl font-bold text-white">{inv.id.slice(0, 8).toUpperCase()}</h1>
          <p className="mt-2 text-sm text-slate-soft">{clientLabel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {statusPillVisual(label)}
          <DownloadInvoicePdfButton invoice={inv} />
          {!isPaidInvoiceStatus(inv.status) ? <MarkInvoicePaidButton invoiceId={inv.id} /> : null}
          <PaymentThankYouButton
            invoiceId={inv.id}
            amount={Number(inv.total_amount)}
            statusRaw={inv.status}
            clientName={inv.clients?.name}
            whatsappNumber={inv.clients?.whatsapp_number}
            phone={inv.clients?.phone}
          />
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-white/[0.1] bg-[#0F172A] p-6 shadow-lg shadow-black/20">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Total (incl. GST)</dt>
            <dd className="mt-1 font-display text-2xl font-bold text-[#F97316]">{formatInrFromCents(amountCents)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Due date</dt>
            <dd className="mt-1 text-white">
              {inv.due_date
                ? new Date(inv.due_date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Issued</dt>
            <dd className="mt-1 text-white">
              {inv.created_at
                ? new Date(inv.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '—'}
            </dd>
          </div>
          {inv.paid_at ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Payment received</dt>
              <dd className="mt-1 text-white">
                {new Date(inv.paid_at).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
          ) : null}
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Description</dt>
            <dd className="mt-1 whitespace-pre-wrap text-slate-200">{inv.description?.trim() || 'No description'}</dd>
          </div>
        </dl>
      </div>
    </main>
  )
}
