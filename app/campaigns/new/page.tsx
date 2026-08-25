import CreateCampaignPage from '@/components/campaign/CreateCampaignPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buat Campaign Baru',
  description:
    'Buat campaign baru, tentukan reward per klip dan budget escrow.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CreateCampaignPage />;
}
