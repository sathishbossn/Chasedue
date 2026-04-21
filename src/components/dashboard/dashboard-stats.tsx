'use client'

import { useEffect, useMemo, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { formatInrFromCents } from '@/lib/money'
import {
  aggregateDashboardStatsFromInvoices,
  type DashboardStatInvoice,
} from '@/hooks/use-dashboard-stats'

type Props = {
  userId: string
}

/**
 * Queries `invoices` for the signed-in user and shows Paid / Pending / Overdue totals (V1 rules).
 * Subscribes to realtime changes on `invoices` for this user.
 */
export default function DashboardStats({ userId }: Props) {
  const [rows, setRows] = useState<DashboardStatInvoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()
    let cancelled = false

    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('invoices')
        .select('total_amount, amount_subtotal, status, due_date')
        .eq('user_id', userId)

      if (cancelled) return
      if (error) {
        console.log(error)
        setRows([])
      } else {
        setRows((data ?? []) as DashboardStatInvoice[])
      }
      setLoading(false)
    }

    void load()

    const channel = supabase
      .channel(`dashboard-stats-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void load()
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      void supabase.removeChannel(channel)
    }
  }, [userId])

  const stats = useMemo(() => aggregateDashboardStatsFromInvoices(rows), [rows])

  const paid = loading ? '—' : formatInrFromCents(stats.totalPaidCents)
  const pending = loading ? '—' : formatInrFromCents(stats.totalPendingCents)
  const overdue = loading ? '—' : formatInrFromCents(stats.totalOverdueCents)

  return (
    <section className="mb-10 grid gap-4 sm:grid-cols-3" aria-label="Invoice totals" aria-busy={loading}>
      <div className="rounded-xl border border-white/[0.1] bg-white/[0.04] p-6 shadow-lg shadow-black/15 backdrop-blur-md">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-soft">Paid</p>
        <p className="mt-2 font-display text-3xl font-bold text-[#F97316]">{paid}</p>
        <p className="mt-1 text-xs text-slate-soft">Total from invoices marked paid</p>
      </div>
      <div className="rounded-xl border border-white/[0.1] bg-white/[0.04] p-6 shadow-lg shadow-black/15 backdrop-blur-md">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-soft">Pending</p>
        <p className="mt-2 font-display text-3xl font-bold text-white">{pending}</p>
        <p className="mt-1 text-xs text-slate-soft">Unpaid, due today or later</p>
      </div>
      <div className="rounded-xl border border-white/[0.1] bg-white/[0.04] p-6 shadow-lg shadow-black/15 backdrop-blur-md">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-soft">Overdue</p>
        <p className="mt-2 font-display text-3xl font-bold text-amber-300/95">{overdue}</p>
        <p className="mt-1 text-xs text-slate-soft">Unpaid, due date before today</p>
      </div>
    </section>
  )
}
