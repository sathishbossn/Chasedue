import { writeReceiptPdfFile } from '@/lib/invoice/receipt-pdf-jspdf'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import os from 'os'
import path from 'path'

type Body = {
  invoiceId?: string
  invoiceRefShort?: string
  amountFormatted?: string
  currency?: string
  paymentMethodLabel?: string
  businessName?: string
  clientLabel?: string
  paidAtIso?: string
}

export async function POST(req: NextRequest) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const invoiceId = String(body.invoiceId ?? '').trim()
  const invoiceRefShort = String(body.invoiceRefShort ?? '').trim()
  if (!invoiceId || !invoiceRefShort) {
    return NextResponse.json({ error: 'invoiceId and invoiceRefShort are required.' }, { status: 400 })
  }

  const payload: Required<Body> = {
    invoiceId,
    invoiceRefShort,
    amountFormatted: String(body.amountFormatted ?? '—'),
    currency: String(body.currency ?? 'INR'),
    paymentMethodLabel: String(body.paymentMethodLabel ?? '—'),
    businessName: String(body.businessName ?? '—'),
    clientLabel: String(body.clientLabel ?? '—'),
    paidAtIso: body.paidAtIso != null ? String(body.paidAtIso) : new Date().toISOString(),
  }

  const tmpPath = path.join(os.tmpdir(), `receipt-${invoiceRefShort}-${Date.now()}.pdf`)
  writeReceiptPdfFile(tmpPath, payload)
  const pdfBuffer = fs.readFileSync(tmpPath)
  fs.unlinkSync(tmpPath)

  const safe = invoiceRefShort.replace(/[^\w.\-]+/g, '_').slice(0, 40)

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ChaseDue-receipt-${safe}.pdf"`,
    },
  })
}
