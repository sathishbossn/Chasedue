'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Logo } from '@/components/logo'
import { useEffect, useState } from 'react'
import WorkspaceSyncIndicator from '@/components/workspace/workspace-sync-indicator'

const DashboardSidebar = dynamic(() => import('@/components/dashboard/dashboard-sidebar'), {
  ssr: false,
  loading: () => <SidebarLoading />,
})

function SidebarLoading() {
  return (
    <aside className="flex w-64 shrink-0 flex-col items-center justify-center border-r border-white/[0.08] bg-shell-sidebar/95 py-16 backdrop-blur-md">
      <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" aria-hidden />
      <p className="mt-3 text-xs text-slate-soft">Loading workspace…</p>
    </aside>
  )
}

/**
 * Client shell: sidebar is loaded only after mount + dynamic import to avoid ChunkLoadError /
 * hydration issues from eager-loading sidebar chunks with the workspace route.
 */
export default function WorkspaceLayoutClient({
  children,
  userEmail,
  userDisplayName,
}: {
  children: React.ReactNode
  userEmail: string | null
  userDisplayName: string | null
}) {
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    setSessionReady(true)
  }, [])

  return (
    <div className="flex min-h-screen bg-shell-canvas text-white">
      {sessionReady ? (
        <DashboardSidebar userEmail={userEmail} userDisplayName={userDisplayName} />
      ) : (
        <SidebarLoading />
      )}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <div className="sticky top-0 z-20 flex min-h-[52px] items-center justify-between gap-4 border-b border-white/[0.06] bg-shell-canvas/90 px-4 py-2.5 backdrop-blur-md sm:px-5">
          <Logo theme="dark" size="sm" href="/dashboard" className="transition hover:opacity-90 max-w-[min(100%,140px)]" />
          <WorkspaceSyncIndicator />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
