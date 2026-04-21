'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'

type Props = {
  /** Main headline below the animated checkmark. */
  title?: string
  className?: string
}

/**
 * Green checkmark in a circle (Framer Motion ripple + spring) + success title — portal / post-checkout.
 */
export default function PaymentSuccess({ title = 'Payment Successful!', className = '' }: Props) {
  const reduceMotion = useReducedMotion()

  return (
    <div className={`relative flex flex-col items-center text-center ${className}`}>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.12] blur-3xl"
        aria-hidden
      />

      <div className="relative flex h-28 w-28 items-center justify-center" aria-hidden>
        {!reduceMotion && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={false}
          >
            <motion.div
              className="h-24 w-24 rounded-full border-2 border-emerald-400/55"
              initial={{ scale: 0.45, opacity: 0.55 }}
              animate={{ scale: 1.85, opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        )}
        <motion.div
          initial={{ scale: 0, rotate: -22 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: reduceMotion ? 520 : 340,
            damping: reduceMotion ? 28 : 18,
            delay: reduceMotion ? 0 : 0.08,
          }}
          className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/15 shadow-[0_0_0_1px_rgba(52,211,153,0.35),0_20px_50px_-12px_rgba(6,78,59,0.55)] ring-2 ring-emerald-400/45"
        >
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 22,
              delay: reduceMotion ? 0 : 0.22,
            }}
            className="inline-flex"
          >
            <Check className="h-12 w-12 text-emerald-300" strokeWidth={2.5} />
          </motion.span>
        </motion.div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 font-display text-2xl font-bold text-white sm:text-3xl"
      >
        {title}
      </motion.h2>
    </div>
  )
}
