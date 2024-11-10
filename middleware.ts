import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Add security headers
  const headers = new Headers(request.headers)
  
  // CORS headers
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Security headers
  headers.set('X-DNS-Prefetch-Control', 'on')
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  headers.set('X-Frame-Options', 'SAMEORIGIN')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return NextResponse.next({
    request: {
      headers,
    },
  })
}