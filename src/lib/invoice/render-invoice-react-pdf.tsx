import { renderToBuffer } from '@react-pdf/renderer'
import { InvoicePdfDocument } from '@/components/invoice-pdf/invoice-pdf-document'
import type { InvoicePdfViewModel } from '@/lib/invoice/invoice-pdf-types'

export async function renderInvoicePdfToBuffer(
  data: InvoicePdfViewModel,
  logoUrl: string
): Promise<Buffer> {
  const element = <InvoicePdfDocument data={data} logoUrl={logoUrl} />
  const buf = await renderToBuffer(element)
  return Buffer.from(buf)
}
