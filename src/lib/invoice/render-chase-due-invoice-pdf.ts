import { buildInvoicePdfViewModelFromPortalRow } from '@/lib/invoice/build-invoice-pdf-view-model'
import { renderInvoiceJsPdf } from '@/lib/invoice/render-invoice-js-pdf'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Loads invoice via `get_portal_invoice` (works for dashboard + portal contexts)
 * and returns PDF bytes using jsPDF implementation.
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
  const buffer = await renderInvoiceJsPdf(vm)
  return { buffer, invoiceNumber: vm.invoiceNumber }
}
