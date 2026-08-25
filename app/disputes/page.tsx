import DisputesListPage from '@/components/dispute/DisputeListPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dispute Saya',
  description:
    'Pantau status sengketa yang kamu ajukan atas klip yang ditolak.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DisputesListPage />;
}
