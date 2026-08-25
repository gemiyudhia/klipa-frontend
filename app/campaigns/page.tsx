import MyCampaignsPage from '@/components/campaign/MyCampaignPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campaign Saya',
  description:
    'Kelola campaign yang kamu buat dan pantau progres klip yang masuk.',
  robots: { index: false, follow: false },
};

export default function MyCampaignPage() {
  return <MyCampaignsPage />;
}
