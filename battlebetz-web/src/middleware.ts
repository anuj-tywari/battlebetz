import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/activity',
  '/tournaments/join',
  '/tournaments/place-bets',
];

// Routes that are only accessible to non-authenticated users
const authRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if token exists (user is authenticated)
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isAuthenticated = !!token;

  // Check if the current path requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Check if the current path is an auth route that should redirect if the user is already logged in
  const isAuthRoute = authRoutes.some(route => pathname === route);

  // Debug information to help identify issues
  console.log({
    pathname,
    isAuthenticated,
    isProtectedRoute,
    isAuthRoute,
    token: !!token,
  });

  // Redirect to login if trying to access a protected route while not authenticated
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  // Redirect to dashboard if trying to access an auth route while already authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Allow the request to proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - Static files (/_next/, /assets/, /favicon.ico, etc.)
     * - API routes (/api/*)
     */
    '/((?!_next/|public/|assets/|favicon.ico|api/).*)',
  ],
}; 