/**
 * INR per 1 USD (`NEXT_PUBLIC_INR_PER_USD`).
 * Used everywhere we derive USD from an INR invoice (portal display + `/api/paypal/create-order`).
 */
export function getInrPerUsd(): number {
  const n = Number(process.env.NEXT_PUBLIC_INR_PER_USD)
  if (Number.isFinite(n) && n > 0) return n
  return 83
}

/** Convert INR amount (same units as `invoices.total_amount`) to USD. */
export function inrAmountToUsd(inr: number, inrPerUsd = getInrPerUsd()): number {
  return Number(inr) / inrPerUsd
}

export function formatUsd(amountUsd: number): string {
  if (!Number.isFinite(amountUsd) || amountUsd < 0) return '$0.00'
  return amountUsd.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatUsdFromInr(inr: number, inrPerUsd = getInrPerUsd()): string {
  return formatUsd(inrAmountToUsd(inr, inrPerUsd))
}

function isLemonHost(hostname: string): boolean {
  return hostname === 'lemonsqueezy.com' || hostname.endsWith('.lemonsqueezy.com')
}

/**
 * Parse `NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL` for Lemon hosts.
 * - Prepends `https://` when there is no scheme (e.g. `mystore.lemonsqueezy.com/checkout`).
 * - Resolves scheme-relative URLs (`//…`) to `https://…`.
 */
export function parseLemonCheckoutBase(raw: string): URL | null {
  let t = raw.trim()
  if (!t) return null
  if (t.startsWith('//')) {
    t = `https:${t}`
  }
  try {
    return new URL(t)
  } catch {
    try {
      const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(t)
      return new URL(hasScheme ? t : `https://${t}`)
    } catch {
      return null
    }
  }
}

/**
 * Store subdomain for checkout URL: prefer STORE, then STORE_ID (often the same string in .env).
 */
function lemonStoreSubdomain(): string | null {
  const a = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE?.trim()
  const b = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID?.trim()
  const raw = a || b
  if (!raw) return null
  return raw.replace(/\.lemonsqueezy\.com$/i, '').replace(/^https?:\/\//i, '')
}

/** Normalize variant id to digits-only string, or null. */
export function normalizeLemonVariantId(v: string | null | undefined): string | null {
  if (v == null) return null
  const t = String(v).trim()
  if (!/^\d+$/.test(t)) return null
  return t
}

function lemonVariantIdFromEnv(): string | null {
  return normalizeLemonVariantId(process.env.NEXT_PUBLIC_LEMON_SQUEEZY_VARIANT_ID)
}

/**
 * Set pathname to `/checkout/buy/{variant}` only when the URL does not already include `/checkout/buy/{id}`.
 * Never overwrite an existing variant segment from the dashboard (avoids 404s).
 */
function applyLemonVariantToUrl(u: URL, variant: string): void {
  if (/\/checkout\/buy\/\d+/.test(u.pathname)) {
    return
  }
  u.pathname = `/checkout/buy/${variant}`
}

/**
 * Build Lemon Squeezy checkout URL with invoice tracking.
 *
 * 1) `NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL` — used as-is (Lemon host). Optional variant from invoice/env is merged
 *    into `/checkout/buy/{variant_id}` when provided. Invoice id is always appended as query params (never block
 *    the link if the path is already a full checkout URL from your dashboard).
 * 2) Else: `store` + `variant` from env / invoice builds `https://{store}.lemonsqueezy.com/checkout/buy/{variant}`.
 *
 * Query params: `checkout[custom][invoice_id]`, `invoice_id`
 */
export function buildLemonSqueezyCheckoutUrl(invoiceId: string, invoiceVariantId?: string | null): string | null {
  const variant = normalizeLemonVariantId(invoiceVariantId) ?? lemonVariantIdFromEnv()

  const baseRaw = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL?.trim()
  const store = lemonStoreSubdomain()

  let checkoutBase: string | null = null

  if (baseRaw) {
    const u = parseLemonCheckoutBase(baseRaw)
    if (!u) {
      return null
    }
    if (!isLemonHost(u.hostname)) {
      console.warn('[ChaseDue] Lemon Squeezy URL host does not look like lemonsqueezy.com:', u.hostname)
      return null
    }
    const hasCheckoutBuy = /\/checkout\/buy\/\d+/.test(u.pathname)
    // Do not replace an existing /checkout/buy/{id} from the dashboard — wrong variant → 404.
    if (!hasCheckoutBuy && variant) {
      applyLemonVariantToUrl(u, variant)
    }
    checkoutBase = u.toString()
  } else if (store && variant) {
    checkoutBase = `https://${store}.lemonsqueezy.com/checkout/buy/${variant}`
  } else {
    return null
  }

  const id = invoiceId.trim()
  if (!id) return null

  try {
    const u = new URL(checkoutBase)
    /** Custom data for Lemon checkout overlay + duplicate for app/webhook matching */
    u.searchParams.set('checkout[custom][invoice_id]', id)
    u.searchParams.set('invoice_id', id)
    return u.href
  } catch {
    return null
  }
}
