'use client'

import { useRouter } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { recordChaseReminderSent } from '@/app/dashboard/actions'
import {
  buildChasePaymentWhatsAppMessage,
  chaseInvoiceDisplayRef,
  invoiceNeedsChase,
  isThreeOrMoreCalendarDaysPastDue,
} from '@/lib/chase'
import { formatWhatsAppLink } from '@/lib/whatsapp-me-link'
import { dispatchInvoiceSync } from '@/lib/chasedue-sync'
import { formatInrFromCents } from '@/lib/money'
import { getChasePortalUrl } from '@/lib/public-url'

type Props = {
  invoiceId: string
  amount: number
  dueDate: string
  statusRaw: string
  clientName: string | null | undefined
  /** When set, overrides derived ref from `invoiceId` for the message line. */
  invoiceRefDisplay?: string
  whatsappNumber: string | null | undefined
  phone: string | null | undefined
  className?: string
}

export default function ChasePaymentButton({
  invoiceId,
  amount,
  dueDate,
  statusRaw,
  clientName,
  invoiceRefDisplay,
  whatsappNumber,
  phone,
  className,
}: Props) {
  const router = useRouter()

  if (!invoiceNeedsChase(statusRaw)) {
    return null
  }

  const amountCents = Math.round(Number(amount) * 100)
  const amountFormatted = formatInrFromCents(amountCents)
  const paymentPageUrl = getChasePortalUrl(invoiceId)
  const phoneRaw = (whatsappNumber?.trim() || phone?.trim() || '') || ''
  const pulse = isThreeOrMoreCalendarDaysPastDue(dueDate)
  const invRef = invoiceRefDisplay?.trim() || chaseInvoiceDisplayRef(invoiceId)

  const message = buildChasePaymentWhatsAppMessage({
    clientName: clientName ?? '',
    invoiceRef: invRef,
    totalFormatted: amountFormatted,
    paymentPageUrl,
  })
  const href = formatWhatsAppLink(phoneRaw, message) ?? ''

  async function handleClick() {
    if (!href) {
      toast.error('Missing WhatsApp number. Add `whatsapp_number` on the client record.')
      return
    }
    const w = window.open(href, '_blank', 'noopener,noreferrer')
    if (!w) {
      toast.error('Allow pop-ups for this site to open WhatsApp, then try again.')
      return
    }

    const res = await recordChaseReminderSent(invoiceId)
    if (res.ok === false) {
      toast.error(res.error)
      return
    }
    toast.success('Chase logged — reminder count updated.')
    dispatchInvoiceSync()
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={
        !href
          ? 'Add a WhatsApp number or phone on the client to chase on WhatsApp.'
          : undefined
      }
      className={
        className ??
        [
          'inline-flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-lg border border-[#F97316] px-3 py-2 text-xs font-semibold text-white transition-colors',
          'hover:bg-[#F97316] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]',
          pulse ? 'animate-chase-pulse' : '',
          !href ? 'opacity-60' : '',
        ].join(' ')
      }
    >
      <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      Chase Payment
    </button>
  )
}
