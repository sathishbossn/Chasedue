/**
 * After a successful server-side invoice update from the browser (e.g. Chase Payment),
 * dispatch so the dashboard client can refetch and flash the “Synced” indicator without
 * waiting for Supabase Realtime.
 */
export const INVOICE_SYNC_EVENT = 'chasedue-invoice-sync'

const BROADCAST_NAME = 'chasedue-invoice-sync-bc'

export function dispatchInvoiceSync(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(INVOICE_SYNC_EVENT))
  try {
    const bc = new BroadcastChannel(BROADCAST_NAME)
    bc.postMessage({ t: 'invoice-sync' })
    bc.close()
  } catch {
    /* Safari private mode / unsupported */
  }
}

/** Subscribe in workspace UI so another tab (e.g. client paying on /portal) can flash “Synced”. */
export function subscribeInvoiceSyncAcrossTabs(onSync: () => void): () => void {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
    return () => {}
  }
  const bc = new BroadcastChannel(BROADCAST_NAME)
  bc.onmessage = () => onSync()
  return () => {
    bc.close()
  }
}
