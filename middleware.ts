import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { authConfig } from '@/lib/auth.config';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = authConfig.protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the route is auth-only (login, signup, etc.)
  const isAuthRoute = authConfig.authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', pathname);
    return Response.redirect(url);
  }

  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = authConfig.redirects.afterLogin;
    return Response.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
