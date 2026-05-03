import { createBrowserSupabaseClient } from '@/lib/supabase/client'

export async function getTrialStatus(userId: string) {
  const supabase = createBrowserSupabaseClient()

  const { data, error } = await supabase
    .from('users')
    .select('is_pro, trial_ends_at')
    .eq('id', userId)
    .single()

  if (error || !data) return { isPro: false, daysLeft: 0, isTrialActive: false }

  const isPro = data.is_pro
  const trialEndsAt = new Date(data.trial_ends_at)
  const today = new Date()
  const daysLeft = Math.ceil((trialEndsAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const isTrialActive = !isPro && daysLeft > 0

  return { isPro, daysLeft, isTrialActive }
}
