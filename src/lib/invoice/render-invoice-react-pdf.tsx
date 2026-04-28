import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { renderToBuffer } from '@react-pdf/renderer'
import type { InvoicePdfViewModel } from '@/lib/invoice/invoice-pdf-types'

// Register NotoSans font for rupee symbol support
Font.register({
  family: 'NotoSans',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosans/v36/o-0IIpQlx3QUlC5A4PNr5TRA.woff2',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/notosans/v36/o-0HIpQlx3QUlC5A4PNr5TRASvaR.woff2',
      fontWeight: 'bold',
    },
  ],
})

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  businessName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 4,
  },
  sellerInfo: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F97316',
  },
  invoiceNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 4,
  },
  balanceDueLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 8,
  },
  balanceDueAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  orangeDivider: {
    height: 2,
    backgroundColor: '#F97316',
    marginVertical: 16,
  },
  billToMetaRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  billToSection: {
    flex: 1,
  },
  billToLabel: {
    fontSize: 8,
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 4,
  },
  customerInfo: {
    fontSize: 9,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  metaSection: {
    alignItems: 'flex-end',
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginRight: 8,
  },
  metaValue: {
    fontSize: 9,
    color: '#1a1a1a',
  },
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F97316',
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableColNum: {
    width: '5%',
  },
  tableColDesc: {
    width: '45%',
  },
  tableColQty: {
    width: '10%',
    textAlign: 'right',
  },
  tableColRate: {
    width: '20%',
    textAlign: 'right',
  },
  tableColAmount: {
    width: '20%',
    textAlign: 'right',
  },
  tableHeaderText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableCellText: {
    fontSize: 9,
  },
  totals: {
    alignSelf: 'flex-end',
    width: 250,
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 9,
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  totalDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginVertical: 4,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  balanceDueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F97316',
    padding: 8,
    marginTop: 4,
  },
  balanceDueRowLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  balanceDueRowValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  notesSection: {
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: '#1a1a1a',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 25,
    right: 25,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7,
    color: '#9ca3af',
    textAlign: 'center',
  },
})

// Helper functions
function fmt(n: number): string {
  return 'Rs. ' + new Intl.NumberFormat('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(n)
}

function formatRateLabel(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '0'
  const r = Math.round(n * 10) / 10
  if (Number.isInteger(r)) return String(r)
  return r.toFixed(1)
}

// Invoice PDF Document Component
function InvoicePdfDocument({ data, logoBase64 }: { data: InvoicePdfViewModel; logoBase64: string }) {
  const isPaid = data.status === 'PAID' || data.status === 'SETTLED' || data.status === 'COMPLETED'
  const businessName = data.seller.businessName
  const hasValidBusinessName = businessName && businessName.trim() !== '' && businessName !== 'Seller'

  return (
    <Document>
      <Page size="A4" style={{ position: 'relative', padding: 25 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {logoBase64 && <Image src={logoBase64} style={styles.logo} />}
            {hasValidBusinessName && (
              <Text style={styles.businessName}>{businessName}</Text>
            )}
            {data.seller.address && data.seller.address !== '—' && data.seller.address !== '— | —' && data.seller.address !== 'India' && (
              <Text style={styles.sellerInfo}>{data.seller.address}</Text>
            )}
            {data.seller.gstin && data.seller.gstin !== '—' && data.seller.gstin !== '— | —' && (
              <Text style={styles.sellerInfo}>GSTIN: {data.seller.gstin}</Text>
            )}
            {data.seller.email && data.seller.email !== '—' && data.seller.email !== '— | —' && (
              <Text style={styles.sellerInfo}>{data.seller.email}</Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}># {data.invoiceNumber}</Text>
            <Text style={styles.balanceDueLabel}>Balance Due</Text>
            <Text style={styles.balanceDueAmount}>{fmt(data.grandTotal)}</Text>
          </View>
        </View>

        {/* ORANGE DIVIDER */}
        <View style={styles.orangeDivider} />

        {/* BILL TO + META */}
        <View style={styles.billToMetaRow}>
          <View style={styles.billToSection}>
            <Text style={styles.billToLabel}>Bill To</Text>
            <Text style={styles.customerName}>{data.client.name}</Text>
            {data.client.address && <Text style={styles.customerInfo}>{data.client.address}</Text>}
            {data.client.gstin && <Text style={styles.customerInfo}>GSTIN: {data.client.gstin}</Text>}
            {data.client.email && <Text style={styles.customerInfo}>{data.client.email}</Text>}
          </View>
          <View style={styles.metaSection}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Invoice Date:</Text>
              <Text style={styles.metaValue}>{data.invoiceDate}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Due Date:</Text>
              <Text style={styles.metaValue}>{data.dueDate}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Place of Supply:</Text>
              <Text style={styles.metaValue}>{data.placeOfSupplyShort}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Terms:</Text>
              <Text style={styles.metaValue}>Due on Receipt</Text>
            </View>
          </View>
        </View>

        {/* ITEMS TABLE */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.tableColNum]}>#</Text>
            <Text style={[styles.tableHeaderText, styles.tableColDesc]}>Item & Description</Text>
            <Text style={[styles.tableHeaderText, styles.tableColQty]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.tableColRate]}>Rate</Text>
            <Text style={[styles.tableHeaderText, styles.tableColAmount]}>Amount</Text>
          </View>
          {data.lineItems.map((item, index) => (
            <View 
              key={index} 
              style={[styles.tableRow, index % 2 === 1 && { backgroundColor: '#fafafa' }]}
            >
              <Text style={[styles.tableCellText, styles.tableColNum]}>{index + 1}</Text>
              <Text style={[styles.tableCellText, styles.tableColDesc]}>
                {item.description === 'nil' ? 'Professional Services' : item.description}
              </Text>
              <Text style={[styles.tableCellText, styles.tableColQty]}>{item.qty}</Text>
              <Text style={[styles.tableCellText, styles.tableColRate]}>{fmt(item.rate)}</Text>
              <Text style={[styles.tableCellText, styles.tableColAmount]}>{fmt(item.amount)}</Text>
            </View>
          ))}
        </View>

        {/* TOTALS */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sub Total</Text>
            <Text style={styles.totalValue}>{fmt(data.taxableValue)}</Text>
          </View>
          {data.taxType === 'intra' ? (
            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>CGST @ {formatRateLabel(data.cgstRate)}%</Text>
                <Text style={styles.totalValue}>{fmt(data.cgstAmount)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>SGST @ {formatRateLabel(data.sgstRate)}%</Text>
                <Text style={styles.totalValue}>{fmt(data.sgstAmount)}</Text>
              </View>
            </>
          ) : (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IGST @ {formatRateLabel(data.igstRate)}%</Text>
              <Text style={styles.totalValue}>{fmt(data.igstAmount)}</Text>
            </View>
          )}
          <View style={styles.totalDivider} />
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>{fmt(data.grandTotal)}</Text>
          </View>
          {!isPaid && (
            <View style={styles.balanceDueRow}>
              <Text style={styles.balanceDueRowLabel}>Balance Due</Text>
              <Text style={styles.balanceDueRowValue}>{fmt(data.grandTotal)}</Text>
            </View>
          )}
        </View>

        {/* NOTES */}
        {data.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{data.notes}</Text>
          </View>
        )}

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {data.isFreePlan 
              ? 'Sent via ChaseDue · chasedue.com · Upgrade at chasedue.com/pricing'
              : 'Generated by ChaseDue · chasedue.com'
            }
          </Text>
          <Text style={styles.footerText}>This is a computer-generated invoice.</Text>
        </View>
      </Page>
    </Document>
  )
}

export async function renderInvoicePdfToBuffer(
  data: InvoicePdfViewModel,
  logoBase64: string
): Promise<Buffer> {
  const element = <InvoicePdfDocument data={data} logoBase64={logoBase64} />
  const buf = await renderToBuffer(element)
  return Buffer.from(buf)
}
