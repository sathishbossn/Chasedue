import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ScrollText } from 'lucide-react'
import NewInvoice from '@/components/invoices/NewInvoice'
import { listClientsFull } from '@/app/clients/actions'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { checkInvoiceLimit } from '@/lib/usage-limit'

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string }> | { client_id?: string }
}) {
  const sp = await Promise.resolve(searchParams)
  const initialClientId = sp.client_id?.trim() || undefined

  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    const limit = await checkInvoiceLimit(user.id, supabase)
    if (limit.status === 'limit_reached') {
      redirect('/dashboard/invoices?limited=1')
    }
  }

  const res = await listClientsFull()

  if (res.ok === false) {
    if (res.error === 'unauthorized') {
      redirect('/login?next=/invoices/new')
    }
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {res.message ?? 'Could not load data.'}
        </p>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#F97316]">
        <ScrollText className="h-3.5 w-3.5" aria-hidden />
        New invoice
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">Create an invoice</h1>
      <p className="mt-1 text-sm text-slate-soft">
        Linked to your signed-in account — your invoices stay in one place across devices.
      </p>

      <div className="mt-10 rounded-2xl border border-white/[0.1] bg-white/[0.04] p-6 shadow-lg shadow-black/20 backdrop-blur-md sm:p-8">
        <NewInvoice clients={res.clients} initialClientId={initialClientId} />
      </div>

      <p className="mt-8 text-center text-sm text-slate-soft">
        <Link href="/dashboard/invoices" className="font-medium text-[#F97316] hover:underline">
          ← Back to all invoices
        </Link>
      </p>
    </main>
  )
}
