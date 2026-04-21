'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { INVOICE_SYNC_EVENT, subscribeInvoiceSyncAcrossTabs } from '@/lib/chasedue-sync'

/**
 * Workspace-wide “Live sync / Synced” badge: pulses after navigation, invoice realtime updates,
 * or `dispatchInvoiceSync()` (e.g. Chase Payment, Mark as paid).
 */
export default function WorkspaceSyncIndicator() {
  const pathname = usePathname()
  const [syncPulse, setSyncPulse] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  function bump() {
    setSyncPulse(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null
      setSyncPulse(false)
    }, 2200)
  }

  useEffect(() => {
    bump()
  }, [pathname])

  useEffect(() => {
    const onSync = () => bump()
    window.addEventListener(INVOICE_SYNC_EVENT, onSync)
    const unsubBc = subscribeInvoiceSyncAcrossTabs(onSync)
    return () => {
      window.removeEventListener(INVOICE_SYNC_EVENT, onSync)
      unsubBc()
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const supabase = createBrowserSupabaseClient()

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled || !session?.user?.id) return
      const uid = session.user.id
      const ch = supabase
        .channel(`workspace-invoices-${uid}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'invoices',
            filter: `user_id=eq.${uid}`,
          },
          () => {
            bump()
          }
        )
        .subscribe()
      if (cancelled) {
        void supabase.removeChannel(ch)
        return
      }
      channelRef.current = ch
    })

    return () => {
      cancelled = true
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      const ch = channelRef.current
      channelRef.current = null
      if (ch) {
        void supabase.removeChannel(ch)
      }
    }
  }, [])

  return (
    <div
      className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-300 ${
        syncPulse
          ? 'border-emerald-400/60 bg-emerald-500/20 text-emerald-100 shadow-[0_0_20px_rgba(52,211,153,0.35)]'
          : 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200/95'
      }`}
      aria-live="polite"
    >
      <CheckCircle2
        className={`h-4 w-4 text-emerald-400 ${syncPulse ? 'animate-pulse' : ''}`}
        aria-hidden
      />
      {syncPulse ? 'Synced' : 'Live sync'}
    </div>
  )
}
