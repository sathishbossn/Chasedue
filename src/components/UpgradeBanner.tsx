'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, X, Sparkles } from 'lucide-react'

interface UpgradeBannerProps {
  daysLeft: number
  onUpgradeClick: () => void
}

const BANNER_DISMISSED_KEY = 'cd_banner_dismissed'

export function UpgradeBanner({ daysLeft, onUpgradeClick }: UpgradeBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY)
    if (dismissed === 'true') {
      setIsDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true')
    setIsDismissed(true)
  }

  if (isDismissed) return null

  const getBannerText = () => {
    if (daysLeft === 0) {
      return 'Your free trial has ended — WhatsApp reminders will stop. Upgrade to keep getting paid on time.'
    }
    if (daysLeft === 1) {
      return 'Your free trial ends tomorrow — WhatsApp reminders will stop. Upgrade to keep getting paid on time.'
    }
    return `Your free trial ends in ${daysLeft} days — WhatsApp reminders will stop. Upgrade to keep getting paid on time.`
  }

  return (
    <div className="mb-6 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-4 shadow-lg shadow-orange-500/10 backdrop-blur-md sm:px-6">
      <div className="flex items-start gap-3 sm:items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
          <AlertTriangle className="h-5 w-5 text-orange-400" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-relaxed text-white/90">
            {getBannerText()}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onUpgradeClick}
              className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition hover:bg-orange-600"
            >
              <Sparkles className="h-4 w-4" />
              Upgrade Now
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-sm font-medium text-white/60 transition hover:text-white/90"
            >
              Maybe later
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="ml-2 shrink-0 rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white/80"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
