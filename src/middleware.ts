import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = ['/login', '/signup', '/verifyemail']

async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.TOKEN_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload // return decoded payload
  } catch (err) {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = PUBLIC_PATHS.includes(path)

  const token = request.cookies.get('token')?.value || ''
  const payload = token ? await verifyToken(token) : null

  // If user is logged in
  if (payload) {
    // and tries to access a public path, redirect them to their dashboard
    if (isPublicPath) {
      if (payload.role === 'core_member') {
        return NextResponse.redirect(new URL('/core-member', request.url))
      }
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Role-based access control for core_member
    if (payload.role === 'core_member') {
      // If a core_member is not on a core-member path, redirect them.
      if (!path.startsWith('/core-member')) {
        return NextResponse.redirect(new URL('/core-member', request.url))
      }
    } else {
      // If any other logged-in user tries to access a core-member path, redirect them.
      if (path.startsWith('/core-member')) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Special check for participants without a team
    if (payload.role === 'participant' && !payload.teamId && path !== '/join-team') {
      return NextResponse.redirect(new URL('/join-team', request.url))
    }
  }

  // If user is not logged in and tries to access a private path, redirect to login
  if (!payload && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/profile',
    '/profile/:path*',
    '/login',
    '/signup',
    '/verifyemail',
    '/join-team',
    '/core-member',
    '/core-member/:path*',
  ]
}
