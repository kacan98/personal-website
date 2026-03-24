export const baseUrl =
  process.env.NEXT_PUBLIC_VERCEL_URL
  || process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
  || process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
  || (process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : '')
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '')
