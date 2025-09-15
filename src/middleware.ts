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

  if (isPublicPath) {
    if (payload) {
      return NextResponse.redirect(new URL('/profile', request.url))
    }
    return NextResponse.next()
  }

  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (payload.role === 'participant' && !payload.teamId && !['/join-team', '/create-team'].includes(path)) {
    return NextResponse.redirect(new URL('/join-team', request.url))
  }

  // if (payload.role === 'participant' && payload.teamId && ['/join-team', '/create-team'].includes(path)) {
  //   return NextResponse.redirect(new URL('/profile', request.url))
  // }

  if (path === '/create-team' && payload.teamId) {
    return NextResponse.redirect(new URL('/role-selection', request.url))
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
    '/create-team',
    
  ]
}
