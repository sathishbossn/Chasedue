'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Loader2, PiggyBank, Receipt, Wallet } from 'lucide-react'
import type { ExpenseListRow } from '@/app/expenses/actions'
import { createExpense } from '@/app/expenses/actions'
import { formatInrFromCents } from '@/lib/money'

const CATEGORIES = ['Hardware', 'Software', 'Marketing', 'Other'] as const

function todayIsoDate(): string {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

export default function ExpensesPageContent({
  expenses,
  monthBurnCents,
  totalExpensesCents,
  monthlyBudgetCents,
  remainingBudgetCents,
}: {
  expenses: ExpenseListRow[]
  monthBurnCents: number
  totalExpensesCents: number
  monthlyBudgetCents: number
  remainingBudgetCents: number
}) {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string>('Hardware')
  const [expenseDate, setExpenseDate] = useState(todayIsoDate())
  const [pending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await createExpense(fd)
      if (res.ok) {
        setDescription('')
        setAmount('')
        setCategory('Hardware')
        setExpenseDate(todayIsoDate())
        router.refresh()
      } else {
        setFormError(res.error)
      }
    })
  }

  const recentExpenses = expenses

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-brand-400">
              <Receipt className="h-5 w-5" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wider">Expenses</span>
            </div>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              Expense tracker
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-soft">
              Track spending and stay inside your monthly budget. Add expenses manually — automatic receipt capture is
              coming soon.
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(240px,280px)_minmax(0,1fr)] lg:items-start">
          <aside className="space-y-3 lg:sticky lg:top-6">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-soft">
              Receipt capture
            </h2>
            <div className="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-5 shadow-inner shadow-black/20">
              <p className="text-sm font-medium text-white">Feature coming soon</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-soft">
                Automatic extraction from photos and PDFs will appear here. For now, use the expense form to log
                spending.
              </p>
            </div>
          </aside>

          <div className="min-w-0 space-y-8">
            <div>
              <h2 className="font-display text-lg font-semibold text-white">Summary</h2>
              <p className="mt-1 text-sm text-slate-soft">Totals from your account (all-time spend vs. monthly budget).</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="glass-panel relative overflow-hidden rounded-2xl border border-white/[0.08] p-6 shadow-card">
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-500/15 blur-2xl" aria-hidden />
                  <div className="relative flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/20 ring-1 ring-brand-500/30">
                      <Wallet className="h-5 w-5 text-brand-400" aria-hidden />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-soft">
                        Total expenses
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
                        {formatInrFromCents(totalExpensesCents)}
                      </p>
                      <p className="mt-1 text-xs text-slate-soft">All recorded expenses</p>
                    </div>
                  </div>
                </div>
                <div className="glass-panel relative overflow-hidden rounded-2xl border border-white/[0.08] p-6 shadow-card">
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl" aria-hidden />
                  <div className="relative flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/25">
                      <PiggyBank className="h-5 w-5 text-emerald-400" aria-hidden />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-soft">
                        Remaining budget
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
                        {formatInrFromCents(remainingBudgetCents)}
                      </p>
                      <p className="mt-1 text-xs text-slate-soft">
                        Monthly cap {formatInrFromCents(monthlyBudgetCents)} · spent this month{' '}
                        {formatInrFromCents(monthBurnCents)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-white">Log expense</h2>
              <p className="mt-1 text-sm text-slate-soft">
                Description, amount, date, and category — saved to your account.
              </p>

              <form
                onSubmit={handleSubmit}
                className="glass-panel mt-4 space-y-4 rounded-2xl border border-white/[0.08] p-6 shadow-card"
              >
                {formError ? (
                  <p
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                    role="alert"
                  >
                    {formError}
                  </p>
                ) : null}

                <div>
                  <label
                    htmlFor="expense_description"
                    className="block text-xs font-medium uppercase tracking-wide text-slate-soft"
                  >
                    Description
                  </label>
                  <input
                    id="expense_description"
                    name="description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input mt-1 w-full"
                    placeholder="e.g. RAM Upgrade"
                    autoComplete="off"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="expense_amount"
                      className="block text-xs font-medium uppercase tracking-wide text-slate-soft"
                    >
                      Amount (INR)
                    </label>
                    <input
                      id="expense_amount"
                      name="amount"
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="input mt-1 w-full"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="expense_date"
                      className="block text-xs font-medium uppercase tracking-wide text-slate-soft"
                    >
                      Date
                    </label>
                    <input
                      id="expense_date"
                      name="expense_date"
                      type="date"
                      required
                      value={expenseDate}
                      onChange={(e) => setExpenseDate(e.target.value)}
                      className="input mt-1 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="expense_category"
                    className="block text-xs font-medium uppercase tracking-wide text-slate-soft"
                  >
                    Category
                  </label>
                  <select
                    id="expense_category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input mt-1 w-full"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="btn-premium btn-premium-primary w-full justify-center gap-2 sm:w-auto"
                >
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                  Save expense
                </button>
              </form>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-white">Recent expenses</h2>
              <p className="mt-1 text-sm text-slate-soft">Newest expenses first.</p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F172A]/80">
                {recentExpenses.length === 0 ? (
                  <p className="px-5 py-12 text-center text-sm text-slate-soft">
                    No expenses yet. Log one above.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.08] text-[10px] font-semibold uppercase tracking-wider text-slate-soft">
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {recentExpenses.map((row) => (
                          <tr key={row.id} className="text-slate-200">
                            <td className="whitespace-nowrap px-4 py-3 text-slate-soft">{row.expense_date}</td>
                            <td className="px-4 py-3 font-medium text-white">{row.description}</td>
                            <td className="px-4 py-3 text-slate-soft">{row.category ?? '—'}</td>
                            <td className="px-4 py-3 text-right font-display font-semibold text-white">
                              {formatInrFromCents(Math.round(Number(row.amount) * 100))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
