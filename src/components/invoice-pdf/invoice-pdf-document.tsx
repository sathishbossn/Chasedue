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
 * Stable Google Fonts (gstatic) TTF endpoints — consistent ₹ (U+20B9) across OS.
 * @see https://fonts.google.com/specimen/Roboto
 */
const ROBOTO_REGULAR =
  'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf'
const ROBOTO_BOLD = 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf'
const ROBOTO_ITALIC =
  'https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu51xIIzc.ttf'

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

const ORANGE = '#F97316'
const BRAND_ACCENT = '#FF4F01'
const DARK = '#1a1a1a'
const GRAY = '#6b7280'
const LIGHT_GRAY = '#fafafa'
const WHITE = '#ffffff'
const GREEN = '#16a34a'
const BORDER = '#e5e7eb'

const styles = StyleSheet.create({
  page: { fontFamily: 'Roboto', fontSize: 9, color: DARK, paddingBottom: 56 },

  brandStrip: { height: 4, backgroundColor: BRAND_ACCENT, width: '100%' },

  header: {
    backgroundColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  logo: { width: 28, height: 28, marginRight: 8, objectFit: 'contain' },
  brandWordmark: { color: WHITE, fontSize: 15, fontWeight: 700 },
  taxInvoiceLabel: { color: WHITE, fontSize: 13, fontWeight: 700, letterSpacing: 1.5 },

  body: { paddingHorizontal: 24, paddingTop: 18 },

  metaRow: { flexDirection: 'row', marginBottom: 14 },
  metaLeft: { flex: 1, paddingRight: 12 },
  metaRight: { width: 220 },
  label: {
    fontSize: 7,
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: { fontSize: 9, color: DARK, marginBottom: 2 },
  valueBold: { fontSize: 9, color: DARK, fontWeight: 700, marginBottom: 2 },
  invoiceNum: { fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 4 },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    marginBottom: 8,
  },
  badgePending: { backgroundColor: ORANGE },
  badgePaid: { backgroundColor: GREEN },
  badgeText: { color: WHITE, fontSize: 8, fontWeight: 700 },

  divider: { height: 1, backgroundColor: BORDER, marginVertical: 12 },

  billToLabel: {
    fontSize: 7,
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  table: { marginTop: 12 },
  tableHeader: { flexDirection: 'row', backgroundColor: DARK, paddingVertical: 6, paddingHorizontal: 0 },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: WHITE,
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: LIGHT_GRAY,
  },
  tableCell: { paddingVertical: 6, paddingHorizontal: 6 },
  tableHeaderText: { color: WHITE, fontSize: 7, fontWeight: 700 },
  tableCellText: { fontSize: 8, color: DARK },
  tableCellDescText: { fontSize: 8, color: DARK, lineHeight: 1.45, textAlign: 'left' },

  colNo: { width: 22 },
  colDesc: { flex: 1, minWidth: 0 },
  colHsn: { width: 52 },
  colQty: { width: 28 },
  colUnit: { width: 36 },
  colRate: { width: 64, alignItems: 'flex-end' },
  colAmt: { width: 72, alignItems: 'flex-end' },

  totalsSection: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  totalsTable: { width: 280 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, paddingHorizontal: 4 },
  totalRowGrand: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginTop: 4,
    borderTopWidth: 1.5,
    borderTopColor: DARK,
  },
  totalLabel: { fontSize: 9, color: GRAY, width: 140 },
  totalValue: { fontSize: 9, color: DARK, textAlign: 'right', flex: 1 },
  grandTotalLabel: { fontSize: 11, color: DARK, fontWeight: 700, width: 140 },
  grandTotalValue: { fontSize: 11, color: ORANGE, fontWeight: 700, textAlign: 'right', flex: 1 },

  amountWordsInTotals: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  amountWordsItalic: {
    fontSize: 8.5,
    color: GRAY,
    fontStyle: 'italic',
    fontWeight: 400,
    lineHeight: 1.45,
  },

  infoSection: { marginTop: 12 },
  infoLabel: {
    fontSize: 7,
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  infoValue: { fontSize: 8.5, color: DARK, lineHeight: 1.35 },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: WHITE,
  },
  footerText: { fontSize: 7, color: GRAY },
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

export function InvoicePdfDocument({
  data,
  logoUrl,
}: {
  data: InvoicePdfViewModel
  logoUrl: string
}) {
  const st = data.status.trim().toUpperCase()
  const isPaid = st === 'PAID' || st === 'SETTLED' || st === 'COMPLETED'

  const detailRows: [string, string][] = [
    ['Invoice Date', data.invoiceDate],
    ['Due Date', data.dueDate],
    ['Place of Supply', data.placeOfSupplyShort],
    ['Currency', data.currency],
  ]

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.brandStrip} fixed />
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            <Image style={styles.logo} src={logoUrl} />
            <Text style={styles.brandWordmark}>ChaseDue</Text>
          </View>
          <Text style={styles.taxInvoiceLabel}>TAX INVOICE</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.metaRow}>
            <View style={styles.metaLeft}>
              <Text style={styles.label}>From</Text>
              <Text style={styles.valueBold}>{data.seller.businessName}</Text>
              {data.seller.gstin && data.seller.gstin !== '—' ? (
                <Text style={styles.value}>GSTIN: {data.seller.gstin}</Text>
              ) : null}
              {data.seller.address ? <Text style={styles.value}>{data.seller.address}</Text> : null}
              <Text style={styles.value}>
                {[data.seller.email, data.seller.phone].filter(Boolean).join(' · ')}
              </Text>
            </View>

            <View style={styles.metaRight}>
              <Text style={styles.invoiceNum}>#{data.invoiceNumber}</Text>
              <View style={[styles.badge, isPaid ? styles.badgePaid : styles.badgePending]}>
                <Text style={styles.badgeText}>{data.status}</Text>
              </View>
              <View style={{ marginTop: 6 }}>
                {detailRows.map(([label, value], i) => (
                  <View key={`d-${i}`} style={{ flexDirection: 'row', marginBottom: 3 }}>
                    <Text style={[styles.label, { width: 88, marginBottom: 0 }]}>{label}</Text>
                    <Text style={styles.value}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.billToLabel}>Bill To</Text>
          <Text style={styles.valueBold}>{data.client.name}</Text>
          {data.client.gstin ? <Text style={styles.value}>GSTIN: {data.client.gstin}</Text> : null}
          {data.client.address ? <Text style={styles.value}>{data.client.address}</Text> : null}
          {data.client.email ? <Text style={styles.value}>{data.client.email}</Text> : null}
          {data.client.phone ? <Text style={styles.value}>{data.client.phone}</Text> : null}

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <View style={[styles.tableCell, styles.colNo]}>
                <Text style={styles.tableHeaderText}>#</Text>
              </View>
              <View style={[styles.tableCell, styles.colDesc]}>
                <Text style={styles.tableHeaderText}>Description</Text>
              </View>
              <View style={[styles.tableCell, styles.colHsn]}>
                <Text style={styles.tableHeaderText}>HSN</Text>
              </View>
              <View style={[styles.tableCell, styles.colQty]}>
                <Text style={styles.tableHeaderText}>Qty</Text>
              </View>
              <View style={[styles.tableCell, styles.colUnit]}>
                <Text style={styles.tableHeaderText}>Unit</Text>
              </View>
              <View style={[styles.tableCell, styles.colRate]}>
                <Text style={styles.tableHeaderText}>Rate</Text>
              </View>
              <View style={[styles.tableCell, styles.colAmt]}>
                <Text style={styles.tableHeaderText}>Amount</Text>
              </View>
            </View>

            {data.lineItems.map((item, i) => (
              <View key={`line-${i}`} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <View style={[styles.tableCell, styles.colNo]}>
                  <Text style={styles.tableCellText}>{i + 1}</Text>
                </View>
                <View style={[styles.tableCell, styles.colDesc]} wrap>
                  <Text style={styles.tableCellDescText}>{item.description}</Text>
                </View>
                <View style={[styles.tableCell, styles.colHsn]}>
                  <Text style={styles.tableCellText}>{item.hsn ?? '998314'}</Text>
                </View>
                <View style={[styles.tableCell, styles.colQty]}>
                  <Text style={styles.tableCellText}>{String(item.qty)}</Text>
                </View>
                <View style={[styles.tableCell, styles.colUnit]}>
                  <Text style={styles.tableCellText}>{item.unit ?? '—'}</Text>
                </View>
                <View style={[styles.tableCell, styles.colRate]}>
                  <Text style={styles.tableCellText}>{fmt(item.rate)}</Text>
                </View>
                <View style={[styles.tableCell, styles.colAmt]}>
                  <Text style={styles.tableCellText}>{fmt(item.amount)}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.totalsSection}>
            <View style={styles.totalsTable}>
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
              <View style={styles.totalRowGrand}>
                <Text style={styles.grandTotalLabel}>Grand Total</Text>
                <Text style={styles.grandTotalValue}>{fmt(data.grandTotal)}</Text>
              </View>
              <View style={styles.amountWordsInTotals}>
                <Text style={styles.amountWordsItalic}>
                  Amount in words: {data.amountInWords}
                </Text>
              </View>
            </View>
          </View>

          {(data.seller.bankName || data.seller.accountNumber || data.seller.ifsc) && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Bank</Text>
              <Text style={styles.infoValue}>
                {[data.seller.businessName, data.seller.accountNumber, data.seller.ifsc, data.seller.bankName]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </View>
          )}

          {data.notes ? (
            <View style={[styles.infoSection, { marginTop: 8 }]}>
              <Text style={styles.infoLabel}>Notes</Text>
              <Text style={styles.infoValue}>{data.notes}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Generated by ChaseDue · chasedue.in</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}
