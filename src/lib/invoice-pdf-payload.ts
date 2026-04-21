import type { DashboardInvoiceRow } from '@/app/dashboard/actions'
import { formatInrFromCents } from '@/lib/money'

export const DEFAULT_ISSUER_NAME = 'A. Sathish Kumar'

export type InvoicePdfPayload = {
  invoiceId: string
  issuerName: string
  clientDisplayName: string
  clientBusiness: string | null
  /** Paise scale — single source for PDF line amounts (Indian grouping via formatter). */
  amountCents: number
  amountFormatted: string
  description: string
  invoiceDateLabel: string
  dueDateLabel: string
  invoiceRefLabel: string
  statusRaw: string
  isPaid: boolean
}

function formatPdfDate(d: string | null | undefined): string {
  if (!d) return '—'
  const t = Date.parse(d)
  if (!Number.isFinite(t)) return d
  return new Date(t).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function invoiceRowToPdfPayload(row: DashboardInvoiceRow): InvoicePdfPayload {
  const cents = Math.round(Number(row.total_amount) * 100)
  const st = String(row.status).toLowerCase()
  const isPaid = st === 'paid' || st === 'settled' || st === 'received'
  return {
    invoiceId: row.id,
    issuerName: DEFAULT_ISSUER_NAME,
    clientDisplayName: row.clients?.name?.trim() || '—',
    clientBusiness: row.clients?.company?.trim() || null,
    amountCents: cents,
    amountFormatted: formatInrFromCents(cents),
    description: row.description?.trim() || '—',
    invoiceDateLabel: formatPdfDate(row.created_at),
    dueDateLabel: formatPdfDate(row.due_date),
    invoiceRefLabel: row.id.slice(0, 8).toUpperCase(),
    statusRaw: row.status,
    isPaid,
  }
}
