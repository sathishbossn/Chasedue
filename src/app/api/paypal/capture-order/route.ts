import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/admin'
import { INVOICE_STATUS_DB } from '@/lib/invoice-paid'
import { getInrPerUsd, inrAmountToUsd } from '@/lib/global-payment'
import { clientCredentials, paypalFetch } from '@/lib/paypal-server'

type CaptureBody = {
  orderID?: string
  invoiceId?: string
}

export async function POST(request: Request) {
  if (!clientCredentials()) {
    return NextResponse.json({ error: 'PayPal is not configured.' }, { status: 503 })
  }

  let body: CaptureBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const orderID = String(body.orderID ?? '').trim()
  const invoiceId = String(body.invoiceId ?? '').trim()
  if (!orderID || !invoiceId) {
    return NextResponse.json({ error: 'orderID and invoiceId are required.' }, { status: 400 })
  }

  const admin = createServiceRoleClient()
  if (!admin) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not configured.' }, { status: 503 })
  }

  const { data: invoice, error: invErr } = await admin
    .from('invoices')
    .select('id, total_amount, status')
    .eq('id', invoiceId)
    .maybeSingle()

  if (invErr) {
    console.log(invErr)
  }
  if (invErr || !invoice) {
    return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 })
  }

  const st = String(invoice.status).toLowerCase().trim()
  if (st === 'paid' || st === 'settled' || st === 'received' || st === 'completed') {
    return NextResponse.json({ ok: true, alreadyPaid: true })
  }

  const expectedUsd = Math.max(0.01, Math.round(inrAmountToUsd(Number(invoice.total_amount), getInrPerUsd()) * 100) / 100)

  try {
    const capRes = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`, {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const capJson = (await capRes.json().catch(() => ({}))) as {
      status?: string
      id?: string
      purchase_units?: Array<{
        custom_id?: string
        payments?: { captures?: Array<{ amount?: { value?: string; currency_code?: string } }> }
      }>
      message?: string
    }

    if (!capRes.ok) {
      console.log('PAYPAL CAPTURE ERROR:', capJson)
      return NextResponse.json(
        { error: capJson.message ?? 'PayPal capture failed.' },
        { status: 502 }
      )
    }

    if (String(capJson.status).toUpperCase() !== 'COMPLETED') {
      return NextResponse.json({ error: 'PayPal order was not completed.' }, { status: 400 })
    }

    const pu = capJson.purchase_units?.[0]
    if (pu?.custom_id && pu.custom_id !== invoiceId) {
      return NextResponse.json({ error: 'Invoice mismatch on PayPal order.' }, { status: 400 })
    }

    const captured = pu?.payments?.captures?.[0]?.amount?.value
    if (captured != null) {
      const got = parseFloat(captured)
      if (Number.isFinite(got) && Math.abs(got - expectedUsd) > 0.05) {
        return NextResponse.json({ error: 'Captured amount does not match invoice.' }, { status: 400 })
      }
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
  } catch (e) {
    console.log('PAYPAL ERROR:', e)
    const msg = e instanceof Error ? e.message : 'PayPal capture failed.'
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
