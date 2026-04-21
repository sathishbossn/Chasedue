'use client'

import { CheckCircle, MessageSquare, Clock, TrendingUp, Zap } from 'lucide-react'
import ScrollSlideUp from '@/components/landing/scroll-slide-up'

export default function BenefitsSection() {
  return (
    <section className="section relative overflow-hidden border-t border-white/[0.06] bg-[#010101]">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F97316]/[0.06] via-transparent to-transparent"
        aria-hidden
      />
      <div className="container relative">
        <ScrollSlideUp className="mb-20 text-center">
          <div className="eyebrow mx-auto">Proof, not promises</div>
          <h2 className="section-title mx-auto max-w-3xl text-balance">
            Why freelancers switch from inbox invoices to ChaseDue on WhatsApp
          </h2>
          <p className="hero-subtitle mx-auto mt-4 max-w-2xl text-pretty text-slate-400">
            Email gets buried. WhatsApp gets read. ChaseDue turns that habit into predictable cash flow.
          </p>
        </ScrollSlideUp>

        <div className="mb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              num: '3×',
              label: 'Faster payments',
              desc: 'Reminders clients actually see beat polite email pings.',
              icon: <Zap className="h-5 w-5" />,
            },
            {
              num: '95%',
              label: 'Seen on WhatsApp',
              desc: 'Versus single-digit reply rates on cold invoice emails.',
              icon: <MessageSquare className="h-5 w-5" />,
            },
            {
              num: '15 hrs',
              label: 'Saved weekly',
              desc: 'Less chasing, fewer threads, more billable time.',
              icon: <Clock className="h-5 w-5" />,
            },
            {
              num: '89%',
              label: 'On-time',
              desc: 'Professional GST PDFs + nudges that don’t feel spammy.',
              icon: <TrendingUp className="h-5 w-5" />,
            },
          ].map((benefit, i) => (
            <ScrollSlideUp key={i} delay={i * 0.06}>
              <div className="group h-full text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-[#F97316]/20 bg-[#F97316]/10 backdrop-blur-xl transition-transform duration-300 group-hover:scale-105">
                  <div className="text-[#F97316]">{benefit.icon}</div>
                </div>
                <div className="mb-3 font-display text-5xl font-black text-gradient">{benefit.num}</div>
                <div className="mb-2 font-display text-lg font-bold text-white">{benefit.label}</div>
                <div className="text-sm leading-relaxed text-slate-400">{benefit.desc}</div>
              </div>
            </ScrollSlideUp>
          ))}
        </div>

        <div className="grid items-center gap-16 lg:grid-cols-2">
          <ScrollSlideUp className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-display text-3xl font-bold text-white">
                Stop the email chase. Start the WhatsApp conversation.
              </h3>
              <p className="text-body text-pretty text-slate-300">
                You’re not bad at collections—your channel is. ChaseDue meets clients where they already reply, with
                invoices that look as serious as your work.
              </p>
            </div>

            <div className="space-y-6">
              <div className="glass-panel flex items-start gap-4 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4 backdrop-blur-xl">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                  <MessageSquare className="h-4 w-4 text-red-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-red-200">The inbox problem</h4>
                  <p className="text-sm text-slate-400">
                    Low opens, slower replies, and “following up” that eats your week.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-white/10" />
                <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-500">vs</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="glass-panel flex items-start gap-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4 backdrop-blur-xl">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-emerald-200">ChaseDue on WhatsApp</h4>
                  <p className="text-sm text-slate-400">
                    High visibility, polite automation, and GST-ready PDFs in one flow.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-display font-bold text-white">What you get out of the box</h4>
              <div className="space-y-3">
                {[
                  'Instant WhatsApp delivery with read-friendly formatting',
                  'GST lines that match how Indian clients expect to review bills',
                  'Polite scheduled nudges—no manual “just circling back”',
                  'Dashboard for who’s paid, who’s late, and what’s next',
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F97316]/15">
                      <CheckCircle className="h-3.5 w-3.5 text-[#F97316]" />
                    </div>
                    <span className="text-body text-slate-300">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollSlideUp>

          <ScrollSlideUp delay={0.08}>
            <div className="relative">
              <div className="glass-panel aspect-4-3 overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl animate-float">
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#F97316]/15 via-[#0a0a0a] to-[#121212]"
                  aria-hidden
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="space-y-6 p-8 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-xl bg-[#F97316]/20 ring-1 ring-[#F97316]/30 animate-pulse-glow">
                      <MessageSquare className="h-10 w-10 text-[#F97316]" />
                    </div>
                    <div className="space-y-2">
                      <div className="font-display text-3xl font-black text-white">95%</div>
                      <div className="text-sm font-semibold uppercase tracking-wider text-[#F97316]">Seen rate</div>
                      <div className="text-xs text-slate-500">vs. easy-to-ignore email threads</div>
                      <div className="mt-2 text-xs font-bold text-[#F97316]">4×+ better surface area for payment</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollSlideUp>
        </div>
      </div>
    </section>
  )
}
