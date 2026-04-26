import crypto from 'crypto'
import Razorpay from 'razorpay'
import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/admin'

const PLAN_PRICES = {
  pro: { monthly: 29900, yearly: 269900 },
  pro_max: { monthly: 79900, yearly: 719900 },
  ultra_pro: { monthly: 149900, yearly: 1349900 },
}

const LAUNCH_OFFER_PRICE = 9900 // ₹99 in paise
const LAUNCH_OFFER_SLOTS = 10

export async function POST(request: Request) {
  const admin = createServiceRoleClient()
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })

  const { plan, billing, userId } = await request.json()

  // Check launch offer slots
  const { count } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_launch_customer', true)

  const isLaunchOffer = (count ?? 0) < LAUNCH_OFFER_SLOTS
  const amount = isLaunchOffer
    ? LAUNCH_OFFER_PRICE
    : PLAN_PRICES[plan as keyof typeof PLAN_PRICES][billing as 'monthly' | 'yearly']

  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: `sub_${userId}_${plan}_${Date.now()}`,
    notes: {
      userId,
      plan,
      billing,
      isLaunchOffer: String(isLaunchOffer),
    },
  })

  return NextResponse.json({
    orderId: order.id,
    amount,
    isLaunchOffer,
    slotsLeft: Math.max(0, LAUNCH_OFFER_SLOTS - (count ?? 0)),
  })
}
