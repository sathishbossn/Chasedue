export const FEATURE_SLUGS = ['dashboard', 'clients', 'whatsapp', 'analytics'] as const
export type FeatureSlug = (typeof FEATURE_SLUGS)[number]

/** Serializable icon key — map to Lucide in client components only */
export type FeatureIconId = 'dashboard' | 'clients' | 'whatsapp' | 'analytics'

export type FeatureCard = {
  slug: FeatureSlug
  title: string
  shortDescription: string
  icon: FeatureIconId
  previewSrc?: string
}

export type FeatureDeepDive = FeatureCard & {
  subtitle: string
  lifestyleHeroSrc: string
  heroAlt: string
  uiShot?: { src: string; alt: string }
  sections: { heading: string; paragraphs: string[] }[]
  teamSpotlight: { heading: string; paragraphs: string[] }
  workflowSpotlight: { heading: string; paragraphs: string[] }
}

export const FEATURE_DEEP_DIVES: FeatureDeepDive[] = [
  {
    slug: 'dashboard',
    title: 'Centralized Control',
    shortDescription:
      'One dashboard for invoices, statuses, and cash flow — see what moved and what needs a nudge.',
    subtitle:
      'Your ChaseDue dashboard is the single place to understand what moved, what’s stuck, and what to chase next.',
    icon: 'dashboard',
    previewSrc: '/images/Woman_using_laptop.jpeg',
    lifestyleHeroSrc: '/images/Woman_using_laptop_202604140858.jpg',
    heroAlt: 'Freelancer reviewing work on a laptop',
    uiShot: {
      src: '/images/dashboard.jpeg',
      alt: 'ChaseDue dashboard showing revenue and invoice statuses',
    },
    teamSpotlight: {
      heading: 'Team, meet the numbers',
      paragraphs: [
        'Finance and delivery stay aligned when everyone references the same dashboard — not screenshots in random threads.',
        'Shareable clarity means fewer “which version?” moments and faster sign-off on what’s due.',
      ],
    },
    workflowSpotlight: {
      heading: 'Workflow that respects your week',
      paragraphs: [
        'ChaseDue is built around how you actually work: quick scans between meetings, deep dives when you need them.',
        'Statuses update as money moves, so your next action is obvious — not buried in a spreadsheet.',
      ],
    },
    sections: [
      {
        heading: 'Why it matters',
        paragraphs: [
          'Invoices scattered across email and chat make it hard to answer the one question that matters: who still owes you, and by how much?',
          'ChaseDue pulls statuses, amounts, and timelines into a layout you can scan in seconds — not after exporting CSVs.',
        ],
      },
      {
        heading: 'What you’ll use daily',
        paragraphs: [
          'At-a-glance totals for the month with gentle trend cues so you notice drift before it becomes a crunch.',
          'Invoice rows that respect how you work: GST lines, client names, and delivery channels without opening five tabs.',
        ],
      },
      {
        heading: 'Built for focus',
        paragraphs: [
          'Glass panels and high-contrast type keep the interface calm when your week isn’t — clarity you can trust.',
        ],
      },
    ],
  },
  {
    slug: 'clients',
    title: 'Client Management',
    shortDescription:
      'Keep conversations tied to the invoice — finance, delivery, and your client stay aligned.',
    subtitle:
      'ChaseDue makes team–client communication feel intentional: everyone sees the same numbers and the same next step.',
    icon: 'clients',
    previewSrc: '/images/People_collaborating_at.jpeg',
    lifestyleHeroSrc: '/images/People_collaborating_at.jpeg',
    heroAlt: 'Team collaborating around a table',
    uiShot: {
      src: '/images/clients.png',
      alt: 'ChaseDue clients view',
    },
    teamSpotlight: {
      heading: 'One conversation, one source of truth',
      paragraphs: [
        'When your team and client can point at the same invoice state, debates shrink and decisions speed up.',
        'ChaseDue keeps context where finance expects it — without losing the human tone your relationships need.',
      ],
    },
    workflowSpotlight: {
      heading: 'From kickoff to paid',
      paragraphs: [
        'Handoffs are where projects stall. ChaseDue ties milestones to billing so “done” and “paid” stay connected.',
        'Your workflow stays in flow — fewer status meetings, more shipped work.',
      ],
    },
    sections: [
      {
        heading: 'Shared truth',
        paragraphs: [
          'When estimates, revisions, and approvals live in separate chats, invoices become arguments instead of confirmations.',
          'ChaseDue anchors discussion to the document clients already expect — the invoice — so questions route to facts.',
        ],
      },
      {
        heading: 'Polite by design',
        paragraphs: [
          'Reminders and updates read like a human nudge, not a collections blast. That protects relationships while keeping velocity.',
        ],
      },
    ],
  },
  {
    slug: 'whatsapp',
    title: 'Automated Chasing',
    shortDescription:
      'GST-ready PDFs and reminders on WhatsApp — high read rates without sounding robotic.',
    subtitle:
      'Meet clients where they already reply. ChaseDue formats every message for mobile-first reading.',
    icon: 'whatsapp',
    previewSrc: '/images/Woman_smartphone_chasedue_portrait.png',
    lifestyleHeroSrc: '/images/Woman_smartphone_chasedue_portrait.png',
    heroAlt: 'Person reading a message on a smartphone',
    uiShot: {
      src: '/images/invoices.png',
      alt: 'ChaseDue invoice preview on mobile',
    },
    teamSpotlight: {
      heading: 'Team visibility, client simplicity',
      paragraphs: [
        'Your crew can see what went out and what bounced — without exposing internal noise to the client.',
        'Shared visibility on delivery means nobody duplicates pings or contradicts the story.',
      ],
    },
    workflowSpotlight: {
      heading: 'Workflow that matches real life',
      paragraphs: [
        'You’re rarely at a desk when a client says “send the invoice.” ChaseDue fits that rhythm — send, track, nudge, from one place.',
        'The workflow stays lightweight so WhatsApp stays a convenience, not a chore.',
      ],
    },
    sections: [
      {
        heading: 'Surface area for payment',
        paragraphs: [
          'Email inboxes overflow; WhatsApp threads get attention. ChaseDue uses that habit to put invoices in front of eyes, not spam folders.',
        ],
      },
      {
        heading: 'Scheduled, not spammy',
        paragraphs: [
          'Cadence-aware nudges keep tone professional. You set the rhythm; ChaseDue handles the polite follow-through.',
        ],
      },
    ],
  },
  {
    slug: 'analytics',
    title: 'Revenue Insights',
    shortDescription:
      'Trends, concentration risk, and collection health — visualized so you can act this week.',
    subtitle:
      'Turn ledger noise into a narrative: who pays fast, who stalls, and where your revenue actually comes from.',
    icon: 'analytics',
    previewSrc: '/images/analytics.png',
    lifestyleHeroSrc: '/images/Woman_using_laptop_202604140858.jpg',
    heroAlt: 'Professional reviewing analytics on a laptop',
    uiShot: {
      src: '/images/analytics.png',
      alt: 'ChaseDue analytics charts',
    },
    teamSpotlight: {
      heading: 'Align the room around the trend',
      paragraphs: [
        'When analytics are legible, your team spends less time debating what happened and more time fixing it.',
        'ChaseDue keeps charts tied to invoices and clients — not abstract vanity metrics.',
      ],
    },
    workflowSpotlight: {
      heading: 'Workflow from insight to invoice',
      paragraphs: [
        'Spot the slowdown early, then act: follow up, re-scope, or re-sequence — without leaving the app.',
        'That’s workflow as a loop, not a quarterly report.',
      ],
    },
    sections: [
      {
        heading: 'From totals to tactics',
        paragraphs: [
          'Seeing revenue is easy; understanding behavior is harder. ChaseDue charts help you compare periods and spot slowdowns early.',
        ],
      },
      {
        heading: 'Decisions, not dashboards',
        paragraphs: [
          'Every visualization ties back to action: follow up, re-price, or re-sequence clients. Less vanity, more velocity.',
        ],
      },
    ],
  },
]

const bySlug = Object.fromEntries(FEATURE_DEEP_DIVES.map((f) => [f.slug, f])) as Record<
  FeatureSlug,
  FeatureDeepDive
>

export function getFeatureBySlug(slug: string): FeatureDeepDive | undefined {
  if (!FEATURE_SLUGS.includes(slug as FeatureSlug)) return undefined
  return bySlug[slug as FeatureSlug]
}

export function getFeatureCardsForHome(): FeatureCard[] {
  return FEATURE_DEEP_DIVES.map(({ slug, title, shortDescription, icon, previewSrc }) => ({
    slug,
    title,
    shortDescription,
    icon,
    previewSrc,
  }))
}
