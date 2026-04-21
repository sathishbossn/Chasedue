import { renderChaseDueInvoicePdf } from '@/lib/invoice/render-chase-due-invoice-pdf'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

function safeFilenamePart(s: string): string {
  return String(s).replace(/[^\w.\-]+/g, '_').slice(0, 80) || 'invoice'
}

type RouteCtx = { params: Promise<{ id: string }> }

/**
 * Canonical invoice PDF: `GET /api/invoices/[id]/pdf`
 * (`/api/invoices/pdf?id=` redirects here for backward compatibility.)
 *
 * Logo: `renderChaseDueInvoicePdf` passes `logoUrl` = `{NEXT_PUBLIC_APP_URL}/logo-icon.png` to `@react-pdf/renderer`.
 */
export async function GET(_req: NextRequest, ctx: RouteCtx) {
  try {
    const { id: invoiceId } = await ctx.params
    if (!invoiceId?.trim()) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    let buffer: Buffer
    let invoiceNumber: string
    try {
      const result = await renderChaseDueInvoicePdf(supabase, invoiceId.trim())
      buffer = result.buffer
      invoiceNumber = result.invoiceNumber
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg.includes('not found') || msg === 'Invoice not found') {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
      }
      console.error('[PDF route id] renderChaseDueInvoicePdf:', e)
      return NextResponse.json({ error: msg || 'PDF generation failed' }, { status: 500 })
    }

    const fn = safeFilenamePart(`Invoice-${invoiceNumber}`)

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fn}.pdf"`,
      },
    })
  } catch (err: unknown) {
    console.error('[PDF route id] failed:', err)
    const message = err instanceof Error ? err.message : 'PDF generation failed'
    return NextResponse.json({ error: message || 'PDF generation failed' }, { status: 500 })
  }
}
