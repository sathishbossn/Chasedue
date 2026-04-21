import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/admin'
import { INVOICE_STATUS_DB } from '@/lib/invoice-paid'

function verifySignature(orderId: string, paymentId: string, signature: string, secret: string): boolean {
  const body = `${orderId}|${paymentId}`
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  return expected === signature
}

export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    return NextResponse.json({ error: 'RAZORPAY_KEY_SECRET is not configured.' }, { status: 500 })
  }

  const admin = createServiceRoleClient()
  if (!admin) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not configured.' }, { status: 503 })
  }

  let body: {
    invoiceId?: string
    razorpay_order_id?: string
    razorpay_payment_id?: string
    razorpay_signature?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const invoiceId = String(body.invoiceId ?? '').trim()
  const orderId = String(body.razorpay_order_id ?? '').trim()
  const paymentId = String(body.razorpay_payment_id ?? '').trim()
  const signature = String(body.razorpay_signature ?? '').trim()

  if (!invoiceId || !orderId || !paymentId || !signature) {
    return NextResponse.json({ error: 'Missing payment fields.' }, { status: 400 })
  }

  if (!verifySignature(orderId, paymentId, signature, keySecret)) {
    return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 400 })
  }

  const { data: invoice, error: fetchErr } = await admin
    .from('invoices')
    .select('id, status, paid_at')
    .eq('id', invoiceId)
    .maybeSingle()

  if (fetchErr) {
    console.log(fetchErr)
  }
  if (fetchErr || !invoice) {
    return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 })
  }

  const st = String(invoice.status).toLowerCase().trim()
  if (st === 'paid' || st === 'settled' || st === 'received' || st === 'completed') {
    return NextResponse.json({ ok: true, alreadyPaid: true })
  }

  const nowIso = new Date().toISOString()

  const { error: updateErr } = await admin
    .from('invoices')
    .update({
      status: INVOICE_STATUS_DB.PAID,
      last_chased_at: nowIso,
      paid_at: nowIso,
    })
    .eq('id', invoiceId)

  if (updateErr) {
    console.log(updateErr)
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/invoices')
  revalidatePath('/analytics')
  revalidatePath('/clients')
  revalidatePath(`/portal/${invoiceId}`)

  return NextResponse.json({ ok: true })
}
