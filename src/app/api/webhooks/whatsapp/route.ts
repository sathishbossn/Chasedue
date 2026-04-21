import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/admin'
import { parseMetaWebhookStatuses } from '@/lib/whatsapp/meta-webhook'

/**
 * Meta WhatsApp Cloud API — webhook endpoint.
 *
 * GET  — Subscription verification (`hub.mode`, `hub.verify_token`, `hub.challenge`).
 * POST — Incoming events (status updates, messages). Persists rows to `whatsapp_logs`.
 *
 * Env:
 * - `META_WHATSAPP_VERIFY_TOKEN` — must match the Verify Token in Meta Developer Console.
 * - `META_APP_SECRET` — optional; when set, validates `X-Hub-Signature-256` on POST.
 * - `SUPABASE_SERVICE_ROLE_KEY` — required to insert into `whatsapp_logs`.
 */

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}

function verifyMetaSignature(rawBody: string, signatureHeader: string | null, appSecret: string): boolean {
  if (!signatureHeader?.startsWith('sha256=')) return false
  const expected = signatureHeader.slice('sha256='.length)
  const hmac = crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex')
  try {
    return timingSafeEqual(expected, hmac)
  } catch {
    return false
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const verifyToken = process.env.META_WHATSAPP_VERIFY_TOKEN

  if (!verifyToken) {
    return NextResponse.json(
      { error: 'META_WHATSAPP_VERIFY_TOKEN is not configured.' },
      { status: 503 }
    )
  }

  if (mode === 'subscribe' && token === verifyToken && challenge) {
    return new Response(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  return new Response('Forbidden', { status: 403 })
}

export async function POST(request: Request) {
  const appSecret = process.env.META_APP_SECRET
  const rawBody = await request.text()

  if (appSecret) {
    const sig = request.headers.get('x-hub-signature-256')
    if (!verifyMetaSignature(rawBody, sig, appSecret)) {
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 })
    }
  }

  let body: unknown
  try {
    body = rawBody ? JSON.parse(rawBody) : {}
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const events = parseMetaWebhookStatuses(body)
  const admin = createServiceRoleClient()

  if (!admin) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY is not configured; cannot persist whatsapp_logs.' },
      { status: 503 }
    )
  }

  for (const ev of events) {
    const { error } = await admin.from('whatsapp_logs').insert({
      invoice_id: ev.invoiceId,
      meta_message_id: ev.metaMessageId,
      status: ev.status,
      recipient_wa_id: ev.recipientWaId,
      error_detail: ev.errorDetail,
      raw_payload: {
        parsed: ev,
        received_at: new Date().toISOString(),
      },
    })

    if (error) {
      console.error('[whatsapp webhook] insert whatsapp_logs:', error.message)
    }
  }

  // Meta expects 200 quickly; acknowledge even if some inserts failed.
  return NextResponse.json({ received: true, logged: events.length }, { status: 200 })
}
