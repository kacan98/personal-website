import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'da'],
  
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Enable automatic locale detection from browser
  localeDetection: true,
  
  // Customize locale prefix (optional)
  localePrefix: 'always'
});