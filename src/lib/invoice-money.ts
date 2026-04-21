/**
 * Supabase `invoices` money columns — use everywhere instead of legacy `amount`.
 * - `total_amount`: payable total (incl. GST) — Razorpay, dashboards, analytics revenue.
 * - `amount_subtotal`: pre-GST taxable base.
 */

export type InvoiceMoneyColumns = {
  total_amount: number | string | null
  amount_subtotal?: number | string | null
}

export function invoicePayableInr(inv: InvoiceMoneyColumns): number {
  const v = inv.total_amount
  if (v == null || v === '') return 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export function invoiceSubtotalInr(inv: InvoiceMoneyColumns): number {
  const v = inv.amount_subtotal
  if (v == null || v === '') return 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}
