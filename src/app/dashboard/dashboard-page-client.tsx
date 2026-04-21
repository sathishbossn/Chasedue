'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Loader2 } from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import ChaseDueDashboard from '@/components/dashboard/chasedue-dashboard'
import InvoiceEssentialGrid from '@/components/dashboard/invoice-essential-grid'
import DashboardRevenueMilestone from '@/components/dashboard/dashboard-revenue-milestone'
import { formatInrFromCents } from '@/lib/money'
import DashboardStats from '@/components/dashboard/dashboard-stats'
import {
  getDashboardSnapshot,
  listClientsForUser,
  type DashboardSnapshot,
} from '@/app/dashboard/actions'
import { INVOICE_SYNC_EVENT } from '@/lib/chasedue-sync'

type ClientOption = { id: string; name: string; company: string | null }

type LoadState =
  | { status: 'loading' }
  | { status: 'unauthorized' }
  | { status: 'error'; message: string }
  | { status: 'ready'; snapshot: DashboardSnapshot; clients: ClientOption[] }

/**
 * Dashboard UI + data: waits for an authenticated session before loading invoices.
 * Invoice PDFs are generated server-side (`/api/invoices/[id]/pdf`); Razorpay stays in payment flows.
 */
export default function DashboardPageClient() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      const supabase = createBrowserSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (cancelled) return
      if (!session) {
        setState({ status: 'unauthorized' })
        return
      }

      const [snapshot, clientsRes] = await Promise.all([getDashboardSnapshot(), listClientsForUser()])

      if (cancelled) return

      if (snapshot.ok === false) {
        if (snapshot.error === 'unauthorized') {
          setState({ status: 'unauthorized' })
          return
        }
        setState({ status: 'error', message: snapshot.message ?? 'Something went wrong.' })
        return
      }

      const clients = clientsRes.ok ? clientsRes.clients : []

      setState({
        status: 'ready',
        snapshot: snapshot.data,
        clients,
      })
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const userId = state.status === 'ready' ? state.snapshot.userId : null

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    const supabase = createBrowserSupabaseClient()

    async function pullSnapshot() {
      const snap = await getDashboardSnapshot()
      if (cancelled || snap.ok === false) return
      setState((prev) =>
        prev.status === 'ready' ? { ...prev, snapshot: snap.data } : prev
      )
    }

    const onInvoiceSync = () => {
      void pullSnapshot()
    }
    window.addEventListener(INVOICE_SYNC_EVENT, onInvoiceSync)

    const channel = supabase
      .channel(`dashboard-invoices-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void pullSnapshot()
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      window.removeEventListener(INVOICE_SYNC_EVENT, onInvoiceSync)
      void supabase.removeChannel(channel)
    }
  }, [userId])

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#F97316]" aria-hidden />
        <p className="mt-4 text-sm text-slate-soft">Loading your invoices…</p>
      </div>
    )
  }

  if (state.status === 'unauthorized') {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">ChaseDue</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-white">Sign in to view your invoices</h1>
        <p className="mt-2 max-w-md text-sm text-slate-soft">
          Use <span className="text-white">Sign in with Google</span>. Your invoices and clients stay tied to this
          account on every device you use.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center justify-center rounded-lg border border-brand-500/30 bg-[#F97316] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-600"
        >
          Sign in
        </Link>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {state.message}
        </p>
      </div>
    )
  }

  const d = state.snapshot
  const { clients } = state

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8 rounded-xl border border-white/[0.1] bg-white/[0.05] px-5 py-5 shadow-lg shadow-black/20 backdrop-blur-md sm:px-6">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#F97316]">
            <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-[1.75rem]">
            {d.userWelcomeName ? (
              <>
                Welcome back, <span className="text-[#F97316]">{d.userWelcomeName}</span>
              </>
            ) : d.userDisplayName ? (
              <>
                Welcome back, <span className="text-[#F97316]">{d.userDisplayName}</span>
              </>
            ) : (
              'Welcome back'
            )}
          </h1>
          <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-soft">
            {d.userEmail ? (
              <p>
                Signed in as <span className="font-semibold text-white">{d.userEmail}</span>.
              </p>
            ) : (
              <p>
                <span className="block text-slate-soft">Account ID</span>
                <span className="mt-1 block font-mono text-sm font-semibold text-white break-all">{d.userId}</span>
              </p>
            )}
            <p>Your latest invoice activity and expenses sync here automatically when you use this account.</p>
          </div>
        </div>
      </div>

      <DashboardRevenueMilestone invoices={d.invoices} />

      <DashboardStats userId={d.userId} />

      <section className="mb-10" aria-label="Net position">
        <div className="rounded-xl border border-white/[0.1] bg-white/[0.04] p-6 shadow-lg shadow-black/15 backdrop-blur-md">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-soft">Net after expenses</p>
          <p className="mt-2 font-display text-3xl font-bold text-white">{formatInrFromCents(d.netPositionCents)}</p>
          <p className="mt-1 text-xs text-slate-soft">Total paid (all-time) − recorded expenses</p>
        </div>
      </section>

      <section className="mb-12" aria-labelledby="invoices-preview-heading">
        <h2 id="invoices-preview-heading" className="sr-only">
          Recent invoices
        </h2>
        <InvoiceEssentialGrid invoices={d.invoices} />
      </section>

      <ChaseDueDashboard snapshot={d} clients={clients} embedded showStatCards={false} />
    </main>
  )
}
