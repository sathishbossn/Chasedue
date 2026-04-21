/** ₹ (INR) with Indian digit grouping via `en-IN` — use for dashboard cards and lists. */
export function formatInrFromCents(cents: number): string {
  return (cents / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  })
}

/**
 * Premium dashboard-style ₹ display with Indian digit grouping (e.g. ₹13,000).
 * @param fractionDigits 0 for whole rupees, 2 for paise-precise tax lines
 */
export function formatInrRupee(amount: number, fractionDigits: 0 | 2 = 0): string {
  return Number(amount).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}

/** Razorpay expects INR amounts in paise (smallest unit). */
export function inrToPaise(inr: number): number {
  return Math.round(Number(inr) * 100)
}
