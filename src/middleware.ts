import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('auth-token')
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isLoginPage = request.nextUrl.pathname === '/login'

  // Redirect authenticated users trying to access auth pages to home
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect unauthenticated users to login page (except if they're already on login page)
  if (!isAuthenticated && !isLoginPage && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
