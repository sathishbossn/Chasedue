'use client'

import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import type { ClientRecord } from '@/app/clients/actions'
import { createClient } from '@/app/clients/actions'
import { PHONE_DIAL_OPTIONS } from '@/lib/country-dial-codes'
import { DEFAULT_CLIENT_STATE, INDIAN_STATE_OPTIONS } from '@/lib/indian-states'
import { parseStoredPhoneForForm } from '@/lib/phone-e164'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

function resolveInitialState(raw: string | null | undefined): string {
  if (raw && INDIAN_STATE_OPTIONS.includes(raw)) return raw
  return DEFAULT_CLIENT_STATE
}

function NewClientFormBody({
  editingClient,
  onClose,
  onSaved,
}: {
  editingClient: ClientRecord | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = Boolean(editingClient?.id)
  const phoneDefaults = useMemo(
    () => parseStoredPhoneForForm(editingClient?.whatsapp_number ?? editingClient?.phone),
    [editingClient]
  )

  const [dial, setDial] = useState(() =>
    phoneDefaults.mode === 'full' ? '__full__' : phoneDefaults.dial
  )
  const [placeState, setPlaceState] = useState(() => resolveInitialState(editingClient?.state ?? null))

  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)
    const fd = new FormData(e.currentTarget)
    fd.set('phone_dial', dial === '__full__' ? '__full__' : dial)
    const res = await createClient(fd)
    setPending(false)
    if (res.ok === false) {
      setError(res.error)
      return
    }
    ;(e.target as HTMLFormElement).reset()
    onSaved()
    onClose()
  }

  const manualFull = dial === '__full__'

  return (
    <form onSubmit={handleSubmit} className="max-h-[min(85vh,640px)] space-y-5 overflow-y-auto px-5 py-6">
      {isEdit ? <input type="hidden" name="client_id" value={editingClient!.id} /> : null}

      {error && (
        <p
          className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-sm text-amber-100"
          role="alert"
        >
          {error}
        </p>
      )}

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Name</span>
        <input
          name="name"
          required
          autoComplete="name"
          className="input mt-2"
          placeholder="Client or business name"
          defaultValue={editingClient?.name ?? ''}
        />
      </label>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Business name</span>
        <input
          name="company"
          autoComplete="organization"
          className="input mt-2"
          placeholder="Optional — legal or trading name"
          defaultValue={editingClient?.company ?? ''}
        />
      </label>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          className="input mt-2"
          placeholder="billing@client.com"
          defaultValue={editingClient?.email ?? ''}
        />
      </label>

      <label className="block" htmlFor="client-state">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-soft">State (GST place of supply)</span>
        <select
          id="client-state"
          name="state"
          value={placeState}
          onChange={(e) => setPlaceState(e.target.value)}
          className="input mt-2"
          required
          aria-required="true"
        >
          {INDIAN_STATE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-[11px] text-slate-soft">
          Used for CGST/SGST vs IGST on invoices. Defaults to {DEFAULT_CLIENT_STATE}; change if the client is billed in
          another state.
        </p>
      </label>

      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-soft">WhatsApp</span>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="phone_dial">
            Country code
          </label>
          <select
            id="phone_dial"
            value={dial}
            onChange={(e) => setDial(e.target.value)}
            className="input shrink-0 sm:max-w-[220px]"
            aria-label="Country code"
          >
            {PHONE_DIAL_OPTIONS.map((o, index) => (
              <option key={`${o.value}-${index}`} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {manualFull ? (
            <label className="min-w-0 flex-1">
              <span className="sr-only">Full international number</span>
              <input
                name="phone_full"
                type="tel"
                autoComplete="tel"
                className="input w-full"
                placeholder="+919876543210"
                defaultValue={phoneDefaults.mode === 'full' ? phoneDefaults.full : ''}
              />
            </label>
          ) : (
            <label className="min-w-0 flex-1">
              <span className="sr-only">Mobile number</span>
              <input
                name="phone_local"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                className="input w-full"
                placeholder="9876543210"
                defaultValue={phoneDefaults.mode === 'split' ? phoneDefaults.local : ''}
              />
            </label>
          )}
        </div>
        <p className="mt-1.5 text-[11px] text-slate-soft">
          {manualFull
            ? 'Include country code (e.g. +91…). Used for Quick Message and reminders.'
            : 'Local number without country prefix — we combine it with the code you pick.'}
        </p>
        <p className="mt-1 text-[11px] text-slate-soft/90">Auto-formats to India (91) if 10 digits are entered.</p>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} className="btn-premium btn-premium-secondary">
          Cancel
        </button>
        <button type="submit" disabled={pending} className="btn-premium btn-premium-primary disabled:opacity-60">
          {pending ? 'Saving…' : isEdit ? 'Save changes' : 'Save client'}
        </button>
      </div>
    </form>
  )
}

export default function NewClientModal({
  open,
  onClose,
  onCreated,
  editingClient,
}: {
  open: boolean
  onClose: () => void
  onCreated: () => void
  editingClient: ClientRecord | null
}) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  /** Light session touch when the dialog opens — refreshes auth + client without relying on a custom RPC. */
  useEffect(() => {
    if (!open) return
    const sb = createBrowserSupabaseClient()
    void sb.auth.getSession()
  }, [open])

  if (!open) return null

  const isEdit = Boolean(editingClient?.id)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-client-modal-title"
        className="relative w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#0F172A] shadow-2xl shadow-black/60"
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
          <h2 id="new-client-modal-title" className="font-display text-lg font-bold text-white">
            {isEdit ? 'Edit client' : 'New client'}
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

        <NewClientFormBody
          key={editingClient?.id ?? 'new'}
          editingClient={editingClient}
          onClose={onClose}
          onSaved={onCreated}
        />
      </div>
    </div>
  )
}
