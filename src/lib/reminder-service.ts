/**
 * Reminder / due-date logic: mark unpaid invoices OVERDUE when due date is before today (local calendar).
 * DB stores UPPERCASE statuses (`PENDING`, `OVERDUE`); UI compares via `.toLowerCase()`.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import { INVOICE_STATUS_DB } from '@/lib/invoice-paid'

/** Supabase `invoices.status` values written by this service. */
export const INVOICE_STATUS_OVERDUE = INVOICE_STATUS_DB.OVERDUE
export const INVOICE_STATUS_PENDING = INVOICE_STATUS_DB.PENDING

function parseLocalDateYmd(ymd: string): Date {
  const [y, m, d] = String(ymd).split('-').map(Number)
  if (!y || !m || !d) return new Date(NaN)
  return new Date(y, m - 1, d)
}

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

/** `YYYY-MM-DD` for the given date in local time. */
export function formatLocalDateYmd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * True when the due date (invoice local calendar day) is strictly before `asOf`'s calendar day.
 */
export function isDueDateOverdue(dueDateYmd: string, asOf: Date = new Date()): boolean {
  const due = parseLocalDateYmd(dueDateYmd)
  const today = startOfDay(asOf)
  if (!Number.isFinite(due.getTime())) return false
  return due.getTime() < today.getTime()
}

export type ReminderEvaluation = {
  /** Lowercase bucket for UI / analytics when DB may lag sync. */
  effectiveStatus: 'pending' | 'overdue' | 'paid' | string
}

/**
 * Maps DB status + due date to an effective bucket. Paid-like statuses are left as-is.
 */
export function evaluateReminderFlags(
  statusRaw: string,
  dueDateYmd: string,
  asOf: Date = new Date()
): ReminderEvaluation {
  const s = String(statusRaw ?? '').toLowerCase().trim()
  if (['paid', 'settled', 'received', 'completed'].includes(s)) {
    return { effectiveStatus: 'paid' }
  }
  if (s === 'overdue') {
    return { effectiveStatus: 'overdue' }
  }
  if (s === 'pending' && isDueDateOverdue(dueDateYmd, asOf)) {
    return { effectiveStatus: 'overdue' }
  }
  return { effectiveStatus: 'pending' }
}

export class ReminderService {
  /**
   * Sets `status` to `overdue` for rows that are still `pending` and whose `due_date` is before today (local).
   * Returns how many rows were updated (best-effort; depends on RLS allowing update).
   */
  static async syncOverdueForUser(
    supabase: SupabaseClient,
    userId: string,
    asOf: Date = new Date()
  ): Promise<{ ok: true; updatedCount: number } | { ok: false; message: string }> {
    const todayYmd = formatLocalDateYmd(startOfDay(asOf))

    const { data, error } = await supabase
      .from('invoices')
      .update({ status: INVOICE_STATUS_OVERDUE })
      .eq('user_id', userId)
      .eq('status', INVOICE_STATUS_PENDING)
      .lt('due_date', todayYmd)
      .select('id')

    if (error) {
      console.log(error)
      return { ok: false, message: error.message }
    }

    return { ok: true, updatedCount: data?.length ?? 0 }
  }
}
