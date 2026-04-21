'use server'

import { isPaidInvoiceStatus } from '@/lib/invoice-paid'
import { createServerSupabaseClient } from '@/lib/supabase/server'

function toCents(n: number): number {
  return Math.round(Number(n) * 100)
}

export type AnalyticsExpenseRow = {
  id: string
  description: string
  amount: number
  created_at: string
  expense_date: string
  category: string | null
}

export type MonthlyBarPoint = {
  /** Short label e.g. "Feb '26" */
  label: string
  monthKey: string
  revenueCents: number
  expenseCents: number
}

export type AnalyticsSnapshot = {
  /** Sum of paid invoice `total_amount` (incl. GST). */
  grossRevenueCents: number
  /** Sum of `amount_subtotal` for paid invoices (pre-GST / GST base). */
  paidPreTaxSubtotalCents: number
  /** Gross minus estimated Razorpay fee. */
  netRevenueCents: number
  razorpayFeeEstimateCents: number
  totalExpensesCents: number
  takeHomeProfitCents: number
  /** Unpaid invoice `total_amount` sums. */
  pendingCollectionCents: number
  monthlyBars: MonthlyBarPoint[]
  recentExpenses: AnalyticsExpenseRow[]
}

function lastThreeMonthKeys(): { keys: string[]; labels: string[] } {
  const keys: string[] = []
  const labels: string[] = []
  const now = new Date()
  for (let i = 2; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    keys.push(`${y}-${String(m).padStart(2, '0')}`)
    labels.push(
      d.toLocaleString('en-IN', { month: 'short' }) + " '" + String(y).slice(-2)
    )
  }
  return { keys, labels }
}

function monthKeyFromIso(iso: string | null | undefined): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return null
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** `YYYY-MM-DD` from Postgres date — avoids timezone drift vs timestamptz. */
function monthKeyFromDateString(ymd: string | null | undefined): string | null {
  if (!ymd) return null
  const m = /^(\d{4})-(\d{2})/.exec(String(ymd).trim())
  return m ? `${m[1]}-${m[2]}` : null
}

const RAZORPAY_FEE_RATE = 0.02

/**
 * Revenue cards sum `total_amount` (payable = taxable `amount_subtotal` + `gst_total` on insert).
 * Razorpay fee estimate applies to gross paid revenue only.
 */
type AnalyticsInvoiceRow = {
  total_amount: number
  amount_subtotal: number | null
  status: string
  created_at: string | null
}

export async function getAnalyticsSnapshot(): Promise<
  | { ok: true; data: AnalyticsSnapshot }
  | { ok: false; error: 'unauthorized' | 'unknown'; message?: string }
> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'unauthorized' }
  }

  const uid = user.id

  const { data: invRows, error: invErr } = await supabase
    .from('invoices')
    .select('total_amount, amount_subtotal, status, created_at')
    .eq('user_id', uid)

  if (invErr) {
    console.log(invErr)
    return { ok: false, error: 'unknown', message: invErr.message }
  }

  const { data: expRows, error: expErr } = await supabase
    .from('expenses')
    .select('id, description, amount, created_at, expense_date, category')
    .eq('user_id', uid)

  if (expErr) {
    console.log(expErr)
    return { ok: false, error: 'unknown', message: expErr.message }
  }

  const invoices = (invRows ?? []) as AnalyticsInvoiceRow[]
  const expenses = (expRows ?? []) as AnalyticsExpenseRow[]

  let grossRevenueCents = 0
  let paidPreTaxSubtotalCents = 0
  let pendingCollectionCents = 0

  // `isPaidInvoiceStatus` is case-insensitive (DB stores PAID / PENDING / OVERDUE).
  for (const row of invoices) {
    const total = toCents(Number(row.total_amount ?? 0))
    const sub = toCents(Number(row.amount_subtotal ?? 0))
    if (isPaidInvoiceStatus(row.status)) {
      grossRevenueCents += total
      paidPreTaxSubtotalCents += sub
    } else {
      pendingCollectionCents += total
    }
  }

  const razorpayFeeEstimateCents = Math.round(grossRevenueCents * RAZORPAY_FEE_RATE)
  const netRevenueCents = grossRevenueCents - razorpayFeeEstimateCents

  let totalExpensesCents = 0
  for (const e of expenses) {
    totalExpensesCents += toCents(Number(e.amount))
  }

  const takeHomeProfitCents = netRevenueCents - totalExpensesCents

  const { keys: monthKeys, labels } = lastThreeMonthKeys()
  const keySet = new Set(monthKeys)

  const revenueByMonth: Record<string, number> = {}
  const expenseByMonth: Record<string, number> = {}
  for (const k of monthKeys) {
    revenueByMonth[k] = 0
    expenseByMonth[k] = 0
  }

  for (const row of invoices) {
    if (!isPaidInvoiceStatus(row.status)) continue
    const mk = monthKeyFromIso(row.created_at)
    if (!mk || !keySet.has(mk)) continue
    revenueByMonth[mk] += toCents(Number(row.total_amount ?? 0))
  }

  for (const e of expenses) {
    const mk = monthKeyFromDateString(e.expense_date) ?? monthKeyFromIso(e.created_at)
    if (!mk || !keySet.has(mk)) continue
    expenseByMonth[mk] += toCents(Number(e.amount))
  }

  const monthlyBars: MonthlyBarPoint[] = monthKeys.map((k, i) => ({
    monthKey: k,
    label: labels[i] ?? k,
    revenueCents: revenueByMonth[k] ?? 0,
    expenseCents: expenseByMonth[k] ?? 0,
  }))

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return {
    ok: true,
    data: {
      grossRevenueCents,
      paidPreTaxSubtotalCents,
      netRevenueCents,
      razorpayFeeEstimateCents,
      totalExpensesCents,
      takeHomeProfitCents,
      pendingCollectionCents,
      monthlyBars,
      recentExpenses,
    },
  }
}
