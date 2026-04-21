/**
 * Indian states / UTs for GST “place of supply” (client billing address).
 * Default matches ChaseDue business assumptions in `get-tax-breakdown.ts`.
 */
export const DEFAULT_CLIENT_STATE = 'Tamil Nadu'

const REST_ALPHABETICAL = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const

/** Tamil Nadu first, then the rest alphabetically (Tamil Nadu deduped). */
export const INDIAN_STATE_OPTIONS: readonly string[] = [
  DEFAULT_CLIENT_STATE,
  ...REST_ALPHABETICAL.filter((s) => s !== DEFAULT_CLIENT_STATE),
]
