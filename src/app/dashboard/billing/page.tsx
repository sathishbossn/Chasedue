import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

function checkoutUrl(plan: 'pro' | 'agency'): string | null {
  const pro = process.env.NEXT_PUBLIC_CHASEDUE_PRO_CHECKOUT_URL?.trim()
  const agency = process.env.NEXT_PUBLIC_CHASEDUE_AGENCY_CHECKOUT_URL?.trim()
  if (plan === 'agency' && agency) return agency
  if (plan === 'pro' && pro) return pro
  if (plan === 'agency' && pro) return pro
  return pro ?? agency ?? null
}

export default async function DashboardBillingPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>
}) {
  const sp = await searchParams
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/dashboard/billing')
  }

  const planParam = (sp.plan ?? 'pro').toLowerCase()
  const highlightPlan: 'pro' | 'agency' = planParam === 'agency' ? 'agency' : 'pro'
  const primaryHref = checkoutUrl(highlightPlan)

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F97316]">Billing</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-white">Upgrade your workspace</h1>
      <p className="mt-2 text-sm text-slate-soft">
        Pay securely through Razorpay using the link below. After payment, your plan updates once your account is
        activated — contact us if anything doesn&apos;t reflect within a few minutes.
      </p>

      <div className="mt-8 space-y-4 rounded-2xl border border-white/[0.1] bg-white/[0.04] p-6 shadow-lg shadow-black/20 backdrop-blur-md">
        <p className="text-sm text-white/90">
          {highlightPlan === 'agency' ? (
            <>
              <span className="font-semibold text-[#F97316]">Agency</span> — team seats and white-label branding.
            </>
          ) : (
            <>
              <span className="font-semibold text-[#F97316]">Pro</span> — unlimited invoices, reminders, and Razorpay on
              the portal.
            </>
          )}
        </p>
        {primaryHref ? (
          <a
            href={primaryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#F97316] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#F97316]/25 transition hover:brightness-110 sm:w-auto"
          >
            Open checkout
          </a>
        ) : (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Online checkout isn&apos;t configured for this deployment yet. Use the pricing section on the homepage or
            contact support for an upgrade link.
          </p>
        )}
        <p className="text-xs text-slate-soft">
          Existing invoices, the client portal, and PDF downloads stay available even if a subscription lapses — only new invoice creation is limited on
          Starter.
        </p>
      </div>

      <p className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/#pricing" className="font-medium text-[#F97316] hover:underline">
          Homepage pricing
        </Link>
        <Link href="/dashboard/invoices" className="text-slate-soft hover:text-white">
          ← Invoices
        </Link>
      </p>
    </main>
  )
}
