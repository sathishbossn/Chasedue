import Link from 'next/link'
import { ArrowRight, CheckCircle, Shield, Sparkles, Zap } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-6 pb-20 md:pb-28 lg:pb-32">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute -right-32 -top-32 h-[min(90vw,720px)] w-[min(90vw,720px)] rounded-full bg-brand-500/20 blur-[100px]" />
        <div className="absolute -bottom-40 -left-24 h-[min(70vw,520px)] w-[min(70vw,520px)] rounded-full bg-brand-600/10 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="container relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-8 lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-400 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-brand-400" aria-hidden />
              Built for Indian freelancers
            </div>

            <div className="space-y-4">
              <h1 className="hero-title max-w-xl text-balance text-white">
                Chase What You&apos;re{' '}
                <span className="text-gradient">Owed.</span>
              </h1>
              <p className="hero-subtitle max-w-lg text-pretty">
                ChaseDue sends GST-ready invoices on WhatsApp, nudges clients politely, and shows you exactly
                who owes what—so you close the month with cash in the bank, not open tabs.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#pricing"
                className="btn btn-primary btn-lg group justify-center shadow-glow sm:min-w-[220px]"
              >
                Start free — no card
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#features"
                className="btn-glass btn-lg justify-center border border-white/10 sm:min-w-[200px]"
              >
                See the product
              </Link>
            </div>

            <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2 text-sm text-slate-soft">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-brand-500" aria-hidden />
                <span>Free tier, upgrade when you scale</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 shrink-0 text-brand-500" aria-hidden />
                <span>GST lines &amp; PDFs clients trust</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-brand-500" aria-hidden />
                <span>Live in under 2 minutes</span>
              </li>
            </ul>

            <p className="text-xs text-slate-soft/90">
              <span className="font-semibold text-white">500+ freelancers</span> use ChaseDue to replace the
              invoice email black hole—join them this week.
            </p>
          </div>

          <div className="relative lg:col-span-6">
            <div className="glass-panel relative overflow-hidden rounded-2xl p-6 shadow-card md:p-8 animate-float">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" aria-hidden />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-soft">This month</p>
                    <p className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">₹4.2Cr+</p>
                    <p className="text-sm text-brand-400">Collected via ChaseDue</p>
                  </div>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 ring-1 ring-brand-500/30">
                    <Zap className="h-7 w-7 text-brand-400" strokeWidth={2} aria-hidden />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
                    <p className="text-xs text-slate-soft">Paid on time</p>
                    <p className="mt-1 font-display text-2xl font-bold text-white">89%</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
                    <p className="text-xs text-slate-soft">Avg. days to pay</p>
                    <p className="mt-1 font-display text-2xl font-bold text-brand-400">3×</p>
                    <p className="text-[10px] text-slate-soft">faster vs email</p>
                  </div>
                </div>
                <div className="rounded-lg border border-dashed border-white/15 bg-brand-500/5 p-4">
                  <p className="text-xs font-medium text-slate-soft">WhatsApp Chaser (preview)</p>
                  <p className="mt-1 text-sm leading-relaxed text-white">
                    Invoice <span className="font-semibold text-brand-400">#1042</span> — “You can pay securely via
                    Razorpay here: <span className="text-brand-300">[your pay link]</span>” — reminder queued for 10:00
                    AM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
