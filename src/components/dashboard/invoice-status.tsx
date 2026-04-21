import type { ReactNode } from 'react'
import { AlertTriangle, Check } from 'lucide-react'

export type InvoiceUiStatus = 'Paid' | 'Pending' | 'Overdue'

export function invoiceStatusLabel(raw: string): InvoiceUiStatus {
  const s = raw.toLowerCase().trim()
  if (['paid', 'settled', 'received', 'completed'].includes(s)) return 'Paid'
  if (s === 'overdue') return 'Overdue'
  return 'Pending'
}

export function statusPillVisual(label: InvoiceUiStatus): ReactNode {
  if (label === 'Paid') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-900/30 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-400 ring-1 ring-emerald-500/25">
        <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden />
        Paid
      </span>
    )
  }
  if (label === 'Overdue') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-red-900/35 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-red-300 ring-1 ring-red-500/30">
        <AlertTriangle className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden />
        Overdue
      </span>
    )
  }
  return (
    <span className="shrink-0 rounded-md bg-orange-900/30 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-orange-400 ring-1 ring-orange-500/25">
      Pending
    </span>
  )
}
