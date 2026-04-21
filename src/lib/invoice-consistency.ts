/**
 * Validates stored invoice money: taxable subtotal + GST total ≈ payable total (₹, 2dp rounding).
 * Use when asserting analytics/dashboard rows match ChaseDue GST logic.
 */
export function invoiceTotalsConsistentPaise(
  amountSubtotalInr: number | null | undefined,
  gstTotalInr: number | null | undefined,
  totalAmountInr: number | null | undefined
): boolean {
  const sub = Math.round(Number(amountSubtotalInr ?? 0) * 100)
  const gst = Math.round(Number(gstTotalInr ?? 0) * 100)
  const tot = Math.round(Number(totalAmountInr ?? 0) * 100)
  if (tot <= 0 && sub <= 0) return true
  return Math.abs(sub + gst - tot) <= 1
}
