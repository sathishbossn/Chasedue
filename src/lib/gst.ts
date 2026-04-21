/**
 * Indian GST helpers — intra-state (CGST + SGST) vs inter-state (IGST) at a single headline rate.
 * Default 18%: splits 9% + 9% for same state, full 18% as IGST when states differ.
 */

export const DEFAULT_GST_RATE_PERCENT = 18

function roundMoney2(n: number): number {
  return Math.round(Number(n) * 100) / 100
}

/** Normalize for comparison (trim, uppercase; strips spaces). */
export function normalizeIndianStateCode(raw: string | null | undefined): string {
  return String(raw ?? '')
    .trim()
    .replace(/\s+/g, '')
    .toUpperCase()
}

export type GstBreakdown = {
  regime: 'intra' | 'inter'
  /** Pre-tax taxable value (your line items subtotal). */
  taxableAmount: number
  /** Effective GST % applied to taxable (default 18). */
  ratePercent: number
  cgst: number
  sgst: number
  igst: number
  totalTax: number
  grandTotal: number
}

export type CalculateGstInput = {
  supplierStateCode: string
  clientStateCode: string
  /** Amount before GST (taxable value). */
  taxableAmount: number
  /** Default 18. */
  gstRatePercent?: number
}

/**
 * Computes CGST/SGST (half + half) when supplier and client state codes match,
 * otherwise IGST for the full rate. Amounts are rounded to 2 decimal places (INR).
 */
export function calculateIndianGst(input: CalculateGstInput): GstBreakdown {
  const rate = input.gstRatePercent ?? DEFAULT_GST_RATE_PERCENT
  const taxable = roundMoney2(Math.max(0, Number(input.taxableAmount)))
  const supplier = normalizeIndianStateCode(input.supplierStateCode)
  const client = normalizeIndianStateCode(input.clientStateCode)
  const sameState = supplier.length > 0 && supplier === client

  const totalTax = roundMoney2((taxable * rate) / 100)

  if (sameState) {
    const half = roundMoney2(totalTax / 2)
    const cgst = half
    const sgst = roundMoney2(totalTax - half)
    return {
      regime: 'intra',
      taxableAmount: taxable,
      ratePercent: rate,
      cgst,
      sgst,
      igst: 0,
      totalTax: roundMoney2(cgst + sgst),
      grandTotal: roundMoney2(taxable + roundMoney2(cgst + sgst)),
    }
  }

  return {
    regime: 'inter',
    taxableAmount: taxable,
    ratePercent: rate,
    cgst: 0,
    sgst: 0,
    igst: totalTax,
    totalTax,
    grandTotal: roundMoney2(taxable + totalTax),
  }
}

/** V1 MVP: same API as strategy doc — business = supplier, client = place of supply. */
export type TaxBreakdown = {
  subtotal: number
  cgst: number
  sgst: number
  igst: number
  totalTax: number
  grandTotal: number
  regime: 'intra' | 'inter'
}

/**
 * If `clientState === businessState`: 9% CGST + 9% SGST on subtotal.
 * Otherwise: 18% IGST. Returns line items and `grandTotal`.
 */
export function calculateTaxes(subtotal: number, clientState: string, businessState: string): TaxBreakdown {
  const r = calculateIndianGst({
    taxableAmount: subtotal,
    supplierStateCode: businessState,
    clientStateCode: clientState,
    gstRatePercent: DEFAULT_GST_RATE_PERCENT,
  })
  return {
    subtotal: r.taxableAmount,
    cgst: r.cgst,
    sgst: r.sgst,
    igst: r.igst,
    totalTax: r.totalTax,
    grandTotal: r.grandTotal,
    regime: r.regime,
  }
}
