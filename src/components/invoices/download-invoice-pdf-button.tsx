'use client'

import { useState } from 'react'
import { FileDown } from 'lucide-react'
import type { DashboardInvoiceRow } from '@/app/dashboard/actions'

async function downloadInvoicePdfFromApi(invoiceId: string): Promise<void> {
  const res = await fetch(`/api/invoices/${encodeURIComponent(invoiceId)}/pdf`, {
    credentials: 'include',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error('[PDF] API error:', res.status, err)
    throw new Error(typeof err?.error === 'string' ? err.error : 'Could not download PDF.')
  }
  const blob = await res.blob()
  const cd = res.headers.get('Content-Disposition')
  let filename = `Invoice-${invoiceId.slice(0, 8)}.pdf`
  const m = cd && /filename="([^"]+)"/.exec(cd)
  if (m) filename = m[1]
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function downloadInvoicePdfFromRow(row: DashboardInvoiceRow): Promise<void> {
  await downloadInvoicePdfFromApi(row.id)
}

export default function DownloadInvoicePdfButton({
  invoice,
  className = '',
  label = 'Download PDF',
  size = 'default',
}: {
  invoice: DashboardInvoiceRow
  className?: string
  label?: string
  size?: 'default' | 'sm'
}) {
  const [busy, setBusy] = useState(false)

  async function handleClick() {
    if (typeof window === 'undefined') return
    setBusy(true)
    try {
      await downloadInvoicePdfFromRow(invoice)
    } catch (e) {
      console.error(e)
      window.alert(e instanceof Error ? e.message : 'Could not generate PDF. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const base =
    size === 'sm'
      ? 'inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.12] bg-white/[0.06] px-2.5 py-1.5 text-xs font-medium text-white transition hover:border-[#F97316]/40 hover:bg-[#F97316]/10'
      : 'inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.06] px-3 py-2 text-sm font-medium text-white transition hover:border-[#F97316]/40 hover:bg-[#F97316]/10'

  return (
    <button type="button" onClick={handleClick} disabled={busy} className={`${base} items-center justify-center disabled:opacity-50 ${className}`}>
      <FileDown className={size === 'sm' ? 'h-3.5 w-3.5 shrink-0 text-[#F97316]' : 'h-4 w-4 shrink-0 text-[#F97316]'} />
      {busy ? 'Preparing…' : label}
    </button>
  )
}
