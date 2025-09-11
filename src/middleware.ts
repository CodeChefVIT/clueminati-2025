// import { NextResponse, NextRequest } from 'next/server'
// import jwt from 'jsonwebtoken'

// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname

//   const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail'

//   const token = request.cookies.get('token')?.value || ''
  
//   // For public paths
//   if (isPublicPath) {
//     if (token) {
//       try {
//         // Verify token
//         jwt.verify(token, process.env.TOKEN_SECRET!)
//         // If token is valid, redirect to profile
//         return NextResponse.redirect(new URL('/profile', request.url))
//       } catch (error) {
//         // If token is invalid, let them access public paths
//         return NextResponse.next()
//       }
//     }
//     // No token, allow access to public paths
//     return NextResponse.next()
//   }

//   // For protected paths
//   if (!token) {
//     // No token, redirect to login
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   try {
//     // Verify token for protected paths
//     jwt.verify(token, process.env.TOKEN_SECRET!)
//     // Token is valid, allow access
//     return NextResponse.next()
//   } catch (error) {
//     // Token is invalid, redirect to login and clear the token
//     const response = NextResponse.redirect(new URL('/login', request.url))
//     console.log("my error",error)
//     //response.cookies.delete('token')
//     return response
//   }
// }
 
// export const config = {
//   matcher: [
//     '/',
//     '/profile',
//     '/profile/:path*',
//     '/login',
//     '/signup',
//     '/verifyemail'
//   ]
// } 

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
