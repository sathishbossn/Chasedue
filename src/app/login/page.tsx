'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Receipt, Shield } from 'lucide-react'
import GoogleSignInButton from '@/components/auth/google-sign-in-button'
import { Logo } from '@/components/logo'

function LoginContent() {
  const searchParams = useSearchParams()
  const authError = searchParams.get('error')

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0F172A] px-4 py-16">
      <div
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#F97316]/[0.12] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#fb923c]/[0.08] blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4">
          <Logo theme="dark" size="lg" className="max-w-full" />
        </div>
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-[1.75rem]">
            Sign in to your workspace
          </h1>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-slate-soft">
            High-contrast books, gentle reminders, and invoices that stay in sync across every device.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.1] bg-white/[0.05] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-white/[0.08] bg-[#0F172A]/60 p-4">
            <Receipt className="mt-0.5 h-5 w-5 shrink-0 text-[#F97316]" strokeWidth={1.75} aria-hidden />
            <div className="min-w-0 text-left">
              <p className="text-sm font-semibold text-white">Secure Google sign-in</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-soft">
                After you sign in with Google, you return here securely and your dashboard loads your{' '}
                <span className="text-white/90">invoices</span> and <span className="text-white/90">expenses</span>.
              </p>
            </div>
          </div>

          {authError === 'auth' && (
            <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-red-300" aria-hidden />
              <p>
                Could not complete sign-in. Ask your administrator to add this website&apos;s URL to the allowed
                redirect list in your Google / OAuth provider settings.
              </p>
            </div>
          )}

          <GoogleSignInButton label="Sign in with Google" nextPath={searchParams.get('next')} />

          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-slate-soft">
            <Shield className="h-3.5 w-3.5 text-slate-500" aria-hidden />
            Session stored in secure HTTP-only cookies.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-soft transition hover:text-[#F97316]"
          >
            Back to home
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-soft">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <span className="text-white/20" aria-hidden>
              ·
            </span>
            <Link href="/terms" className="transition hover:text-white">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0F172A]">
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-[#F97316]/20" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
