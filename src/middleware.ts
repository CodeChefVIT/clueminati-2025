import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = ['/login', '/signup', '/verifyemail']

async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(process.env.TOKEN_SECRET)
    await jwtVerify(token, secret)
    return true
  } catch (err) {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = PUBLIC_PATHS.includes(path)

  const token = request.cookies.get('token')?.value || ''

  if (isPublicPath) {
    if (token && await verifyToken(token)) {
      // Token is valid → redirect to profile
      return NextResponse.redirect(new URL('/profile', request.url))
    }
    // No token or invalid → allow access to public path
    return NextResponse.next()
  }

  // For protected paths
  if (!token || !(await verifyToken(token))) {
    // No token or invalid → redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url))
    // Optionally: response.cookies.delete('token')
    return response
  }

  // Token is valid → allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/profile',
    '/profile/:path*',
    '/login',
    '/signup',
    '/verifyemail'
  ]
}
