import { notFound } from 'next/navigation';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CampaignDetailClient from '@/components/campaign/CampaignDetailClient';
import { getCampaignDetailServer } from '@/lib/api/server-campaign';

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const campaign = await getCampaignDetailServer(id);

  if (!campaign) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <section className="flex-1">
        <CampaignDetailClient campaign={campaign} />
      </section>

      <Footer />
    </main>
  );
}
