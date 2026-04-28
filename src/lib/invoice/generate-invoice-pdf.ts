import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ChaseDue brand color
const CHASEDUE_PINK = '#ED13C4'

interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  businessName: string
  businessAddress?: string
  businessGstin?: string
  clientName: string
  clientAddress?: string
  clientGstin?: string
  items: InvoiceItem[]
  subtotal: number
  taxRate?: number
  taxAmount?: number
  total: number
  notes?: string
}

/**
 * Format currency with Rs. prefix
 */
function fmt(n: number): string {
  return 'Rs. ' + new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

/**
 * Generate a ChaseDue branded invoice PDF
 * @param data Invoice data
 * @returns PDF as Buffer
 */
export function generateChaseDueInvoicePdf(data: InvoiceData): Buffer {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  let yPos = margin

  // Header - Business Info (Left)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(237, 19, 196) // ChaseDue Pink #ED13C4
  doc.text(data.businessName || 'Your Business', margin, yPos + 5)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  yPos += 8

  if (data.businessAddress) {
    const addressLines = doc.splitTextToSize(data.businessAddress, 80)
    addressLines.forEach((line: string) => {
      doc.text(line, margin, yPos)
      yPos += 4
    })
  }

  if (data.businessGstin) {
    doc.text(`GSTIN: ${data.businessGstin}`, margin, yPos)
    yPos += 4
  }

  // Header - Invoice Info (Right)
  const rightX = pageWidth - margin
  yPos = margin

  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(237, 19, 196) // ChaseDue Pink
  doc.text('INVOICE', rightX, yPos + 5, { align: 'right' })

  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text(`# ${data.invoiceNumber}`, rightX, yPos + 12, { align: 'right' })

  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text(`Date: ${data.invoiceDate}`, rightX, yPos + 18, { align: 'right' })
  doc.text(`Due: ${data.dueDate}`, rightX, yPos + 23, { align: 'right' })

  // Bill To Section
  yPos = 50
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('BILL TO', margin, yPos)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(237, 19, 196) // ChaseDue Pink
  doc.text(data.clientName, margin, yPos + 6)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  yPos += 10

  if (data.clientAddress) {
    const clientLines = doc.splitTextToSize(data.clientAddress, 80)
    clientLines.forEach((line: string) => {
      doc.text(line, margin, yPos)
      yPos += 4
    })
  }

  if (data.clientGstin) {
    doc.text(`GSTIN: ${data.clientGstin}`, margin, yPos)
    yPos += 4
  }

  // Items Table
  const tableData = data.items.map((item, index) => [
    (index + 1).toString(),
    item.description,
    item.quantity.toString(),
    fmt(item.rate),
    fmt(item.amount),
  ])

  autoTable(doc, {
    head: [['#', 'Item & Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    startY: 75,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: {
      fillColor: [237, 19, 196], // ChaseDue Pink #ED13C4
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 20, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    },
    styles: {
      lineColor: [229, 231, 235],
      lineWidth: 0.1,
    },
  })

  // Get table end position
  const tableEndY = (doc as any).lastAutoTable?.finalY || 120
  yPos = tableEndY + 10

  // Totals Section (Right aligned)
  const totalsX = pageWidth - margin - 60

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  doc.text('Subtotal:', totalsX, yPos)
  doc.text(fmt(data.subtotal), rightX, yPos, { align: 'right' })

  if (data.taxAmount && data.taxRate) {
    yPos += 6
    doc.text(`Tax (${data.taxRate}%):`, totalsX, yPos)
    doc.text(fmt(data.taxAmount), rightX, yPos, { align: 'right' })
  }

  yPos += 6
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(237, 19, 196) // ChaseDue Pink
  doc.text('Total:', totalsX, yPos)
  doc.text(fmt(data.total), rightX, yPos, { align: 'right' })

  // Notes
  if (data.notes) {
    yPos += 15
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(100, 100, 100)
    doc.text('Notes:', margin, yPos)

    yPos += 5
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    const notesLines = doc.splitTextToSize(data.notes, pageWidth - margin * 2)
    notesLines.forEach((line: string) => {
      doc.text(line, margin, yPos)
      yPos += 4
    })
  }

  // Footer - Powered by ChaseDue
  const footerY = pageHeight - margin - 5
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 150, 150)
  doc.text('Powered by ChaseDue · chasedue.com', pageWidth / 2, footerY, { align: 'center' })

  // Return as Buffer
  return Buffer.from(doc.output('arraybuffer'))
}

/**
 * Example usage:
 * 
 * const pdfBuffer = generateChaseDueInvoicePdf({
 *   invoiceNumber: 'INV-2026-001',
 *   invoiceDate: '28 Apr 2026',
 *   dueDate: '05 May 2026',
 *   businessName: 'My Freelance Business',
 *   businessAddress: 'Mumbai, Maharashtra',
 *   clientName: 'Acme Corp',
 *   items: [
 *     { description: 'Website Design', quantity: 1, rate: 25000, amount: 25000 },
 *     { description: 'Development', quantity: 10, rate: 2000, amount: 20000 },
 *   ],
 *   subtotal: 45000,
 *   taxRate: 18,
 *   taxAmount: 8100,
 *   total: 53100,
 *   notes: 'Payment due within 30 days.',
 * })
 */
