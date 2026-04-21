import { AlertCircle, Check, CheckCheck } from 'lucide-react'

export type WhatsappDelivery = {
  status: string
  error_detail: string | null
}

/** WhatsApp-style ticks: sent (1 gray), delivered (2 gray), read (2 blue), failed (red alert). */
export default function WhatsappDeliveryStatus({ delivery }: { delivery: WhatsappDelivery }) {
  const s = delivery.status.toLowerCase()

  if (s === 'failed') {
    return (
      <span
        className="inline-flex cursor-help"
        title={delivery.error_detail?.trim() || 'Message delivery failed'}
      >
        <AlertCircle className="h-4 w-4 text-red-400" strokeWidth={2} aria-hidden />
        <span className="sr-only">WhatsApp delivery failed</span>
      </span>
    )
  }

  if (s === 'sent') {
    return (
      <span className="inline-flex" title="WhatsApp: Sent">
        <Check className="h-4 w-4 text-slate-400" strokeWidth={2.5} aria-hidden />
        <span className="sr-only">WhatsApp sent</span>
      </span>
    )
  }

  if (s === 'delivered') {
    return (
      <span className="inline-flex" title="WhatsApp: Delivered">
        <CheckCheck className="h-4 w-4 text-slate-400" strokeWidth={2.5} aria-hidden />
        <span className="sr-only">WhatsApp delivered</span>
      </span>
    )
  }

  if (s === 'read') {
    return (
      <span className="inline-flex" title="WhatsApp: Read">
        <CheckCheck className="h-4 w-4 text-blue-500" strokeWidth={2.5} aria-hidden />
        <span className="sr-only">WhatsApp read</span>
      </span>
    )
  }

  if (s === 'pending') {
    return (
      <span className="inline-flex text-xs text-slate-500" title="WhatsApp: Pending">
        …
      </span>
    )
  }

  return null
}
