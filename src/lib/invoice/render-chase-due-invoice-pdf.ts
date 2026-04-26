import { buildInvoicePdfViewModelFromPortalRow } from '@/lib/invoice/build-invoice-pdf-view-model'
import { renderInvoicePdfToBuffer } from '@/lib/invoice/render-invoice-react-pdf'
import type { SupabaseClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

/**
 * Convert logo file to base64 data URL
 */
function getLogoBase64(): string {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo-icon.png')
    const logoBuffer = fs.readFileSync(logoPath)
    return 'data:image/png;base64,' + logoBuffer.toString('base64')
  } catch (error) {
    console.error('Failed to load logo:', error)
    return ''
  }
}

/**
 * Loads invoice via `get_portal_invoice` (works for dashboard + portal contexts)
 * and returns PDF bytes using React PDF implementation.
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
  const logoBase64 = getLogoBase64()
  const buffer = await renderInvoicePdfToBuffer(vm, logoBase64)
  return { buffer, invoiceNumber: vm.invoiceNumber }
}
