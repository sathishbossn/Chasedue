'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'
import type { DashboardInvoiceRow } from '@/app/dashboard/actions'
import { isPaidStatus } from '@/lib/invoice-archive'

function monthPaidCents(invoices: DashboardInvoiceRow[], now = new Date()): number {
  const y = now.getFullYear()
  const m = now.getMonth()
  let sum = 0
  for (const inv of invoices) {
    if (!isPaidStatus(inv.status)) continue
    const raw = inv.paid_at || inv.created_at
    if (!raw) continue
    const at = new Date(raw)
    if (!Number.isFinite(at.getTime())) continue
    if (at.getFullYear() === y && at.getMonth() === m) {
      sum += Math.round(Number(inv.total_amount) * 100)
    }
  }
  return sum
}

function milestoneThresholdCents(): number {
  const raw = process.env.NEXT_PUBLIC_REVENUE_MILESTONE_INR
  const inr = raw != null && String(raw).trim() !== '' ? Number(String(raw).replace(/,/g, '')) : 10_000
  if (!Number.isFinite(inr) || inr <= 0) return 10_000 * 100
  return Math.round(inr * 100)
}

export default function DashboardRevenueMilestone({ invoices }: { invoices: DashboardInvoiceRow[] }) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (firedRef.current || typeof window === 'undefined') return
    const threshold = milestoneThresholdCents()
    const total = monthPaidCents(invoices)
    if (total < threshold) return

    const now = new Date()
    const key = `cd_rev_milestone_${now.getFullYear()}_${now.getMonth() + 1}_${threshold}`
    if (localStorage.getItem(key) === '1') {
      firedRef.current = true
      return
    }

    firedRef.current = true
    localStorage.setItem(key, '1')

    const burst = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#F97316', '#fb923c', '#fdba74', '#ffffff'],
      })
    }
    burst()
    window.setTimeout(burst, 250)
    window.setTimeout(burst, 500)

    const inrLabel = (threshold / 100).toLocaleString('en-IN')
    toast.success(`Milestone reached! You crossed ₹${inrLabel} in paid invoices this month.`, {
      duration: 6000,
      description: 'Sent via ChaseDue — keep chasing what you’re owed.',
    })
  }, [invoices])

  return null
}
