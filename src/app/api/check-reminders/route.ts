import { NextResponse } from 'next/server'
import {
  buildChasePaymentWhatsAppMessage,
  calendarDaysPastDue,
  CHASE_REMINDER_DAY_BUCKETS,
  chaseInvoiceDisplayRef,
} from '@/lib/chase'
import { isPaidInvoiceStatus } from '@/lib/invoice-paid'
import { formatInrRupee } from '@/lib/money'
import { getChasePortalUrl } from '@/lib/public-url'
import { formatWhatsAppLink } from '@/lib/whatsapp-me-link'
import { createServiceRoleClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const BUCKET_SET = new Set<number>(CHASE_REMINDER_DAY_BUCKETS)

function getCronSecret(): string | null {
  const s = process.env.CRON_SECRET ?? process.env.CHECK_REMINDERS_SECRET
  return s && s.trim() ? s.trim() : null
}

function authorize(request: Request): boolean {
  const secret = getCronSecret()
  if (!secret) return false
  const auth = request.headers.get('authorization')
  const url = new URL(request.url)
  const q = url.searchParams.get('secret')
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : null
  return bearer === secret || q === secret
}

export type CheckRemindersInvoice = {
  invoiceId: string
  userId: string
  clientId: string | null
  dueDate: string
  daysPastDue: number
  totalAmount: number
  status: string
  reminderCount: number
  clientName: string | null
  /** Portal URL where client pays (Razorpay on INR). */
  paymentPageUrl: string
  /** Ready-to-send WhatsApp body (no URL encoding). */
  suggestedMessage: string
  /** `https://wa.me/...` when client has a reachable phone. */
  waMeUrl: string | null
}

/**
 * GET/POST — Lists unpaid invoices exactly **1, 3, or 7 calendar days** past due (automation / cron).
 *
 * **Auth:** `Authorization: Bearer <CRON_SECRET>` or `?secret=<CRON_SECRET>`.
 * **Env:** `CRON_SECRET` or `CHECK_REMINDERS_SECRET` (and `SUPABASE_SERVICE_ROLE_KEY`).
 */
async function handle(request: Request) {
  if (!getCronSecret()) {
    return NextResponse.json(
      { ok: false, error: 'Set CRON_SECRET or CHECK_REMINDERS_SECRET in the server environment.' },
      { status: 503 }
    )
  }
  if (!authorize(request)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized. Pass Authorization: Bearer <secret> or ?secret=.' },
      { status: 401 }
    )
  }

  const admin = createServiceRoleClient()
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Service role client not configured.' }, { status: 503 })
  }

  const { data: invRows, error: invErr } = await admin
    .from('invoices')
    .select('id, user_id, client_id, total_amount, due_date, status, reminder_count')
    .not('due_date', 'is', null)
    .limit(5000)

  if (invErr) {
    console.log(invErr)
    return NextResponse.json({ ok: false, error: invErr.message }, { status: 500 })
  }

  const invoices = invRows ?? []
  const clientIds = [...new Set(invoices.map((r) => r.client_id).filter(Boolean))] as string[]
  const clientById: Record<string, { name: string | null; phone: string | null; whatsapp_number: string | null }> = {}

  if (clientIds.length > 0) {
    const { data: clients, error: cErr } = await admin
      .from('clients')
      .select('id, name, phone, whatsapp_number')
      .in('id', clientIds)

    if (cErr) {
      console.log(cErr)
      return NextResponse.json({ ok: false, error: cErr.message }, { status: 500 })
    }
    for (const c of clients ?? []) {
      clientById[c.id] = {
        name: c.name,
        phone: c.phone,
        whatsapp_number: c.whatsapp_number,
      }
    }
  }

  const asOf = new Date()
  const buckets: Record<'1' | '3' | '7', CheckRemindersInvoice[]> = { '1': [], '3': [], '7': [] }
  const prepared: CheckRemindersInvoice[] = []

  for (const row of invoices) {
    if (isPaidInvoiceStatus(row.status)) continue
    const due = String(row.due_date ?? '').slice(0, 10)
    const days = calendarDaysPastDue(due, asOf)
    if (!BUCKET_SET.has(days)) continue

    const invId = row.id as string
    const cid = row.client_id as string | null
    const client = cid ? clientById[cid] : null
    const clientName = client?.name ?? ''
    const total = Number(row.total_amount ?? 0)
    const totalFormatted = formatInrRupee(total, 0)
    const paymentPageUrl = getChasePortalUrl(invId)
    const ref = chaseInvoiceDisplayRef(invId)
    const suggestedMessage = buildChasePaymentWhatsAppMessage({
      clientName,
      invoiceRef: ref,
      totalFormatted,
      paymentPageUrl,
    })

    const rawPhone = (client?.whatsapp_number?.trim() || client?.phone?.trim() || '') || ''
    const waMeUrl = formatWhatsAppLink(rawPhone, suggestedMessage)

    const item: CheckRemindersInvoice = {
      invoiceId: invId,
      userId: row.user_id as string,
      clientId: cid,
      dueDate: due,
      daysPastDue: days,
      totalAmount: total,
      status: String(row.status ?? ''),
      reminderCount: Math.round(Number(row.reminder_count ?? 0)),
      clientName: client?.name ?? null,
      paymentPageUrl,
      suggestedMessage,
      waMeUrl,
    }

    prepared.push(item)
    if (days === 1) buckets['1'].push(item)
    else if (days === 3) buckets['3'].push(item)
    else if (days === 7) buckets['7'].push(item)
  }

  return NextResponse.json({
    ok: true,
    checkedAt: asOf.toISOString(),
    buckets: {
      day1: buckets['1'],
      day3: buckets['3'],
      day7: buckets['7'],
    },
    total: prepared.length,
    /** Flat list for job runners */
    invoices: prepared,
  })
}

export async function GET(request: Request) {
  return handle(request)
}

export async function POST(request: Request) {
  return handle(request)
}
