'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getTaxBreakdown } from '@/lib/get-tax-breakdown'
import { DEFAULT_GST_RATE_PERCENT } from '@/lib/gst'
import { INVOICE_STATUS_DB, isPaidInvoiceStatus } from '@/lib/invoice-paid'
import { ReminderService } from '@/lib/reminder-service'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { invoiceNumberFromRpcData } from '@/lib/invoice/invoice-number-from-rpc'
import { checkInvoiceLimit } from '@/lib/usage-limit'

/** Latest WhatsApp Cloud API log row for an invoice (if any). */
export type WhatsappDeliverySummary = {
  status: string
  error_detail: string | null
} | null

export type DashboardInvoiceRow = {
  id: string
  invoice_number: string | null
  client_id: string
  /** External pay link (UPI, hosted checkout, etc.) — dashboard Pay opens this when set. */
  payment_link_url: string | null
  /** Payable total incl. GST (Razorpay / collection). */
  total_amount: number
  /** Pre-GST taxable base. */
  amount_subtotal: number | null
  due_date: string
  status: string
  description: string | null
  reminder_count: number
  /** Last manual WhatsApp chase from dashboard (Chase Payment button). */
  last_reminder_sent: string | null
  last_chased_at: string | null
  created_at: string | null
  /** Set when payment is confirmed; used for 24h “recent paid” vs archived UI. */
  paid_at: string | null
  clients: {
    name: string
    company: string | null
    phone: string | null
    whatsapp_number: string | null
  } | null
  /** Latest `whatsapp_logs` status for this invoice (by `created_at`). */
  whatsapp_delivery: WhatsappDeliverySummary
}

export type DashboardExpenseRow = {
  id: string
  description: string
  amount: number
  created_at: string
  expense_date: string
  category: string | null
}

export type DashboardSnapshot = {
  userId: string
  userEmail: string | null
  /** From profiles, or Google OAuth user_metadata when no profile row */
  userDisplayName: string | null
  /** First name for “Welcome back, …” (Google given_name, profile, or known account fallback) */
  userWelcomeName: string | null
  outstandingCents: number
  collectedCents: number
  expenseTotalCents: number
  netPositionCents: number
  invoices: DashboardInvoiceRow[]
  expenses: DashboardExpenseRow[]
}

function toCents(n: number): number {
  return Math.round(Number(n) * 100)
}

function firstNameToken(name: string | null | undefined): string | null {
  if (!name) return null
  const t = String(name).trim()
  if (!t) return null
  const [first] = t.split(/\s+/)
  return first || null
}

export async function getDashboardSnapshot(): Promise<
  | { ok: true; data: DashboardSnapshot }
  | { ok: false; error: 'unauthorized' | 'unknown'; message?: string }
> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'unauthorized' }
  }

  const uid = user.id

  await ReminderService.syncOverdueForUser(supabase, uid)

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, business_name')
    .eq('id', uid)
    .maybeSingle()

  const meta = user.user_metadata ?? {}
  const metaName =
    typeof meta.full_name === 'string'
      ? meta.full_name
      : typeof meta.name === 'string'
        ? meta.name
        : null

  const userDisplayName =
    (profile?.full_name && String(profile.full_name).trim()) ||
    (profile?.business_name && String(profile.business_name).trim()) ||
    (metaName && metaName.trim()) ||
    null

  const givenName =
    typeof meta.given_name === 'string' && meta.given_name.trim() ? meta.given_name.trim() : null

  const emailLower = user.email?.toLowerCase() ?? ''
  const userWelcomeName =
    givenName ||
    firstNameToken(profile?.full_name) ||
    firstNameToken(typeof meta.full_name === 'string' ? meta.full_name : null) ||
    firstNameToken(typeof meta.name === 'string' ? meta.name : null) ||
    (emailLower === 'sathish52g@gmail.com' ? 'Sathish' : null) ||
    null

  const { data: invoices, error: invErr } = await supabase
    .from('invoices')
    .select(
      'id, invoice_number, client_id, payment_link_url, total_amount, amount_subtotal, due_date, status, description, reminder_count, last_reminder_sent, last_chased_at, created_at, paid_at'
    )
    .eq('user_id', uid)
    .order('created_at', { ascending: false })
    .limit(200)

  if (invErr) {
    console.log(invErr)
    return { ok: false, error: 'unknown', message: invErr.message }
  }

  const invRaw = invoices ?? []
  const clientIds = [...new Set(invRaw.map((r) => r.client_id).filter(Boolean))]
  let clientMap: Record<
    string,
    { name: string; company: string | null; phone: string | null; whatsapp_number: string | null }
  > = {}

  if (clientIds.length > 0) {
    const { data: clientRows, error: cErr } = await supabase
      .from('clients')
      .select('id, name, company, phone, whatsapp_number')
      .in('id', clientIds)

    if (cErr) {
      console.log(cErr)
      return { ok: false, error: 'unknown', message: cErr.message }
    }
    clientMap = Object.fromEntries(
      (clientRows ?? []).map((c) => [
        c.id,
        { name: c.name, company: c.company, phone: c.phone, whatsapp_number: c.whatsapp_number },
      ])
    )
  }

  const { data: expenses, error: expErr } = await supabase
    .from('expenses')
    .select('id, description, amount, created_at, expense_date, category')
    .eq('user_id', uid)
    .order('expense_date', { ascending: false })
    .limit(50)

  if (expErr) {
    console.log(expErr)
    return { ok: false, error: 'unknown', message: expErr.message }
  }

  const invListBase = invRaw.map((row) => ({
    ...row,
    clients: clientMap[row.client_id] ?? null,
  }))

  const waByInvoice: Record<string, { status: string; error_detail: string | null }> = {}
  if (invListBase.length > 0) {
    const invIds = invListBase.map((r) => r.id)
    const { data: waRows, error: waErr } = await supabase
      .from('whatsapp_logs')
      .select('invoice_id, status, error_detail, created_at')
      .in('invoice_id', invIds)

    if (waErr) {
      console.log(waErr)
      return { ok: false, error: 'unknown', message: waErr.message }
    }

    const sorted = [...(waRows ?? [])].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    for (const r of sorted) {
      if (!r.invoice_id) continue
      if (!waByInvoice[r.invoice_id]) {
        waByInvoice[r.invoice_id] = { status: r.status, error_detail: r.error_detail }
      }
    }
  }

  const invList: DashboardInvoiceRow[] = invListBase.map((row) => ({
    ...row,
    whatsapp_delivery: waByInvoice[row.id] ?? null,
  }))
  const expList = (expenses ?? []) as DashboardExpenseRow[]

  let outstandingCents = 0
  let collectedCents = 0

  for (const row of invList) {
    const c = toCents(Number(row.total_amount ?? 0))
    if (isPaidInvoiceStatus(row.status)) {
      collectedCents += c
    } else {
      outstandingCents += c
    }
  }

  let expenseTotalCents = 0
  for (const e of expList) {
    expenseTotalCents += toCents(Number(e.amount))
  }

  const netPositionCents = collectedCents - expenseTotalCents

  return {
    ok: true,
    data: {
      userId: uid,
      userEmail: user.email ?? null,
      userDisplayName,
      userWelcomeName,
      outstandingCents,
      collectedCents,
      expenseTotalCents,
      netPositionCents,
      invoices: invList,
      expenses: expList,
    },
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export type RequestPaymentResult =
  | { ok: true }
  | { ok: false; error: string }

export async function requestPayment(formData: FormData): Promise<RequestPaymentResult> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'You must be signed in.' }
  }

  const clientId = String(formData.get('client_id') ?? '').trim()
  const amountRaw = String(formData.get('amount') ?? '').trim()
  const dueRaw = String(formData.get('due_date') ?? '').trim()

  if (!clientId || !amountRaw || !dueRaw) {
    return { ok: false, error: 'Client, amount, and due date are required.' }
  }

  const taxable = Number(amountRaw)
  if (!Number.isFinite(taxable) || taxable <= 0) {
    return { ok: false, error: 'Enter a valid positive amount.' }
  }

  const limit = await checkInvoiceLimit(user.id, supabase)
  if (limit.status === 'limit_reached') {
    return {
      ok: false,
      error:
        'You have reached your Starter invoice limit. Upgrade to Pro for unlimited invoices.',
    }
  }

  const { data: client, error: clientErr } = await supabase
    .from('clients')
    .select('id, state')
    .eq('id', clientId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (clientErr || !client) {
    return { ok: false, error: 'Invalid client selection.' }
  }

  const tax = getTaxBreakdown(taxable, client.state)

  const round2 = (n: number) => Math.round(Number(n) * 100) / 100
  const amount_subtotal = round2(tax.subtotal)
  const cgst = round2(tax.cgst)
  const sgst = round2(tax.sgst)
  const igst = round2(tax.igst)
  const gst_total = round2(cgst + sgst + igst)
  const total_amount = round2(amount_subtotal + gst_total)

  const userId = user.id
  const { data, error } = await supabase.rpc('get_next_invoice_number', { p_user_id: userId })
  if (error) {
    console.error('[requestPayment] get_next_invoice_number:', error.message)
    return {
      ok: false,
      error:
        'Could not allocate an invoice number. Try again, or contact support if database migrations are pending.',
    }
  }
  const nextInvoiceNumber = invoiceNumberFromRpcData(data)
  if (!nextInvoiceNumber) {
    console.error('RPC returned empty or invalid shape:', data)
    return { ok: false, error: 'Could not format invoice number.' }
  }

  const { error: insertErr } = await supabase.from('invoices').insert({
    user_id: user.id,
    client_id: clientId,
    invoice_number: nextInvoiceNumber,
    amount_subtotal,
    cgst,
    sgst,
    igst,
    utgst: 0,
    gst_rate: DEFAULT_GST_RATE_PERCENT,
    gst_total,
    total_amount,
    due_date: dueRaw,
    status: INVOICE_STATUS_DB.PENDING,
    reminder_count: 0,
  })

  if (insertErr) {
    console.log(insertErr)
    return { ok: false, error: insertErr.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/invoices')
  revalidatePath('/invoices/new')
  revalidatePath('/analytics')
  return { ok: true }
}

export async function listClientsForUser(): Promise<
  { ok: true; clients: { id: string; name: string; company: string | null }[] } | { ok: false; error: string }
> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'unauthorized' }
  }

  const { data, error } = await supabase
    .from('clients')
    .select('id, name, company')
    .eq('user_id', user.id)
    .order('name')

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true, clients: data ?? [] }
}

/**
 * Called after the Chase Payment WhatsApp link opens: increments `reminder_count`,
 * sets `last_reminder_sent`, and mirrors `last_chased_at` for the invoices table "Last" column.
 */
export async function recordChaseReminderSent(
  invoiceId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'You must be signed in.' }
  }

  const id = String(invoiceId ?? '').trim()
  if (!id) {
    return { ok: false, error: 'Invalid invoice.' }
  }

  const { data: cur, error: fetchErr } = await supabase
    .from('invoices')
    .select('id, reminder_count')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (fetchErr) {
    console.log(fetchErr)
    return { ok: false, error: fetchErr.message }
  }
  if (!cur) {
    return { ok: false, error: 'Invoice not found.' }
  }

  const next = Math.max(0, Math.round(Number(cur.reminder_count ?? 0))) + 1
  const nowIso = new Date().toISOString()

  const { error: upErr } = await supabase
    .from('invoices')
    .update({
      reminder_count: next,
      last_reminder_sent: nowIso,
      last_chased_at: nowIso,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (upErr) {
    console.log(upErr)
    return { ok: false, error: upErr.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/invoices')
  revalidatePath('/analytics')
  return { ok: true }
}

/**
 * Cash / bank / offline settlement: mark invoice paid and stamp `paid_at`.
 * Stored `status` is uppercase `PAID` (same as Razorpay verify) — displays as “Paid”.
 */
export async function markInvoicePaidManually(
  invoiceId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'You must be signed in.' }
  }

  const id = String(invoiceId ?? '').trim()
  if (!id) {
    return { ok: false, error: 'Invalid invoice.' }
  }

  const { data: row, error: fetchErr } = await supabase
    .from('invoices')
    .select('id, status')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (fetchErr) {
    console.log(fetchErr)
    return { ok: false, error: fetchErr.message }
  }
  if (!row) {
    return { ok: false, error: 'Invoice not found.' }
  }
  if (isPaidInvoiceStatus(row.status)) {
    return { ok: false, error: 'This invoice is already marked paid.' }
  }

  const nowIso = new Date().toISOString()

  const { error: upErr } = await supabase
    .from('invoices')
    .update({
      status: INVOICE_STATUS_DB.PAID,
      paid_at: nowIso,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (upErr) {
    console.log(upErr)
    return { ok: false, error: upErr.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/invoices')
  revalidatePath('/analytics')
  revalidatePath('/clients')
  return { ok: true }
}

export async function getInvoiceByIdForUser(
  invoiceId: string
): Promise<
  | { ok: true; invoice: DashboardInvoiceRow }
  | { ok: false; error: 'unauthorized' | 'not_found' | 'unknown'; message?: string }
> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'unauthorized' }
  }

  const { data: row, error: invErr } = await supabase
    .from('invoices')
    .select(
      'id, invoice_number, client_id, payment_link_url, total_amount, amount_subtotal, due_date, status, description, reminder_count, last_reminder_sent, last_chased_at, created_at, paid_at'
    )
    .eq('id', invoiceId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (invErr) {
    console.log(invErr)
    return { ok: false, error: 'unknown', message: invErr.message }
  }
  if (!row) {
    return { ok: false, error: 'not_found' }
  }

  let clients: DashboardInvoiceRow['clients'] = null
  if (row.client_id) {
    const { data: c } = await supabase
      .from('clients')
      .select('id, name, company, phone, whatsapp_number')
      .eq('id', row.client_id)
      .maybeSingle()
    if (c) {
      clients = {
        name: c.name,
        company: c.company,
        phone: c.phone,
        whatsapp_number: c.whatsapp_number,
      }
    }
  }

  let whatsapp_delivery: WhatsappDeliverySummary = null
  const { data: waRows } = await supabase
    .from('whatsapp_logs')
    .select('invoice_id, status, error_detail, created_at')
    .eq('invoice_id', row.id)
    .order('created_at', { ascending: false })
    .limit(1)

  const wa = waRows?.[0]
  if (wa) {
    whatsapp_delivery = { status: wa.status, error_detail: wa.error_detail }
  }

  const invoice: DashboardInvoiceRow = {
    ...row,
    clients,
    whatsapp_delivery,
  }

  return { ok: true, invoice }
}
