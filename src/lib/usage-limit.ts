import type { SupabaseClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const STARTER_INVOICE_CAP = 10

export type PlanTier = 'starter' | 'pro' | 'agency'

export type SubscriptionStatus = 'active' | 'inactive' | 'past_due' | 'canceled'

export type InvoiceLimitCheckResult =
  | { status: 'ok' }
  | { status: 'limit_reached'; limit: number; current: number }

function isUnlimitedPlan(plan: string | null | undefined, subscriptionStatus: string | null | undefined): boolean {
  const p = (plan ?? 'starter').toLowerCase()
  const sub = (subscriptionStatus ?? 'inactive').toLowerCase()
  if (sub !== 'active') return false
  return p === 'pro' || p === 'agency'
}

/**
 * Returns whether the user may create another invoice (Starter cap, or Pro/Agency while subscription is active).
 * Missing profile rows default to starter — never throws.
 */
export async function checkInvoiceLimit(
  userId: string,
  supabase?: SupabaseClient
): Promise<InvoiceLimitCheckResult> {
  try {
    const client = supabase ?? (await createServerSupabaseClient())

    // maybeSingle: 0 rows → data null (no error). .single() would error when no profile row exists.
    const { data: profile, error: profileErr } = await client
      .from('profiles')
      .select('plan, subscription_status')
      .eq('id', userId)
      .maybeSingle()

    if (profileErr) {
      console.error('[usage-limit] profiles:', profileErr)
    }

    const plan =
      profile != null && profile.plan != null && String(profile.plan).trim() !== ''
        ? String(profile.plan)
        : 'starter'
    const subscriptionStatus =
      profile != null && profile.subscription_status != null && String(profile.subscription_status).trim() !== ''
        ? String(profile.subscription_status)
        : 'inactive'

    if (isUnlimitedPlan(plan, subscriptionStatus)) {
      return { status: 'ok' }
    }

    const { count, error: countErr } = await client
      .from('invoices')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (countErr) {
      console.error('[usage-limit] invoice count:', countErr)
      return { status: 'ok' }
    }

    const current = count ?? 0
    if (current >= STARTER_INVOICE_CAP) {
      return { status: 'limit_reached', limit: STARTER_INVOICE_CAP, current }
    }

    return { status: 'ok' }
  } catch (e) {
    console.error('[usage-limit] unexpected:', e)
    return { status: 'ok' }
  }
}
