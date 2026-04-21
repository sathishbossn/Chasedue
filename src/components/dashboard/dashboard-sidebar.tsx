'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, FilePlus2, LayoutDashboard, Receipt, ScrollText, Settings, Users } from 'lucide-react'
import { signOut } from '@/app/dashboard/actions'
import { Logo } from '@/components/logo'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/dashboard/invoices', label: 'Invoices', icon: ScrollText },
  { href: '/invoices/new', label: 'New invoice', icon: FilePlus2 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardSidebar({
  userEmail,
  userDisplayName,
}: {
  userEmail: string | null
  userDisplayName: string | null
}) {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/[0.08] bg-shell-sidebar/95 backdrop-blur-md">
      <div className="border-b border-white/10 p-4">
        <Logo theme="dark" size="sm" href="/dashboard" className="max-w-full" />
        <p className="mt-1 pl-0.5 text-xs text-gray-500">Workspace</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/25'
                  : 'text-slate-soft hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/[0.08] p-4">
        <div className="mb-3 truncate text-xs text-slate-soft">
          <p className="truncate font-medium text-white" title={userDisplayName || userEmail || ''}>
            {userDisplayName?.trim() || userEmail || 'Account'}
          </p>
          {userDisplayName?.trim() && userEmail ? (
            <p className="truncate text-[11px] text-slate-soft" title={userEmail}>
              {userEmail}
            </p>
          ) : null}
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-slate-soft transition hover:border-brand-500/30 hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
