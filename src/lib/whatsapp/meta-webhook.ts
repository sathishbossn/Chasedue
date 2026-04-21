/**
 * Meta WhatsApp Cloud API webhook payload helpers.
 * @see https://developers.facebook.com/docs/graph-api/webhooks/getting-started
 */

export type WhatsappLogStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed'

export type ParsedStatusEvent = {
  metaMessageId: string
  status: WhatsappLogStatus
  recipientWaId: string | null
  errorDetail: string | null
  /** Set when your send API includes invoice_id in template metadata (future). */
  invoiceId: string | null
}

function mapMetaStatus(raw: string | undefined): WhatsappLogStatus | null {
  if (!raw) return null
  const s = raw.toLowerCase()
  if (s === 'pending') return 'pending'
  if (s === 'sent') return 'sent'
  if (s === 'delivered') return 'delivered'
  if (s === 'read') return 'read'
  if (s === 'failed' || s === 'undelivered') return 'failed'
  return null
}

/** Best-effort parse of Meta `messages` / `statuses` arrays from webhook POST body. */
export function parseMetaWebhookStatuses(body: unknown): ParsedStatusEvent[] {
  if (!body || typeof body !== 'object') return []

  const out: ParsedStatusEvent[] = []
  const root = body as Record<string, unknown>
  const entries = Array.isArray(root.entry) ? root.entry : []

  for (const ent of entries) {
    if (!ent || typeof ent !== 'object') continue
    const changes = Array.isArray((ent as Record<string, unknown>).changes)
      ? (ent as Record<string, unknown>).changes
      : []

    for (const ch of changes) {
      if (!ch || typeof ch !== 'object') continue
      const value = (ch as Record<string, unknown>).value as Record<string, unknown> | undefined
      if (!value) continue

      const statuses = Array.isArray(value.statuses) ? value.statuses : []
      for (const st of statuses) {
        if (!st || typeof st !== 'object') continue
        const o = st as Record<string, unknown>
        const id = typeof o.id === 'string' ? o.id : null
        const mapped = mapMetaStatus(typeof o.status === 'string' ? o.status : undefined)
        if (!id || !mapped) continue

        const recipient =
          typeof o.recipient_id === 'string'
            ? o.recipient_id
            : typeof o.recipientId === 'string'
              ? o.recipientId
              : null

        let errorDetail: string | null = null
        const errs = o.errors
        if (Array.isArray(errs) && errs.length > 0) {
          errorDetail = JSON.stringify(errs.slice(0, 3))
        }

        let invoiceId: string | null = null
        const meta = o.message
        if (meta && typeof meta === 'object') {
          const m = meta as Record<string, unknown>
          const ctx = m.context
          if (ctx && typeof ctx === 'object') {
            const idFromCtx = (ctx as Record<string, unknown>).invoice_id
            if (typeof idFromCtx === 'string') invoiceId = idFromCtx
          }
        }

        out.push({
          metaMessageId: id,
          status: mapped,
          recipientWaId: recipient,
          errorDetail,
          invoiceId,
        })
      }
    }
  }

  return out
}
