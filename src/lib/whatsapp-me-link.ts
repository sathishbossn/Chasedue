/**
 * WhatsApp click-to-chat URLs: https://wa.me/{digits}?text={encoded_message}
 * Use with invoice total + payment URL (Razorpay flow or hosted checkout link).
 */

/** Strip to digits; wa.me expects country code without + (e.g. 91XXXXXXXXXX). */
export function normalizeWhatsappDigits(raw: string | null | undefined): string {
  const d = String(raw ?? '').replace(/\D/g, '')
  return d
}

/**
 * Normalizes any phone string for `wa.me`: strips non-digits; if exactly **10** digits (Indian mobile
 * without country code), prefixes **91**; if already **≥10** digits (e.g. 91… or other CC), uses as-is.
 * Returns `null` if fewer than 10 digits.
 */
export function digitsForWaMe(raw: string | null | undefined): string | null {
  const d = normalizeWhatsappDigits(raw)
  if (d.length === 10) return `91${d}`
  if (d.length >= 10) return d
  return null
}

/**
 * Builds `https://wa.me/...` using {@link digitsForWaMe} on `phoneRaw`, or empty string if invalid.
 */
export function buildWhatsappMeUrl(phoneRaw: string, message: string): string {
  const digits = digitsForWaMe(phoneRaw)
  if (!digits) return ''
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

/**
 * Full `https://wa.me/{digits}?text=…` URL, or `null` if the number cannot be normalized.
 */
export function formatWhatsAppLink(phone: string | null | undefined, message: string): string | null {
  const url = buildWhatsappMeUrl(phone ?? '', message)
  return url || null
}

export type InvoicePaymentWhatsappMessageInput = {
  /** Already formatted, e.g. "₹25,000.00" or "INR 25000". */
  invoiceTotalLabel: string
  /** Razorpay-hosted page, your portal URL, or any HTTPS pay link. */
  paymentUrl: string
  /** Optional short line; defaults to a neutral ChaseDue line. */
  intro?: string
}

/**
 * Message body including total + payment link for copy/paste or wa.me deep link.
 */
export function buildInvoicePaymentWhatsappMessage(input: InvoicePaymentWhatsappMessageInput): string {
  const intro =
    input.intro?.trim() ||
    'Hi — your invoice is ready. Please use the secure link below to pay.'
  return `${intro}\n\nAmount: ${input.invoiceTotalLabel}\nPay now: ${input.paymentUrl}\n\n— ChaseDue`
}

/**
 * Full WhatsApp API string with encoded text (invoice total + payment link).
 */
export function buildInvoicePaymentWhatsappLink(
  phoneDigits: string,
  input: InvoicePaymentWhatsappMessageInput
): string {
  const msg = buildInvoicePaymentWhatsappMessage(input)
  return buildWhatsappMeUrl(phoneDigits, msg)
}

export type ManualReminderWhatsappInput = {
  clientName: string
  invoiceId: string
  /** Display amount, e.g. "25,000.00" — template adds Rs. prefix. */
  amount: string
  razorpayLink: string
}

/**
 * Manual share template; `buildWhatsappMeUrl` applies `encodeURIComponent` to the full message.
 */
export function buildManualReminderWhatsappMessage(input: ManualReminderWhatsappInput): string {
  const { clientName, invoiceId, amount, razorpayLink } = input
  return `Hi ${clientName}, this is a payment reminder from *ChaseDue* for Invoice ${invoiceId} for Rs. ${amount}. You can pay here: ${razorpayLink}. Thanks!`
}

export function buildManualReminderWhatsappUrl(phoneDigits: string, input: ManualReminderWhatsappInput): string {
  return buildWhatsappMeUrl(phoneDigits, buildManualReminderWhatsappMessage(input))
}
