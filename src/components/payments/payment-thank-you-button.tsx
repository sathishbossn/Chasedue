'use client'

import { HeartHandshake } from 'lucide-react'
import { toast } from 'sonner'
import { buildPaymentThankYouMessage } from '@/lib/chase'
import { formatWhatsAppLink } from '@/lib/whatsapp-me-link'
import { formatInrFromCents } from '@/lib/money'
import { isPaidStatus } from '@/lib/invoice-archive'

type Props = {
  invoiceId: string
  amount: number
  statusRaw: string
  clientName: string | null | undefined
  whatsappNumber: string | null | undefined
  phone: string | null | undefined
  className?: string
}

export default function PaymentThankYouButton({
  invoiceId,
  amount,
  statusRaw,
  clientName,
  whatsappNumber,
  phone,
  className,
}: Props) {
  if (!isPaidStatus(statusRaw)) {
    return null
  }

  const amountCents = Math.round(Number(amount) * 100)
  const amountFormatted = formatInrFromCents(amountCents)
  const name = (clientName?.trim() || 'there').slice(0, 120)
  const invoiceRef = invoiceId.slice(0, 8).toUpperCase()
  const message = buildPaymentThankYouMessage({ clientName: name, amountFormatted, invoiceRef })
  const phoneRaw = (whatsappNumber?.trim() || phone?.trim() || '') || ''
  const href = formatWhatsAppLink(phoneRaw, message) ?? ''

  function handleClick() {
    if (!href) {
      toast.error('Add a phone or WhatsApp number for this client.')
      return
    }
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={!href ? 'Missing client phone number.' : 'Open WhatsApp with payment thank-you message'}
      className={
        className ??
        [
          'inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1.5 text-xs font-semibold text-emerald-100 transition-colors',
          'hover:bg-emerald-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500',
          !href ? 'opacity-60' : '',
        ].join(' ')
      }
    >
      <HeartHandshake className="h-3.5 w-3.5 shrink-0" aria-hidden />
      Thank client (WhatsApp)
    </button>
  )
}
