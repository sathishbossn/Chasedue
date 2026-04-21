import { NextRequest, NextResponse } from 'next/server'

/**
 * Backward compatibility: `GET /api/invoices/pdf?id=` → canonical `GET /api/invoices/[id]/pdf`
 */
export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get('id')
  if (!id?.trim()) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  const safe = encodeURIComponent(id.trim())
  return NextResponse.redirect(new URL(`/api/invoices/${safe}/pdf`, req.url), 307)
}
