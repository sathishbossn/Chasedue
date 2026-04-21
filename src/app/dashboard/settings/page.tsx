import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function DashboardSettingsPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/dashboard/settings')
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
      <p className="mt-1 text-sm text-slate-soft">
        Manage profile and workspace preferences — more options are on the way.
      </p>

      <div className="mt-8 rounded-xl border border-white/[0.1] bg-white/[0.05] p-6 shadow-lg shadow-black/20 backdrop-blur-md">
        <p className="text-sm text-slate-soft">
          {user.email ? (
            <>
              Signed in as <span className="font-medium text-white">{user.email}</span>.
            </>
          ) : (
            <>
              <span className="block text-slate-soft">Account ID</span>
              <span className="mt-1 block font-mono text-sm font-medium text-white break-all">{user.id}</span>
            </>
          )}
        </p>
        <p className="mt-3 text-sm text-slate-soft">
          Use the sidebar <span className="text-white">Sign out</span> to end your session.
        </p>
      </div>

      <p className="mt-8">
        <Link href="/dashboard" className="text-sm font-medium text-brand-400 hover:text-brand-300">
          ← Dashboard
        </Link>
      </p>
    </main>
  )
}
