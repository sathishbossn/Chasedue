import fs from 'fs'
import { jsPDF } from 'jspdf'
import { sanitizeMoneyTextForPdf } from '@/lib/invoice/jspdf-currency'

const ORANGE: [number, number, number] = [249, 115, 22]

export type ReceiptPdfPayload = {
  invoiceId: string
  invoiceRefShort: string
  amountFormatted: string
  currency: string
  paymentMethodLabel: string
  businessName: string
  clientLabel: string
  paidAtIso?: string
}

/** Payment receipt PDF — jsPDF only (no Chromium). */
export function writeReceiptPdfFile(outPath: string, p: ReceiptPdfPayload): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 16
  let y = margin

  doc.setFillColor(...ORANGE)
  doc.rect(0, 0, pageW, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('ChaseDue', margin, 12)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Payment receipt', margin, 20)

  y = 38
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Payment Successful', margin, y)
  y += 10

  const paidAt =
    p.paidAtIso != null
      ? new Date(p.paidAtIso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      : new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

  const boxTop = y
  const boxPad = 6
  y += boxPad + 2
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(100, 116, 139)
  doc.setFontSize(7.5)
  doc.text('INVOICE ID', margin + boxPad, y)
  y += 6
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(13)
  const idLines = doc.splitTextToSize(String(p.invoiceId), pageW - margin * 2 - boxPad * 2)
  doc.text(idLines, margin + boxPad, y)
  y += 8 + (idLines.length - 1) * 6

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(100, 116, 139)
  doc.setFontSize(7.5)
  doc.text('AMOUNT', margin + boxPad, y)
  y += 6
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(249, 115, 22)
  doc.setFontSize(16)
  doc.text(`${sanitizeMoneyTextForPdf(p.amountFormatted)} ${p.currency}`, margin + boxPad, y)
  y += 12

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(100, 116, 139)
  doc.setFontSize(7.5)
  doc.text('DATE', margin + boxPad, y)
  y += 6
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(12)
  doc.text(paidAt, margin + boxPad, y)
  y += 10

  const boxBottom = y + boxPad
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.35)
  doc.roundedRect(margin, boxTop, pageW - margin * 2, boxBottom - boxTop, 3, 3, 'S')

  y = boxBottom + 10

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(5, 150, 105)
  doc.setFontSize(11)
  doc.text('Status: Paid', margin, y)
  y += 12

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)
  doc.text('Additional details', margin, y)
  y += 6

  const secondary: [string, string][] = [
    ['Reference', `INV-${p.invoiceRefShort}`],
    ['Business', p.businessName],
    ['Bill to', p.clientLabel],
    ['Payment method', p.paymentMethodLabel],
  ]

  for (const [label, value] of secondary) {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(8)
    doc.text(label.toUpperCase(), margin, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(15, 23, 42)
    doc.setFontSize(10)
    const lines2 = doc.splitTextToSize(String(value), pageW - margin * 2)
    doc.text(lines2, margin, y)
    y += 6 + (lines2.length - 1) * 5
  }

  y += 4
  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)
  doc.text('Thank you for your payment. — ChaseDue', pageW / 2, y, { align: 'center' })

  const buf = doc.output('arraybuffer')
  fs.writeFileSync(outPath, Buffer.from(buf))
}
