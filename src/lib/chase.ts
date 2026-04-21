import { digitsForWaMe } from '@/lib/whatsapp-me-link'

/** Chase Payment helpers — pending/overdue invoices and due-date math (local calendar dates). */

export function invoiceNeedsChase(statusRaw: string): boolean {
  const s = statusRaw.toLowerCase().trim()
  return s === 'pending' || s === 'overdue'
}

function parseLocalDate(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number)
  if (!y || !m || !d) return new Date(NaN)
  return new Date(y, m - 1, d)
}

function startOfToday(): Date {
  const t = new Date()
  t.setHours(0, 0, 0, 0)
  return t
}

function startOfDay(d: Date): Date {
  const t = new Date(d)
  t.setHours(0, 0, 0, 0)
  return t
}

/** Calendar days the invoice is past due (0 if due today or in the future). */
export function calendarDaysPastDue(dueDateYmd: string, asOf: Date = new Date()): number {
  const due = parseLocalDate(dueDateYmd)
  const today = startOfDay(asOf)
  if (!Number.isFinite(due.getTime())) return 0
  if (due.getTime() >= today.getTime()) return 0
  return Math.floor((today.getTime() - due.getTime()) / 86400000)
}

/** Automation: flag chases when overdue by exactly one of these day counts. */
export const CHASE_REMINDER_DAY_BUCKETS = [1, 3, 7] as const

/** Short invoice # for messages (matches portal). */
export function chaseInvoiceDisplayRef(invoiceId: string): string {
  return String(invoiceId ?? '').trim().slice(0, 8).toUpperCase()
}

/** Human-readable status for the WhatsApp template. */
export function chaseStatusWord(statusRaw: string, dueDateYmd: string): 'Pending' | 'Overdue' {
  const s = statusRaw.toLowerCase().trim()
  if (s === 'overdue') return 'Overdue'
  const due = parseLocalDate(dueDateYmd)
  const today = startOfToday()
  if (!Number.isFinite(due.getTime())) return 'Pending'
  if (due < today) return 'Overdue'
  return 'Pending'
}

/** True when the due date is at least 3 full calendar days before today (invoice is 3+ days late). */
export function isThreeOrMoreCalendarDaysPastDue(dueDateYmd: string): boolean {
  const due = parseLocalDate(dueDateYmd)
  const today = startOfToday()
  if (!Number.isFinite(due.getTime())) return false
  if (today.getTime() <= due.getTime()) return false
  const diffDays = Math.floor((today.getTime() - due.getTime()) / 86400000)
  return diffDays >= 3
}

/** Digits for https://wa.me/{digits} — prefers explicit whatsapp_number, then phone; uses {@link digitsForWaMe}. */
export function whatsappDigits(whatsappNumber: string | null | undefined, phone: string | null | undefined): string | null {
  const raw = (whatsappNumber?.trim() || phone?.trim() || '') || ''
  return digitsForWaMe(raw)
}

/**
 * Digits for the dashboard “Chase” button — **only** `clients.whatsapp_number`
 * (must match the WhatsApp destination for reminders).
 */
export function chaseWhatsAppDigits(whatsappNumber: string | null | undefined): string | null {
  return digitsForWaMe((whatsappNumber ?? '').trim() || undefined)
}

/**
 * WhatsApp copy for the Chase Payment button.
 * `paymentPageUrl` is the hosted pay page (portal loads Razorpay for INR).
 */
export function buildChasePaymentWhatsAppMessage(input: {
  clientName: string
  /** Display ref, e.g. first 8 chars of invoice id uppercase. */
  invoiceRef: string
  /** Includes ₹ via `formatInrFromCents` / `formatInrRupee`. */
  totalFormatted: string
  /** Secure payment URL (portal). */
  paymentPageUrl: string
}): string {
  const name = String(input.clientName ?? '').trim() || 'there'
  const ref = String(input.invoiceRef ?? '').trim() || '—'
  return `Hi ${name}, this is a payment reminder from *ChaseDue* for Invoice #${ref} for ${input.totalFormatted}. Pay securely here: ${input.paymentPageUrl}. Thanks!`
}

/** @deprecated Prefer `buildChasePaymentWhatsAppMessage` for the Chase button. */
export function buildChaseMessage(input: { amountFormatted: string; portalUrl: string }): string {
  const { amountFormatted, portalUrl } = input
  return `Hello! This is an automated reminder from ChaseDue. Your invoice for ${amountFormatted} is ready for review. You can pay securely here: ${portalUrl}. Thank you! - A. Sathish Kumar`
}

/** Post-payment WhatsApp thank-you (manual send from dashboard). */
export function buildPaymentThankYouMessage(input: {
  clientName: string
  amountFormatted: string
  invoiceRef: string
}): string {
  const { clientName, amountFormatted, invoiceRef } = input
  return `Hi ${clientName}, we received your payment of ${amountFormatted} for Invoice #${invoiceRef}. Thank you for your business! — Sent via ChaseDue.`
}
