export type InvoicePdfLineItem = {
  description: string
  subtitle?: string
  hsn?: string
  qty: number
  unit?: string
  rate: number
  amount: number
}

/** Props for @react-pdf/renderer invoice layout */
export type InvoicePdfViewModel = {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  status: string
  refShort: string
  currency: string
  /** e.g. "Tamil Nadu (33)" */
  placeOfSupplyShort: string
  taxType: 'intra' | 'inter'
  gstRatePercent: number
  taxableValue: number
  cgstRate: number
  cgstAmount: number
  sgstRate: number
  sgstAmount: number
  igstRate: number
  igstAmount: number
  totalGst: number
  grandTotal: number
  amountInWords: string
  lineItems: InvoicePdfLineItem[]
  seller: {
    businessName: string
    gstin: string
    address: string
    email: string
    phone: string
    bankName: string
    accountNumber: string
    ifsc: string
  }
  client: {
    name: string
    gstin: string
    address: string
    email: string
    phone: string
  }
  notes: string
}
