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

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // Handle root URL redirection to /en?page=1 or /bn?page=1
  if (pathname === ROOT || pathname === `/${defaultLocale}` || pathname === `/${locales[1]}`) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}?page=1`, nextUrl.origin));
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, nextUrl.origin));
  }

  const urlSearchParams = new URLSearchParams(nextUrl.search);

  if (!urlSearchParams.has('page')) {
    urlSearchParams.set('page', '1');
    return NextResponse.redirect(new URL(`${pathname}?${urlSearchParams.toString()}`, nextUrl.origin));
  }
});

export const config = {
  matcher: [
    '/((?!api|assets|_next|.*\\..*).*)',
    '/',
  ],
};