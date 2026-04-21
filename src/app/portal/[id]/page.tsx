import type { Metadata, Viewport } from 'next'
import { Suspense, type ReactNode } from 'react'
import Link from 'next/link'
import { createServiceRoleClient } from '@/lib/supabase/admin'
import { createPublicSupabaseAnonClient } from '@/lib/supabase/public'
import { getPortalBusinessDisplayName } from '@/lib/public-url'
import { isPaidInvoiceStatus } from '@/lib/invoice-paid'
import PortalInvoiceShell from '@/components/portal/portal-invoice-shell'
import PortalInvoiceNotFound from '@/components/portal/portal-invoice-not-found'

/**
 * Public client portal — no browser session required.
 * Prefers `get_portal_invoice` via NEXT_PUBLIC_SUPABASE_ANON_KEY (see migration); falls back to service role.
 */

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0B1220',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const short = id.slice(0, 8).toUpperCase()
  return {
    title: `Invoice ${short} | ChaseDue`,
    description: 'View your invoice and pay in INR (India) or USD via global options when available.',
    robots: { index: false, follow: false },
  }
}

function formatDue(ymd: string) {
  if (!ymd) return '—'
  const [y, m, d] = ymd.split('-').map(Number)
  if (!y || !m || !d) return ymd
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatPaidAt(iso: string | null | undefined): string | null {
  if (!iso) return null
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return null
  return new Date(t).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

function invoiceRefShort(id: string): string {
  return id.slice(0, 8).toUpperCase()
}

/** PostgREST passes this string as `uuid` — invalid strings cause RPC/500 errors. */
function isUuidForPortal(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.trim())
}

/**
 * RPC: `public.get_portal_invoice(p_invoice_id uuid)` — RETURNS TABLE (PostgREST returns a JSON array).
 * Includes seller/GST fields for PDF and compliance (see migration `invoice_counters_gst_pdf`).
 */
const GET_PORTAL_INVOICE_RPC = 'get_portal_invoice' as const

/** One row from `get_portal_invoice`. */
type PortalRpcRow = {
  id: string
  invoice_number: unknown
  client_name: unknown
  client_email: unknown
  client_gstin?: unknown
  amount: unknown
  status: unknown
  due_date: string
  taxable_value: unknown
  cgst_amount: unknown
  sgst_amount: unknown
  total_amount: unknown
  description: unknown
  created_at: unknown
  line_items?: unknown
  seller_business_name?: unknown
  seller_gstin?: unknown
  seller_state_code?: unknown
  seller_billing_address?: unknown
  seller_email?: unknown
}

function clientLabelFromRpc(row: PortalRpcRow): string {
  const name = row.client_name != null ? String(row.client_name).trim() : ''
  const email = row.client_email != null ? String(row.client_email).trim() : ''
  if (name) return name
  if (email) return email
  return 'Client'
}

/** PostgREST: TABLE-returning RPCs yield a JSON array; older jsonb RPCs yield one object. */
function parsePortalInvoiceRpcPayload(data: unknown): PortalRpcRow | null {
  if (data == null) return null
  if (Array.isArray(data)) {
    const row = data[0]
    if (row != null && typeof row === 'object' && 'id' in row) {
      return row as PortalRpcRow
    }
    return null
  }
  if (typeof data === 'object' && 'id' in data) {
    return data as PortalRpcRow
  }
  return null
}

function PortalConfigHint({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] min-h-screen flex-col items-center justify-center bg-[#0B1220] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-[max(1.5rem,env(safe-area-inset-top,0px))] text-center text-white">
      <p className="max-w-md text-sm leading-relaxed text-slate-soft">{children}</p>
      <Link href="/" className="mt-6 text-sm font-medium text-brand-400 hover:underline">
        Back to home
      </Link>
    </div>
  )
}

type PortalPageProps = {
  params: Promise<{ id: string }>
}

export default async function PortalPage({ params }: PortalPageProps) {
  let invoiceId = ''
  try {
    const { id: rawId } = await params
    invoiceId = rawId?.trim() ?? ''
  } catch {
    return <PortalInvoiceNotFound />
  }

  if (!invoiceId) {
    return <PortalInvoiceNotFound />
  }

  const businessName = getPortalBusinessDisplayName()
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  const hasService = !!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!hasUrl || (!hasAnon && !hasService)) {
    return (
      <PortalConfigHint>
        This payment page isn&apos;t available right now. Please try again later or contact the business that sent you
        this link.
      </PortalConfigHint>
    )
  }

  let inv: PortalRpcRow | null = null
  let clientLabel = 'Client'
  /** Only set on service-role fallback (RPC payload has no `paid_at`). */
  let paidAtFromDb: string | null | undefined = undefined
  /** Only set on service-role fallback (not part of `PortalRpcRow`). */
  let lemonSqueezyVariantId: string | null = null

  const anon = createPublicSupabaseAnonClient()
  let rpcFailed = false
  if (anon && isUuidForPortal(invoiceId)) {
    const { data, error } = await anon.rpc(GET_PORTAL_INVOICE_RPC, { p_invoice_id: invoiceId })
    if (error) {
      console.error('[portal] get_portal_invoice', error.code, error.message, error.details)
      rpcFailed = true
    } else {
      inv = parsePortalInvoiceRpcPayload(data)
      if (inv) {
        clientLabel = clientLabelFromRpc(inv)
      } else {
        return <PortalInvoiceNotFound invoiceId={invoiceId} />
      }
    }
  }

  const admin = createServiceRoleClient()
  if (!inv && admin) {
    try {
      const { data, error } = await admin
        .from('invoices')
        .select(
          'id, invoice_number, total_amount, amount, status, due_date, description, created_at, paid_at, taxable_value, taxable_amount, amount_subtotal, cgst_amount, cgst, sgst_amount, sgst, client_id, lemon_squeezy_variant_id'
        )
        .eq('id', invoiceId)
        .maybeSingle()

      if (error) {
        console.error('[portal] invoice query', error)
      }
      if (!error && data) {
        type InvoiceFallback = {
          id: string
          invoice_number?: unknown
          total_amount: unknown
          amount?: unknown
          status: unknown
          due_date: string
          description: unknown
          created_at?: unknown
          paid_at?: unknown
          taxable_value?: unknown
          taxable_amount?: unknown
          amount_subtotal?: unknown
          cgst_amount?: unknown
          cgst?: unknown
          sgst_amount?: unknown
          sgst?: unknown
          client_id?: string | null
          lemon_squeezy_variant_id?: unknown
        }
        const row = data as InvoiceFallback
        paidAtFromDb = row.paid_at != null ? String(row.paid_at) : null
        lemonSqueezyVariantId =
          row.lemon_squeezy_variant_id != null ? String(row.lemon_squeezy_variant_id).trim() : null

        let client_name: unknown = null
        let client_email: unknown = null
        const cid = row.client_id
        if (cid) {
          try {
            const { data: cli } = await admin.from('clients').select('name, company').eq('id', cid).maybeSingle()
            client_name = cli?.name ?? null
            client_email = null
            const name = client_name != null ? String(client_name).trim() : ''
            const company = cli?.company?.trim() ?? ''
            if (name) {
              clientLabel = company ? `${name} · ${company}` : name
            }
          } catch (e) {
            console.error('[portal] client query', e)
          }
        }

        inv = {
          id: row.id,
          invoice_number: row.invoice_number ?? null,
          client_name,
          client_email,
          amount: row.amount ?? null,
          status: row.status,
          due_date: row.due_date,
          taxable_value: row.taxable_value ?? row.taxable_amount ?? row.amount_subtotal ?? null,
          cgst_amount: row.cgst_amount ?? row.cgst ?? null,
          sgst_amount: row.sgst_amount ?? row.sgst ?? null,
          total_amount: row.total_amount,
          description: row.description,
          created_at: row.created_at ?? null,
        }
        if (clientLabel === 'Client') {
          clientLabel = clientLabelFromRpc(inv)
        }
      }
    } catch (e) {
      console.error('[portal] fetch', e)
    }
  }

  if (!inv) {
    if (rpcFailed && anon && !admin) {
      return (
        <PortalConfigHint>
          We couldn&apos;t load this invoice right now. Please refresh the page, or ask the sender to check their setup
          and resend your link.
        </PortalConfigHint>
      )
    }
    return <PortalInvoiceNotFound invoiceId={invoiceId} />
  }

  const paid = isPaidInvoiceStatus(String(inv.status))
  const totalForAmount = inv.total_amount ?? inv.amount
  const amountCents = Math.round(Number(totalForAmount) * 100)
  const desc = String(inv.description ?? '').trim()
  const invNum = inv.invoice_number != null ? String(inv.invoice_number).trim() : ''
  const invRef = invNum || invoiceRefShort(inv.id)
  const amountNum = Number(totalForAmount)

  const cgstAmt = Number(inv.cgst_amount ?? 0)
  const sgstAmt = Number(inv.sgst_amount ?? 0)
  const gst = {
    taxableAmount: Number(inv.taxable_value ?? 0),
    cgst: cgstAmt,
    sgst: sgstAmt,
    igst: 0,
    utgst: 0,
    gstTotal: cgstAmt + sgstAmt,
    gstRatePercent: null,
  }

  const canPay = !paid
  const paidAtLabel = formatPaidAt(paidAtFromDb !== undefined ? paidAtFromDb : null)

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] min-h-screen items-center justify-center bg-[#0B1220] px-4 text-sm text-slate-soft">
          Loading invoice…
        </div>
      }
    >
      <PortalInvoiceShell
        initiallyPaid={paid}
        invoiceId={inv.id}
        amount={amountNum}
        amountCents={amountCents}
        currency="INR"
        description={desc}
        dueDateFormatted={formatDue(inv.due_date)}
        clientLabel={clientLabel}
        businessName={businessName}
        invRef={invRef}
        gst={gst}
        canPay={canPay}
        statusLabel={String(inv.status ?? '').trim() || 'PENDING'}
        historicalPaidAt={paid ? paidAtLabel : null}
        lemonSqueezyVariantId={lemonSqueezyVariantId}
      />
    </Suspense>
  )
}
