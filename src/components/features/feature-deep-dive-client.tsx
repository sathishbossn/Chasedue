'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import type { FeatureDeepDive } from '@/lib/feature-pages'
import ScrollSlideUp from '@/components/landing/scroll-slide-up'
import { FEATURE_LUCIDE_ICONS } from '@/components/features/feature-icon-map'

const ease = [0.22, 1, 0.36, 1] as const

const heroMask = {
  maskImage: 'linear-gradient(to bottom, black 52%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to bottom, black 52%, transparent 100%)',
} as const

export default function FeatureDeepDiveClient({ feature }: { feature: FeatureDeepDive }) {
  const Icon = FEATURE_LUCIDE_ICONS[feature.icon]

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="container-premium flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#ff6a00] bg-transparent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(255,106,0,0.15)] transition hover:bg-[#ff6a00]/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00]"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-[#ff6a00]" strokeWidth={2.25} aria-hidden />
            Back to Home
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff6a00] to-[#e85d00] shadow-[0_8px_24px_rgba(255,106,0,0.25)] ring-1 ring-white/10">
              <Icon className="h-4 w-4 text-white" strokeWidth={2.25} aria-hidden />
            </div>
            <span className="font-display text-sm font-bold text-white/90">ChaseDue</span>
          </div>
        </div>
      </header>

      <main>
        {/* Lifestyle hero — background image + fade to black + floating UI */}
        <section className="relative -mt-px min-h-[min(88vh,920px)] overflow-hidden bg-black">
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={heroMask}>
              <Image
                src={feature.lifestyleHeroSrc}
                alt={feature.heroAlt}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black"
              aria-hidden
            />
          </div>

          {feature.uiShot ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-6 pt-24 md:justify-end md:pr-8 lg:pr-16 lg:pb-10">
              <motion.div
                className="pointer-events-auto w-full max-w-[min(100%,520px)] origin-bottom-right perspective-[1200px]"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              >
                <div
                  className="overflow-hidden rounded-xl border border-white/15 bg-[#0a0a0a]/90 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.95),0_32px_64px_-12px_rgba(255,106,0,0.22),0_0_0_1px_rgba(255,255,255,0.06)_inset] ring-1 ring-white/[0.07] backdrop-blur-sm"
                  style={{
                    transform: 'rotateX(8deg) rotateY(-10deg) skewY(-3deg)',
                  }}
                >
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={feature.uiShot.src}
                      alt={feature.uiShot.alt}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 520px"
                      priority
                    />
                  </div>
                  <div className="border-t border-white/10 bg-black/50 px-4 py-2.5 text-[11px] font-medium text-slate-400 backdrop-blur-md">
                    ChaseDue — in-app view
                  </div>
                </div>
              </motion.div>
            </div>
          ) : null}

          <div className="relative z-[5] mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-14">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="mb-4 inline-flex rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a00] backdrop-blur-md"
            >
              Feature
            </motion.p>
          </div>
        </section>

        {/* Two-column intro — display title + readable body */}
        <section className="relative z-20 border-b border-white/[0.06] bg-black">
          <div className="container-premium py-16 md:py-20 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease }}
                className="font-display text-[clamp(2rem,4.5vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-[#ff6a00]"
              >
                {feature.title}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease, delay: 0.06 }}
                className="space-y-5 text-[17px] leading-[1.75] text-slate-300"
              >
                <p className="text-pretty">{feature.subtitle}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team — People_collaborating_at.jpeg */}
        <section className="border-b border-white/[0.06] bg-black">
          <div className="container-premium py-16 md:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <ScrollSlideUp className="relative order-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_24px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl lg:order-1">
                <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
                  <Image
                    src="/images/People_collaborating_at.jpeg"
                    alt="Team collaborating"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </ScrollSlideUp>
              <ScrollSlideUp className="order-1 space-y-5 lg:order-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">Team</p>
                <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                  {feature.teamSpotlight.heading}
                </h2>
                <div className="space-y-4 text-[15px] leading-relaxed text-slate-400">
                  {feature.teamSpotlight.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </ScrollSlideUp>
            </div>
          </div>
        </section>

        {/* Workflow — Woman_using_laptop_202604140858.jpg */}
        <section className="border-b border-white/[0.06] bg-black">
          <div className="container-premium py-16 md:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <ScrollSlideUp className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">Workflow</p>
                <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                  {feature.workflowSpotlight.heading}
                </h2>
                <div className="space-y-4 text-[15px] leading-relaxed text-slate-400">
                  {feature.workflowSpotlight.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </ScrollSlideUp>
              <ScrollSlideUp className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_24px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
                  <Image
                    src="/images/Woman_using_laptop_202604140858.jpg"
                    alt="Freelancer workflow on laptop"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </ScrollSlideUp>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-premium max-w-3xl space-y-12">
            {feature.sections.map((section, i) => (
              <ScrollSlideUp key={section.heading} delay={i * 0.06}>
                <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
                  <h2 className="font-display text-2xl font-bold text-white">{section.heading}</h2>
                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((p, j) => (
                      <p key={j} className="text-[15px] leading-relaxed text-slate-300">
                        {p}
                      </p>
                    ))}
                  </div>
                </article>
              </ScrollSlideUp>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 pb-20 pt-4">
          <div className="container-premium flex justify-center">
            <ScrollSlideUp>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#ff6a00] bg-transparent px-8 py-3.5 text-base font-semibold text-white shadow-[0_0_32px_rgba(255,106,0,0.2)] transition hover:bg-[#ff6a00]/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00]"
              >
                <ArrowLeft className="h-5 w-5 text-[#ff6a00]" strokeWidth={2.25} aria-hidden />
                Back to Home
              </Link>
            </ScrollSlideUp>
          </div>
        </section>
      </main>
    </div>
  )
}
