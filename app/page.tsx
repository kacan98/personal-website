import { redirect } from 'next/navigation';

export default function RootPage() {
  // This will be handled by middleware, but adding as fallback
  redirect('/en');
}