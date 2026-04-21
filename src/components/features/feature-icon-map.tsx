'use client'

import type { LucideIcon } from 'lucide-react'
import { BarChart3, LayoutDashboard, MessageCircle, Users } from 'lucide-react'
import type { FeatureIconId } from '@/lib/feature-pages'

export const FEATURE_LUCIDE_ICONS: Record<FeatureIconId, LucideIcon> = {
  dashboard: LayoutDashboard,
  clients: Users,
  whatsapp: MessageCircle,
  analytics: BarChart3,
}
