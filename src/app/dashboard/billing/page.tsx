'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

type BillingCycle = 'monthly' | 'yearly'
type PlanType = 'pro' | 'agency'

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export default function DashboardBillingPage() {
  const [loading, setLoading] = useState(false)
  const [billing, setBilling] = useState<BillingCycle>('monthly')
  const [plan, setPlan] = useState<PlanType>('pro')
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
  }, [supabase])

  const handlePayment = async () => {
    if (!userId) {
      toast.error('Please sign in to upgrade')
      return
    }

    setLoading(true)

    try {
      // Step 1: Create order
      const orderRes = await fetch('/api/razorpay/create-subscription-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billing, userId }),
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Step 2: Load Razorpay script
      const Razorpay = await loadRazorpay()

      // Step 3: Open checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: orderData.orderId,
        amount: orderData.amount,
        currency: 'INR',
        name: 'ChaseDue',
        description: `${plan.toUpperCase()} Plan (${billing})`,
        prefill: {
          email: '',
          contact: '',
        },
        handler: async (response: RazorpayResponse) => {
          try {
            // Step 4: Verify payment
            const verifyRes = await fetch('/api/razorpay/verify-subscription', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                plan,
                billing,
                isLaunchOffer: String(orderData.isLaunchOffer),
              }),
            })

            const verifyData = await verifyRes.json()

            if (!verifyRes.ok) {
              throw new Error(verifyData.error || 'Payment verification failed')
            }

            // Step 5: Update profile via Supabase
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                plan_type: plan,
                subscription_status: 'active',
                updated_at: new Date().toISOString(),
              })
              .eq('id', userId)

            if (updateError) {
              console.error('Profile update error:', updateError)
            }

            toast.success('Payment successful! Your plan has been upgraded.')
            window.location.reload()
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Payment failed')
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
        theme: {
          color: '#ED13C4',
        },
      }

      const rzp = new Razorpay(options)
      rzp.open()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ED13C4]">Billing</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-white">Upgrade your workspace</h1>
      <p className="mt-2 text-sm text-slate-soft">
        Pay securely through Razorpay. After payment, your plan updates automatically.
      </p>

      <div className="mt-8 space-y-4 rounded-2xl border border-white/[0.1] bg-white/[0.04] p-6 shadow-lg shadow-black/20 backdrop-blur-md">
        {/* Plan Selection */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPlan('pro')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              plan === 'pro'
                ? 'bg-[#ED13C4] text-white'
                : 'bg-white/[0.06] text-white/70 hover:bg-white/[0.1]'
            }`}
          >
            Pro
          </button>
          <button
            type="button"
            onClick={() => setPlan('agency')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              plan === 'agency'
                ? 'bg-[#ED13C4] text-white'
                : 'bg-white/[0.06] text-white/70 hover:bg-white/[0.1]'
            }`}
          >
            Agency
          </button>
        </div>

        {/* Billing Cycle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={`flex-1 rounded-xl px-4 py-2 text-sm transition-all ${
              billing === 'monthly'
                ? 'bg-white/[0.1] text-white'
                : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08]'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling('yearly')}
            className={`flex-1 rounded-xl px-4 py-2 text-sm transition-all ${
              billing === 'yearly'
                ? 'bg-white/[0.1] text-white'
                : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08]'
            }`}
          >
            Yearly (Save 30%)
          </button>
        </div>

        <p className="text-sm text-white/90">
          {plan === 'agency' ? (
            <>
              <span className="font-semibold text-[#ED13C4]">Agency</span> — team seats and white-label branding.
            </>
          ) : (
            <>
              <span className="font-semibold text-[#ED13C4]">Pro</span> — unlimited invoices, reminders, and Razorpay on
              the portal.
            </>
          )}
        </p>

        {/* Pay Button with Loading State */}
        <button
          type="button"
          onClick={handlePayment}
          disabled={loading || !userId}
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#ED13C4] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#ED13C4]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loading ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </>
          ) : (
            'Pay with Razorpay'
          )}
        </button>

        <p className="text-xs text-slate-soft">
          Existing invoices, the client portal, and PDF downloads stay available even if a subscription lapses — only new invoice creation is limited on
          Starter.
        </p>
      </div>

      <p className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/#pricing" className="font-medium text-[#ED13C4] hover:underline">
          Homepage pricing
        </Link>
        <Link href="/dashboard/invoices" className="text-slate-soft hover:text-white">
          ← Invoices
        </Link>
      </p>
    </main>
  )
}

// Load Razorpay script dynamically
function loadRazorpay(): Promise<new (options: Record<string, unknown>) => { open: () => void; on: (ev: string, fn: () => void) => void }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Razorpay is only available in the browser'))
      return
    }

    if ((window as any).Razorpay) {
      resolve((window as any).Razorpay)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve((window as any).Razorpay)
    script.onerror = () => reject(new Error('Failed to load Razorpay'))
    document.body.appendChild(script)
  })
}
