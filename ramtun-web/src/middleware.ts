import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Create a response object to pass to supabase
  const res = NextResponse.next()
  
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req: request, res })
  
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
  
  return res
}

export const config = {
  matcher: [
    '/generator/:path*'
    // '/dashboard/:path*', // Removed to prevent conflicts with AuthRedirect
    // '/student/:path*'    // Removed to prevent conflicts with AuthRedirect
    // Both dashboard routes are now protected by RoleProtection components
  ]
}
