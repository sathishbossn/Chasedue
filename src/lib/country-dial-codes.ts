/** Common dial codes for WhatsApp / phone inputs (E.164-style prefix). */
export const DEFAULT_PHONE_DIAL = '+91'

export const PHONE_DIAL_OPTIONS: { label: string; value: string }[] = [
  { label: 'India (+91)', value: '+91' },
  /** NANP — US and Canada share +1; keep a single option to avoid duplicate React keys. */
  { label: 'United States / Canada (+1)', value: '+1' },
  { label: 'United Kingdom (+44)', value: '+44' },
  { label: 'United Arab Emirates (+971)', value: '+971' },
  { label: 'Singapore (+65)', value: '+65' },
  { label: 'Australia (+61)', value: '+61' },
  { label: 'Germany (+49)', value: '+49' },
  { label: 'France (+33)', value: '+33' },
  { label: 'Manual — full international number', value: '__full__' },
]
