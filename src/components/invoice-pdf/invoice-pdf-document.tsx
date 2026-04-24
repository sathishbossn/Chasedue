import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import type { InvoicePdfViewModel } from '@/lib/invoice/invoice-pdf-types'

/**
 * Premium Google Fonts for professional invoice typography
 */
const ROBOTO_REGULAR = 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf'
const ROBOTO_BOLD = 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf'
const ROBOTO_ITALIC = 'https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu51xIIzc.ttf'

let fontsReady = false
function ensureFonts(): void {
  if (fontsReady) return
  fontsReady = true
  Font.register({
    family: 'Roboto',
    fonts: [
      { src: ROBOTO_REGULAR, fontWeight: 400 },
      { src: ROBOTO_BOLD, fontWeight: 700 },
      { src: ROBOTO_ITALIC, fontWeight: 400, fontStyle: 'italic' },
    ],
  })
}

ensureFonts()

// Premium color scheme
const ORANGE = '#F97316'
const DARK_GRAY = '#1a1a1a'
const GRAY = '#6b7280'
const LIGHT_GRAY = '#f3f4f6'
const WHITE = '#ffffff'
const GREEN = '#16a34a'
const RED = '#dc2626'
const BORDER = '#e5e7eb'

const styles = StyleSheet.create({
  page: { 
    fontFamily: 'Roboto', 
    fontSize: 10, 
    color: DARK_GRAY, 
    backgroundColor: WHITE,
    padding: 40,
    paddingBottom: 80,
  },

  // Header with logo and title
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  logo: { width: 32, height: 32, marginRight: 12, objectFit: 'contain' },
  brandWordmark: { fontSize: 18, fontWeight: 700, color: DARK_GRAY },
  headerRight: { alignItems: 'flex-end', textAlign: 'right' },
  taxInvoiceTitle: { fontSize: 24, fontWeight: 700, color: DARK_GRAY, marginBottom: 4 },
  invoiceNumber: { fontSize: 14, fontWeight: 500, color: GRAY, marginBottom: 8 },

  // Status badges
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  badgePending: { backgroundColor: ORANGE },
  badgePaid: { backgroundColor: GREEN },
  badgeOverdue: { backgroundColor: RED },
  badgeText: { color: WHITE, fontSize: 10, fontWeight: 600 },

  // Section labels
  sectionLabel: {
    fontSize: 8,
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    fontWeight: 500,
  },

  // Seller block (FROM)
  sellerBlock: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 8,
  },
  sellerName: { fontSize: 14, fontWeight: 600, color: DARK_GRAY, marginBottom: 6 },
  sellerInfo: { fontSize: 9, color: GRAY, marginBottom: 2, lineHeight: 1.4 },

  // Bill To block
  billToBlock: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
  },
  clientName: { fontSize: 14, fontWeight: 600, color: DARK_GRAY, marginBottom: 6 },
  clientInfo: { fontSize: 9, color: GRAY, marginBottom: 2, lineHeight: 1.4 },

  // Metadata grid (4 cells)
  metadataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 16,
  },
  metadataCell: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 6,
  },
  metadataLabel: {
    fontSize: 8,
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metadataValue: { fontSize: 11, fontWeight: 500, color: DARK_GRAY },

  // Items table
  table: { marginBottom: 24 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: LIGHT_GRAY,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  tableHeaderText: { fontSize: 9, fontWeight: 600, color: DARK_GRAY },
  tableCellText: { fontSize: 9, color: DARK_GRAY },
  tableCellDesc: { fontSize: 9, color: DARK_GRAY, lineHeight: 1.4, flex: 1 },

  colDesc: { flex: 2, minWidth: 0, marginRight: 12 },
  colQty: { width: 40, textAlign: 'center' },
  colRate: { width: 80, textAlign: 'right', marginRight: 12 },
  colAmount: { width: 80, textAlign: 'right' },

  // Totals summary box
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  totalsBox: {
    width: 280,
    padding: 16,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalLabel: { fontSize: 9, color: GRAY, flex: 1 },
  totalValue: { fontSize: 9, color: DARK_GRAY, textAlign: 'right', fontWeight: 500 },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: ORANGE,
  },
  grandTotalLabel: { fontSize: 12, color: DARK_GRAY, fontWeight: 700, flex: 1 },
  grandTotalValue: { fontSize: 12, color: ORANGE, fontWeight: 700, textAlign: 'right' },

  // Amount in words
  amountWordsSection: {
    marginBottom: 24,
    padding: 12,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 6,
  },
  amountWordsLabel: {
    fontSize: 8,
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  amountWordsText: { fontSize: 9, color: DARK_GRAY, lineHeight: 1.4 },

  // Notes section
  notesSection: {
    marginBottom: 24,
    padding: 12,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 6,
  },
  notesLabel: {
    fontSize: 8,
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  notesText: { fontSize: 9, color: DARK_GRAY, lineHeight: 1.4 },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: WHITE,
  },
  footerText: { fontSize: 8, color: GRAY, textAlign: 'center' },
})

function fmt(n: number): string {
  return (
    '\u20B9' +
    new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
  )
}

function formatRateLabel(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '0'
  const r = Math.round(n * 10) / 10
  if (Number.isInteger(r)) return String(r)
  return r.toFixed(1)
}

function getStatusBadgeStyle(status: string) {
  const st = status.trim().toUpperCase()
  if (st === 'PAID' || st === 'SETTLED' || st === 'COMPLETED') {
    return styles.badgePaid
  }
  if (st === 'OVERDUE') {
    return styles.badgeOverdue
  }
  return styles.badgePending
}

export function InvoicePdfDocument({
  data,
  logoUrl,
}: {
  data: InvoicePdfViewModel
  logoUrl: string
}) {
  const isPaid = data.status === 'PAID' || data.status === 'SETTLED' || data.status === 'COMPLETED'
  const isOverdue = data.status === 'OVERDUE'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with logo and title */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image style={styles.logo} src={logoUrl} />
            <Text style={styles.brandWordmark}>ChaseDue</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.taxInvoiceTitle}>TAX INVOICE</Text>
            <Text style={styles.invoiceNumber}>{data.invoiceNumber}</Text>
            <View style={[styles.badge, getStatusBadgeStyle(data.status)]}>
              <Text style={styles.badgeText}>{data.status}</Text>
            </View>
          </View>
        </View>

        {/* Seller Block (FROM) */}
        <View style={styles.sellerBlock}>
          <Text style={styles.sectionLabel}>FROM</Text>
          <Text style={styles.sellerName}>{data.seller.businessName}</Text>
          {data.seller.gstin && data.seller.gstin !== '—' && (
            <Text style={styles.sellerInfo}>GSTIN: {data.seller.gstin}</Text>
          )}
          {data.seller.address && (
            <Text style={styles.sellerInfo}>{data.seller.address}</Text>
          )}
          {data.seller.email && (
            <Text style={styles.sellerInfo}>{data.seller.email}</Text>
          )}
          {data.seller.phone && (
            <Text style={styles.sellerInfo}>{data.seller.phone}</Text>
          )}
        </View>

        {/* Bill To Block */}
        <View style={styles.billToBlock}>
          <Text style={styles.sectionLabel}>BILL TO</Text>
          <Text style={styles.clientName}>{data.client.name}</Text>
          {data.client.gstin && (
            <Text style={styles.clientInfo}>GSTIN: {data.client.gstin}</Text>
          )}
          {data.client.address && (
            <Text style={styles.clientInfo}>{data.client.address}</Text>
          )}
          {data.client.email && (
            <Text style={styles.clientInfo}>{data.client.email}</Text>
          )}
          {data.client.phone && (
            <Text style={styles.clientInfo}>{data.client.phone}</Text>
          )}
        </View>

        {/* Metadata Grid (4 cells) */}
        <View style={styles.metadataGrid}>
          <View style={styles.metadataCell}>
            <Text style={styles.metadataLabel}>Invoice Date</Text>
            <Text style={styles.metadataValue}>{data.invoiceDate}</Text>
          </View>
          <View style={styles.metadataCell}>
            <Text style={styles.metadataLabel}>Due Date</Text>
            <Text style={styles.metadataValue}>{data.dueDate}</Text>
          </View>
          <View style={styles.metadataCell}>
            <Text style={styles.metadataLabel}>Place of Supply</Text>
            <Text style={styles.metadataValue}>{data.placeOfSupplyShort}</Text>
          </View>
          <View style={styles.metadataCell}>
            <Text style={styles.metadataLabel}>Currency</Text>
            <Text style={styles.metadataValue}>{data.currency}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.colDesc}>
              <Text style={styles.tableHeaderText}>Description</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={styles.tableHeaderText}>Qty</Text>
            </View>
            <View style={styles.colRate}>
              <Text style={styles.tableHeaderText}>Rate</Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={styles.tableHeaderText}>Amount</Text>
            </View>
          </View>

          {data.lineItems.map((item, i) => (
            <View key={`line-${i}`} style={styles.tableRow}>
              <View style={styles.colDesc}>
                <Text style={styles.tableCellDesc}>
                  {item.description === 'nil' ? 'Professional Services' : item.description}
                </Text>
              </View>
              <View style={styles.colQty}>
                <Text style={styles.tableCellText}>{String(item.qty)}</Text>
              </View>
              <View style={styles.colRate}>
                <Text style={styles.tableCellText}>{fmt(item.rate)}</Text>
              </View>
              <View style={styles.colAmount}>
                <Text style={styles.tableCellText}>{fmt(item.amount)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals Summary Box */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Taxable Value</Text>
              <Text style={styles.totalValue}>{fmt(data.taxableValue)}</Text>
            </View>
            {data.taxType === 'intra' ? (
              <>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>
                    CGST @ {formatRateLabel(data.cgstRate)}%
                  </Text>
                  <Text style={styles.totalValue}>{fmt(data.cgstAmount)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>
                    SGST @ {formatRateLabel(data.sgstRate)}%
                  </Text>
                  <Text style={styles.totalValue}>{fmt(data.sgstAmount)}</Text>
                </View>
              </>
            ) : (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>IGST @ {formatRateLabel(data.igstRate)}%</Text>
                <Text style={styles.totalValue}>{fmt(data.igstAmount)}</Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>{fmt(data.grandTotal)}</Text>
            </View>
            {!isPaid && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Amount Due</Text>
                <Text style={styles.totalValue}>{fmt(data.grandTotal)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Amount in Words */}
        <View style={styles.amountWordsSection}>
          <Text style={styles.amountWordsLabel}>Amount in words:</Text>
          <Text style={styles.amountWordsText}>{data.amountInWords}</Text>
        </View>

        {/* Notes Section */}
        {data.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{data.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by ChaseDue · chasedue.com · support@chasedue.com
          </Text>
          <Text style={styles.footerText}>This is a computer-generated invoice.</Text>
        </View>
      </Page>
    </Document>
  )
}
