import { Suspense } from 'react'
import type { Metadata } from 'next'
import WorkspaceLayout from '@/components/workspace/workspace-layout'

export const metadata: Metadata = {
  title: 'Workspace | ChaseDue',
  description: 'Invoices, clients, and expenses in one place.',
}

function DashboardSuspenseFallback() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-shell-canvas px-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F97316] border-t-transparent" aria-hidden />
      <p className="mt-4 text-sm text-slate-soft">Loading dashboard…</p>
    </div>
  )
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceLayout>
      <Suspense fallback={<DashboardSuspenseFallback />}>{children}</Suspense>
    </WorkspaceLayout>
  )
}
