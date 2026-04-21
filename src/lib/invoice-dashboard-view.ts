import type { DashboardInvoiceRow } from '@/app/dashboard/actions'
import { isActiveDebtInvoice, isArchivedPaidInvoice, isPaidStatus } from '@/lib/invoice-archive'

export function partitionInvoiceViews(invoices: DashboardInvoiceRow[]) {
  const active: DashboardInvoiceRow[] = []
  const recentPaid: DashboardInvoiceRow[] = []
  const archived: DashboardInvoiceRow[] = []

  for (const inv of invoices) {
    if (isActiveDebtInvoice(inv.status)) {
      active.push(inv)
      continue
    }
    if (isPaidStatus(inv.status)) {
      if (isArchivedPaidInvoice(inv)) archived.push(inv)
      else recentPaid.push(inv)
    }
  }

  return { active, recentPaid, archived }
}

function byCreatedDesc(a: DashboardInvoiceRow, b: DashboardInvoiceRow): number {
  const ta = a.created_at ? Date.parse(a.created_at) : 0
  const tb = b.created_at ? Date.parse(b.created_at) : 0
  return tb - ta
}

/** Rows for the main dashboard table: pending/overdue, optionally + recent paid (24h). */
export function visibleMainInvoices(
  invoices: DashboardInvoiceRow[],
  showPaid: boolean
): DashboardInvoiceRow[] {
  const { active, recentPaid } = partitionInvoiceViews(invoices)
  const list = showPaid ? [...active, ...recentPaid] : [...active]
  return list.sort(byCreatedDesc)
}

export function archivedInvoicesSorted(invoices: DashboardInvoiceRow[]): DashboardInvoiceRow[] {
  const { archived } = partitionInvoiceViews(invoices)
  return archived.sort(byCreatedDesc)
}
