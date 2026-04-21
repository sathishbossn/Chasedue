import { createClient } from '@supabase/supabase-js'

/**
 * Public anon client (NEXT_PUBLIC_SUPABASE_ANON_KEY) — no user session.
 * Used for server-side portal loads via SECURITY DEFINER RPCs so invoice links work without the service role.
 */
export function createPublicSupabaseAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
