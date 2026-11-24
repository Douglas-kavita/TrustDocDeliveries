import { NextResponse } from 'next/server'

const LOGIN_PATH = '/auth/login'
const SESSION_COOKIE = 'trustdoc_staff_session'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Public authentication endpoints must remain reachable.
  if (
    pathname === LOGIN_PATH ||
    pathname.startsWith('/api/session') ||
    pathname.startsWith('/api/logout')
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (!token) {
    const login = new URL(LOGIN_PATH, request.url)
    login.searchParams.set('next', pathname)
    return NextResponse.redirect(login)
  }

  const apiBase = process.env.TRUSTDOC_API_URL
  const requiredRole = process.env.STAFF_ROLE || 'admin'

  if (!apiBase) {
    return new NextResponse('Admin authentication is unavailable: API URL is not configured.', {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  try {
    const response = await fetch(new URL('/api/auth/me', apiBase), {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!response.ok) {
      const login = new URL(LOGIN_PATH, request.url)
      login.searchParams.set('next', pathname)
      const redirectResponse = NextResponse.redirect(login)
      redirectResponse.cookies.delete(SESSION_COOKIE)
      return redirectResponse
    }

    const identity = await response.json()
    if (!Array.isArray(identity.roles) || !identity.roles.includes(requiredRole)) {
      return new NextResponse('Forbidden: this account is not authorized for the Admin portal.', {
        status: 403,
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    return NextResponse.next()
  } catch {
    return new NextResponse('Unable to verify Admin session. Please try again.', {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    })
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
