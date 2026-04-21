/**
 * PayPal REST (server) — OAuth + Orders API.
 * Set NEXT_PUBLIC_PAYPAL_CLIENT_ID + PAYPAL_CLIENT_SECRET (or PAYPAL_SECRET alias).
 * Environment: NEXT_PUBLIC_PAYPAL_ENV or PAYPAL_ENV — `live` uses production API; otherwise sandbox.
 */

function paypalEnvIsLive(): boolean {
  const pub = process.env.NEXT_PUBLIC_PAYPAL_ENV?.trim().toLowerCase()
  if (pub === 'live' || pub === 'production') return true
  if (pub === 'sandbox' || pub === 'test' || pub === 'development') return false
  return process.env.PAYPAL_ENV?.trim().toLowerCase() === 'live'
}

function apiBase(): string {
  if (process.env.PAYPAL_API_BASE?.trim()) return process.env.PAYPAL_API_BASE.trim().replace(/\/$/, '')
  return paypalEnvIsLive() ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
}

export function clientCredentials(): { id: string; secret: string } | null {
  const id = (process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID)?.trim()
  const secret = (process.env.PAYPAL_CLIENT_SECRET || process.env.PAYPAL_SECRET)?.trim()
  if (!id || !secret) return null
  return { id, secret }
}

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getPayPalAccessToken(): Promise<string> {
  const cred = clientCredentials()
  if (!cred) throw new Error('PayPal client credentials are not configured.')

  const now = Date.now() / 1000
  if (cachedToken && cachedToken.expiresAt > now + 60) {
    return cachedToken.token
  }

  const base = apiBase()
  const auth = Buffer.from(`${cred.id}:${cred.secret}`).toString('base64')
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const data = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error_description?: string }
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description ?? `PayPal OAuth failed (${res.status}).`)
  }
  const expiresIn = typeof data.expires_in === 'number' ? data.expires_in : 300
  cachedToken = { token: data.access_token, expiresAt: now + expiresIn }
  return data.access_token
}

export async function paypalFetch(path: string, init: RequestInit): Promise<Response> {
  const token = await getPayPalAccessToken()
  const base = apiBase()
  return fetch(`${base}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })
}
