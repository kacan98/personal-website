import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Get the Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  
  // Check if this is a root request (no locale in path)
  const { pathname } = request.nextUrl;
  const isRootRequest = pathname === '/';
  
  if (isRootRequest && acceptLanguage) {
    // Parse accept-language header to find preferred languages
    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase());
    
    // Check if any preferred language matches our supported locales
    let targetLocale = 'en'; // Default to English
    
    for (const lang of languages) {
      if (lang.startsWith('da')) {
        targetLocale = 'da';
        break;
      } else if (lang.startsWith('sv')) {
        targetLocale = 'sv';
        break;
      } else if (lang.startsWith('en')) {
        targetLocale = 'en';
        break;
      }
    }
    
    // Redirect to the determined locale
    const url = request.nextUrl.clone();
    url.pathname = `/${targetLocale}`;
    return Response.redirect(url);
  }
  
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames, exclude API routes, static files, and icon routes
  matcher: ['/((?!api|_next|_vercel|icon|favicon|.*\\..*).*)']
};