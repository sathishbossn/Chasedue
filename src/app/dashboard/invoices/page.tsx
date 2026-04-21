import Link from 'next/link'
import { redirect } from 'next/navigation'
import InvoicesTable from '@/components/dashboard/invoices-table'
import InvoicesCreateInvoiceCta from '@/components/dashboard/invoices-create-invoice-cta'
import { checkInvoiceLimit } from '@/lib/usage-limit'
import { getDashboardSnapshot } from '../actions'

export default async function DashboardInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ limited?: string }>
}) {
  const sp = await searchParams
  const snapshot = await getDashboardSnapshot()

  if (snapshot.ok === false) {
    if (snapshot.error === 'unauthorized') {
      redirect('/login?next=/dashboard/invoices')
    }
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {snapshot.message ?? 'Something went wrong.'}
        </p>
        <Link href="/dashboard" className="mt-4 inline-block text-sm text-brand-400 hover:underline">
          ← Dashboard
        </Link>
      </div>
    )
  }

  let limitReached = false
  try {
    const limit = await checkInvoiceLimit(snapshot.data.userId)
    limitReached = limit.status === 'limit_reached'
  } catch (e) {
    console.error('[dashboard/invoices] checkInvoiceLimit:', e)
    limitReached = false
  }

  const openFromQuery = sp.limited === '1'

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Invoices</h1>
          <p className="mt-1 text-sm text-slate-soft">All invoices for your account (newest first).</p>
        </div>
        <InvoicesCreateInvoiceCta limitReached={limitReached} openFromQuery={openFromQuery} />
      </div>
      <InvoicesTable invoices={snapshot.data.invoices} />
    </main>
  )
}
