import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServiceRoleClient } from '@/lib/supabase/admin'
import { formatInrFromCents } from '@/lib/money'
import PayInvoiceButton from '@/components/payments/pay-invoice-button'

export default async function PublicPayPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params
  const admin = createServiceRoleClient()

  if (!admin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F172A] px-4 text-center text-white">
        <p className="max-w-md text-sm text-slate-soft">
          Add <code className="text-brand-400">SUPABASE_SERVICE_ROLE_KEY</code> to your server environment so this
          public payment page can load invoices (server-only, never expose to the browser).
        </p>
        <Link href="/" className="mt-6 text-sm font-medium text-[#F97316] hover:underline">
          Back to home
        </Link>
      </div>
    )
  }

  const { data: inv, error } = await admin
    .from('invoices')
    .select('id, total_amount, status, due_date, paid_at')
    .eq('id', invoiceId)
    .maybeSingle()

  if (error) {
    console.log(error)
  }
  if (error || !inv) {
    notFound()
  }

  const st = String(inv.status).toLowerCase()
  const paid = st === 'paid' || st === 'settled' || st === 'received'
  const amountCents = Math.round(Number(inv.total_amount) * 100)

  return (
    <div className="min-h-screen bg-[#0F172A] px-4 py-12 text-white">
      <div className="mx-auto max-w-md">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#F97316]">ChaseDue</p>
        <h1 className="mt-3 text-center font-display text-2xl font-bold">Pay invoice</h1>
        <p className="mt-2 text-center text-sm text-slate-soft">Secure checkout powered by Razorpay.</p>

        <div className="mt-10 rounded-2xl border border-white/[0.1] bg-white/[0.05] p-8 shadow-xl shadow-black/30 backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Amount due</p>
          <p className="mt-1 font-display text-3xl font-bold text-white">{formatInrFromCents(amountCents)}</p>

          {paid ? (
            <p className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-200">
              This invoice is already marked paid.
            </p>
          ) : (
            <div className="mt-8 flex flex-col items-stretch gap-3">
              <PayInvoiceButton invoiceId={inv.id} className="btn-premium btn-premium-primary w-full justify-center gap-2 py-3.5 text-sm" />
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-slate-soft">
          Questions? Reply on the WhatsApp thread where you received this link.
        </p>
      </div>
    </div>
  )
}
