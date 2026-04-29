import { buildInvoicePdfViewModelFromPortalRow } from '@/lib/invoice/build-invoice-pdf-view-model'
import type { SupabaseClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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
 * Format currency with Rs. prefix
 */
function fmt(n: number): string {
  return 'Rs. ' + new Intl.NumberFormat('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(n)
}

/**
 * Loads invoice via `get_portal_invoice` and returns PDF bytes using jsPDF implementation.
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
  
  // Create jsPDF document (A4 size: 210x297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Set margins (15mm each side)
  const leftMargin = 15
  const rightMargin = 15
  const pageWidth = 210
  const contentWidth = pageWidth - leftMargin - rightMargin
  let currentY = 10

  // Load and add logo
  const logoBase64 = getLogoBase64()
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', leftMargin, currentY, 20, 20)
  }

  // Business info (left side)
  currentY = 10
  const businessName = vm.seller.businessName
  const hasValidBusinessName = businessName && businessName.trim() !== '' && 
    businessName !== 'Seller' && businessName !== 'Your Business'
  if (hasValidBusinessName) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(249, 115, 22) // Orange #F97316
    doc.text(businessName, leftMargin + 25, currentY + 7)
    currentY += 7
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128) // Gray
  
  let addressY = hasValidBusinessName ? currentY + 5 : currentY
  if (vm.seller.address && vm.seller.address !== '—' && vm.seller.address !== '— | —' && vm.seller.address !== 'India') {
    doc.text(vm.seller.address, leftMargin + 25, addressY)
    addressY += 4
  }
  if (vm.seller.gstin && vm.seller.gstin !== '—' && vm.seller.gstin !== '— | —') {
    doc.text(`GSTIN: ${vm.seller.gstin}`, leftMargin + 25, addressY)
    addressY += 4
  }
  if (vm.seller.email && vm.seller.email !== '—' && vm.seller.email !== '— | —') {
    doc.text(vm.seller.email, leftMargin + 25, addressY)
  }

  // Invoice info (right side)
  const rightX = pageWidth - rightMargin - 5
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(249, 115, 22) // Orange #F97316
  doc.text('INVOICE', rightX, 15, { align: 'right' })

  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0) // Black
  doc.text(`# ${vm.invoiceNumber}`, rightX, 23, { align: 'right' })

  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128) // Gray
  doc.text('Balance Due', rightX, 29, { align: 'right' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0) // Black
  doc.text(fmt(vm.grandTotal), rightX, 35, { align: 'right' })

  // Orange divider line
  currentY = 38
  doc.setDrawColor(249, 115, 22)
  doc.setLineWidth(0.5)
  doc.line(leftMargin, currentY, pageWidth - rightMargin, currentY)

  // Bill To + Meta section
  currentY = 44
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128) // Gray
  doc.text('BILL TO', leftMargin, currentY)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(249, 115, 22) // Orange #F97316
  doc.text(vm.client.name, leftMargin, currentY + 5)

  // Client details
  let clientY = currentY + 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(0, 0, 0) // Black
  if (vm.client.address) {
    doc.text(vm.client.address, leftMargin, clientY)
    clientY += 4
  }
  if (vm.client.gstin) {
    doc.text(`GSTIN: ${vm.client.gstin}`, leftMargin, clientY)
    clientY += 4
  }
  if (vm.client.email) {
    doc.text(vm.client.email, leftMargin, clientY)
  }

  // Meta info (right side)
  const metaX = pageWidth - rightMargin - 60
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128) // Gray
  doc.text('Invoice Date:', metaX, currentY)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0) // Black
  doc.text(vm.invoiceDate, pageWidth - rightMargin, currentY, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(128, 128, 128) // Gray
  doc.text('Due Date:', metaX, currentY + 5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0) // Black
  doc.text(vm.dueDate, pageWidth - rightMargin, currentY + 5, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(128, 128, 128) // Gray
  doc.text('Place of Supply:', metaX, currentY + 10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0) // Black
  doc.text(vm.placeOfSupplyShort, pageWidth - rightMargin, currentY + 10, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(128, 128, 128) // Gray
  doc.text('Terms:', metaX, currentY + 15)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0) // Black
  doc.text('Due on Receipt', pageWidth - rightMargin, currentY + 15, { align: 'right' })

  // Items table
  currentY = 70
  const tableData = vm.lineItems.map((item, index) => [
    (index + 1).toString(),
    item.description === 'nil' ? 'Professional Services' : item.description,
    item.qty.toString(),
    fmt(item.rate),
    fmt(item.amount)
  ])

  // Items table using autoTable
  autoTable(doc, {
    head: [['#', 'Item & Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    startY: currentY,
    margin: { left: leftMargin, right: rightMargin },
    theme: 'grid',
    headStyles: {
      fillColor: [249, 115, 22], // Orange #F97316
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 10 }, // #
      1: { cellWidth: 'auto' }, // Item & Description
      2: { cellWidth: 20, halign: 'right' }, // Qty
      3: { cellWidth: 35, halign: 'right' }, // Rate
      4: { cellWidth: 35, halign: 'right' } // Amount
    },
    styles: {
      lineColor: [229, 231, 235], // #e5e7eb
      lineWidth: 0.1
    }
  })

  // Get table end position
  const tableEndY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : currentY + 50

  // Totals section (right side)
  const totalsX = pageWidth - rightMargin - 60
  let totalsY = tableEndY

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(0, 0, 0)
  doc.text('Sub Total:', totalsX, totalsY)
  doc.text(fmt(vm.taxableValue), pageWidth - rightMargin, totalsY, { align: 'right' })

  if (vm.taxType === 'intra') {
    totalsY += 5
    doc.text(`CGST @ ${vm.cgstRate}%:`, totalsX, totalsY)
    doc.text(fmt(vm.cgstAmount), pageWidth - rightMargin, totalsY, { align: 'right' })

    totalsY += 5
    doc.text(`SGST @ ${vm.sgstRate}%:`, totalsX, totalsY)
    doc.text(fmt(vm.sgstAmount), pageWidth - rightMargin, totalsY, { align: 'right' })
  } else {
    totalsY += 5
    doc.text(`IGST @ ${vm.igstRate}%:`, totalsX, totalsY)
    doc.text(fmt(vm.igstAmount), pageWidth - rightMargin, totalsY, { align: 'right' })
  }

  // Divider line
  totalsY += 2
  doc.setDrawColor(229, 231, 235)
  doc.setLineWidth(0.1)
  doc.line(totalsX, totalsY, pageWidth - rightMargin, totalsY)

  totalsY += 7
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Grand Total:', totalsX, totalsY)
  doc.text(fmt(vm.grandTotal), pageWidth - rightMargin, totalsY, { align: 'right' })

  // Balance Due row (if not paid)
  const isPaid = vm.status === 'PAID' || vm.status === 'SETTLED' || vm.status === 'COMPLETED'
  if (!isPaid) {
    totalsY += 7
    doc.setFillColor(249, 115, 22) // Orange background
    doc.rect(totalsX - 5, totalsY - 4, pageWidth - rightMargin - totalsX + 5, 8, 'F')
    doc.setTextColor(255, 255, 255) // White text
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('Balance Due:', totalsX, totalsY)
    doc.text(fmt(vm.grandTotal), pageWidth - rightMargin, totalsY, { align: 'right' })
  }

  // Notes section (left side, only if exists - positioned close to totals)
  if (vm.notes) {
    const notesY = Math.min(tableEndY, totalsY + 10)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128) // Gray
    doc.text('Notes:', leftMargin, notesY)
    
    doc.setTextColor(0, 0, 0) // Black
    const splitNotes = doc.splitTextToSize(vm.notes, contentWidth - 60)
    doc.text(splitNotes, leftMargin, notesY + 5)
  }

  // Footer - pinned to absolute bottom of page
  const pageHeight = doc.internal.pageSize.getHeight()
  doc.setDrawColor(229, 231, 235)
  doc.setLineWidth(0.1)
  doc.line(leftMargin, pageHeight - 20, pageWidth - rightMargin, pageHeight - 20)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(156, 163, 175) // #9ca3af
  doc.text('Generated by ChaseDue · chasedue.com', pageWidth / 2, pageHeight - 15, { align: 'center' })
  doc.text('This is a computer-generated invoice.', pageWidth / 2, pageHeight - 10, { align: 'center' })

  // Generate buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
  
  return { buffer: pdfBuffer, invoiceNumber: vm.invoiceNumber }
}
