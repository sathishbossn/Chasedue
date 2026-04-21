'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { combineDialAndLocal } from '@/lib/phone-e164'

function friendlyClientInsertError(message: string): string {
  const m = String(message)
  if (/state/i.test(m) && /null|violates|check|constraint|not.?null|23502|23514/i.test(m)) {
    return 'Please choose a state for GST (place of supply).'
  }
  return m
}

export type ClientRecord = {
  id: string
  name: string
  company: string | null
  email: string | null
  phone: string | null
  whatsapp_number: string | null
  /** Place of supply for GST (e.g. Tamil Nadu). */
  state: string | null
  created_at: string | null
}

export type ClientWithStats = ClientRecord & {
  /** Sum of unpaid invoice amounts for this client (paise / cents scale, same as formatInrFromCents). */
  outstanding_cents: number
}

export type ClientDetailInvoiceRow = {
  id: string
  total_amount: number
  due_date: string
  status: string
  description: string | null
  created_at: string | null
  paid_at: string | null
  reminder_count: number
  last_reminder_sent: string | null
  last_chased_at: string | null
}

export async function getClientDetailForUser(clientId: string): Promise<
  | { ok: true; client: ClientRecord; invoices: ClientDetailInvoiceRow[] }
  | { ok: false; error: 'unauthorized' | 'not_found' | 'unknown'; message?: string }
> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'unauthorized' }
  }

  const { data: client, error: cErr } = await supabase
    .from('clients')
    .select('id, name, company, email, phone, whatsapp_number, state, created_at')
    .eq('id', clientId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (cErr) {
    return { ok: false, error: 'unknown', message: cErr.message }
  }
  if (!client) {
    return { ok: false, error: 'not_found' }
  }

  const { data: invRows, error: iErr } = await supabase
    .from('invoices')
    .select(
      'id, total_amount, due_date, status, description, created_at, paid_at, reminder_count, last_reminder_sent, last_chased_at'
    )
    .eq('user_id', user.id)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (iErr) {
    console.log(iErr)
    return { ok: false, error: 'unknown', message: iErr.message }
  }

  const invoices: ClientDetailInvoiceRow[] = (invRows ?? []).map((r) => ({
    id: r.id,
    total_amount: Number(r.total_amount),
    due_date: r.due_date,
    status: String(r.status),
    description: r.description,
    created_at: r.created_at,
    paid_at: r.paid_at,
    reminder_count: Math.max(0, Math.round(Number(r.reminder_count ?? 0))),
    last_reminder_sent: r.last_reminder_sent ?? null,
    last_chased_at: r.last_chased_at ?? null,
  }))

  return { ok: true, client, invoices }
}

export async function listClientsFull(): Promise<
  | { ok: true; clients: ClientRecord[] }
  | { ok: false; error: 'unauthorized' | 'unknown'; message?: string }
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
    .select('id, name, company, email, phone, whatsapp_number, state, created_at')
    .eq('user_id', user.id)
    .order('name')

  if (error) {
    return { ok: false, error: 'unknown', message: error.message }
  }

  return { ok: true, clients: data ?? [] }
}

const PAID_STATUSES = new Set(['paid', 'settled', 'received'])

export async function listClientsWithStats(): Promise<
  | { ok: true; clients: ClientWithStats[] }
  | { ok: false; error: 'unauthorized' | 'unknown'; message?: string }
> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'unauthorized' }
  }

  const { data: clientRows, error: cErr } = await supabase
    .from('clients')
    .select('id, name, company, email, phone, whatsapp_number, state, created_at')
    .eq('user_id', user.id)
    .order('name')

  if (cErr) {
    return { ok: false, error: 'unknown', message: cErr.message }
  }

  const clients = clientRows ?? []
  const { data: invRows, error: iErr } = await supabase
    .from('invoices')
    .select('client_id, total_amount, status')
    .eq('user_id', user.id)

  if (iErr) {
    console.log(iErr)
    return { ok: false, error: 'unknown', message: iErr.message }
  }

  const outstandingByClient: Record<string, number> = {}
  for (const row of invRows ?? []) {
    const cid = row.client_id as string
    if (!cid) continue
    const st = String(row.status).toLowerCase()
    if (PAID_STATUSES.has(st)) continue
    const cents = Math.round(Number(row.total_amount) * 100)
    if (!Number.isFinite(cents)) continue
    outstandingByClient[cid] = (outstandingByClient[cid] ?? 0) + cents
  }

  const withStats: ClientWithStats[] = clients.map((c) => ({
    ...c,
    outstanding_cents: outstandingByClient[c.id] ?? 0,
  }))

  return { ok: true, clients: withStats }
}

export async function createClient(formData: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'You must be signed in.' }
  }

  const clientId = String(formData.get('client_id') ?? '').trim()
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const company = String(formData.get('company') ?? '').trim()
  const state = String(formData.get('state') ?? '').trim()
  const dial = String(formData.get('phone_dial') ?? '+91').trim()
  const local = String(formData.get('phone_local') ?? '').trim()
  const phoneFull = String(formData.get('phone_full') ?? '').trim()
  const altWhatsapp = String(formData.get('whatsapp') ?? '').trim()

  if (!name) {
    return { ok: false, error: 'Name is required.' }
  }

  if (!state) {
    return { ok: false, error: 'Please choose a state for GST (place of supply).' }
  }

  let phoneE164 = ''
  if (altWhatsapp) {
    const raw = altWhatsapp.replace(/\s/g, '')
    if (!raw) {
      return { ok: false, error: 'Enter a valid WhatsApp number with country code.' }
    }
    phoneE164 = raw.startsWith('+') ? raw : `+${raw.replace(/\D/g, '')}`
  } else if (dial === '__full__') {
    const raw = phoneFull.replace(/\s/g, '')
    if (!raw) {
      return { ok: false, error: 'Enter a full WhatsApp number with country code.' }
    }
    phoneE164 = raw.startsWith('+') ? raw : `+${raw.replace(/\D/g, '')}`
  } else {
    phoneE164 = combineDialAndLocal(dial, local)
  }

  if (!phoneE164 || phoneE164.replace(/\D/g, '').length < 10) {
    return { ok: false, error: 'Enter a valid WhatsApp number with country code.' }
  }

  const row = {
    name,
    company: company || null,
    email: email || null,
    state,
    phone: phoneE164,
    whatsapp_number: phoneE164,
  }

  if (clientId) {
    const { data: existing, error: fetchErr } = await supabase
      .from('clients')
      .select('id')
      .eq('id', clientId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (fetchErr) {
      console.log(fetchErr)
      return { ok: false, error: fetchErr.message }
    }
    if (!existing) {
      return { ok: false, error: 'Client not found or access denied.' }
    }

    const { error } = await supabase.from('clients').update(row).eq('id', clientId).eq('user_id', user.id)

    if (error) {
      console.log(error)
      return { ok: false, error: friendlyClientInsertError(error.message) }
    }

    revalidatePath('/clients')
    revalidatePath(`/clients/${clientId}`)
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/invoices')
    revalidatePath('/invoices/new')
    return { ok: true }
  }

  /**
   * Account link: `user_id` = auth user (RLS, joins). We do not send `freelancer_id` — use a DB migration
   * to rename/sync columns if your project still expects that name.
   */
  const { error } = await supabase.from('clients').insert({
    user_id: user.id,
    ...row,
  })

  if (error) {
    console.log(error)
    return { ok: false, error: friendlyClientInsertError(error.message) }
  }

  revalidatePath('/clients')
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/invoices')
  revalidatePath('/invoices/new')
  return { ok: true }
}
