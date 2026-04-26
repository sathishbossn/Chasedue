import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/admin'

const PLAN_LIMITS = {
  pro: { invoice_limit: 50, whatsapp_limit: 999999 },
  pro_max: { invoice_limit: 999999, whatsapp_limit: 999999 },
  ultra_pro: { invoice_limit: 999999, whatsapp_limit: 999999 },
}

function verifySignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
  return expected === signature
}

export async function POST(request: Request) {
  const admin = createServiceRoleClient()
  const keySecret = process.env.RAZORPAY_KEY_SECRET!

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    plan,
    billing,
    isLaunchOffer,
  } = await request.json()

  if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, keySecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]
  const now = new Date()
  const billingEnd = new Date(now)
  billing === 'yearly'
    ? billingEnd.setFullYear(billingEnd.getFullYear() + 1)
    : billingEnd.setMonth(billingEnd.getMonth() + 1)

  await admin
    .from('profiles')
    .update({
      plan,
      invoice_limit: limits.invoice_limit,
      whatsapp_limit: limits.whatsapp_limit,
      billing_end: billingEnd.toISOString(),
      is_launch_customer: isLaunchOffer === 'true',
      launch_offer_expires: isLaunchOffer === 'true' ? billingEnd.toISOString() : null,
      payment_id: razorpay_payment_id,
    })
    .eq('id', userId)

  return NextResponse.json({ ok: true, plan, billing })
}
