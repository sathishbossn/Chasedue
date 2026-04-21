'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { getTaxBreakdown } from '@/lib/get-tax-breakdown'
import { DEFAULT_GST_RATE_PERCENT } from '@/lib/gst'
import { normalizeInvoiceStatusForDb } from '@/lib/invoice-paid'
import { getPublicBaseUrlFromHeaders, normalizeHttpOrigin } from '@/lib/public-url'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { checkInvoiceLimit } from '@/lib/usage-limit'
import { invoiceNumberFromRpcData } from '@/lib/invoice/invoice-number-from-rpc'
import { parseLineItemsFromFormJson, roundMoney2 } from '@/lib/invoice/line-items'

export async function createInvoice(
  formData: FormData
): Promise<{ ok: true; invoiceId: string } | { ok: false; error: string }> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'You must be signed in.' }
  }

  const limit = await checkInvoiceLimit(user.id, supabase)
  if (limit.status === 'limit_reached') {
    return {
      ok: false,
      error:
        'You have reached your Starter invoice limit. Upgrade to Pro for unlimited invoices.',
    }
  }

  const clientId = String(formData.get('client_id') ?? '').trim()
  const dueRaw = String(formData.get('due_date') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const statusDb = normalizeInvoiceStatusForDb(String(formData.get('status') ?? '').trim() || undefined)
  const lineItemsJson = String(formData.get('line_items_json') ?? '')

  if (!clientId || !dueRaw) {
    return { ok: false, error: 'Client and due date are required.' }
  }

  const lineItems = parseLineItemsFromFormJson(lineItemsJson)
  if (!lineItems?.length) {
    return { ok: false, error: 'Add at least one line item with a positive amount.' }
  }

  const taxable = roundMoney2(lineItems.reduce((s, row) => s + row.amount, 0))
  if (!Number.isFinite(taxable) || taxable <= 0) {
    return { ok: false, error: 'Enter a valid positive amount for each line item.' }
  }

  const { data: client, error: clientErr } = await supabase
    .from('clients')
    .select('id, state, name, company, phone, whatsapp_number')
    .eq('id', clientId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (clientErr) {
    console.log(clientErr)
    return { ok: false, error: clientErr.message }
  }
  if (!client) {
    return { ok: false, error: 'Pick a client that belongs to your account.' }
  }

  const tax = getTaxBreakdown(taxable, client.state)

  const amount_subtotal = roundMoney2(tax.subtotal)
  const cgst = roundMoney2(tax.cgst)
  const sgst = roundMoney2(tax.sgst)
  const igst = roundMoney2(tax.igst)
  /** Sum of component taxes (must match `tax.totalTax` from the same breakdown). */
  const gst_total = roundMoney2(cgst + sgst + igst)
  /** Payable total: subtotal + GST (same as `amount_subtotal + gst_total`). */
  const total_amount = roundMoney2(amount_subtotal + gst_total)

  const userId = user.id
  const { data, error } = await supabase.rpc('get_next_invoice_number', { p_user_id: userId })
  if (error) {
    console.error('[createInvoice] get_next_invoice_number:', error.message)
    return {
      ok: false,
      error:
        'Could not allocate an invoice number. If this persists after a refresh, contact support (database migration may be pending).',
    }
  }
  const nextInvoiceNumber = invoiceNumberFromRpcData(data)
  if (!nextInvoiceNumber) {
    console.error('RPC returned empty or invalid shape:', data)
    return { ok: false, error: 'Could not format invoice number.' }
  }

  const insertPayload = {
    user_id: user.id,
    client_id: clientId,
    invoice_number: nextInvoiceNumber,
    amount_subtotal,
    taxable_value: amount_subtotal,
    cgst,
    sgst,
    igst,
    cgst_amount: cgst,
    sgst_amount: sgst,
    utgst: 0,
    gst_rate: DEFAULT_GST_RATE_PERCENT,
    gst_total,
    total_amount,
    due_date: dueRaw,
    status: statusDb,
    reminder_count: 0,
    description: description || null,
    line_items: lineItems,
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[createInvoice] Supabase insert keys:', Object.keys(insertPayload))
    console.log('[createInvoice] GST row:', {
      amount_subtotal,
      cgst,
      sgst,
      igst,
      gst_total,
      total_amount,
      taxBreakdownGrandTotal: tax.grandTotal,
      taxBreakdownTotalTax: tax.totalTax,
    })
  }

  const { data: insertedRows, error: insertErr } = await supabase
    .from('invoices')
    .insert(insertPayload)
    .select('id')

  if (insertErr) {
    console.log(insertErr)
    return { ok: false, error: insertErr.message }
  }
  const inserted = insertedRows?.[0]
  if (!inserted?.id) {
    return { ok: false, error: 'Invoice was not created.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/invoices')
  revalidatePath('/invoices/new')
  revalidatePath('/analytics')
  revalidatePath('/clients')
  return { ok: true, invoiceId: inserted.id as string }
}

/**
 * Persists the public client portal URL for sharing.
 * Pass `publicOriginFromClient` from the browser (`window.location.origin`) so the saved link matches the site you’re on.
 */
export async function saveInvoicePortalPaymentLink(
  invoiceId: string,
  publicOriginFromClient?: string
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'You must be signed in.' }
  }

  const id = invoiceId.trim()
  if (!id) {
    return { ok: false, error: 'Invalid invoice.' }
  }

  let base = ''
  const fromClient = publicOriginFromClient?.trim()
  if (fromClient) {
    const normalized = normalizeHttpOrigin(fromClient)
    if (normalized) {
      base = normalized
    }
  }
  if (!base) {
    const h = await headers()
    base = getPublicBaseUrlFromHeaders(h)
    if (!base) {
      base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? ''
    }
  }
  if (!base) {
    return { ok: false, error: 'Could not determine app URL. Open the dashboard in the browser or set NEXT_PUBLIC_APP_URL.' }
  }

  const url = `${base.replace(/\/$/, '')}/portal/${id}`

  const { error } = await supabase
    .from('invoices')
    .update({ payment_link_url: url })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.log(error)
    return { ok: false, error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/invoices')
  revalidatePath('/analytics')
  revalidatePath(`/portal/${id}`)
  return { ok: true, url }
}
