'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FilePlus2, MessageCircle, Pencil, Phone, Plus, Users } from 'lucide-react'
import type { ClientWithStats } from '@/app/clients/actions'
import { formatInrFromCents } from '@/lib/money'
import { formatWhatsAppLink } from '@/lib/whatsapp-me-link'
import NewClientModal from '@/components/clients/new-client-modal'

function waHref(
  whatsapp: string | null | undefined,
  phone: string | null | undefined,
  clientName: string
) {
  const raw = (whatsapp?.trim() || phone?.trim() || '') || ''
  return formatWhatsAppLink(raw, `Hi ${clientName}, this is a quick note from ChaseDue.`)
}

export default function ClientsPageContent({ clients }: { clients: ClientWithStats[] }) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientWithStats | null>(null)

  function openNewClient() {
    setEditingClient(null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingClient(null)
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-brand-500">
              <Users className="h-5 w-5" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wider">Clients</span>
            </div>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              Client management
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-soft">
              Outstanding balances, WhatsApp, and new invoices — one place.
            </p>
          </div>
          <button
            type="button"
            onClick={openNewClient}
            className="btn-premium btn-premium-primary inline-flex shrink-0 items-center justify-center gap-2 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" aria-hidden />
            New client
          </button>
        </div>

        {clients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#0F172A]/80 px-6 py-16 text-center">
            <Users className="mx-auto h-12 w-12 text-slate-soft/50" aria-hidden />
            <p className="mt-4 font-display text-lg font-semibold text-white">No clients yet</p>
            <p className="mt-2 text-sm text-slate-soft">Add your first client to start chasing and invoicing.</p>
            <button
              type="button"
              onClick={openNewClient}
              className="btn-premium btn-premium-primary mt-6 inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New client
            </button>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {clients.map((c) => {
              const wa = waHref(c.whatsapp_number, c.phone, c.name)
              const outstanding = formatInrFromCents(c.outstanding_cents)
              return (
                <li
                  key={c.id}
                  className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#0F172A] p-5 shadow-lg shadow-black/20 transition hover:border-brand-500/25"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <Link
                        href={`/clients/${c.id}`}
                        className="min-w-0 flex-1 truncate font-display text-lg font-bold text-white hover:text-brand-400"
                      >
                        {c.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingClient(c)
                          setModalOpen(true)
                        }}
                        className="shrink-0 rounded-lg p-1.5 text-slate-soft transition hover:bg-white/[0.08] hover:text-white"
                        aria-label={`Edit ${c.name}`}
                        title="Edit client"
                      >
                        <Pencil className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                    {c.company ? (
                      <p className="mt-0.5 truncate text-sm text-slate-soft">{c.company}</p>
                    ) : null}
                    {c.email ? (
                      <p className="mt-2 truncate text-xs text-slate-soft/90">{c.email}</p>
                    ) : null}
                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2.5">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-soft">Outstanding</p>
                        <p className="font-mono text-sm font-semibold tabular-nums text-white">{outstanding}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
                    {wa ? (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-premium btn-premium-secondary inline-flex flex-1 min-w-[8rem] items-center justify-center gap-2 py-2.5 text-sm"
                      >
                        <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden />
                        Quick message
                      </a>
                    ) : (
                      <span
                        className="inline-flex flex-1 min-w-[8rem] cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-2.5 text-sm text-slate-soft"
                        title="Add a WhatsApp number to this client"
                      >
                        <MessageCircle className="h-4 w-4 opacity-50" aria-hidden />
                        No number
                      </span>
                    )}
                    <Link
                      href={`/invoices/new?client_id=${encodeURIComponent(c.id)}`}
                      className="btn-premium btn-premium-primary inline-flex flex-1 min-w-[8rem] items-center justify-center gap-2 py-2.5 text-sm"
                    >
                      <FilePlus2 className="h-4 w-4" aria-hidden />
                      New invoice
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <NewClientModal
        open={modalOpen}
        onClose={closeModal}
        editingClient={editingClient}
        onCreated={() => router.refresh()}
      />
    </>
  )
}
