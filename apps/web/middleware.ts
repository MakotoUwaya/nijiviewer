import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Node.jsランタイムを使用
export const runtime = 'nodejs';

export async function middleware(_request: NextRequest) {
  // Temporarily disable middleware to avoid edge runtime issues
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - flow-sample (exclude flow-sample page due to WebAssembly requirements)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|flow-sample).*)',
  ],
};
