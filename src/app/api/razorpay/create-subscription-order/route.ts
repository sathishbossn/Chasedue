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
  try {
    // Verify environment variables
    const keyId = process.env.RAZORPAY_KEY_ID?.trim() || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim()
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim() || process.env.RAZORPAY_SECRET_KEY?.trim()

    if (!keyId) {
      console.error('[ChaseDue] Missing env: RAZORPAY_KEY_ID or NEXT_PUBLIC_RAZORPAY_KEY_ID')
      return NextResponse.json({ error: 'Razorpay key_id is not configured.' }, { status: 500 })
    }

    if (!keySecret) {
      console.error('[ChaseDue] Missing env: RAZORPAY_KEY_SECRET or RAZORPAY_SECRET_KEY')
      return NextResponse.json({ error: 'Razorpay key_secret is not configured.' }, { status: 500 })
    }

    // Parse request body
    let body: { plan?: string; billing?: string; userId?: string }
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('[ChaseDue] Failed to parse request JSON:', parseError)
      return NextResponse.json({ error: 'Invalid JSON body. Expected { plan, billing, userId }.' }, { status: 400 })
    }

    const { plan, billing, userId } = body

    if (!plan || !billing || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: plan, billing, userId.' },
        { status: 400 }
      )
    }

    const admin = createServiceRoleClient()
    if (!admin) {
      return NextResponse.json(
        { error: 'Service role client failed to initialize. Check SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 500 }
      )
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })

    // Check launch offer slots
    const { count, error: countError } = await admin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_launch_customer', true)

    if (countError) {
      console.error('[ChaseDue] Failed to count launch customers:', countError)
      return NextResponse.json({ error: 'Database error while checking launch offer.' }, { status: 500 })
    }

    const isLaunchOffer = (count ?? 0) < LAUNCH_OFFER_SLOTS
    const planPrices = PLAN_PRICES[plan as keyof typeof PLAN_PRICES]
    if (!planPrices) {
      return NextResponse.json({ error: `Invalid plan: ${plan}. Valid options: pro, pro_max, ultra_pro.` }, { status: 400 })
    }

    const amount = planPrices[billing as 'monthly' | 'yearly']
    if (!amount) {
      return NextResponse.json({ error: `Invalid billing: ${billing}. Valid options: monthly, yearly.` }, { status: 400 })
    }

    const finalAmount = isLaunchOffer ? LAUNCH_OFFER_PRICE : amount

    // Create Razorpay order
    let order
    try {
      console.log('[ChaseDue] Creating Razorpay order:', {
        amount: finalAmount,
        currency: 'INR',
        receipt: `sub_${userId}_${plan}_${Date.now()}`,
        keyId: keyId.slice(0, 8) + '...', // Log partial key for debugging
      })

      order = await razorpay.orders.create({
        amount: finalAmount,
        currency: 'INR',
        receipt: `cd_${userId.slice(0, 8)}_${Date.now().toString().slice(-8)}`,
        notes: {
          userId,
          plan,
          billing,
          isLaunchOffer: String(isLaunchOffer),
        },
      })

      console.log('[ChaseDue] Razorpay order created:', order.id)
    } catch (razorpayError: any) {
      console.error('[ChaseDue] Razorpay order creation failed:', razorpayError)
      console.error('[ChaseDue] Razorpay error details:', {
        message: razorpayError?.message,
        code: razorpayError?.code,
        statusCode: razorpayError?.statusCode,
        description: razorpayError?.description,
      })
      const errorMessage = razorpayError?.message || razorpayError?.description || 'Razorpay API error'
      return NextResponse.json(
        { error: `Razorpay error: ${errorMessage}`, details: razorpayError?.description },
        { status: 502 }
      )
    }

    return NextResponse.json({
      orderId: order.id,
      amount: finalAmount,
      isLaunchOffer,
      slotsLeft: Math.max(0, LAUNCH_OFFER_SLOTS - (count ?? 0)),
    })
  } catch (error) {
    console.error('[ChaseDue] Unexpected error in create-subscription-order:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unexpected server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
