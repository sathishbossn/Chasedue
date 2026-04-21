import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/admin'
import { inrToPaise } from '@/lib/money'

function resolveRazorpayKeyId(): string {
  return (
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() ||
    process.env.RAZORPAY_KEY_ID?.trim() ||
    ''
  )
}

export async function POST(request: Request) {
  const keyId = resolveRazorpayKeyId()
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim()
  if (!keyId) {
    console.log('[ChaseDue] Missing env: NEXT_PUBLIC_RAZORPAY_KEY_ID (or legacy RAZORPAY_KEY_ID)')
  }
  if (!keySecret) {
    console.log('[ChaseDue] Missing env: RAZORPAY_KEY_SECRET')
  }
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'Missing API Keys' }, { status: 400 })
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

  const supabaseUser = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabaseUser.auth.getUser()

  let invoice: {
    id: string
    user_id: string
    total_amount: number
    status: string
  } | null = null

  if (user) {
    const { data, error } = await supabaseUser
      .from('invoices')
      .select('id, user_id, total_amount, status')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .maybeSingle()
    if (error) {
      console.log(error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    invoice = data
  } else {
    const admin = createServiceRoleClient()
    if (!admin) {
      return NextResponse.json(
        { error: 'Public payment requires SUPABASE_SERVICE_ROLE_KEY on the server.' },
        { status: 503 }
      )
    }
    const { data, error } = await admin
      .from('invoices')
      .select('id, user_id, total_amount, status')
      .eq('id', invoiceId)
      .maybeSingle()
    if (error) {
      console.log(error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    invoice = data
  }

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 })
  }

  const st = String(invoice.status).toLowerCase()
  if (st === 'paid' || st === 'settled' || st === 'received') {
    return NextResponse.json({ error: 'This invoice is already paid.' }, { status: 400 })
  }

  /** Razorpay order amount: INR → paise (×100), integer. */
  const amountPaise = inrToPaise(Number(invoice.total_amount))
  if (amountPaise < 100) {
    return NextResponse.json({ error: 'Amount must be at least ₹1.' }, { status: 400 })
  }

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: invoiceId.slice(0, 40),
      notes: { invoice_id: invoiceId },
    })

    return NextResponse.json({
      keyId,
      orderId: order.id,
      amountPaise,
      currency: order.currency ?? 'INR',
      invoiceId: invoice.id,
    })
  } catch (error) {
    console.log('RAZORPAY ERROR:', error)
    const msg = error instanceof Error ? error.message : 'Failed to create Razorpay order.'
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
