import Link from 'next/link'
import { signOut } from '@/app/dashboard/actions'

export default function DashboardTopBar({
  email,
  displayName,
}: {
  email: string | null
  displayName: string | null
}) {
  const primary = displayName?.trim() || email || 'Account'

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-charcoal/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">ChaseDue</span>
          <span className="font-display text-lg font-bold text-white">Dashboard</span>
        </Link>
        <div className="flex max-w-[min(100%,320px)] flex-col items-end gap-1 sm:max-w-none sm:flex-row sm:items-center sm:gap-3">
          <div className="text-right text-sm">
            <p className="truncate font-medium text-white" title={primary}>
              {primary}
            </p>
            {email && displayName?.trim() ? (
              <p className="truncate text-xs text-slate-soft" title={email}>
                {email}
              </p>
            ) : null}
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition-colors hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-brand-200"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
