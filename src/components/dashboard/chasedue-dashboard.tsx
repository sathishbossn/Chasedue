'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDownLeft, Loader2, Send, Zap } from 'lucide-react'
import {
  requestPayment,
  type DashboardSnapshot,
} from '@/app/dashboard/actions'
import { formatInrFromCents } from '@/lib/money'
import { toast } from 'sonner'

type ClientOption = { id: string; name: string; company: string | null }

type ExpenseRow = {
  id: string
  at: string
  description: string
  amountCents: number
}

function parseTs(iso: string | null | undefined): number {
  if (!iso) return 0
  const t = Date.parse(iso)
  return Number.isFinite(t) ? t : 0
}

function buildExpenseTimeline(snapshot: DashboardSnapshot): ExpenseRow[] {
  return snapshot.expenses
    .map((ex) => ({
      id: ex.id,
      at: ex.expense_date || ex.created_at,
      description: ex.description,
      amountCents: Math.round(Number(ex.amount) * 100),
    }))
    .sort((a, b) => parseTs(b.at) - parseTs(a.at))
    .slice(0, 24)
}

export default function ChaseDueDashboard({
  snapshot,
  clients,
  embedded = false,
  showStatCards = true,
}: {
  snapshot: DashboardSnapshot
  clients: ClientOption[]
  embedded?: boolean
  showStatCards?: boolean
}) {
  const router = useRouter()
  const [openPay, setOpenPay] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [payPending, setPayPending] = useState(false)
  const expenseRows = useMemo(() => buildExpenseTimeline(snapshot), [snapshot])

  async function handleRequestPayment(formData: FormData) {
    setMessage(null)
    setPayPending(true)
    try {
      const res = await requestPayment(formData)
      if (res.ok) {
        setMessage('Payment request created as a pending invoice.')
        toast.success('Invoice created.')
        setOpenPay(false)
        router.refresh()
      } else if (res.ok === false) {
        setMessage(res.error)
      }
    } finally {
      setPayPending(false)
    }
  }

  const defaultDue = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().slice(0, 10)
  }, [])

  return (
    <div className={embedded ? '' : 'mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8'}>
      <header
        className={
          embedded
            ? 'mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'
            : 'mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'
        }
      >
        {embedded ? (
          <>
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Overview &amp; expenses</h2>
              <p className="mt-1 text-sm text-slate-soft">
                Balances and recorded expenses (invoice list is in the section above).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpenPay(true)}
              className="btn-premium btn-premium-primary inline-flex shrink-0 items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              Request payment
            </button>
          </>
        ) : (
          <>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">ChaseDue</p>
              <h1 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">Dashboard</h1>
              <p className="mt-1 max-w-xl text-sm text-slate-soft">
                Only your data appears here — balances and invoices stay private to your account.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpenPay(true)}
              className="btn-premium btn-premium-primary mt-4 inline-flex items-center justify-center gap-2 sm:mt-0"
            >
              <Send className="h-4 w-4" />
              Request payment
            </button>
          </>
        )}
      </header>

      {message && (
        <div
          className="mb-6 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-slate-200 backdrop-blur-md"
          role="status"
        >
          {message}
        </div>
      )}

      {showStatCards ? (
        <section className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="glass-panel rounded-xl p-6 shadow-card">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-soft">Pending</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">
              {formatInrFromCents(snapshot.outstandingCents)}
            </p>
            <p className="mt-1 text-xs text-slate-soft">Outstanding invoices awaiting payment</p>
          </div>
          <div className="glass-panel rounded-xl p-6 shadow-card">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-soft">Paid</p>
            <p className="mt-2 font-display text-3xl font-bold text-brand-400">
              {formatInrFromCents(snapshot.collectedCents)}
            </p>
            <p className="mt-1 text-xs text-slate-soft">Money marked as received</p>
          </div>
          <div className="glass-panel rounded-xl p-6 shadow-card">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-soft">Net after expenses</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">
              {formatInrFromCents(snapshot.netPositionCents)}
            </p>
            <p className="mt-1 text-xs text-slate-soft">Collected − recorded expenses</p>
          </div>
        </section>
      ) : null}

      <section className="glass-panel rounded-xl p-6 shadow-card">
        <div className="mb-6 flex items-center gap-2">
          <Zap className="h-5 w-5 text-brand-400" strokeWidth={2} aria-hidden />
          <h2 className="font-display text-lg font-semibold text-white">Recent expenses</h2>
        </div>
        {expenseRows.length === 0 ? (
          <p className="text-sm text-slate-soft">
            No expenses logged yet. Invoice history is in the table above.
          </p>
        ) : (
          <ul className="divide-y divide-white/10">
            {expenseRows.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]"
                    aria-hidden
                  >
                    <ArrowDownLeft className="h-4 w-4 text-slate-soft" />
                  </span>
                  <div>
                    <p className="font-medium text-white">{row.description}</p>
                    <p className="text-xs text-slate-soft">
                      {row.at ? new Date(row.at).toLocaleString() : '—'}
                      <span className="ml-2 text-slate-soft">Expense</span>
                    </p>
                  </div>
                </div>
                <p className="font-display text-lg font-semibold text-slate-soft sm:text-right">
                  −{formatInrFromCents(row.amountCents)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {openPay && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pay-title"
        >
          <div className="glass-panel max-h-[min(90dvh,36rem)] w-full max-w-md overflow-y-auto rounded-xl p-6 shadow-card">
            <h3 id="pay-title" className="font-display text-xl font-bold text-white">
              Request payment
            </h3>
            <p className="mt-1 text-sm text-slate-soft">Creates a pending invoice linked to your account.</p>
            <form action={handleRequestPayment} className="mt-6 space-y-4">
              <div>
                <label htmlFor="client_id" className="block text-xs font-medium uppercase tracking-wide text-slate-soft">
                  Client
                </label>
                {clients.length === 0 ? (
                  <p className="mt-1 text-sm text-amber-400/90">
                    No clients yet. Add a client from the Clients page first, then pick them here.
                  </p>
                ) : (
                  <select
                    id="client_id"
                    name="client_id"
                    required
                    className="input mt-1"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select client
                    </option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                        {c.company ? ` (${c.company})` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label htmlFor="amount" className="block text-xs font-medium uppercase tracking-wide text-slate-soft">
                  Amount (₹)
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  className="input mt-1"
                  placeholder="25000"
                />
              </div>
              <div>
                <label htmlFor="due_date" className="block text-xs font-medium uppercase tracking-wide text-slate-soft">
                  Due date
                </label>
                <input
                  id="due_date"
                  name="due_date"
                  type="date"
                  required
                  className="input mt-1"
                  defaultValue={defaultDue}
                />
              </div>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="btn-premium btn-premium-secondary"
                  onClick={() => setOpenPay(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payPending || clients.length === 0}
                  className="btn-premium btn-premium-primary gap-2"
                >
                  {payPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Create invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
