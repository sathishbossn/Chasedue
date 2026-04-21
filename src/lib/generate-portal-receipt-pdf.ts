export type PortalReceiptPayload = {
  invoiceId: string
  invoiceRefShort: string
  amountFormatted: string
  currency: string
  paymentMethodLabel: string
  businessName: string
  clientLabel: string
  paidAtIso?: string
}

/** Server-generated PDF via `/api/portal/receipt-pdf` (no client-side PDF libs). */
export async function downloadPortalReceiptPdf(payload: PortalReceiptPayload): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('Receipt PDF is only available in the browser.')
  }

  const res = await fetch('/api/portal/receipt-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error('Could not generate receipt PDF.')
  }

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ChaseDue-receipt-${payload.invoiceRefShort}.pdf`
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
