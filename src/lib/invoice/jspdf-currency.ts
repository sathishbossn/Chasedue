/**
 * INR prefix for jsPDF. Uses U+20B9 (₹); standard PDF fonts may substitute — most viewers render it.
 */
export function currencyPrefixForPdf(symbol: string | undefined): string {
  const s = (symbol ?? '').trim()
  if (!s || s === '₹' || s === '\u20B9') return '\u20B9'
  if (/^inr$/i.test(s)) return '\u20B9'
  if (/^rs\.?$/i.test(s)) return '\u20B9'
  // Avoid showing a stray key typo (e.g. "1") as the currency glyph in PDFs
  if (/^\d$/.test(s)) return '\u20B9'
  return `${s} `
}

/** Normalize pre-formatted money strings for PDF body cells. */
export function sanitizeMoneyTextForPdf(s: string): string {
  return s.replace(/\u20B9\u202F/g, '\u20B9 ').replace(/\u20B9\s*/g, '\u20B9 ').replace(/₹\s*/g, '\u20B9 ')
}
