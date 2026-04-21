import { createServerSupabaseClient } from '@/lib/supabase/server'
import WorkspaceLayoutClient from '@/components/workspace/workspace-layout-client'

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user ?? null

  if (!user) {
    return <div className="min-h-screen bg-shell-canvas text-white">{children}</div>
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, business_name')
    .eq('id', user.id)
    .maybeSingle()

  const meta = user.user_metadata ?? {}
  const metaName =
    typeof meta.full_name === 'string'
      ? meta.full_name
      : typeof meta.name === 'string'
        ? meta.name
        : null

  const userDisplayName =
    (profile?.full_name && String(profile.full_name).trim()) ||
    (profile?.business_name && String(profile.business_name).trim()) ||
    (metaName && metaName.trim()) ||
    null

  const userEmail = user.email ?? null

  return (
    <WorkspaceLayoutClient userEmail={userEmail} userDisplayName={userDisplayName}>
      {children}
    </WorkspaceLayoutClient>
  )
}
