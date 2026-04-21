import { DEFAULT_PHONE_DIAL, PHONE_DIAL_OPTIONS } from '@/lib/country-dial-codes'

/** Combine dial prefix and local digits into a single string for storage (phone / whatsapp_number). */
export function combineDialAndLocal(dial: string, localRaw: string): string {
  const dialClean = dial.replace(/\s/g, '').trim() || '+91'
  const localDigits = localRaw.replace(/\D/g, '')
  if (!localDigits) return ''
  const prefix = dialClean.startsWith('+') ? dialClean : `+${dialClean}`
  return `${prefix}${localDigits}`
}

/**
 * Split stored E.164-ish value back into dial + local for the client form, or fall back to "manual full".
 */
export function parseStoredPhoneForForm(stored: string | null | undefined):
  | { mode: 'split'; dial: string; local: string }
  | { mode: 'full'; full: string } {
  const raw = (stored ?? '').trim().replace(/\s/g, '')
  if (!raw) {
    return { mode: 'split', dial: DEFAULT_PHONE_DIAL, local: '' }
  }
  const normalized = raw.startsWith('+') ? raw : `+${raw.replace(/\D/g, '')}`
  const withoutPlus = normalized.slice(1).replace(/\D/g, '')

  const codes = PHONE_DIAL_OPTIONS.map((o) => o.value).filter((v) => v !== '__full__')
  const sorted = [...new Set(codes)].sort((a, b) => b.replace(/\D/g, '').length - a.replace(/\D/g, '').length)

  for (const code of sorted) {
    const cDigits = code.replace(/\D/g, '')
    if (cDigits && withoutPlus.startsWith(cDigits)) {
      const rest = withoutPlus.slice(cDigits.length)
      return { mode: 'split', dial: code, local: rest }
    }
  }

  return { mode: 'full', full: normalized }
}
