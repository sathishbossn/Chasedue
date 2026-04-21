import { formatPlaceOfSupplyLine, gstinPrefixStateCode } from '@/lib/gst-state-codes'
import { amountToWordsInr } from '@/lib/invoice/amount-to-words-inr'
import type { InvoicePdfViewModel } from '@/lib/invoice/invoice-pdf-types'
import { parseStoredLineItemsRpc, storedLineItemsToPdfRows } from '@/lib/invoice/line-items'

function str(v: unknown): string {
  if (v == null) return ''
  return String(v).trim()
}

function safeNum(v: unknown, fallback = 0): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function round2(n: number): number {
  return Math.round(Number(n) * 100) / 100
}

/** One decimal for labels like "CGST @ 9%" */
function round1(n: number): number {
  return Math.round(Number(n) * 10) / 10
}

/**
 * Intra-state supply: recipient state matches supplier state → CGST + SGST (50/50 split of total GST).
 * Inter-state: different states → IGST on full GST amount.
 */
export function buildInvoicePdfViewModelFromPortalRow(inv: Record<string, unknown>): InvoicePdfViewModel {
  const taxable = safeNum(inv.taxable_value, safeNum(inv.total_amount, safeNum(inv.amount, 0)))
  const total = round2(safeNum(inv.total_amount, safeNum(inv.amount, 0)))
  const totalGst = round2(Math.max(0, total - taxable))

  const storedLines = parseStoredLineItemsRpc(inv.line_items)
  const lineItems =
    storedLines.length > 0
      ? storedLineItemsToPdfRows(storedLines)
      : [
          {
            description:
              inv.description != null && String(inv.description).trim() !== ''
                ? String(inv.description)
                : 'Services Rendered',
            hsn: '998314',
            qty: 1,
            unit: 'Job',
            rate: taxable,
            amount: taxable,
          },
        ]

  const sellerGstin = str(inv.seller_gstin) || process.env.NEXT_PUBLIC_INVOICE_SELLER_GSTIN || ''
  const sellerStateCode = str(inv.seller_state_code) || process.env.NEXT_PUBLIC_INVOICE_SELLER_STATE_CODE || ''

  const placeLine = formatPlaceOfSupplyLine({
    sellerGstin: sellerGstin || null,
    sellerStateCodeFallback: sellerStateCode || null,
  })
  const placeOfSupplyShort = placeLine.replace(/^Place of Supply:\s*/i, '').trim() || 'Tamil Nadu (33)'

  let sellerCode = gstinPrefixStateCode(sellerGstin || null)
  if (!sellerCode && sellerStateCode) {
    sellerCode = sellerStateCode.padStart(2, '0').slice(0, 2)
  }
  if (!sellerCode || sellerCode === '00') sellerCode = '33'

  const clientGstin = str(inv.client_gstin)
  const clientCode = gstinPrefixStateCode(clientGstin || null)

  /**
   * Intra-state (CGST+SGST): supplier and recipient in the same state.
   * If the client has no GSTIN (B2C), assume same-state supply.
   * Inter-state (IGST): client GSTIN shows a different state code than the seller.
   */
  const intraState = clientCode == null ? true : clientCode === sellerCode
  const taxType: 'intra' | 'inter' = intraState ? 'intra' : 'inter'

  const gstRatePercent =
    taxable > 0.0001 ? round2((totalGst / taxable) * 100) : 18

  let cgstAmount = 0
  let sgstAmount = 0
  let igstAmount = 0
  let cgstRate = 0
  let sgstRate = 0
  let igstRate = 0

  if (taxType === 'intra') {
    if (totalGst <= 0) {
      cgstAmount = 0
      sgstAmount = 0
    } else {
      /** 50/50 split of total GST (matches typical equal CGST/SGST on intra-state supplies). */
      cgstAmount = round2(totalGst / 2)
      sgstAmount = round2(totalGst - cgstAmount)
    }
    const halfPct = gstRatePercent > 0 ? round1(gstRatePercent / 2) : 0
    cgstRate = halfPct
    sgstRate = halfPct
  } else {
    igstAmount = round2(totalGst)
    igstRate = gstRatePercent
  }

  const sellerName =
    str(inv.seller_business_name) || process.env.NEXT_PUBLIC_INVOICE_SELLER_NAME || 'Seller'
  const bankName = process.env.NEXT_PUBLIC_INVOICE_BANK_NAME || ''
  const accountNumber = process.env.NEXT_PUBLIC_INVOICE_BANK_ACCOUNT_NUMBER || ''
  const ifsc = process.env.NEXT_PUBLIC_INVOICE_BANK_IFSC || ''

  return {
    invoiceNumber:
      inv.invoice_number != null && String(inv.invoice_number).trim() !== ''
        ? String(inv.invoice_number)
        : String(inv.id).slice(0, 8).toUpperCase(),
    invoiceDate: formatIn(inv.created_at),
    dueDate: formatIn(inv.due_date),
    status: inv.status != null ? String(inv.status).toUpperCase() : 'PENDING',
    refShort: String(inv.id).slice(0, 8).toUpperCase(),
    currency: 'INR',
    placeOfSupplyShort,
    taxType,
    gstRatePercent,
    taxableValue: round2(taxable),
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate,
    igstAmount,
    totalGst,
    grandTotal: total,
    amountInWords: amountToWordsInr(total),
    lineItems,
    seller: {
      businessName: sellerName,
      gstin: sellerGstin || '—',
      address:
        str(inv.seller_billing_address) || process.env.NEXT_PUBLIC_INVOICE_SELLER_ADDRESS || 'India',
      email: str(inv.seller_email) || process.env.NEXT_PUBLIC_INVOICE_SELLER_EMAIL || '—',
      phone: process.env.NEXT_PUBLIC_INVOICE_SELLER_PHONE || '—',
      bankName,
      accountNumber,
      ifsc,
    },
    client: {
      name: inv.client_name != null ? String(inv.client_name) : 'Client',
      gstin: clientGstin,
      address: '',
      email: inv.client_email != null ? String(inv.client_email) : '',
      phone: '',
    },
    notes: 'Payment due within 14 days.',
  }
}

function formatIn(d: unknown): string {
  if (d == null || d === '') return '—'
  const t = Date.parse(String(d))
  if (!Number.isFinite(t)) return String(d)
  return new Date(t).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
