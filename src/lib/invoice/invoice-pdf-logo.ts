/**
 * Absolute URL for the invoice PDF header logo (`@react-pdf/renderer` `Image`).
 * Set `NEXT_PUBLIC_APP_URL` in production (e.g. `https://chasedue.in`).
 */
export function getInvoicePdfLogoIconUrl(): string {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  return `${base}/logo-icon.png`
}
