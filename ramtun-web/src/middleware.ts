import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'


// Narrow cookie options to avoid `any` while remaining compatible with Next.js cookies API
type CookieOptions = {
  maxAge?: number
  expires?: Date
  httpOnly?: boolean
  secure?: boolean
  path?: string
  domain?: string
  sameSite?: 'strict' | 'lax' | 'none'
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Create a response object to pass to supabase
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  // Protect generator routes - Teacher access only
  if (pathname.startsWith('/generator')) {
    console.log('🔒 Middleware: Protecting generator route')

    // Check if user is authenticated
    if (!session?.user) {
      console.log('❌ Middleware: No session, redirecting to login')
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user has teacher role
    const userRole = session.user.user_metadata?.role
    console.log('👤 Middleware: User role:', userRole)

    if (userRole !== 'teacher') {
      console.log('🚫 Middleware: Non-teacher access denied, redirecting')

      // Redirect based on actual role
      if (userRole === 'student') {
        return NextResponse.redirect(new URL('/student', request.url))
      } else {
        // Unknown role or no role, redirect to login
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }

    console.log('✅ Middleware: Teacher access granted')
  }

  // Note: Dashboard routes (/dashboard and /student) are protected by RoleProtection components, not middleware
  // This prevents conflicts with AuthRedirect component and ensures consistent authentication flow

  return response
}

export const config = {
  matcher: [
    '/generator/:path*'
    // '/dashboard/:path*', // Removed to prevent conflicts with AuthRedirect
    // '/student/:path*'    // Removed to prevent conflicts with AuthRedirect
    // Both dashboard routes are now protected by RoleProtection components
  ]
}
