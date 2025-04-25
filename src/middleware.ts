import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = [
  '/login',
  '/register',
  '/reset-password',
  '/forgot-password',
  '/verify-otp',
]

const protectedRoutes = [
  '/',
  '/contributions',
  '/coordinators',
  '/events',
  '/faculties',
  '/guests',
  '/managers',
  '/students',
]

export async function middleware(request: NextRequest) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  const pathStartsWith = (prefixes: string[]) =>
    prefixes.some((prefix) => pathname.startsWith(prefix))

  // Helper function to handle redirection
  const redirectTo = (path: string, redirectFrom?: string) => {
    if (pathname === path) {
      return NextResponse.next()
    }
    const absoluteURL = new URL(path, request.nextUrl.origin)

    if (redirectFrom) {
      absoluteURL.searchParams.set('redirectFrom', redirectFrom)
    }
    return NextResponse.redirect(absoluteURL.toString())
  }

  if (session) {
    if (publicRoutes.includes(pathname)) {
      return redirectTo('/')
    }
    return NextResponse.next()
  } else {
    if (pathStartsWith(protectedRoutes)) {
      return redirectTo('/login', pathname)
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
}
