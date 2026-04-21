import { calculateTaxes, type TaxBreakdown } from '@/lib/gst'

/** Fixed place-of-supply for ChaseDue V1 (your business). */
export const CHASEDUE_BUSINESS_STATE = 'Tamil Nadu' as const

/**
 * Tamil Nadu client → 9% CGST + 9% SGST on subtotal.
 * Any other state (or missing state) → 18% IGST.
 */
export function getTaxBreakdown(subtotal: number, clientState: string | null | undefined): TaxBreakdown {
  return calculateTaxes(Number(subtotal), clientState ?? '', CHASEDUE_BUSINESS_STATE)
}

export type { TaxBreakdown }
