/**
 * Hero 3D feature story — maps product surfaces to narrative copy.
 * Image files: use /public/images (Next static). Repo uses dashboard.jpeg / expenses.png
 * where the brief references dashboard.jpg / expenses.jpg — same assets, on-disk extensions.
 */
export type FeatureScreen = {
  id: string
  /** Public URL under /public */
  src: string
  title: string
  subtext: string
  alt: string
}

export const FEATURE_SCREENS: FeatureScreen[] = [
  {
    id: 'dashboard',
    src: '/images/dashboard.jpeg',
    title: 'Track Cashflow',
    subtext: 'Revenue, overdue balances, and what’s next — one live command center.',
    alt: 'ChaseDue dashboard',
  },
  {
    id: 'expenses',
    src: '/images/expenses.png',
    title: 'Capture Spend',
    subtext: 'Log expenses and categories the moment they happen — no extra tab dance.',
    alt: 'ChaseDue expenses',
  },
  {
    id: 'clients',
    src: '/images/clients.png',
    title: 'Client Relationships',
    subtext: 'Contacts, notes, and history in one place so nothing slips through.',
    alt: 'ChaseDue clients',
  },
  {
    id: 'invoices',
    src: '/images/invoices.png',
    title: 'Invoice Faster',
    subtext: 'Polished PDFs, clear statuses, and payment links that actually get paid.',
    alt: 'ChaseDue invoices',
  },
  {
    id: 'analytics',
    src: '/images/analytics.png',
    title: 'See the Story',
    subtext: 'Charts that turn activity into decisions — not just pretty graphs.',
    alt: 'ChaseDue analytics',
  },
]
