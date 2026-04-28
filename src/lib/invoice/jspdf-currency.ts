/**
 * INR prefix for jsPDF. Uses "Rs. " prefix to avoid font rendering issues with ₹ symbol.
 */
export function currencyPrefixForPdf(symbol: string | undefined): string {
  const s = (symbol ?? '').trim()
  if (!s || s === '₹' || s === '\u20B9') return 'Rs. '
  if (/^inr$/i.test(s)) return 'Rs. '
  if (/^rs\.?$/i.test(s)) return 'Rs. '
  // Avoid showing a stray key typo (e.g. "1") as the currency glyph in PDFs
  if (/^\d$/.test(s)) return 'Rs. '
  return `${s} `
}

/** Normalize pre-formatted money strings for PDF body cells. */
export function sanitizeMoneyTextForPdf(s: string): string {
  return s.replace(/\u20B9\u202F/g, 'Rs. ').replace(/\u20B9\s*/g, 'Rs. ').replace(/₹\s*/g, 'Rs. ')
}
