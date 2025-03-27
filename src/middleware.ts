import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check for admin authentication
  const {
    data: { session }
  } = await supabase.auth.getSession();

  // Admin email (replace with your actual admin email)
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // Log middleware checks for debugging
  console.log('Middleware - Session:', session);
  console.log('Middleware - Admin Email:', ADMIN_EMAIL);
  console.log('Middleware - Current Path:', req.nextUrl.pathname);

  // Redirect to login if not authenticated or not admin for admin routes
  if (
    req.nextUrl.pathname.startsWith('/admin') && 
    (!session || session.user.email !== ADMIN_EMAIL)
  ) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*']
};