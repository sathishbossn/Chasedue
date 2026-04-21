/**
 * GST state / UT codes (first 2 digits of GSTIN) → display name.
 * Source: CBIC (updated for state reorganisations where applicable).
 */
export const GST_STATE_CODE_TO_NAME: Record<string, string> = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '26': 'Dadra and Nagar Haveli and Daman and Diu',
  '25': 'Daman and Diu', // legacy; merged — keep for old GSTINs
  '27': 'Karnataka',
  '29': 'Kerala',
  '30': 'Lakshadweep',
  '31': 'Goa',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman and Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
  '38': 'Ladakh',
  '97': 'Other Territory',
  '99': 'Centre Jurisdiction',
}

export function gstStateNameFromCode(code: string | null | undefined): string | null {
  if (code == null) return null
  const k = String(code).trim().padStart(2, '0').slice(0, 2)
  return GST_STATE_CODE_TO_NAME[k] ?? null
}

/** First two digits of 15-char GSTIN → state code string "33". */
export function gstinPrefixStateCode(gstin: string | null | undefined): string | null {
  if (gstin == null) return null
  const t = String(gstin).trim().toUpperCase().replace(/\s/g, '')
  if (t.length < 2 || !/^\d{2}/.test(t)) return null
  return t.slice(0, 2)
}

/**
 * "Place of Supply: Tamil Nadu (33)" for PDF — supplier’s registered state from GSTIN, else profile state_code.
 */
const DEFAULT_PLACE_OF_SUPPLY = 'Place of Supply: Tamil Nadu (33)'

export function formatPlaceOfSupplyLine(args: {
  sellerGstin: string | null | undefined
  sellerStateCodeFallback: string | null | undefined
}): string {
  const fromGstin = gstinPrefixStateCode(args.sellerGstin ?? null)
  const raw = String(args.sellerStateCodeFallback ?? '').trim()
  const padded = raw.padStart(2, '0').slice(0, 2)
  const code = (fromGstin ?? (raw ? padded : '')) || null
  if (!code || code === '00') return DEFAULT_PLACE_OF_SUPPLY
  const name = gstStateNameFromCode(code)
  if (!name) return DEFAULT_PLACE_OF_SUPPLY
  return `Place of Supply: ${name} (${code})`
}
