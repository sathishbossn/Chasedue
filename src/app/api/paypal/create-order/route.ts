import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/admin'
import { getInrPerUsd, inrAmountToUsd } from '@/lib/global-payment'
import { clientCredentials, paypalFetch } from '@/lib/paypal-server'

export async function POST(request: Request) {
  if (!clientCredentials()) {
    return NextResponse.json(
      {
        error:
          'PayPal is not configured. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID (or PAYPAL_CLIENT_ID) and PAYPAL_CLIENT_SECRET (or PAYPAL_SECRET).',
      },
      { status: 503 }
    )
  }

  let body: { invoiceId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const invoiceId = String(body.invoiceId ?? '').trim()
  if (!invoiceId) {
    return NextResponse.json({ error: 'invoiceId is required.' }, { status: 400 })
  }

  const admin = createServiceRoleClient()
  if (!admin) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not configured.' }, { status: 503 })
  }

  const { data: invoice, error } = await admin
    .from('invoices')
    .select('id, total_amount, status')
    .eq('id', invoiceId)
    .maybeSingle()

  if (error) {
    console.log(error)
  }
  if (error || !invoice) {
    return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 })
  }

  const st = String(invoice.status).toLowerCase()
  if (st === 'paid' || st === 'settled' || st === 'received') {
    return NextResponse.json({ error: 'This invoice is already paid.' }, { status: 400 })
  }

  const inrPerUsd = getInrPerUsd()
  const usd = inrAmountToUsd(Number(invoice.total_amount), inrPerUsd)
  const value = Math.max(0.01, Math.round(usd * 100) / 100)
  const usdStr = value.toFixed(2)

  try {
    const res = await paypalFetch('/v2/checkout/orders', {
      method: 'POST',
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: invoiceId.slice(0, 12),
            custom_id: invoiceId,
            amount: {
              currency_code: 'USD',
              value: usdStr,
            },
          },
        ],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
        },
      }),
    })

    const data = (await res.json().catch(() => ({}))) as {
      id?: string
      message?: string
      details?: unknown
    }

    if (!res.ok || !data.id) {
      console.log('PAYPAL CREATE ORDER ERROR:', data)
      return NextResponse.json(
        { error: data.message ?? 'Failed to create PayPal order.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ orderId: data.id })
  } catch (e) {
    console.log('PAYPAL ERROR:', e)
    const msg = e instanceof Error ? e.message : 'PayPal order failed.'
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
