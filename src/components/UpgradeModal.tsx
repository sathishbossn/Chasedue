'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, Check, Loader2, Shield, Zap, Receipt, Users, CreditCard, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string | null
}

const features = [
  { icon: Zap, text: 'Unlimited WhatsApp payment reminders' },
  { icon: Receipt, text: 'GST-compliant invoice generation' },
  { icon: Users, text: 'Unlimited clients & invoices' },
  { icon: CreditCard, text: 'Razorpay payment collection' },
  { icon: BarChart3, text: 'Cashflow dashboard & reports' },
]

export function UpgradeModal({ isOpen, onClose, userId }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Handle ESC key to close modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  const handleSubscribe = async () => {
    if (!userId) {
      toast.error('Please sign in to upgrade')
      return
    }

    setIsLoading(true)

    try {
      // Create subscription order
      const res = await fetch('/api/razorpay/create-subscription-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'pro',
          billing: 'monthly',
          userId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create subscription order')
      }

      // Load Razorpay and open checkout
      const Razorpay = await loadRazorpay()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: data.orderId,
        amount: data.amount,
        currency: 'INR',
        name: 'ChaseDue',
        description: 'Pro Plan (Monthly)',
        handler: async (response: {
          razorpay_payment_id: string
          razorpay_order_id: string
          razorpay_signature: string
        }) => {
          try {
            // Verify payment
            const verifyRes = await fetch('/api/razorpay/verify-subscription', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                plan: 'pro',
                billing: 'monthly',
                isLaunchOffer: String(data.isLaunchOffer),
              }),
            })

            const verifyData = await verifyRes.json()

            if (!verifyRes.ok) {
              throw new Error(verifyData.error || 'Payment verification failed')
            }

            toast.success('Welcome to Pro! Your subscription is active.')
            onClose()
            window.location.reload()
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Payment verification failed')
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
          },
        },
        theme: {
          color: '#F97316',
        },
      }

      const rzp = new Razorpay(options)
      rzp.open()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl shadow-black/50">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/20">
            <Zap className="h-7 w-7 text-orange-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white">Upgrade to Pro</h2>
          <p className="mt-2 text-sm text-white/60">
            Get paid faster with unlimited reminders and premium features
          </p>
        </div>

        {/* Plan */}
        <div className="mb-6 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-300">Pro Plan</p>
          <p className="mt-1 font-display text-3xl font-bold text-white">₹299<span className="text-lg font-normal text-white/60">/month</span></p>
        </div>

        {/* Features */}
        <ul className="mb-6 space-y-3">
          {features.map((feature) => (
            <li key={feature.text} className="flex items-center gap-3 text-sm text-white/80">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/20">
                <Check className="h-3 w-3 text-green-400" />
              </div>
              <feature.icon className="h-4 w-4 text-orange-400" />
              {feature.text}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Subscribe for ₹299/month'
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-white/5 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Not right now
          </button>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40">
          <Shield className="h-3.5 w-3.5" />
          Secured via Razorpay · Cancel anytime
        </div>
      </div>
    </div>
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
