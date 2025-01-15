import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import NextAuth from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authConfig } from './auth.config';

const protectedRoutes = ['/success', '/payment', '/bookings'];
const defaultLocale = 'en';
const locales = ['bn', 'en'];
const ROOT = '/';

const { auth } = NextAuth(authConfig);

// Function to get the locale from the request's Accept-Language header
function getLocale(request: NextRequest): string {
  const acceptedLanguage = request.headers.get('accept-language') ?? undefined;
  const headers = { 'accept-language': acceptedLanguage };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

export default auth(async function middleware(request: NextRequest): Promise<NextResponse | void> {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isAuthenticated = !!request.auth;

  // Skip API routes explicitly
  if (pathname.startsWith('/api')) {
    return;
  }

  // Check for protected routes and handle redirection for unauthenticated users
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // Check if pathname contains a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}`));

  // If no locale is present, redirect to the default or detected locale
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, nextUrl.origin));
  }

  // Ensure the `page` query parameter is set to 1 if missing
  const urlSearchParams = new URLSearchParams(nextUrl.search);

  if (!urlSearchParams.has('page')) {
    urlSearchParams.set('page', '1');
    return NextResponse.redirect(new URL(`${pathname}?${urlSearchParams.toString()}`, nextUrl.origin));
  }

  // No redirect necessary, just continue the request
});

export const config = {
  matcher: [
    '/((?!api|assets|_next|.*\\..*).*)',  // Exclude API and static assets
    '/',  // Include the root URL
  ],
};