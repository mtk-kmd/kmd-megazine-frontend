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

  // Check if the path exactly matches or starts with any of the prefixes
  const isPublicRoute = publicRoutes.includes(pathname) || 
    publicRoutes.some(route => pathname.startsWith(`${route}/`))
  
  const isProtectedRoute = protectedRoutes.includes(pathname) || 
    protectedRoutes.some(route => pathname.startsWith(`${route}/`))

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


  if (session && session.is_authenticated) {
    // Authenticated users shouldn't access public routes
    if (isPublicRoute) {
      return redirectTo('/')
    }
    return NextResponse.next()
  } else {
    // Unauthenticated users can't access protected routes
    if (isProtectedRoute) {
      return redirectTo('/login', pathname)
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
}
