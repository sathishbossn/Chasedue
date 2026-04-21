'use client'

import { useMemo } from 'react'
import { isPaidInvoiceStatus } from '@/lib/invoice-paid'
import { invoicePayableInr, invoiceSubtotalInr } from '@/lib/invoice-money'
import { formatLocalDateYmd } from '@/lib/reminder-service'

/** Minimum fields needed to bucket totals (matches Supabase `invoices` row shape). */
export type DashboardStatInvoice = {
  total_amount: number
  amount_subtotal?: number | null
  status: string
  due_date: string
}

export type DashboardStatsBuckets = {
  /** Sums of `total_amount` (incl. GST). */
  totalPaidCents: number
  totalPendingCents: number
  totalOverdueCents: number
  /** Pre-GST (`amount_subtotal`) sums — same status/due splits as above. */
  paidSubtotalCents: number
  pendingSubtotalCents: number
  overdueSubtotalCents: number
}

function toCents(n: number): number {
  return Math.round(Number(n) * 100)
}

function dueYmdOnly(dueDateRaw: string): string {
  return String(dueDateRaw ?? '')
    .trim()
    .slice(0, 10)
}

/**
 * V1 aggregation (Build Strategy):
 * - Paid: sum where status is paid (case-insensitive `PAID`; includes settled/received/completed via `isPaidInvoiceStatus`).
 * - Pending: not paid and due_date ≥ today (calendar, local).
 * - Overdue: not paid and due_date &lt; today.
 */
export function aggregateDashboardStatsFromInvoices(invoices: DashboardStatInvoice[]): DashboardStatsBuckets {
  let totalPaidCents = 0
  let totalPendingCents = 0
  let totalOverdueCents = 0
  let paidSubtotalCents = 0
  let pendingSubtotalCents = 0
  let overdueSubtotalCents = 0
  const todayYmd = formatLocalDateYmd(new Date())

  for (const inv of invoices) {
    const cents = toCents(invoicePayableInr(inv))
    const subCents = toCents(invoiceSubtotalInr(inv))
    if (isPaidInvoiceStatus(inv.status)) {
      totalPaidCents += cents
      paidSubtotalCents += subCents
      continue
    }
    const due = dueYmdOnly(inv.due_date)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(due)) {
      totalPendingCents += cents
      pendingSubtotalCents += subCents
      continue
    }
    if (due < todayYmd) {
      totalOverdueCents += cents
      overdueSubtotalCents += subCents
    } else {
      totalPendingCents += cents
      pendingSubtotalCents += subCents
    }
  }

  return {
    totalPaidCents,
    totalPendingCents,
    totalOverdueCents,
    paidSubtotalCents,
    pendingSubtotalCents,
    overdueSubtotalCents,
  }
}

/** @deprecated Prefer aggregateDashboardStatsFromInvoices — kept for callers passing snapshot rows. */
export function aggregateDashboardStats(invoices: DashboardStatInvoice[]): DashboardStatsBuckets {
  return aggregateDashboardStatsFromInvoices(invoices)
}

/**
 * Memoized dashboard buckets from live Supabase-backed invoice lists (client components).
 */
export function useDashboardStats(invoices: DashboardStatInvoice[] | undefined): DashboardStatsBuckets {
  return useMemo(() => aggregateDashboardStatsFromInvoices(invoices ?? []), [invoices])
}
