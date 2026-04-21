/** Base URL for absolute payment/WhatsApp links. Prefer NEXT_PUBLIC_APP_URL in production. */
export function getPublicBaseUrlFromHeaders(h: Readonly<Headers>): string {
  const env = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
  if (env) return env
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'http'
  return host ? `${proto}://${host}` : ''
}

/** Client-only: same resolution rules without `headers()` (App Router client components). */
export function getPublicBaseUrlClient(): string {
  const env = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
  if (env) return env
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
}

/**
 * Live browser origin (e.g. `http://localhost:3000` vs production host) — best for dashboard “copy portal link”.
 */
export function getBrowserOriginForPortalLink(): string {
  if (typeof window === 'undefined') return ''
  return window.location.origin.replace(/\/$/, '')
}

/**
 * Validates a client-supplied origin (http/https only). Returns normalized `https://host` or null.
 */
export function normalizeHttpOrigin(input: string): string | null {
  const t = input.trim()
  if (!t) return null
  try {
    const u = new URL(t.includes('://') ? t : `https://${t}`)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
    return u.origin
  } catch {
    return null
  }
}

/**
 * Absolute URL for WhatsApp “Chase” links (`https://chasedue.in/portal/[id]`).
 * Set `NEXT_PUBLIC_CHASE_PORTAL_ORIGIN=http://localhost:3000` in `.env.local` while testing.
 */
export function getChasePortalUrl(invoiceId: string): string {
  const base = process.env.NEXT_PUBLIC_CHASE_PORTAL_ORIGIN?.replace(/\/$/, '') ?? 'https://chasedue.in'
  return `${base}/portal/${invoiceId}`
}

/** Freelancer / business name shown on the public client portal header. */
export function getPortalBusinessDisplayName(): string {
  const raw = process.env.NEXT_PUBLIC_BUSINESS_DISPLAY_NAME
  const s = typeof raw === 'string' && raw.trim() ? raw.trim() : 'A. Sathish Kumar'
  return s
}
