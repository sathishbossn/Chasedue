import jsPDF from 'jspdf'
import type { InvoicePdfViewModel } from '@/lib/invoice/invoice-pdf-types'

/**
 * Format currency for display
 */
function fmt(n: number): string {
  return 'Rs. ' + new Intl.NumberFormat('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(n)
}

/**
 * Format rate label
 */
function formatRateLabel(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '0'
  const r = Math.round(n * 10) / 10
  if (Number.isInteger(r)) return String(r)
  return r.toFixed(1)
}

/**
 * Fetch and convert logo to base64
 */
async function getLogoBase64(): Promise<string> {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'logo-icon.png'),
      path.join(process.cwd(), 'public', 'logo.png'),
      path.join(process.cwd(), 'public', 'images', 'logo-icon.png'),
    ]
    
    for (const logoPath of possiblePaths) {
      try {
        const logoBuffer = await fs.readFile(logoPath)
        return `data:image/png;base64,${logoBuffer.toString('base64')}`
      } catch (e) {
        // Continue to next path
      }
    }
    
    throw new Error('Logo file not found')
  } catch (error) {
    console.error('Failed to load logo:', error)
    return ''
  }
}

/**
 * Render invoice PDF using jsPDF with Zoho-style premium layout
 */
export async function renderInvoiceJsPdf(
  data: InvoicePdfViewModel
): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  
  // 15mm margins all sides
  const margin = 15
  const contentWidth = pageWidth - (margin * 2)
  let yPosition = margin

  // Colors
  const ORANGE = '#F97316'
  const DARK = '#1a1a1a'
  const GRAY = '#6b7280'
  const LIGHT_GRAY = '#fafafa'
  const BORDER = '#e5e7eb'

  // Set default font
  doc.setFont('helvetica')

  // SECTION 1 — HEADER
  // Left side: Logo + Business Info
  const logoBase64 = await getLogoBase64()
  if (logoBase64) {
    try {
      // 40x40px circle logo
      doc.addImage(logoBase64, 'PNG', margin, yPosition, 10, 10)
    } catch (error) {
      console.error('Failed to add logo to PDF:', error)
    }
  }

  // Business name in orange bold (only if valid)
  const businessName = data.seller.businessName
  const hasValidBusinessName = businessName && businessName.trim() !== '' && businessName !== 'Seller'
  if (hasValidBusinessName) {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(ORANGE)
    doc.text(businessName, margin, yPosition + 14)
    yPosition += 18
  } else {
    yPosition += 10
  }

  // Address lines
  doc.setFontSize(8)
  doc.setTextColor(DARK)
  doc.setFont('helvetica', 'normal')
  
  if (data.seller.address) {
    const addressLines = doc.splitTextToSize(data.seller.address, 60)
    addressLines.forEach((line: string) => {
      doc.text(line, margin, yPosition)
      yPosition += 3.5
    })
  }
  
  if (data.seller.gstin && data.seller.gstin !== '—') {
    doc.text(`GSTIN: ${data.seller.gstin}`, margin, yPosition)
    yPosition += 3.5
  }
  
  // Email | Phone on same line
  const contactParts = []
  if (data.seller.email) contactParts.push(data.seller.email)
  if (data.seller.phone) contactParts.push(data.seller.phone)
  if (contactParts.length > 0) {
    doc.text(contactParts.join(' | '), margin, yPosition)
    yPosition += 3.5
  }

  // Right side: Invoice details
  const rightX = pageWidth - margin
  yPosition = margin + 5

  // "INVOICE" in large bold orange
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(ORANGE)
  doc.text('INVOICE', rightX, yPosition, { align: 'right' })

  yPosition += 8

  // Invoice number
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(DARK)
  doc.text(`# ${data.invoiceNumber}`, rightX, yPosition, { align: 'right' })

  yPosition += 6

  // Balance Due section
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(GRAY)
  doc.text('Balance Due', rightX, yPosition, { align: 'right' })

  yPosition += 5

  // Grand total amount
  const isPaid = data.status === 'PAID' || data.status === 'SETTLED' || data.status === 'COMPLETED'
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(DARK)
  doc.text(fmt(data.grandTotal), rightX, yPosition, { align: 'right' })

  yPosition += 10

  // SECTION 2 — BILL TO + META with orange divider
  yPosition = Math.max(yPosition, margin + 35) // Ensure we're past the header

  // Orange divider line
  doc.setDrawColor(ORANGE)
  doc.setLineWidth(0.5)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)

  yPosition += 8

  // Left column: Bill To
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(GRAY)
  doc.text('Bill To', margin, yPosition)

  yPosition += 4

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(ORANGE)
  doc.text(data.client.name, margin, yPosition)

  yPosition += 4

  doc.setFontSize(8)
  doc.setTextColor(DARK)
  doc.setFont('helvetica', 'normal')
  
  if (data.client.address) {
    const clientAddressLines = doc.splitTextToSize(data.client.address, 60)
    clientAddressLines.forEach((line: string) => {
      doc.text(line, margin, yPosition)
      yPosition += 3.5
    })
  }
  
  if (data.client.gstin) {
    doc.text(`GSTIN: ${data.client.gstin}`, margin, yPosition)
    yPosition += 3.5
  }

  // Right column: Meta info
  const metaY = yPosition - (data.client.address ? 7 : 4) // Adjust based on content
  yPosition = margin + 43 // Reset to proper position

  const metaItems = [
    ['Invoice Date:', data.invoiceDate],
    ['Due Date:', data.dueDate],
    ['Place of Supply:', data.placeOfSupplyShort],
    ['Terms:', 'Due on Receipt'],
  ]

  metaItems.forEach(([label, value]) => {
    doc.setFontSize(7)
    doc.setTextColor(GRAY)
    doc.setFont('helvetica', 'normal')
    doc.text(label, rightX - 35, yPosition, { align: 'right' })
    
    doc.setFontSize(8)
    doc.setTextColor(DARK)
    doc.text(value, rightX, yPosition, { align: 'right' })
    
    yPosition += 4
  })

  yPosition += 6

  // SECTION 3 — ITEMS TABLE
  const tableY = yPosition
  const colWidths = {
    num: 8,
    desc: contentWidth - 40,
    qty: 12,
    rate: 18,
    amount: 18,
  }

  // Table header with orange background
  const headerHeight = 6
  doc.setFillColor(ORANGE)
  doc.setDrawColor(ORANGE)
  doc.rect(margin, yPosition, contentWidth, headerHeight, 'FD')

  doc.setFontSize(8)
  doc.setTextColor('#ffffff')
  doc.setFont('helvetica', 'bold')
  
  let x = margin + 2
  doc.text('#', x, yPosition + 4)
  x += colWidths.num
  doc.text('Item & Description', x, yPosition + 4)
  x += colWidths.desc
  doc.text('Qty', x + 6, yPosition + 4, { align: 'right' })
  x += colWidths.qty
  doc.text('Rate', x + 9, yPosition + 4, { align: 'right' })
  x += colWidths.rate
  doc.text('Amount', x + 9, yPosition + 4, { align: 'right' })

  yPosition += headerHeight

  // Table rows with alternating colors
  const rowHeight = 6
  data.lineItems.forEach((item, index) => {
    // Alternating row background
    if (index % 2 === 1) {
      doc.setFillColor(LIGHT_GRAY)
      doc.rect(margin, yPosition, contentWidth, rowHeight, 'F')
    }
    
    // Bottom border
    doc.setDrawColor(BORDER)
    doc.setLineWidth(0.3)
    doc.line(margin, yPosition + rowHeight, pageWidth - margin, yPosition + rowHeight)

    // Row content
    doc.setFontSize(8)
    doc.setTextColor(DARK)
    doc.setFont('helvetica', 'normal')
    
    x = margin + 2
    doc.text(String(index + 1), x, yPosition + 4)
    x += colWidths.num
    
    const description = item.description === 'nil' ? 'Professional Services' : item.description
    doc.text(description, x, yPosition + 4)
    x += colWidths.desc
    
    doc.text(String(item.qty), x + 6, yPosition + 4, { align: 'right' })
    x += colWidths.qty
    
    doc.text(fmt(item.rate), x + 9, yPosition + 4, { align: 'right' })
    x += colWidths.rate
    
    doc.text(fmt(item.amount), x + 9, yPosition + 4, { align: 'right' })

    yPosition += rowHeight
  })

  yPosition += 8

  // SECTION 4 — TOTALS (right side)
  const totalsWidth = 50
  const totalsX = pageWidth - margin - totalsWidth
  const totalsY = yPosition

  const totals = [
    ['Sub Total', data.taxableValue],
    ...(data.taxType === 'intra' 
      ? [
          [`CGST @ ${formatRateLabel(data.cgstRate)}%`, data.cgstAmount],
          [`SGST @ ${formatRateLabel(data.sgstRate)}%`, data.sgstAmount]
        ]
      : [
          [`IGST @ ${formatRateLabel(data.igstRate)}%`, data.igstAmount]
        ]
    ),
    ['Grand Total', data.grandTotal],
  ]

  totals.forEach(([label, amount]) => {
    doc.setFontSize(8)
    doc.setTextColor(DARK)
    doc.setFont('helvetica', 'normal')
    doc.text(String(label), totalsX, yPosition)
    
    doc.setFont('helvetica', 'bold')
    doc.text(fmt(amount as number), totalsX + totalsWidth, yPosition, { align: 'right' })
    
    yPosition += 4
  })

  // Divider line
  doc.setDrawColor(BORDER)
  doc.setLineWidth(0.5)
  doc.line(totalsX, yPosition, totalsX + totalsWidth, yPosition)
  yPosition += 4

  // Grand Total row
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(DARK)
  doc.text('Grand Total', totalsX, yPosition)
  doc.text(fmt(data.grandTotal), totalsX + totalsWidth, yPosition, { align: 'right' })
  yPosition += 6

  // Balance Due row with orange background
  if (!isPaid) {
    doc.setFillColor(ORANGE)
    doc.setDrawColor(ORANGE)
    doc.rect(totalsX, yPosition, totalsWidth, 6, 'FD')
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor('#ffffff')
    doc.text('Balance Due', totalsX + 2, yPosition + 4)
    doc.text(fmt(data.grandTotal), totalsX + totalsWidth - 2, yPosition + 4, { align: 'right' })
    
    yPosition += 8
  }

  // SECTION 5 — NOTES (left side, same level as totals)
  let notesY = totalsY
  const notesWidth = contentWidth - totalsWidth - 10

  if (data.notes) {
    doc.setFontSize(7)
    doc.setTextColor(GRAY)
    doc.setFont('helvetica', 'bold')
    doc.text('Notes', margin, notesY)
    
    doc.setFontSize(8)
    doc.setTextColor(DARK)
    doc.setFont('helvetica', 'normal')
    const notesLines = doc.splitTextToSize(data.notes, notesWidth)
    notesLines.forEach((line: string) => {
      doc.text(line, margin, notesY + 4)
      notesY += 3.5
    })
  }

  yPosition = Math.max(yPosition, notesY + 10)

  // SECTION 6 — FOOTER
  let footerY = pageHeight - margin - 15
  
  // Thin gray divider
  doc.setDrawColor(BORDER)
  doc.setLineWidth(0.3)
  doc.line(margin, footerY, pageWidth - margin, footerY)

  footerY += 5

  // Terms & Conditions
  doc.setFontSize(7)
  doc.setTextColor(GRAY)
  doc.setFont('helvetica', 'bold')
  doc.text('Terms & Conditions', margin, footerY)
  
  footerY += 3
  
  doc.setFontSize(6)
  doc.setFont('helvetica', 'normal')
  const termsText = 'Payment is due within 14 days. Late payments may incur additional charges. This invoice is subject to the terms and conditions of our service agreement.'
  const termsLines = doc.splitTextToSize(termsText, contentWidth - 80)
  termsLines.forEach((line: string) => {
    doc.text(line, margin, footerY)
    footerY += 2.5
  })

  // Right side: Generated by
  doc.setFontSize(6)
  doc.setTextColor(GRAY)
  doc.setFont('helvetica', 'normal')
  doc.text('Generated by ChaseDue · chasedue.com', pageWidth - margin, footerY - 5, { align: 'right' })
  doc.text('This is a computer-generated invoice.', pageWidth - margin, footerY - 2, { align: 'right' })

  // Generate buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
  return pdfBuffer
}
