'use client'

import { useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

/** Restricts post-login redirect to same-origin paths (no open redirects). */
function safeNextPath(raw: string | null | undefined): string | null {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return null
  return raw
}

export default function GoogleSignInButton({
  label = 'Sign in with Google',
  className,
  /** e.g. `/dashboard/billing` from `login?next=…` */
  nextPath,
}: {
  label?: string
  className?: string
  nextPath?: string | null
}) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function signInWithGoogle() {
    setError(null)
    setPending(true)
    try {
      const supabase = createBrowserSupabaseClient()
      const callbackBase = `${window.location.origin}/auth/callback`
      const next = safeNextPath(nextPath)
      const redirectTo = next ? `${callbackBase}?next=${encodeURIComponent(next)}` : callbackBase

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (oauthError) {
        setError(oauthError.message)
        setPending(false)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setPending(false)
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={pending}
        className={
          className ??
          'flex w-full items-center justify-center gap-3 rounded-lg border border-brand-500/30 bg-[#F97316] py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-600 disabled:opacity-60'
        }
      >
        <GoogleMark />
        {pending ? 'Opening Google…' : label}
      </button>
      {error && <p className="mt-2 text-center text-sm text-red-400">{error}</p>}
    </div>
  )
}

function GoogleMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path
        fill="currentColor"
        className="text-white opacity-95"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        className="text-white opacity-90"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        className="text-white opacity-85"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        className="text-white"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}
