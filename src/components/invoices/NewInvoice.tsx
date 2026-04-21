'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronDown, MessageCircle, Receipt, ScrollText, Trash2 } from 'lucide-react'
import { createInvoice } from '@/app/invoices/actions'
import type { ClientRecord } from '@/app/clients/actions'
import {
  buildChasePaymentWhatsAppMessage,
  chaseInvoiceDisplayRef,
  whatsappDigits,
} from '@/lib/chase'
import { dispatchInvoiceSync } from '@/lib/chasedue-sync'
import { toast } from 'sonner'
import { CHASEDUE_BUSINESS_STATE, getTaxBreakdown } from '@/lib/get-tax-breakdown'
import { formatInrRupee } from '@/lib/money'
import { getChasePortalUrl } from '@/lib/public-url'
import { formatWhatsAppLink } from '@/lib/whatsapp-me-link'

function defaultDueDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString().slice(0, 10)
}

function newLineItemRow(): { id: string; description: string; amount: string } {
  return { id: crypto.randomUUID(), description: '', amount: '' }
}

const touchBtn = 'min-h-[44px] min-w-[44px] touch-manipulation'
const lineInputClass =
  'input mt-1.5 border-[1px] border-white/[0.12] bg-white/[0.05] focus:border-brand-500/50'

/**
 * New invoice form — mobile-first (Android Chrome): decimal keypad for amount, native date picker, 44px touch targets.
 */
export default function NewInvoice({
  clients,
  initialClientId,
}: {
  clients: ClientRecord[]
  initialClientId?: string
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [clientId, setClientId] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [lineItems, setLineItems] = useState(() => [newLineItemRow()])
  const [successInvoiceId, setSuccessInvoiceId] = useState<string | null>(null)
  const [successTotalInr, setSuccessTotalInr] = useState<number | null>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const initialClientAppliedRef = useRef(false)

  useEffect(() => {
    if (initialClientAppliedRef.current || !initialClientId) return
    const exists = clients.some((c) => c.id === initialClientId)
    if (exists) {
      setClientId(initialClientId)
      initialClientAppliedRef.current = true
    }
  }, [initialClientId, clients])

  useEffect(() => {
    if (!pickerOpen) return
    function handlePointerDown(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [pickerOpen])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return clients
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.company?.toLowerCase().includes(q) ?? false) ||
        (c.email?.toLowerCase().includes(q) ?? false) ||
        (c.phone?.toLowerCase().includes(q) ?? false) ||
        (c.whatsapp_number?.toLowerCase().includes(q) ?? false)
    )
  }, [clients, query])

  const selected = clients.find((c) => c.id === clientId)

  const subtotalNum = useMemo(() => {
    let sum = 0
    for (const row of lineItems) {
      const n = Number.parseFloat(row.amount)
      if (Number.isFinite(n) && n > 0) sum += n
    }
    return Math.round(sum * 100) / 100
  }, [lineItems])

  const taxPreview = useMemo(() => {
    if (!selected || subtotalNum <= 0) return null
    return getTaxBreakdown(subtotalNum, selected.state)
  }, [selected, subtotalNum])

  /** Same rule as dashboard Chase: WhatsApp first, then phone — never throws on empty strings. */
  const reminderDigits = useMemo(() => {
    if (!selected) return null
    return whatsappDigits(selected.whatsapp_number, selected.phone)
  }, [selected])

  const reminderUsesWhatsappField = useMemo(() => {
    if (!selected) return false
    return Boolean(String(selected.whatsapp_number ?? '').trim())
  }, [selected])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (!clientId) {
      setError('Select a client.')
      return
    }
    const payload = lineItems
      .map((r) => ({
        description: r.description.trim(),
        amount: Number.parseFloat(r.amount),
      }))
      .filter((r) => Number.isFinite(r.amount) && r.amount > 0)
    if (payload.length === 0) {
      setError('Add at least one line item with a positive amount.')
      return
    }
    setPending(true)
    const fd = new FormData(e.currentTarget)
    fd.set('client_id', clientId)
    fd.set('line_items_json', JSON.stringify(payload))
    const res = await createInvoice(fd)
    setPending(false)
    if (res.ok === false) {
      setError(res.error)
      return
    }
    const taxAtSave =
      selected && subtotalNum > 0 ? getTaxBreakdown(subtotalNum, selected.state) : null
    setSuccessInvoiceId(res.invoiceId)
    setSuccessTotalInr(taxAtSave ? taxAtSave.grandTotal : null)
    toast.success('Invoice created.')
    dispatchInvoiceSync()
    router.refresh()
  }

  const successWaHref =
    successInvoiceId && selected
      ? formatWhatsAppLink(
          (selected.whatsapp_number?.trim() || selected.phone?.trim() || '') || '',
          buildChasePaymentWhatsAppMessage({
            clientName: selected.name ?? '',
            invoiceRef: chaseInvoiceDisplayRef(successInvoiceId),
            totalFormatted: formatInrRupee(
              successTotalInr != null && Number.isFinite(successTotalInr) ? successTotalInr : 0,
              0
            ),
            paymentPageUrl: getChasePortalUrl(successInvoiceId),
          })
        )
      : null

  if (successInvoiceId && selected) {
    return (
      <div className="space-y-8">
        <div
          className="rounded-2xl border border-emerald-500/30 bg-emerald-950/25 px-5 py-6 shadow-lg shadow-black/20 sm:px-8"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2 text-emerald-300">
            <Check className="h-5 w-5 shrink-0" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wide">Invoice created</span>
          </div>
          <p className="mt-3 text-sm text-slate-200">
            Share the payment link on WhatsApp with {selected.name}
            {selected.company ? ` (${selected.company})` : ''}, or go to your invoice list.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {successWaHref ? (
              <button
                type="button"
                onClick={() => {
                  window.open(successWaHref, '_blank', 'noopener,noreferrer')
                }}
                className="btn-premium inline-flex min-h-[44px] items-center justify-center gap-2 bg-[#25D366] px-5 text-white hover:bg-[#20bd5a]"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                WhatsApp share
              </button>
            ) : (
              <p className="text-sm text-amber-200/95">
                Add a WhatsApp number or phone on this client to share via WhatsApp.
              </p>
            )}
            <button
              type="button"
              onClick={() => router.push('/dashboard/invoices')}
              className={`btn-premium btn-premium-primary ${touchBtn} inline-flex items-center justify-center`}
            >
              View invoices
            </button>
            <button
              type="button"
              onClick={() => {
                setSuccessInvoiceId(null)
                setSuccessTotalInr(null)
                setLineItems([newLineItemRow()])
              }}
              className={`btn-premium btn-premium-secondary ${touchBtn}`}
            >
              Create another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100" role="alert">
          {error}
        </div>
      )}

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-soft" htmlFor="new-inv-client-trigger">
          Client
        </label>
        <input type="hidden" name="client_id" value={clientId} />
        <div className="relative mt-2" ref={pickerRef}>
          <button
            id="new-inv-client-trigger"
            type="button"
            onClick={() => setPickerOpen((o) => !o)}
            className={`input flex w-full items-center justify-between text-left ${touchBtn}`}
          >
            <span className={selected ? 'text-white' : 'text-slate-soft'}>
              {selected
                ? `${selected.name}${selected.company ? ` (${selected.company})` : ''}${selected.state ? ` · ${selected.state}` : ''}`
                : 'Search and select a client…'}
            </span>
            <ChevronDown className={`h-4 w-4 shrink-0 opacity-70 transition ${pickerOpen ? 'rotate-180' : ''}`} />
          </button>

          {pickerOpen && (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/[0.12] bg-[#0c1424] shadow-xl shadow-black/40">
              <div className="border-b border-white/[0.08] p-2">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter by name, company, email, phone…"
                  className={`input py-2 text-sm ${touchBtn}`}
                  autoComplete="off"
                  autoFocus
                />
              </div>
              <ul className="max-h-56 overflow-y-auto py-1">
                {filtered.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-slate-soft">No matches. Add a client first.</li>
                ) : (
                  filtered.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setClientId(c.id)
                          setPickerOpen(false)
                          setQuery('')
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-white transition hover:bg-white/[0.06] ${touchBtn}`}
                      >
                        {clientId === c.id ? <Check className="h-4 w-4 shrink-0 text-[#F97316]" /> : <span className="w-4" />}
                        <span className="flex min-w-0 flex-col items-start text-left">
                          <span className="font-medium text-white">{c.name}</span>
                          {c.company?.trim() ? (
                            <span className="text-xs font-medium text-slate-300">{c.company.trim()}</span>
                          ) : null}
                          {c.email?.trim() ? (
                            <span className="text-xs text-slate-soft">{c.email.trim()}</span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-soft">
          No client?{' '}
          <a href="/clients" className="font-medium text-[#F97316] hover:underline">
            Add one in Clients
          </a>
          .
        </p>
      </div>

      {selected ? (
        <div
          className="rounded-xl border border-white/[0.1] bg-white/[0.04] p-4 shadow-inner shadow-black/20"
          aria-label="Client snapshot for GST and WhatsApp reminders"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-soft">
            <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden />
            Client &amp; reminder delivery
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex flex-wrap justify-between gap-2 border-b border-white/[0.06] pb-2">
              <dt className="text-slate-soft">Company</dt>
              <dd className="max-w-[min(100%,20rem)] text-right font-medium text-white">
                {selected.company?.trim() || '—'}
              </dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 border-b border-white/[0.06] pb-2">
              <dt className="text-slate-soft">GST (place of supply)</dt>
              <dd className="text-right font-medium text-white">{selected.state?.trim() || '—'}</dd>
            </div>
            <div className="pt-0.5">
              <dt className="text-slate-soft">WhatsApp reminder target</dt>
              <dd className="mt-1 text-slate-200">
                {reminderDigits ? (
                  <>
                    <span className="font-mono tabular-nums text-white">wa.me/{reminderDigits}</span>
                    <span className="mt-1 block text-xs text-slate-soft">
                      {reminderUsesWhatsappField
                        ? 'Using the client’s WhatsApp number — Chase Payment reminders will open here.'
                        : 'Using phone as fallback — add a dedicated WhatsApp number on the client for best results.'}
                    </span>
                  </>
                ) : (
                  <span className="text-amber-200/95">
                    No WhatsApp or phone on file.{' '}
                    <a href="/clients" className="font-medium text-[#F97316] underline-offset-2 hover:underline">
                      Edit the client
                    </a>{' '}
                    to enable reminder links after you create this invoice.
                  </span>
                )}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-soft/85">
            The saved invoice links to this client via <code className="text-[10px] text-slate-400">client_id</code> — GST
            uses their state; reminders use the number above (same logic as the dashboard Chase button).
          </p>
        </div>
      ) : null}

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Line items</span>
            <span className="mt-0.5 block text-[11px] font-normal normal-case tracking-normal text-slate-soft/90">
              Taxable amounts (INR) · Subtotal before GST · Business: {CHASEDUE_BUSINESS_STATE}
            </span>
          </div>
          {selected && subtotalNum > 0 ? (
            <p className="text-sm text-slate-200">
              Subtotal:{' '}
              <span className="font-semibold tabular-nums text-white">{formatInrRupee(subtotalNum, 2)}</span>
            </p>
          ) : null}
        </div>

        <div className="space-y-3">
          {lineItems.map((row, index) => (
            <div
              key={row.id}
              className="flex flex-col gap-3 rounded-xl border border-white/[0.12] bg-white/[0.03] p-3 sm:flex-row sm:items-end"
            >
              <label className="block min-w-0 flex-1" htmlFor={`new-inv-line-desc-${row.id}`}>
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-soft">Description</span>
                <input
                  id={`new-inv-line-desc-${row.id}`}
                  type="text"
                  autoComplete="off"
                  enterKeyHint="next"
                  className={lineInputClass}
                  placeholder={`Item ${index + 1}`}
                  value={row.description}
                  onChange={(e) => {
                    const v = e.target.value
                    setLineItems((rows) => rows.map((r) => (r.id === row.id ? { ...r, description: v } : r)))
                  }}
                />
              </label>
              <label className="block w-full shrink-0 sm:w-[10rem]" htmlFor={`new-inv-line-amt-${row.id}`}>
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-soft">Amount</span>
                <input
                  id={`new-inv-line-amt-${row.id}`}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  autoComplete="off"
                  enterKeyHint="done"
                  className={lineInputClass}
                  placeholder="0.00"
                  value={row.amount}
                  onChange={(e) => {
                    const v = e.target.value
                    setLineItems((rows) => rows.map((r) => (r.id === row.id ? { ...r, amount: v } : r)))
                  }}
                />
              </label>
              <div className="flex shrink-0 justify-end sm:pb-1">
                <button
                  type="button"
                  disabled={lineItems.length <= 1}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.12] text-slate-300 transition hover:border-red-500/40 hover:bg-red-950/30 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Remove line item"
                  onClick={() => {
                    if (lineItems.length <= 1) return
                    setLineItems((rows) => rows.filter((r) => r.id !== row.id))
                  }}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setLineItems((rows) => [...rows, newLineItemRow()])}
          className="text-sm font-medium text-[#F97316] hover:underline"
        >
          + Add Line Item
        </button>

        <label className="block max-w-xs" htmlFor="new-inv-due">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Due date</span>
          <input
            id="new-inv-due"
            name="due_date"
            type="date"
            required
            autoComplete="off"
            className="input mt-2 border-[1px] border-white/[0.12]"
            defaultValue={defaultDueDate()}
          />
        </label>
      </div>

      {selected && taxPreview && (
        <div
          className="rounded-2xl border border-white/[0.12] bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.65)] backdrop-blur-md"
          aria-live="polite"
        >
          <div className="mb-4 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-[#F97316]" strokeWidth={2} aria-hidden />
            <h3 className="font-display text-sm font-semibold tracking-wide text-white">GST preview</h3>
            <span className="ml-auto rounded-md border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-soft">
              {taxPreview.regime === 'intra' ? 'CGST + SGST' : 'IGST'}
            </span>
          </div>
          <dl className="space-y-2 text-sm">
            {taxPreview.regime === 'intra' ? (
              <>
                <div className="flex justify-between gap-4 text-slate-soft">
                  <dt>CGST (9%)</dt>
                  <dd className="font-medium tabular-nums text-white">{formatInrRupee(taxPreview.cgst, 2)}</dd>
                </div>
                <div className="flex justify-between gap-4 text-slate-soft">
                  <dt>SGST (9%)</dt>
                  <dd className="font-medium tabular-nums text-white">{formatInrRupee(taxPreview.sgst, 2)}</dd>
                </div>
              </>
            ) : (
              <div className="flex justify-between gap-4 text-slate-soft">
                <dt>IGST (18%)</dt>
                <dd className="font-medium tabular-nums text-white">{formatInrRupee(taxPreview.igst, 2)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3 text-slate-soft">
              <dt>Total tax</dt>
              <dd className="font-medium tabular-nums text-white">{formatInrRupee(taxPreview.totalTax, 2)}</dd>
            </div>
            <div className="flex justify-between gap-4 pt-1">
              <dt className="font-display text-base font-semibold text-white">Total payable</dt>
              <dd className="font-display text-2xl font-bold tracking-tight text-[#F97316]">
                {formatInrRupee(taxPreview.grandTotal, 0)}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-soft/85">
            Saved invoice uses this breakdown; <strong className="text-slate-soft">amount due</strong> is the total
            payable (incl. GST).
          </p>
        </div>
      )}

      {selected && !taxPreview && lineItems.some((r) => r.amount.trim() !== '') && subtotalNum <= 0 ? (
        <p className="text-xs text-amber-400/90">Enter a positive amount on at least one line to see GST.</p>
      ) : null}

      <label className="block" htmlFor="new-inv-desc">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Description</span>
        <span className="mt-0.5 block text-[11px] font-normal normal-case tracking-normal text-slate-soft/90">
          Optional — appears in your invoice list and on the PDF.
        </span>
        <textarea
          id="new-inv-desc"
          name="description"
          rows={4}
          maxLength={4000}
          autoComplete="off"
          className="input mt-2 min-h-[120px] resize-y"
          placeholder="Line items, PO number, or scope of work…"
        />
      </label>

      <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-8 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className={`btn-premium btn-premium-secondary ${touchBtn} sm:min-w-0`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending || clients.length === 0}
          className={`btn-premium btn-premium-primary inline-flex items-center justify-center gap-2 disabled:opacity-50 ${touchBtn} sm:min-w-0`}
        >
          <ScrollText className="h-4 w-4" aria-hidden />
          {pending ? 'Creating…' : 'Create invoice'}
        </button>
      </div>
    </form>
  )
}
