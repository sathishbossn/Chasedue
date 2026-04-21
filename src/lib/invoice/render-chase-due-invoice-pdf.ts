import { buildInvoicePdfViewModelFromPortalRow } from '@/lib/invoice/build-invoice-pdf-view-model'
import { getInvoicePdfLogoIconUrl } from '@/lib/invoice/invoice-pdf-logo'
import { renderInvoicePdfToBuffer } from '@/lib/invoice/render-invoice-react-pdf'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Loads invoice via `get_portal_invoice` (works for dashboard + portal contexts)
 * and returns PDF bytes.
 */
export async function renderChaseDueInvoicePdf(
  supabase: SupabaseClient,
  invoiceId: string
): Promise<{ buffer: Buffer; invoiceNumber: string }> {
  const { data, error } = await supabase.rpc('get_portal_invoice', { p_invoice_id: invoiceId })
  if (error) {
    throw new Error(error.message || 'Invoice lookup failed')
  }
  const row = data?.[0] as Record<string, unknown> | undefined
  if (!row) {
    throw new Error('Invoice not found')
  }
  const vm = buildInvoicePdfViewModelFromPortalRow(row)
  const logoUrl = getInvoicePdfLogoIconUrl()
  const buffer = await renderInvoicePdfToBuffer(vm, logoUrl)
  return { buffer, invoiceNumber: vm.invoiceNumber }
}
