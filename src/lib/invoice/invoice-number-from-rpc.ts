/**
 * `get_next_invoice_number` may be `RETURNS text` (scalar), `RETURNS TABLE (invoice_number text)`,
 * or a single object — never use `.single()` on `.rpc()` for this call.
 */
export function invoiceNumberFromRpcData(data: unknown): string | null {
  if (data == null) return null
  if (typeof data === 'string') {
    const t = data.trim()
    return t || null
  }
  const invoiceNumber = Array.isArray(data)
    ? (data[0] as { invoice_number?: unknown } | undefined)?.invoice_number
    : (data as { invoice_number?: unknown } | undefined)?.invoice_number
  if (typeof invoiceNumber === 'string' && invoiceNumber.trim()) return invoiceNumber.trim()
  return null
}
