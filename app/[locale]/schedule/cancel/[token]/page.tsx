import CancelBookingPage from '@/components/pages/schedule/CancelBookingPage';

interface Props {
  params: Promise<{ token: string }>;
}

export default async function CancelPage({ params }: Props) {
  const { token } = await params;
  return <CancelBookingPage token={token} />;
}
