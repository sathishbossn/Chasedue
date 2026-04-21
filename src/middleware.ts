import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Public routes — never redirect to login or return 404 from middleware.
 * `/portal` and `/portal/:path*` (e.g. `/portal/[id]`) must stay reachable without auth.
 */
export const PUBLIC_ROUTE_PREFIXES = [
  '/portal',
  '/pay',
  '/login',
  '/auth',
  '/api/webhooks',
  '/api/razorpay',
  '/api/paypal',
  '/privacy',
  '/terms',
] as const

function isPublicPath(pathname: string): boolean {
  if (pathname === '/') return true
  return PUBLIC_ROUTE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Future: e.g. redirect unauthenticated users away from protected routes.
  // Do not add logic that blocks `/portal` — keep it in PUBLIC_ROUTE_PREFIXES above.
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
