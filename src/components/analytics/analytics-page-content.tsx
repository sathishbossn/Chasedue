'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { motion } from 'framer-motion'
import { BarChart3, Receipt, TrendingUp, Wallet } from 'lucide-react'
import type { AnalyticsSnapshot } from '@/app/analytics/actions'
import { formatInrFromCents } from '@/lib/money'

const REVENUE_COLOR = '#F97316'
const EXPENSE_COLOR = '#64748b'

const statCardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.04 + i * 0.08, duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

function formatAxisInr(rupees: number): string {
  if (rupees >= 100000) {
    return `₹${(rupees / 100000).toFixed(1)}L`
  }
  if (rupees >= 1000) {
    return `₹${(rupees / 1000).toFixed(1)}k`
  }
  return `₹${Math.round(rupees).toLocaleString('en-IN')}`
}

export default function AnalyticsPageContent({ data }: { data: AnalyticsSnapshot }) {
  const chartRows = data.monthlyBars.map((m) => ({
    label: m.label,
    revenue: m.revenueCents / 100,
    expenses: m.expenseCents / 100,
  }))

  const profitNegative = data.takeHomeProfitCents < 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-[#F97316]">
          <BarChart3 className="h-5 w-5" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-wider">Analytics</span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
          Analytics &amp; profit
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-soft">
          Gross and net revenue (after an estimated 2% Razorpay fee), expenses, and take-home profit. Card totals use{' '}
          <code className="text-xs text-slate-soft">total_amount</code> (taxable subtotal + GST). Chart uses paid invoices
          and expenses grouped by calendar month.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          custom={0}
          variants={statCardVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-6 shadow-lg shadow-black/20"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Total revenue</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F97316]/15 text-[#F97316]">
              <TrendingUp className="h-5 w-5" aria-hidden />
            </span>
          </div>
          <p className="mt-4 font-mono text-2xl font-bold tabular-nums text-white sm:text-3xl">
            {formatInrFromCents(data.grossRevenueCents)}
          </p>
          <p className="mt-2 text-xs text-slate-soft">Sum of paid invoice totals (₹, incl. GST)</p>
          <p className="mt-1 text-[11px] text-slate-soft/80">
            Pre-tax (GST base):{' '}
            <span className="font-mono tabular-nums text-slate-300">{formatInrFromCents(data.paidPreTaxSubtotalCents)}</span>
          </p>
        </motion.div>

        <motion.div
          custom={1}
          variants={statCardVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-6 shadow-lg shadow-black/20"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Pending collection</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-slate-200">
              <Wallet className="h-5 w-5" aria-hidden />
            </span>
          </div>
          <p className="mt-4 font-mono text-2xl font-bold tabular-nums text-white sm:text-3xl">
            {formatInrFromCents(data.pendingCollectionCents)}
          </p>
          <p className="mt-2 text-xs text-slate-soft">Unpaid invoice total (total_amount)</p>
        </motion.div>

        <motion.div
          custom={2}
          variants={statCardVariants}
          initial="hidden"
          animate="visible"
          className={`rounded-2xl border p-6 shadow-lg shadow-black/20 ${
            profitNegative
              ? 'border-red-500/25 bg-red-950/20'
              : 'border-white/[0.08] bg-[#0F172A]'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Net profit</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F97316]/15 text-[#F97316]">
              <Receipt className="h-5 w-5" aria-hidden />
            </span>
          </div>
          <p
            className={`mt-4 font-mono text-2xl font-bold tabular-nums sm:text-3xl ${
              profitNegative ? 'text-red-200' : 'text-white'
            }`}
          >
            {formatInrFromCents(data.takeHomeProfitCents)}
          </p>
          <p className="mt-2 text-xs text-slate-soft">Net revenue after fees minus expenses</p>
        </motion.div>
      </div>

      <div className="mt-8 grid gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-soft">Net revenue</p>
          <p className="mt-1 font-mono text-lg font-semibold text-white">{formatInrFromCents(data.netRevenueCents)}</p>
          <p className="mt-0.5 text-[11px] text-slate-soft">After ~2% fee est.</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-soft">Est. Razorpay (2%)</p>
          <p className="mt-1 font-mono text-lg font-semibold text-slate-300">
            {formatInrFromCents(data.razorpayFeeEstimateCents)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-soft">Total expenses</p>
          <p className="mt-1 font-mono text-lg font-semibold text-white">{formatInrFromCents(data.totalExpensesCents)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-soft">Take-home profit</p>
          <p className={`mt-1 font-mono text-lg font-semibold ${profitNegative ? 'text-red-200' : 'text-white'}`}>
            {formatInrFromCents(data.takeHomeProfitCents)}
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 rounded-2xl border border-white/[0.08] bg-[#0F172A] p-6 shadow-lg shadow-black/20"
      >
        <h2 className="font-display text-lg font-semibold text-white">Revenue vs. expenses</h2>
        <p className="mt-1 text-sm text-slate-soft">Last three calendar months</p>
        <div className="mt-6 h-[320px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickFormatter={(v: number) => formatAxisInr(v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c1424',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: number | undefined, name: string | undefined) => [
                  formatInrFromCents(Math.round((value ?? 0) * 100)),
                  name ?? '',
                ]}
              />
              <Legend wrapperStyle={{ paddingTop: 16 }} />
              <Bar dataKey="revenue" fill={REVENUE_COLOR} name="Revenue" radius={[6, 6, 0, 0]} maxBarSize={48} />
              <Bar dataKey="expenses" fill={EXPENSE_COLOR} name="Expenses" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold text-white">Recent expenses</h2>
        <p className="mt-1 text-sm text-slate-soft">Latest five entries</p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F172A]">
          {data.recentExpenses.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-slate-soft">No expenses recorded yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wide text-slate-soft">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.recentExpenses.map((e) => (
                  <tr key={e.id} className="border-b border-white/[0.05] last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                      {new Date(e.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">{e.description}</td>
                    <td className="px-4 py-3 text-slate-soft">{e.category?.trim() || '—'}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-white">
                      {formatInrFromCents(toCentsLocal(e.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

function toCentsLocal(n: number): number {
  return Math.round(Number(n) * 100)
}
