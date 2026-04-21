import type { InvoicePdfLineItem } from '@/lib/invoice/invoice-pdf-types'

export type InvoiceLineItemStored = {
  description: string
  amount: number
}

/** INR — match `gst.ts` / server actions rounding (2 dp). */
export function roundMoney2(n: number): number {
  return Math.round(Number(n) * 100) / 100
}

/**
 * Parses `line_items_json` from the new-invoice form (array of { description, amount }).
 */
export function parseLineItemsFromFormJson(raw: string | null | undefined): InvoiceLineItemStored[] | null {
  const s = String(raw ?? '').trim()
  if (!s) return null
  try {
    const parsed = JSON.parse(s) as unknown
    if (!Array.isArray(parsed)) return null
    const out: InvoiceLineItemStored[] = []
    for (const row of parsed) {
      if (!row || typeof row !== 'object') continue
      const o = row as Record<string, unknown>
      const amount = Number(o.amount)
      const description = String(o.description ?? '').trim()
      if (Number.isFinite(amount) && amount > 0) {
        out.push({
          description: description || 'Line item',
          amount: roundMoney2(amount),
        })
      }
    }
    return out.length > 0 ? out : null
  } catch {
    return null
  }
}

/**
 * Normalizes JSONB / API values from `invoices.line_items` into stored rows.
 */
export function parseStoredLineItemsRpc(raw: unknown): InvoiceLineItemStored[] {
  let arr: unknown[] = []
  if (raw == null) return []
  if (typeof raw === 'string') {
    try {
      const p = JSON.parse(raw) as unknown
      arr = Array.isArray(p) ? p : []
    } catch {
      return []
    }
  } else if (Array.isArray(raw)) {
    arr = raw
  }
  const out: InvoiceLineItemStored[] = []
  for (const row of arr) {
    if (!row || typeof row !== 'object') continue
    const o = row as Record<string, unknown>
    const amount = Number(o.amount)
    const description = String(o.description ?? '').trim()
    if (Number.isFinite(amount) && amount > 0) {
      out.push({
        description: description || 'Line item',
        amount: roundMoney2(amount),
      })
    }
  }
  return out
}

const DEFAULT_HSN = '998314'

/** Strip placeholder "nil" and collapse whitespace — PDF shows a real service label. */
function descriptionForPdf(raw: string): string {
  const t = String(raw ?? '')
    .replace(/\bnil\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return t || 'Services rendered'
}

export function storedLineItemsToPdfRows(items: InvoiceLineItemStored[]): InvoicePdfLineItem[] {
  return items.map((row, i) => ({
    description: descriptionForPdf(row.description),
    hsn: DEFAULT_HSN,
    qty: 1,
    unit: '—',
    rate: row.amount,
    amount: row.amount,
  }))
}
