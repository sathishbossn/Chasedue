/** Paid invoices move to “archived” UI 24h after payment (see paid_at). */

const PAID = new Set(['paid', 'settled', 'received'])

export function isPaidStatus(statusRaw: string): boolean {
  return PAID.has(String(statusRaw).toLowerCase().trim())
}

const ARCHIVE_MS = 24 * 60 * 60 * 1000

/** Paid long enough to leave the “recent paid” list (dashboard focus on active debt). */
export function isArchivedPaidInvoice(inv: { status: string; paid_at: string | null }): boolean {
  if (!isPaidStatus(inv.status)) return false
  if (!inv.paid_at) return true
  return Date.now() - new Date(inv.paid_at).getTime() >= ARCHIVE_MS
}

export function isActiveDebtInvoice(statusRaw: string): boolean {
  const s = statusRaw.toLowerCase().trim()
  return s === 'pending' || s === 'overdue'
}

/** Paid but still within the 24h window (shown when “Show paid” is on). */
export function isRecentPaidInvoice(inv: { status: string; paid_at: string | null }): boolean {
  return isPaidStatus(inv.status) && !isArchivedPaidInvoice(inv)
}
