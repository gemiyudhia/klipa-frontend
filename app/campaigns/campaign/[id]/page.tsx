import MyCampaignsPage from '@/components/campaign/MyCampaignPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detail Campaign',
  description:
    'Lihat detail campaign, reward per klip, dan syarat submit klip.',
};

export default function CampaignPage() {
  return <MyCampaignsPage />;
}
