/**
 * Stored in Supabase `invoices.status` (UPPERCASE) — matches typical CHECK constraints.
 * Reads elsewhere normalize with `.toLowerCase()` for comparisons.
 */
export const INVOICE_STATUS_DB = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
} as const

/** Default `PENDING` when empty; otherwise trim + uppercase (form/API → DB). */
export function normalizeInvoiceStatusForDb(raw: string | null | undefined): string {
  const u = String(raw ?? '').trim().toUpperCase()
  return u || INVOICE_STATUS_DB.PENDING
}

/** Align with portal + payment flows — all count as revenue when paid. */
export function isPaidInvoiceStatus(raw: string | null | undefined): boolean {
  const s = String(raw ?? '')
    .toLowerCase()
    .trim()
  return ['paid', 'settled', 'received', 'completed'].includes(s)
}
