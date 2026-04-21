'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { createClient } from '@/app/clients/actions'
import { DEFAULT_CLIENT_STATE, INDIAN_STATE_OPTIONS } from '@/lib/indian-states'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

export default function NewClientSlideover({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [placeState, setPlaceState] = useState(DEFAULT_CLIENT_STATE)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      setError(null)
      setPlaceState(DEFAULT_CLIENT_STATE)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const sb = createBrowserSupabaseClient()
    void sb.auth.getSession()
  }, [open])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)
    const fd = new FormData(e.currentTarget)
    const res = await createClient(fd)
    setPending(false)
    if (res.ok === false) {
      setError(res.error)
      return
    }
    ;(e.target as HTMLFormElement).reset()
    onCreated()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close panel"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-client-title"
        className="relative flex h-full w-full max-w-md flex-col border-l border-white/[0.1] bg-[#0c1424] shadow-2xl shadow-black/50"
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
          <h2 id="new-client-title" className="font-display text-lg font-bold text-white">
            New client
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-soft transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
          {error && (
            <p className="mb-4 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-sm text-amber-100" role="alert">
              {error}
            </p>
          )}

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Name</span>
            <input name="name" required autoComplete="organization" className="input mt-2" placeholder="Acme Studio" />
          </label>

          <label className="mt-5 block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Business name</span>
            <input name="company" autoComplete="organization" className="input mt-2" placeholder="Optional" />
          </label>

          <label className="mt-5 block" htmlFor="slideover-client-state">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-soft">State (GST place of supply)</span>
            <select
              id="slideover-client-state"
              name="state"
              value={placeState}
              onChange={(e) => setPlaceState(e.target.value)}
              className="input mt-2"
              required
            >
              {INDIAN_STATE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-5 block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-soft">WhatsApp</span>
            <input
              name="whatsapp"
              type="tel"
              autoComplete="tel"
              className="input mt-2"
              placeholder="+91 …"
            />
            <span className="mt-1 block text-[11px] text-slate-soft/90">Stored as the contact phone for WhatsApp nudges.</span>
            <span className="mt-1 block text-[11px] text-slate-soft/90">Auto-formats to India (91) if 10 digits are entered.</span>
          </label>

          <label className="mt-5 block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              className="input mt-2"
              placeholder="billing@client.com"
            />
          </label>

          <div className="mt-auto flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="btn-premium btn-premium-secondary order-2 sm:order-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="btn-premium btn-premium-primary order-1 sm:order-2 disabled:opacity-60"
            >
              {pending ? 'Saving…' : 'Save client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
