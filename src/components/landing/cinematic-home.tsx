'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  Clock,
  HelpCircle,
  Hexagon,
  IndianRupee,
  Lock,
  FileText,
  MessageCircle,
  MessageSquare,
  Moon,
  Banknote,
  Target,
  Shield,
  TrendingDown,
  XCircle,
  Zap,
} from 'lucide-react'
import { useId, useState } from 'react'
import PaymentPartnerLogos from '@/components/payment-partner-logos'
import { Logo } from '@/components/logo'

/** Cinematic landing palette — match design reference */
const BG = '#0F0F0F'
const ORANGE = '#FF6B00'
const ORANGE_DIM = 'rgba(255, 107, 0, 0.92)'
/** WhatsApp brand green — native follow-up section */
const WA_GREEN = '#25D366'

const ease = [0.22, 1, 0.36, 1] as const

/** Primary actions: subtle glow + lift on hover (Bolt-style polish) */
const btnPrimaryGlow =
  'shadow-[0_0_24px_rgba(255,107,0,0.35)] transition-transform duration-200 hover:scale-105 active:scale-[0.98]'
const btnGhostGlow =
  'transition-transform duration-200 hover:scale-105 active:scale-[0.98] border border-white/[0.14] hover:border-white/25'

const FAQ_ITEMS = [
  {
    q: 'Is ChaseDue really GST compliant?',
    a: 'Absolutely. ChaseDue is built specifically for Indian tax laws. It automatically calculates CGST, SGST, and IGST based on your client\'s location and generates professional, tax-ready PDFs that your CA will love.',
  },
  {
    q: 'Does ChaseDue hold my payments?',
    a: 'Never. We are not a payment processor. We integrate with your own Razorpay or UPI keys. Your money goes directly from your client\'s bank account to yours. We only track the payment status to stop the reminders.',
  },
  {
    q: 'Will my personal WhatsApp number get banned?',
    a: 'No. ChaseDue uses the official Meta WhatsApp Cloud API. This is the professional way to send automated messages, ensuring high delivery rates without risking your personal account.',
  },
  {
    q: 'What if my client pays via cash or direct bank transfer?',
    a: 'No problem. You can manually \'Mark as Paid\' in your dashboard with one click. ChaseDue will instantly stop all scheduled reminders and send a professional \'Payment Received\' confirmation to your client.',
  },
  {
    q: 'Can I use ChaseDue alongside my existing accounting software?',
    a: 'Yes! Many of our users use Tally or Zoho for accounting but use ChaseDue specifically for its superior WhatsApp-native follow-up system. It\'s the perfect \'recovery layer\' for your business.',
  },
] as const

function Nav() {
  return (
    <nav
      className="sticky top-0 z-[60] border-b border-white/[0.08] backdrop-blur-xl"
      style={{ backgroundColor: `${BG}e6` }}
    >
      <div className="container-premium">
        <div className="flex h-16 items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 shrink">
            <Logo theme="dark" size="md" href="/" className="max-h-8 max-w-[min(100%,160px)]" fontWeight="font-extrabold" />
          </div>

          <div className="hidden items-center gap-8 lg:flex">
            <Link href="#advantage" className="text-sm font-medium text-white/60 transition hover:text-white">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-white/60 transition hover:text-white">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-white/60 transition hover:text-white">
              Stories
            </Link>
            <Link href="#faq" className="text-sm font-medium text-white/60 transition hover:text-white">
              FAQ
            </Link>
            <Link href="/help" className="text-sm font-medium text-white/60 transition hover:text-white">
              Help
            </Link>
            <Link href="/contact" className="text-sm font-medium text-white/60 transition hover:text-white">
              Contact
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-lg px-2 py-2 text-xs font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white sm:px-3 sm:text-sm"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white sm:inline-block"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white sm:px-5 ${btnPrimaryGlow}`}
              style={{
                background: `linear-gradient(90deg, ${ORANGE}, #e85d00)`,
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

/** Pure Tailwind WhatsApp-style hero illustration — no external image URLs */
function HeroWhatsAppIllustration() {
  return (
    <div
      className="mx-auto w-full max-w-[320px] overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0a0e11] ring-1 ring-white/[0.06]"
      style={{ boxShadow: '0 0 50px rgba(255, 107, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.04)' }}
    >
      {/* Green WhatsApp-style header */}
      <div className="flex items-center gap-3 bg-gradient-to-b from-[#1f8f54] to-[#0d5c3f] px-4 py-3">
        <button type="button" className="text-white/90" aria-label="Back">
          <span className="text-lg leading-none">‹</span>
        </button>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/20">
          <Zap className="h-5 w-5 text-white" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-inter text-[15px] font-semibold text-white">ChaseDue</p>
          <p className="text-[11px] text-emerald-100/85">Business account</p>
        </div>
        <span className="text-white/70" aria-hidden>
          ⋮
        </span>
      </div>

      {/* Chat surface (dark) */}
      <div className="relative min-h-[300px] bg-[#0b141a] px-3 pb-6 pt-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='%23ffffff'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <p className="relative mb-4 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
          Today
        </p>

        {/* Incoming: invoice notification */}
        <div className="relative mb-3 max-w-[92%] rounded-2xl rounded-tl-md border border-white/[0.06] bg-[#1b3944] px-3.5 py-2.5 shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-200/90">ChaseDue</p>
          <p className="mt-1.5 text-[13px] leading-snug text-white/95">
            <span className="font-semibold">Invoice reminder</span>
            <br />
            <span className="text-white/80">INV-1042 · ₹48,500 · Due in 2 days</span>
          </p>
          <p className="mt-2 text-[12px] leading-snug text-white/75">
            Tap below to view your invoice and pay securely via UPI or card.
          </p>
          <div
            className="mt-2.5 inline-flex w-full items-center justify-center rounded-lg py-2 text-center text-[12px] font-bold text-white"
            style={{ backgroundColor: ORANGE }}
          >
            View invoice &amp; Pay
          </div>
        </div>

        {/* Outgoing bubble */}
        <div className="relative ml-auto max-w-[85%] rounded-2xl rounded-tr-md border border-white/[0.08] bg-[#053b4c] px-3 py-2 shadow-md">
          <p className="text-right text-[12px] leading-relaxed text-white/90">Sounds good — paying now.</p>
          <p className="mt-1 text-right text-[10px] text-white/40">10:24</p>
        </div>

        {/* Incoming: confirmation */}
        <div className="relative mt-3 max-w-[92%] rounded-2xl rounded-tl-md border border-white/[0.06] bg-[#1b3944] px-3.5 py-2 shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-200/90">ChaseDue</p>
          <p className="mt-1 text-[12px] text-white/90">Payment received. Reminders for this invoice are turned off.</p>
          <p className="mt-1 text-[10px] text-white/40">10:26</p>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-20 md:pb-28" style={{ backgroundColor: BG }}>
      {/* Cinematic orange radial glow (Bolt-style) */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[min(90vw,720px)] w-[min(90vw,720px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,107,0,0.28)_0%,rgba(255,107,0,0.08)_40%,transparent_68%)] blur-3xl md:left-[58%]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_80%_20%,rgba(255,107,0,0.1),transparent_55%)]" aria-hidden />
      <div className="container-premium relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="max-w-xl"
          >
            <h1
              className="font-inter text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem]"
              style={{ letterSpacing: '-0.045em', fontWeight: 800 }}
            >
              Get paid faster:{' '}
              <span style={{ color: '#FF6B00' }} className="text-balance">
                No awkward follow-ups.
              </span>
            </h1>
            <p className="mt-6 text-pretty text-base leading-relaxed text-white/60 sm:text-lg">
              Professional invoices, automated WhatsApp reminders, and faster payments. Not an accounting app—just the
              smartest way to manage your cash flow.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/login"
                className={`inline-flex min-h-[52px] items-center justify-center rounded-xl px-8 text-base font-semibold text-white ${btnPrimaryGlow}`}
                style={{
                  background: `linear-gradient(90deg, ${ORANGE}, #e85d00)`,
                  boxShadow: '0 16px 40px rgba(255, 107, 0, 0.38)',
                }}
              >
                Get started for free
              </Link>
              <Link
                href="#dashboard-preview"
                className={`inline-flex min-h-[52px] items-center justify-center rounded-xl bg-white/[0.04] px-7 text-base font-semibold text-white/90 ${btnGhostGlow}`}
              >
                Watch Demo
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
            className="flex justify-center lg:justify-end"
          >
            <HeroWhatsAppIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/** Subtle trust row — placed directly under the hero for early credibility. */
function TrustBar() {
  return (
    <section
      aria-label="Trust and compliance"
      className="border-b border-white/[0.06] bg-[#0a0a0a] py-7 md:py-9"
    >
      <div className="container-premium">
        <ul className="mx-auto flex max-w-6xl flex-col flex-wrap items-center justify-center gap-x-10 gap-y-5 px-4 sm:flex-row md:gap-x-14 lg:justify-between lg:gap-x-8">
          <li className="flex items-center gap-2.5 grayscale opacity-[0.82]">
            <Check className="h-4 w-4 shrink-0 text-white/50" strokeWidth={2.5} aria-hidden />
            <span className="font-inter text-[13px] font-medium tracking-tight text-white/50">100% GST Compliant</span>
          </li>
          <li className="flex items-center gap-2.5 grayscale opacity-[0.82]">
            <IndianRupee className="h-4 w-4 shrink-0 text-white/50" strokeWidth={2.25} aria-hidden />
            <span className="font-inter text-[13px] font-medium tracking-tight text-white/50">
              Secured by <span className="font-semibold text-white/65">Razorpay</span>
            </span>
          </li>
          <li className="flex items-center gap-2.5 grayscale opacity-[0.82]">
            <MessageCircle className="h-4 w-4 shrink-0 text-white/50" strokeWidth={2.25} aria-hidden />
            <span className="font-inter text-[13px] font-medium tracking-tight text-white/50">
              WhatsApp Business API Integrated
            </span>
          </li>
          <li className="flex items-center gap-2.5 grayscale opacity-[0.82]">
            <Lock className="h-4 w-4 shrink-0 text-white/50" strokeWidth={2.25} aria-hidden />
            <span className="font-inter text-[13px] font-medium tracking-tight text-white/50">
              Data Encrypted &amp; Secure
            </span>
          </li>
        </ul>
      </div>
    </section>
  )
}

/** Compact “Start free” line — spaced so a free-trial CTA appears about every two sections. */
function MiniStartFreeRail() {
  return (
    <div className="border-y border-white/[0.05] bg-black/30 py-4 text-center backdrop-blur-sm">
      <Link
        href="/login"
        className="font-inter text-sm font-semibold tracking-tight text-white/65 transition hover:text-[#FF6B00]"
      >
        Start free <span className="mx-1.5 text-white/25">·</span>{' '}
        <span className="font-medium text-white/45">No card · Under 2 minutes</span>
      </Link>
    </div>
  )
}

function LatePaymentStatsAndHardTruth() {
  const statCards: {
    icon: LucideIcon
    stat: string
    rest: string
    tint: string
    iconColor: string
  }[] = [
    {
      icon: TrendingDown,
      stat: '85%',
      rest: 'of freelancers face late payments regularly',
      tint: 'bg-red-500/[0.08] border-red-500/20',
      iconColor: 'text-red-400',
    },
    {
      icon: Clock,
      stat: '21%',
      rest: 'are paid late more than half the time',
      tint: 'bg-amber-400/[0.09] border-amber-400/22',
      iconColor: 'text-amber-300',
    },
    {
      icon: MessageCircle,
      stat: '68%',
      rest: 'of invoices get paid after just one reminder',
      tint: 'bg-emerald-500/[0.09] border-emerald-500/22',
      iconColor: 'text-emerald-400',
    },
    {
      icon: IndianRupee,
      stat: '₹4Cr+',
      rest: 'in invoices tracked on Indian platforms like Refrens',
      tint: 'bg-[#6b4423]/[0.22] border-[#8b5a2b]/35',
      iconColor: 'text-[#d4a574]',
    },
  ]

  return (
    <section className="border-y border-white/[0.06] py-12 md:py-16" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="container-premium">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((c) => (
            <div
              key={c.rest}
              className={`flex flex-col rounded-2xl border px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] ${c.tint}`}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-black/25">
                <c.icon className={`h-5 w-5 ${c.iconColor}`} strokeWidth={2.25} aria-hidden />
              </div>
              <p className="font-inter text-[15px] leading-snug text-white/88">
                <span className="text-lg font-black tabular-nums tracking-tight text-white sm:text-xl">{c.stat}</span>{' '}
                <span className="font-medium text-white/75">{c.rest}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/[0.1] bg-[#0f0f0f] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-8 lg:p-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
            <div className="max-w-2xl flex-1">
              <p
                className="font-inter text-[11px] font-bold uppercase tracking-[0.28em]"
                style={{ color: ORANGE }}
              >
                THE HARD TRUTH
              </p>
              <h3 className="font-inter mt-4 text-2xl font-black leading-[1.2] tracking-[-0.03em] text-white sm:text-3xl md:text-[1.85rem] md:leading-tight lg:text-[2rem]">
                A single WhatsApp reminder gets you{' '}
                <span style={{ color: ORANGE }}>massive</span> results — you get paid{' '}
                <span className="tabular-nums text-white">68%</span> of the time.
              </h3>
              <p className="mt-5 text-[15px] leading-relaxed text-white/58 sm:text-base">
                The problem isn&apos;t your clients. It&apos;s that following up manually is awkward, inconsistent, and
                time-consuming. ChaseDue does it automatically — no awkwardness, no forgetting, no chasing.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-6 sm:flex-row sm:gap-10 lg:flex-col lg:gap-8 lg:pt-1">
              <div className="text-left sm:text-center lg:text-right">
                <p className="font-inter text-4xl font-black tabular-nums tracking-tight text-white sm:text-5xl">68%</p>
                <p className="mt-1.5 max-w-[12rem] text-sm font-medium leading-snug text-white/55 sm:mx-auto lg:ml-auto lg:mr-0">
                  paid after reminder 1
                </p>
              </div>
              <div className="text-left sm:text-center lg:text-right">
                <p className="font-inter text-4xl font-black tabular-nums tracking-tight text-white sm:text-5xl">89%</p>
                <p className="mt-1.5 max-w-[12rem] text-sm font-medium leading-snug text-white/55 sm:mx-auto lg:ml-auto lg:mr-0">
                  paid after reminder 3
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Advantage() {
  const items = [
    {
      n: '01',
      title: 'Smart automated reminders',
      body: 'Schedule polite WhatsApp nudges on your timeline — the sequence stops automatically when the invoice is marked paid, so you never double-chase or look pushy.',
    },
    {
      n: '02',
      title: 'Direct to bank payments',
      body: 'Razorpay checkout with UPI and cards on your client portal; money lands in your bank using your own Razorpay keys — configured once in the app, no funds held by us.',
    },
    {
      n: '03',
      title: 'GST compliance',
      body: 'Invoice PDFs include the same tax summary as our server pipeline: taxable value, then split CGST/SGST lines for intra-state or IGST for inter-state, plus total GST and grand total — HSN-backed line items, built for India.',
    },
    {
      n: '04',
      title: 'Client portal',
      body: 'One secure link per invoice: your client opens it, pays, and sees status — no sign-up wall, no attachment maze, fewer “did you get my invoice?” threads.',
    },
  ]
  return (
    <section id="advantage" className="py-24 md:py-32" style={{ backgroundColor: '#000000' }}>
      <div className="container-premium">
        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-16">
          <p
            className="mb-4 font-inter text-[11px] font-bold uppercase tracking-[0.28em] sm:text-xs"
            style={{ color: ORANGE }}
          >
            THE CHASEDUE ADVANTAGE
          </p>
          <h2 className="font-inter text-3xl font-black leading-[1.1] tracking-[-0.04em] text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.08]">
            Why ChaseDue? Smart, fast, and professional.
          </h2>
        </div>
        <div className="mx-auto grid max-w-5xl gap-5 sm:gap-6 md:grid-cols-2">
          {items.map((it) => (
            <article
              key={it.n}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#161616]/90 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition-all duration-300 ease-out hover:border-[#FF6B00] hover:shadow-[0_20px_56px_-12px_rgba(255,107,0,0.22)] md:p-9"
            >
              <span
                className="pointer-events-none absolute -right-1 -top-2 font-inter text-[5.5rem] font-black tabular-nums leading-none opacity-[0.07] transition-opacity duration-300 group-hover:opacity-[0.11] sm:text-[6.5rem]"
                style={{ color: ORANGE }}
                aria-hidden
              >
                {it.n}
              </span>
              <h3 className="font-inter relative text-xl font-bold leading-tight tracking-tight text-white md:text-[1.35rem]">
                {it.title}
              </h3>
              <p className="relative mt-4 text-sm leading-relaxed text-white/[0.52] md:text-[15px] md:leading-relaxed">
                {it.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/** WhatsApp-style delivered / read indicator (blue double checks) */
function WaDoubleChecks({ className }: { className?: string }) {
  return (
    <CheckCheck
      className={className}
      strokeWidth={2.5}
      aria-hidden
      style={{ color: '#53BDEB' }}
    />
  )
}

function FourStepFlow() {
  const steps: { n: string; title: string; detail: string }[] = [
    { n: '01', title: 'Create invoice in 30 seconds', detail: 'GST-ready · Auto-numbering' },
    { n: '02', title: 'Share with a payment link', detail: 'WhatsApp · Email · Direct link' },
    { n: '03', title: 'Auto-send WhatsApp reminders', detail: 'Day 3, 7, and 10 automatically' },
    { n: '04', title: 'Get paid. Track instantly.', detail: 'Real-time status · Auto-close invoice' },
  ]

  return (
    <section id="flow" className="border-y border-white/[0.06] py-24 md:py-32" style={{ backgroundColor: BG }}>
      <div className="container-premium">
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-16">
          <span
            className="inline-flex rounded-full border-2 px-4 py-1.5 font-inter text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ borderColor: ORANGE, color: ORANGE }}
          >
            Simple by design
          </span>
          <h2 className="font-inter mt-6 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl md:text-[2.75rem]">
            Four steps. Zero awkwardness.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/55 sm:text-lg">
            From invoice creation to money in your account — ChaseDue handles every step.
          </p>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col items-stretch lg:flex-row lg:items-stretch lg:justify-center">
          {steps.map((step, i) => (
            <div key={step.n} className="contents lg:contents">
              <article
                className="group relative flex min-h-[200px] flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[#121212] p-7 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.04] transition-all duration-300 ease-out will-change-transform hover:z-10 hover:-translate-y-4 hover:scale-105 hover:border-orange-500/35 hover:shadow-[0_28px_56px_-14px_rgba(255,107,0,0.38)] md:min-h-[220px] lg:min-w-0"
              >
                <span
                  className="pointer-events-none absolute -right-2 -top-4 font-inter text-7xl font-black tabular-nums leading-none sm:text-8xl"
                  style={{ color: ORANGE, opacity: 0.14 }}
                  aria-hidden
                >
                  {step.n}
                </span>
                <h3 className="font-inter relative mt-1 text-lg font-bold leading-snug tracking-tight text-white sm:text-xl">
                  {step.title}
                </h3>
                <p className="relative mt-4 text-sm leading-relaxed text-white/50">{step.detail}</p>
              </article>

              {i < steps.length - 1 ? (
                <div
                  className="flex shrink-0 items-center justify-center py-5 lg:w-10 lg:py-0 lg:px-1"
                  aria-hidden
                >
                  <div className="flex flex-col gap-1.5 lg:flex-row lg:gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ORANGE, opacity: 0.85 }} />
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ORANGE, opacity: 0.55 }} />
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ORANGE, opacity: 0.35 }} />
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <p className="mx-auto mt-14 max-w-2xl text-center font-inter text-sm font-medium text-white/45 sm:text-base">
          Average time to first payment after setup:{' '}
          <span className="font-bold tabular-nums text-white/80">under 24 hours</span>
        </p>
      </div>
    </section>
  )
}

function MomentumCta() {
  return (
    <section
      aria-labelledby="momentum-cta-heading"
      className="relative border-y border-white/[0.06] py-12 md:py-16"
      style={{ backgroundColor: BG }}
    >
      <div className="container-premium max-w-4xl px-4 sm:px-6">
        <div
          className="rounded-2xl p-[1px] shadow-[0_0_56px_-12px_rgba(255,107,0,0.45)]"
          style={{
            background:
              'linear-gradient(145deg, rgba(255,107,0,0.55) 0%, rgba(18,18,18,0.95) 28%, rgba(15,15,15,1) 50%, rgba(18,18,18,0.95) 72%, rgba(255,107,0,0.4) 100%)',
          }}
        >
          <div className="rounded-[15px] bg-[#0b0b0b] px-6 py-12 text-center md:px-12 md:py-14">
            <h2
              id="momentum-cta-heading"
              className="font-inter text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl md:text-[2.65rem] md:leading-tight"
            >
              Stop chasing, start growing.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/55 sm:text-lg">
              Join 50+ Indian freelancers who recovered ₹15L+ this month. No more awkward follow-ups.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3">
              <Link
                href="/login"
                className={`inline-flex min-h-[56px] w-full max-w-sm items-center justify-center rounded-xl px-10 text-lg font-bold text-white sm:w-auto sm:min-w-[280px] ${btnPrimaryGlow}`}
                style={{
                  background: `linear-gradient(90deg, ${ORANGE}, #e85d00)`,
                  boxShadow:
                    '0 12px 40px rgba(255, 107, 0, 0.55), 0 0 48px rgba(255, 107, 0, 0.22), inset 0 1px 0 rgba(255,255,255,0.12)',
                }}
              >
                Get Started for Free
              </Link>
              <p className="font-inter text-sm text-white/42">Takes less than 2 minutes to set up.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhatsappNativeFollowUp() {
  const features: { icon: LucideIcon; text: string }[] = [
    {
      icon: Target,
      text: 'Automatically stops when client pays',
    },
    {
      icon: Hexagon,
      text: 'Escalation sequences: gentle → firm → final — your rules',
    },
    {
      icon: Moon,
      text: 'Smart cadence & quiet hours — never spammy',
    },
    {
      icon: Banknote,
      text: 'Razorpay pay links with the right amount in the same thread',
    },
  ]

  return (
    <section
      id="whatsapp-followup"
      className="border-y border-white/[0.06] py-24 md:py-32"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="container-premium">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Left: copy */}
          <div className="max-w-xl">
            <span
              className="inline-flex items-center rounded-full px-4 py-1.5 font-inter text-[11px] font-bold uppercase tracking-[0.18em] text-white"
              style={{ backgroundColor: WA_GREEN }}
            >
              WhatsApp-Native
            </span>
            <h2 className="font-inter mt-6 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl md:text-[2.5rem] md:leading-[1.12]">
              Your payment follow-up runs on{' '}
              <span style={{ color: WA_GREEN }}>WhatsApp</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/65 sm:text-lg">
              Clients ignore emails. They don&apos;t ignore WhatsApp. ChaseDue sends smart, contextual reminders that feel
              personal — because they are.
            </p>
            <ul className="mt-10 space-y-5">
              {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-4">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]"
                    style={{ color: WA_GREEN }}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <p className="pt-1.5 font-inter text-[15px] font-semibold leading-snug text-white/90">{text}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex gap-4 rounded-2xl border border-white/[0.1] bg-[#111]/90 p-5 ring-1 ring-white/[0.04]">
              <MessageSquare
                className="mt-0.5 h-6 w-6 shrink-0 text-white/45"
                strokeWidth={2}
                aria-hidden
              />
              <div>
                <p className="font-inter text-sm font-bold text-white">Not just notifications</p>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  ChaseDue sends structured, invoice-aware messages — so clients recognise them as real business
                  conversations, not generic blasts.
                </p>
              </div>
            </div>
            <p className="mt-8">
              <Link
                href="/login"
                className="font-inter text-sm font-semibold text-[#FF6B00] underline-offset-4 transition hover:text-[#ff8533] hover:underline"
              >
                Start free with WhatsApp reminders →
              </Link>
            </p>
          </div>

          {/* Right: WhatsApp conversation stack */}
          <div className="mx-auto w-full max-w-[400px]">
            <div
              className="overflow-hidden rounded-[28px] border border-white/[0.1] bg-[#0b141a] shadow-[0_32px_80px_-28px_rgba(0,0,0,0.85)] ring-1 ring-black/40"
              style={{ boxShadow: `0 24px 60px -20px rgba(37, 211, 102, 0.12)` }}
            >
              {/* Chat header */}
              <div
                className="flex items-center gap-3 px-4 py-3.5"
                style={{ background: `linear-gradient(180deg, #1f8f54 0%, #0d5c3f 100%)` }}
              >
                <span className="text-lg leading-none text-white/90" aria-hidden>
                  ‹
                </span>
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/20"
                  aria-hidden
                >
                  <Zap className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-inter text-[15px] font-semibold text-white">ChaseDue</p>
                  <p className="text-[11px] text-emerald-100/90">Business account</p>
                </div>
                <span className="text-white/70" aria-hidden>
                  ⋮
                </span>
              </div>

              <div className="relative min-h-[420px] px-3 pb-8 pt-5">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='%23ffffff'/%3E%3C/svg%3E")`,
                  }}
                  aria-hidden
                />

                {/* Bubble 1 — Day 3 Friendly Reminder */}
                <div className="relative mb-4 flex flex-col items-end gap-1.5">
                  <span className="mr-1 rounded-full bg-black/35 px-2.5 py-0.5 font-inter text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Day 3
                  </span>
                  <div className="w-full max-w-[94%] overflow-hidden rounded-2xl rounded-tr-md border border-white/[0.08] bg-[#1e2a30] shadow-lg ring-1 ring-black/20">
                    <div
                      className="px-3.5 py-2.5 font-inter text-[13px] font-bold text-white"
                      style={{ backgroundColor: WA_GREEN }}
                    >
                      Friendly Reminder
                    </div>
                    <div className="space-y-2.5 px-3.5 py-3">
                      <p className="text-[13px] leading-snug text-white/95">
                        Hi — this is a friendly reminder that invoice <span className="font-semibold">INV-882</span> for{' '}
                        <span className="font-semibold">₹22,000</span> is due soon. Tap below when you&apos;re ready.
                      </p>
                      <button
                        type="button"
                        className="w-full rounded-lg py-2.5 font-inter text-[13px] font-bold text-white"
                        style={{ backgroundColor: WA_GREEN }}
                      >
                        Pay Now · ₹22,000
                      </button>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 px-3 pb-2.5 pt-0">
                      <span className="text-[11px] tabular-nums text-white/35">10:02</span>
                      <WaDoubleChecks className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Bubble 2 — Day 7 Follow-up (firmer) */}
                <div className="relative mb-4 flex flex-col items-end gap-1.5">
                  <span className="mr-1 rounded-full bg-black/35 px-2.5 py-0.5 font-inter text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Day 7
                  </span>
                  <div className="w-full max-w-[94%] overflow-hidden rounded-2xl rounded-tr-md border border-white/[0.08] bg-[#1e2a30] shadow-lg ring-1 ring-black/20">
                    <div
                      className="px-3.5 py-2.5 font-inter text-[13px] font-bold text-white"
                      style={{ backgroundColor: '#128C7E' }}
                    >
                      Follow-up
                    </div>
                    <div className="space-y-2 px-3.5 py-3">
                      <p className="text-[13px] leading-snug text-white/95">
                        Second notice: <span className="font-semibold">INV-882</span> is now overdue. Please settle{' '}
                        <span className="font-semibold">₹22,000</span> today to keep your account in good standing.
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 px-3 pb-2.5 pt-0">
                      <span className="text-[11px] tabular-nums text-white/35">09:41</span>
                      <WaDoubleChecks className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Bubble 3 — Client reply (incoming, left) */}
                <div className="relative mb-4 flex flex-col items-start gap-1.5">
                  <span className="ml-1 rounded-full bg-black/35 px-2.5 py-0.5 font-inter text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Day 7
                  </span>
                  <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-white/[0.06] bg-[#202c33] px-3.5 py-2.5 shadow-md">
                    <p className="text-[13px] leading-relaxed text-white/92">So sorry! Will pay today.</p>
                    <div className="mt-1 flex items-center justify-end gap-1">
                      <span className="text-[11px] tabular-nums text-white/35">11:06</span>
                    </div>
                  </div>
                </div>

                {/* Bubble 4 — Payment Confirmed */}
                <div className="relative flex flex-col items-end gap-1.5">
                  <span className="mr-1 rounded-full bg-black/35 px-2.5 py-0.5 font-inter text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Day 7
                  </span>
                  <div className="w-full max-w-[94%] rounded-2xl rounded-tr-md border border-emerald-700/40 bg-[#0d3d2e] px-3.5 py-3 shadow-md">
                    <div className="flex items-start gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/25">
                        <Check className="h-4 w-4 text-emerald-300" strokeWidth={3} aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-inter text-[12px] font-bold uppercase tracking-wide text-emerald-100/95">
                          Payment Confirmed
                        </p>
                        <p className="mt-1 text-[13px] leading-snug text-white/92">
                          ₹22,000 received. Reminders for this invoice are turned off.
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-end gap-1.5">
                      <span className="text-[11px] tabular-nums text-white/35">14:22</span>
                      <WaDoubleChecks className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DashboardPreview() {
  return (
    <section id="dashboard-preview" className="py-24 md:py-28" style={{ backgroundColor: BG }}>
      <div className="container-premium">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: ORANGE }}>
            Dashboard
          </p>
          <h2 className="font-inter mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            Your cash flow at a glance
          </h2>
        </div>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/[0.1] bg-[#121212] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.04]">
          <div className="border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500/80" />
              <div className="h-2 w-2 rounded-full bg-amber-400/80" />
              <div className="h-2 w-2 rounded-full bg-emerald-500/80" />
              <span className="ml-4 text-xs text-white/35">chasedue.app/dashboard</span>
            </div>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-3">
            {[
              { k: 'Total invoiced', v: '₹4,28,000', sub: 'This quarter' },
              { k: 'Pending', v: '₹1,12,400', sub: 'Awaiting payment' },
              { k: 'Paid', v: '₹3,15,600', sub: 'Collected' },
            ].map((c) => (
              <div key={c.k} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-white/40">{c.k}</p>
                <p className="mt-2 font-inter text-2xl font-black tracking-tight text-white">{c.v}</p>
                <p className="mt-1 text-xs text-white/45">{c.sub}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] px-6 pb-6 pt-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Recent invoices</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-white/40">
                    <th className="pb-3 pr-4 font-medium">Invoice</th>
                    <th className="pb-3 pr-4 font-medium">Client</th>
                    <th className="pb-3 pr-4 font-medium text-right">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-white/85">
                  {[
                    ['INV-1042', 'Acme Studio', '₹48,500', 'Paid'],
                    ['INV-1041', 'Northwind', '₹22,000', 'Pending'],
                    ['INV-1038', 'Pixel Co.', '₹17,700', 'Overdue'],
                  ].map((row) => (
                    <tr key={row[0]}>
                      <td className="py-3 pr-4 font-mono text-xs">{row[0]}</td>
                      <td className="py-3 pr-4">{row[1]}</td>
                      <td className="py-3 pr-4 text-right tabular-nums">{row[2]}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            row[3] === 'Paid'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : row[3] === 'Pending'
                                ? 'bg-amber-500/15 text-amber-200'
                                : 'bg-red-500/15 text-red-300'
                          }`}
                        >
                          {row[3]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function EscalationTimeline() {
  const steps = [
    { day: 'Day 1', title: 'Friendly nudge', color: '#34d399', body: 'A polite WhatsApp reminder — professional tone, zero guilt.' },
    { day: 'Day 3', title: 'Firm reminder', color: ORANGE, body: 'Clear due date and pay link — urgency without burning the relationship.' },
    { day: 'Day 7', title: 'Final notice', color: '#f87171', body: 'Last structured touchpoint before you step in personally.' },
  ]
  return (
    <section className="border-y border-white/[0.06] py-24 md:py-28" style={{ backgroundColor: '#101010' }}>
      <div className="container-premium">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-inter text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              Get paid on time, every time.
            </h2>
            <p className="mt-4 max-w-md text-lg text-white/55">
              A clear escalation path — so clients know you are serious, and you stay in control.
            </p>
          </div>
          <div className="relative pl-8">
            <div className="absolute bottom-2 left-[11px] top-2 w-px bg-gradient-to-b from-emerald-500/50 via-[#FF6B00]/60 to-red-500/50" />
            <ul className="space-y-10">
              {steps.map((s) => (
                <li key={s.day} className="relative flex gap-5">
                  <span
                    className="absolute -left-8 mt-1.5 h-3 w-3 shrink-0 rounded-full ring-4 ring-black"
                    style={{ backgroundColor: s.color }}
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: s.color }}>
                      {s.day}
                    </p>
                    <p className="font-inter mt-1 text-xl font-bold text-white">{s.title}</p>
                    <p className="mt-2 text-sm text-white/55">{s.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const pricingToggleId = useId()

  const cardBase =
    'flex w-full flex-1 flex-col rounded-2xl border bg-[#121212]/90 p-8 text-left backdrop-blur-md sm:p-9 lg:max-w-[340px]'
  const cardGlass = `${cardBase} border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]`
  const listClass = 'mt-8 flex-1 space-y-3.5 text-left text-sm leading-snug text-white/[0.82]'
  const outlineBtn = `mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl border-2 border-white/[0.18] bg-transparent text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/[0.04] ${btnGhostGlow}`

  const freeFeatures = [
    '1 invoice only',
    'PDF download (watermarked)',
    'Manual payment tracking',
    'No WhatsApp reminders',
    'No payment collection',
  ]
  const proFeatures = [
    '50 invoices/month',
    'Unlimited WhatsApp reminders',
    'Razorpay + PayPal payments',
    'Analytics dashboard',
    'GST compliant PDFs',
    'Client portal',
    'Expense tracking',
  ]
  const proMaxFeatures = [
    'Unlimited invoices',
    'Unlimited WhatsApp reminders',
    'White-label invoice branding',
    'Advanced analytics',
    'Custom invoice prefix',
    'Priority support',
    'Early access to features',
  ]
  const ultraProFeatures = [
    'Everything in Pro Max',
    'Up to 5 team members',
    'Multiple business profiles',
    'API access',
    'Dedicated support',
    'Custom onboarding',
  ]

  return (
    <section id="pricing" className="py-24 md:py-32" style={{ backgroundColor: BG }}>
      <div className="container-premium">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: ORANGE }}>
            Simple pricing for Indian freelancers
          </p>
          <h2 className="font-inter mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            Choose the plan that fits how you work
          </h2>
        </div>

        {/* Launch Offer Banner */}
        <div className="mx-auto mb-10 max-w-4xl">
          <div 
            className="relative overflow-hidden rounded-2xl p-6 text-center animate-pulse"
            style={{ background: `linear-gradient(135deg, ${ORANGE}, #e85d00)` }}
          >
            <p className="text-lg font-bold text-white">
              🔥 First 10 customers get all plans at ₹99/mo — 2 weeks only
            </p>
          </div>
        </div>

        <div className="mx-auto mb-10 flex w-full max-w-md flex-col items-center justify-center gap-3 sm:mx-auto sm:flex-row sm:gap-4">
          <span
            className={`font-inter text-sm font-medium transition-colors ${billingPeriod === 'monthly' ? 'text-white' : 'text-white/40'}`}
          >
            Monthly
          </span>
          <button
            type="button"
            id={pricingToggleId}
            role="switch"
            aria-checked={billingPeriod === 'yearly'}
            aria-label="Switch between monthly and yearly billing"
            onClick={() => setBillingPeriod((p) => (p === 'monthly' ? 'yearly' : 'monthly'))}
            className="relative h-9 w-[52px] shrink-0 rounded-full border border-white/[0.14] bg-black/50 shadow-inner transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]/60"
          >
            <span
              className="absolute top-1 left-1 h-7 w-7 rounded-full bg-gradient-to-br from-white to-white/85 shadow-md transition-transform duration-200 ease-out"
              style={{ transform: billingPeriod === 'yearly' ? 'translateX(20px)' : 'translateX(0)' }}
            />
          </button>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span
              className={`font-inter text-sm font-medium transition-colors ${billingPeriod === 'yearly' ? 'text-white' : 'text-white/40'}`}
            >
              Yearly
            </span>
            <span
              className="rounded-full border border-[#FF6B00]/35 px-2.5 py-0.5 font-inter text-[10px] font-bold uppercase tracking-wider shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              style={{ backgroundColor: 'rgba(255, 107, 0, 0.22)', color: ORANGE }}
            >
              Save 10%
            </span>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-6 lg:flex-row lg:items-stretch lg:justify-center lg:gap-5">
          {/* FREE */}
          <div className={cardGlass}>
            <p className="font-inter text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">FREE</p>
            <h3 className="font-inter mt-2 text-2xl font-bold tracking-tight text-white">Free forever</h3>
            <p className="mt-4 font-inter text-4xl font-black tabular-nums text-white">
              ₹0
              {billingPeriod === 'yearly' ? (
                <span className="text-xl font-semibold text-white/40 sm:text-2xl"> / year</span>
              ) : null}
            </p>
            <p className="mt-4 text-sm font-medium leading-relaxed text-white/70">
              Perfect for trying out ChaseDue
            </p>
            <ul className={listClass}>
              {freeFeatures.map((f, i) => (
                <li key={f} className="flex gap-3">
                  {i === 0 ? (
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" strokeWidth={2.5} aria-hidden />
                  ) : (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-white/50" strokeWidth={2.5} aria-hidden />
                  )}
                  <span className={i === 0 ? 'font-semibold text-orange-500' : ''}>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/login" className={outlineBtn}>
              Get Started for Free
            </Link>
            <p className="mt-3 text-center font-inter text-xs leading-relaxed text-white/45">
              No credit card required
            </p>
          </div>

          {/* PRO — Most Popular */}
          <div
            className={`relative z-10 flex w-full flex-1 flex-col rounded-2xl border-2 bg-[#141414]/95 p-8 text-left shadow-[0_24px_70px_-20px_rgba(255,107,0,0.35)] backdrop-blur-md sm:p-9 lg:max-w-[380px] lg:-translate-y-1 lg:scale-[1.02]`}
            style={{ borderColor: ORANGE }}
          >
            <div
              className="absolute -top-3 left-1/2 max-w-[min(100%,280px)] -translate-x-1/2 rounded-full px-4 py-1.5 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-white sm:text-[11px]"
              style={{ background: `linear-gradient(90deg, ${ORANGE}, #e85d00)` }}
            >
              Most Popular
            </div>
            <p className="mt-2 font-inter text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">PRO</p>
            <div className="mt-3">
              {billingPeriod === 'monthly' ? (
                <>
                  <p className="font-inter text-4xl font-black tabular-nums sm:text-5xl" style={{ color: ORANGE }}>
                    ₹299<span className="text-lg font-semibold text-white/40">/mo</span>
                  </p>
                </>
              ) : (
                <>
                  <p className="font-inter text-4xl font-black tabular-nums sm:text-5xl" style={{ color: ORANGE }}>
                    ₹3,229<span className="text-lg font-semibold text-white/40">/year</span>
                  </p>
                  <p className="mt-2 text-sm text-white/50 line-through">₹3,588/year</p>
                </>
              )}
            </div>
            <p className="mt-5 text-sm font-medium leading-relaxed text-white/80">
              Perfect for growing freelancers
            </p>
            <ul className={listClass}>
              {proFeatures.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ORANGE }} strokeWidth={2.5} aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={'/login?next=' + encodeURIComponent('/dashboard/billing?plan=pro')}
              className={`mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold text-white ${btnPrimaryGlow}`}
              style={{ backgroundColor: ORANGE }}
            >
              Get Pro
            </Link>
          </div>

          {/* PRO MAX */}
          <div className={cardGlass}>
            <p className="font-inter text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">PRO MAX</p>
            <div className="mt-3">
              {billingPeriod === 'monthly' ? (
                <>
                  <p className="font-inter text-4xl font-black tabular-nums text-white sm:text-5xl">
                    ₹799<span className="text-lg font-semibold text-white/40">/mo</span>
                  </p>
                </>
              ) : (
                <>
                  <p className="font-inter text-4xl font-black tabular-nums text-white sm:text-5xl">
                    ₹8,629<span className="text-lg font-semibold text-white/40">/year</span>
                  </p>
                  <p className="mt-2 text-sm text-white/50 line-through">₹9,588/year</p>
                </>
              )}
            </div>
            <p className="mt-5 text-sm font-medium leading-relaxed text-white/70">
              For serious freelancers with high volume
            </p>
            <ul className={listClass}>
              {proMaxFeatures.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-white/50" strokeWidth={2.5} aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href={'/login?next=' + encodeURIComponent('/dashboard/billing?plan=pro_max')} className={outlineBtn}>
              Get Pro Max
            </Link>
          </div>

          {/* ULTRA PRO */}
          <div className={cardGlass}>
            <p className="font-inter text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">ULTRA PRO</p>
            <div className="mt-3">
              {billingPeriod === 'monthly' ? (
                <>
                  <p className="font-inter text-4xl font-black tabular-nums text-white sm:text-5xl">
                    ₹1,499<span className="text-lg font-semibold text-white/40">/mo</span>
                  </p>
                </>
              ) : (
                <>
                  <p className="font-inter text-4xl font-black tabular-nums text-white sm:text-5xl">
                    ₹16,189<span className="text-lg font-semibold text-white/40">/year</span>
                  </p>
                  <p className="mt-2 text-sm text-white/50 line-through">₹17,988/year</p>
                </>
              )}
            </div>
            <p className="mt-5 text-sm font-medium leading-relaxed text-white/70">
              For teams and agencies
            </p>
            <ul className={listClass}>
              {ultraProFeatures.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-white/50" strokeWidth={2.5} aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href={'/login?next=' + encodeURIComponent('/dashboard/billing?plan=ultra_pro')} className={outlineBtn}>
              Get Ultra Pro
            </Link>
          </div>
        </div>

        <SecurePaymentsRow />
      </div>
    </section>
  )
}

/** Grayscale trust strip — directly under pricing cards. */
function SecurePaymentsRow() {
  const item =
    'flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-inter text-[12px] font-medium text-white/50 sm:text-[13px] grayscale opacity-[0.88]'

  return (
    <div className="mt-14 border-t border-white/[0.08] pt-10 md:mt-16 md:pt-12">
      <p className="mb-6 text-center font-inter text-[11px] font-bold uppercase tracking-[0.22em] text-white/40">
        Secure payments
      </p>
      <ul className="mx-auto flex max-w-5xl flex-col flex-wrap items-stretch justify-center gap-3 sm:flex-row sm:items-center md:gap-4">
        <li className={`${item} sm:flex-1`}>
          <IndianRupee className="h-4 w-4 shrink-0 text-white/45" strokeWidth={2.25} aria-hidden />
          <span>
            <span className="font-semibold text-white/65">Razorpay</span>
            <span className="text-white/35"> · Primary checkout</span>
          </span>
        </li>
        <li className={`${item} sm:flex-1`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/35" aria-hidden>
            UPI
          </span>
          <span>Google Pay / PhonePe / UPI</span>
        </li>
        <li className={`${item} sm:flex-1`}>
          <Check className="h-4 w-4 shrink-0 text-white/45" strokeWidth={2.5} aria-hidden />
          <span>100% GST compliant</span>
        </li>
        <li className={`${item} sm:flex-1`}>
          <Lock className="h-4 w-4 shrink-0 text-white/45" strokeWidth={2.25} aria-hidden />
          <span>SSL secure encryption</span>
        </li>
      </ul>
    </div>
  )
}

function Testimonials() {
  const quotes: {
    quote: string
    nameRole: string
    initials: string
    avatarClass: string
  }[] = [
    {
      quote:
        'ChaseDue recovered ₹45,000 in overdue payments in my first week. The WhatsApp automation is a game changer.',
      nameRole: 'Suresh K., UI/UX Designer (Bengaluru)',
      initials: 'SK',
      avatarClass: 'from-[#5c4d7a] to-[#3d3558]',
    },
    {
      quote:
        'I used to hate following up. Now ChaseDue does it for me professionally. 80% of my invoices are paid on the first reminder.',
      nameRole: 'Ananya R., Content Strategist (Chennai)',
      initials: 'AR',
      avatarClass: 'from-[#2d6a4f] to-[#1b4332]',
    },
    {
      quote:
        'The GST-ready PDFs and Razorpay integration make this the best tool for Indian devs. Highly recommended.',
      nameRole: 'Vikram M., Full-stack Dev (Mumbai)',
      initials: 'VM',
      avatarClass: 'from-[#8b5a2b] to-[#5c3d1e]',
    },
  ]
  return (
    <section id="testimonials" className="border-y border-white/[0.06] py-20 md:py-24" style={{ backgroundColor: '#101010' }}>
      <div className="container-premium">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: ORANGE }}>
            Testimonials
          </p>
          <h2 className="font-inter mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            Trusted by freelancers across India.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-white/50 sm:text-base">
            Over ₹15 Lakhs in payments tracked and 500+ reminders sent this month.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {quotes.map((q) => (
            <blockquote
              key={q.nameRole}
              className="flex flex-col rounded-2xl border border-white/[0.12] bg-white/[0.04] p-6 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            >
              <p className="font-inter text-sm leading-relaxed text-white/85">&ldquo;{q.quote}&rdquo;</p>
              <footer className="mt-6 border-t border-white/[0.08] pt-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-bold tracking-tight text-white shadow-inner ring-1 ring-white/15 ${q.avatarClass}`}
                    aria-hidden
                  >
                    {q.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-inter text-sm font-semibold leading-snug text-white">
                        <span>{q.nameRole}</span>{' '}
                        <span className="inline-block text-base leading-none" role="img" aria-label="India">
                          🇮🇳
                        </span>
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-inter text-[10px] font-bold uppercase tracking-wide text-emerald-300/95">
                        <CheckCircle2 className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

function Comparison() {
  const redX = '#f87171'
  const greyX = '#6b7280'
  const yellowLabel = '#facc15'

  const rows: {
    feature: string
    chaseDue: 'orange-check' | 'grey-x'
    generic: { kind: 'red-x' | 'yellow' | 'green-check'; label?: string; bloatNote?: boolean }
  }[] = [
    { feature: 'Built for payment recovery', chaseDue: 'orange-check', generic: { kind: 'red-x' } },
    { feature: 'WhatsApp-native reminders', chaseDue: 'orange-check', generic: { kind: 'red-x' } },
    { feature: 'Auto-escalation workflows', chaseDue: 'orange-check', generic: { kind: 'red-x' } },
    { feature: 'UPI + Razorpay embedded', chaseDue: 'orange-check', generic: { kind: 'red-x' } },
    { feature: 'Built for Indian GST', chaseDue: 'orange-check', generic: { kind: 'yellow', label: 'Partial' } },
    { feature: 'Works from your phone', chaseDue: 'orange-check', generic: { kind: 'yellow', label: 'Limited' } },
    { feature: 'Stops reminders when paid', chaseDue: 'orange-check', generic: { kind: 'red-x' } },
    {
      feature: 'Payroll, HR, inventory modules',
      chaseDue: 'grey-x',
      generic: { kind: 'green-check', bloatNote: true },
    },
  ]

  const cdCol =
    'border-l-2 bg-white/[0.045] shadow-[inset_0_0_0_1px_rgba(255,107,0,0.12)]'
  const cdColBorder = { borderLeftColor: `${ORANGE}55` } as const

  return (
    <section id="compare" className="border-t border-white/[0.06] py-20 md:py-28" style={{ backgroundColor: '#101010' }}>
      <div className="container-premium">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: ORANGE }}>
            Compare
          </p>
          <h2 className="font-inter mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            Payment recovery — not generic bloat
          </h2>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-white/50 sm:text-base">
            ChaseDue is purpose-built for getting paid. Generic tools spread you thin.
          </p>
        </div>

        <div className="mx-auto max-w-4xl overflow-x-auto rounded-2xl border border-white/[0.1] bg-[#0c0c0c] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ring-1 ring-white/[0.04]">
          <table className="w-full min-w-[300px] text-left text-sm sm:min-w-[560px] md:min-w-[640px]">
            <thead>
              <tr className="border-b border-white/[0.1] text-xs uppercase tracking-[0.18em] text-white/50">
                <th className="px-4 py-4 pl-5 font-semibold sm:px-6 sm:pl-7">Feature</th>
                <th
                  className={`px-4 py-4 font-semibold sm:px-6 ${cdCol}`}
                  style={cdColBorder}
                >
                  <span className="inline-flex items-center gap-2 font-inter text-[13px] tracking-normal text-white">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-white/10"
                      style={{
                        background: `linear-gradient(135deg, ${ORANGE}, #cc5500)`,
                        boxShadow: '0 4px 14px rgba(255, 107, 0, 0.25)',
                      }}
                      aria-hidden
                    >
                      <Zap className="h-4 w-4 text-white" strokeWidth={2.25} />
                    </span>
                    <span style={{ color: ORANGE }}>ChaseDue</span>
                  </span>
                </th>
                <th className="px-4 py-4 pr-5 font-semibold text-white/70 sm:px-6 sm:pr-7">Generic tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {rows.map((r) => (
                <tr key={r.feature} className="text-white/85">
                  <td className="px-4 py-4 pl-5 align-middle sm:px-6 sm:pl-7">
                    <span className="font-inter font-bold text-white">{r.feature}</span>
                  </td>
                  <td
                    className={`px-4 py-4 align-middle sm:px-6 ${cdCol}`}
                    style={cdColBorder}
                  >
                    <span className="inline-flex items-center justify-center">
                      {r.chaseDue === 'orange-check' ? (
                        <CheckCircle2 className="h-6 w-6 shrink-0" strokeWidth={2.25} style={{ color: ORANGE }} aria-hidden />
                      ) : (
                        <XCircle className="h-6 w-6 shrink-0" strokeWidth={2} style={{ color: greyX }} aria-hidden />
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4 pr-5 align-middle sm:px-6 sm:pr-7">
                    {r.generic.kind === 'red-x' && (
                      <XCircle className="h-6 w-6 shrink-0" strokeWidth={2} style={{ color: redX }} aria-hidden />
                    )}
                    {r.generic.kind === 'yellow' && r.generic.label && (
                      <span className="font-inter text-sm font-bold" style={{ color: yellowLabel }}>
                        {r.generic.label}
                      </span>
                    )}
                    {r.generic.kind === 'green-check' && (
                      <span className="inline-flex flex-wrap items-center gap-2">
                        <CheckCircle2
                          className="h-6 w-6 shrink-0"
                          strokeWidth={2.25}
                          style={{ color: '#34d399' }}
                          aria-hidden
                        />
                        {r.generic.bloatNote ? (
                          <span className="text-sm italic text-white/55">(bloat you don&apos;t need)</span>
                        ) : null}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function FaqBlock() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const supportWaDigits = (process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_DIGITS ?? '').replace(/\D/g, '')
  const supportWhatsAppHref =
    supportWaDigits.length >= 10 ? `https://wa.me/${supportWaDigits}` : null

  return (
    <section id="faq" className="py-24 md:py-28" style={{ backgroundColor: BG }}>
      <div className="container-premium max-w-3xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: ORANGE }}>
            FAQ
          </p>
          <h2 className="font-inter mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            The top 5 worries — answered
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-sm leading-relaxed text-white/50 sm:text-base">
            GST, money, WhatsApp, offline payments, and using ChaseDue with tools you already rely on.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0c0c0c]/90 shadow-[0_0_0_1px_rgba(255,107,0,0.08),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md">
          <div className="divide-y divide-white/[0.08] px-1 sm:px-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index
              const panelId = `${baseId}-panel-${index}`
              const triggerId = `${baseId}-trigger-${index}`
              return (
                <div key={item.q}>
                  <h3 className="font-inter text-base font-semibold text-white sm:text-[17px]">
                    <button
                      type="button"
                      id={triggerId}
                      className="group flex w-full items-start gap-3 rounded-xl py-5 text-left outline-none transition hover:bg-white/[0.04] sm:gap-4 sm:py-5 sm:pl-2 sm:pr-2"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex((p) => (p === index ? null : index))}
                    >
                      <HelpCircle
                        className="mt-0.5 h-5 w-5 shrink-0 transition group-hover:opacity-100"
                        style={{ color: ORANGE }}
                        strokeWidth={2}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1 pr-2 leading-snug">{item.q}</span>
                      <motion.span
                        className="mt-0.5 shrink-0 text-white/40 transition group-hover:text-[#FF6B00]"
                        style={{ color: isOpen ? ORANGE : undefined }}
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.28, ease }}
                      >
                        <ChevronDown className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease }}
                        className="overflow-hidden"
                      >
                        <p className="border-t border-white/[0.06] pb-5 pl-9 pr-6 pt-4 text-sm leading-relaxed text-white/[0.68] sm:pb-6 sm:pl-11 sm:pr-8">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
        <p className="mt-10 text-center font-inter text-sm leading-relaxed text-white/45">
          Have more questions?{' '}
          {supportWhatsAppHref ? (
            <a
              href={supportWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline-offset-4 transition hover:underline"
              style={{ color: ORANGE }}
            >
              Chat with us on WhatsApp
            </a>
          ) : (
            <a
              href="mailto:support@chasedue.in?subject=ChaseDue%20%E2%80%94%20WhatsApp"
              className="font-semibold underline-offset-4 transition hover:underline"
              style={{ color: ORANGE }}
            >
              Chat with us on WhatsApp
            </a>
          )}
        </p>
      </div>
    </section>
  )
}

/** Payment & compliance reassurance — sits directly above the site footer. */
function TrustSecurityFooterBar() {
  const badgeClass =
    'flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 grayscale opacity-[0.88] transition hover:opacity-100 sm:min-h-[52px] sm:flex-1 sm:justify-center lg:max-w-none'

  return (
    <section
      aria-label="Payments and security"
      className="border-t border-white/[0.06] bg-[#0a0a0a] py-8 md:py-10"
    >
      <div className="container-premium">
        <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          <li className={badgeClass}>
            <IndianRupee className="h-5 w-5 shrink-0 text-white/45" strokeWidth={2.25} aria-hidden />
            <span className="text-left font-inter text-[12px] leading-snug text-white/50 sm:text-[13px]">
              Payments secured by <span className="font-semibold text-white/70">Razorpay</span>
            </span>
          </li>
          <li className={badgeClass}>
            <MessageCircle className="h-5 w-5 shrink-0 text-white/45" strokeWidth={2.25} aria-hidden />
            <span className="text-left font-inter text-[12px] leading-snug text-white/50 sm:text-[13px]">
              Official Meta <span className="font-semibold text-white/70">WhatsApp</span> API
            </span>
          </li>
          <li className={badgeClass}>
            <Shield className="h-5 w-5 shrink-0 text-white/45" strokeWidth={2.25} aria-hidden />
            <span className="text-left font-inter text-[12px] leading-snug text-white/50 sm:text-[13px]">
              100% Data Privacy &amp; Encryption
            </span>
          </li>
          <li className={badgeClass}>
            <FileText className="h-5 w-5 shrink-0 text-white/45" strokeWidth={2.25} aria-hidden />
            <span className="text-left font-inter text-[12px] leading-snug text-white/50 sm:text-[13px]">
              GST-Ready Invoicing
            </span>
          </li>
        </ul>
      </div>
    </section>
  )
}

function FooterCta() {
  return (
    <section className="border-t border-white/[0.06] py-24 md:py-28" style={{ backgroundColor: '#101010' }}>
      <div className="container-premium text-center">
        <h2 className="font-inter text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
          Stop waiting for <span style={{ color: ORANGE }}>payments.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/55">
          Invoices, reminders, and a client portal — tuned for Indian freelancers.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className={`inline-flex min-h-[52px] items-center justify-center rounded-xl px-8 text-base font-semibold text-white ${btnPrimaryGlow}`}
            style={{
              background: `linear-gradient(90deg, ${ORANGE}, #e85d00)`,
              boxShadow: '0 14px 40px rgba(255, 107, 0, 0.35)',
            }}
          >
            Get started for free
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="mailto:support@chasedue.in"
            className={`inline-flex min-h-[52px] items-center justify-center rounded-xl px-8 text-base font-semibold text-white/90 ${btnGhostGlow}`}
          >
            Contact sales
          </Link>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.08] py-20" style={{ backgroundColor: BG }}>
      <div className="container-premium">
        <div className="mb-14 grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-white/10"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, #cc5500)` }}
              >
                <Zap className="h-4 w-4 text-white" strokeWidth={2.25} aria-hidden />
              </div>
              <span className="font-inter text-lg font-bold text-white">
                Chase<span style={{ color: ORANGE }}>Due</span>
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/45">
              Built for Indian freelancers. Professional invoices, WhatsApp reminders, and faster payments.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-inter text-xs font-bold uppercase tracking-wider text-white/80">Product</h3>
            <div className="space-y-3 text-sm text-white/45">
              <Link href="#advantage" className="block transition hover:text-white">
                Features
              </Link>
              <Link href="#pricing" className="block transition hover:text-white">
                Pricing
              </Link>
              <Link href="/dashboard" className="block transition hover:text-white">
                Dashboard
              </Link>
              <Link href="/help" className="block transition hover:text-white">
                Help
              </Link>
              <Link href="/contact" className="block transition hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-inter text-xs font-bold uppercase tracking-wider text-white/80">Legal</h3>
            <div className="space-y-3 text-sm text-white/45">
              <Link href="/privacy" className="block transition hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="block transition hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/[0.08] pt-10">
          <p className="mb-6 text-center font-inter text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Global payments
          </p>
          <PaymentPartnerLogos />
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-sm text-white/35 md:flex-row">
          <span>© {new Date().getFullYear()} ChaseDue. All rights reserved.</span>
          <span>Made in India</span>
        </div>
      </div>
    </footer>
  )
}

export default function CinematicHome() {
  return (
    <div className="min-h-screen text-white antialiased" style={{ backgroundColor: BG }}>
      <Nav />
      <Hero />
      <TrustBar />
      <MiniStartFreeRail />
      <LatePaymentStatsAndHardTruth />
      <Advantage />
      <MiniStartFreeRail />
      <FourStepFlow />
      <MomentumCta />
      <WhatsappNativeFollowUp />
      <DashboardPreview />
      <MiniStartFreeRail />
      <EscalationTimeline />
      <Pricing />
      <Comparison />
      <MiniStartFreeRail />
      <Testimonials />
      <FaqBlock />
      <FooterCta />
      <TrustSecurityFooterBar />
      <Footer />
    </div>
  )
}
