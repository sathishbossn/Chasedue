'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

type ScrollSlideUpProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
} & Omit<HTMLMotionProps<'div'>, 'children' | 'initial' | 'whileInView' | 'viewport'>

export default function ScrollSlideUp({
  children,
  className,
  delay = 0,
  y = 36,
  ...rest
}: ScrollSlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -12% 0px', amount: 0.2 }}
      transition={{ duration: 0.58, ease, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
