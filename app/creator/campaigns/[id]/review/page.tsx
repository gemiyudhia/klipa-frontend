import ClipReviewWorkspace from '@/components/clip/ClipReviewWorkspace';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Review Klip Masuk',
  description: 'Tinjau dan setujui klip yang masuk untuk campaign kamu.',
  robots: { index: false, follow: false },
};

export default function CreatorCampaingReviewPage() {
  return (
    <div className="flex-1">
      <ClipReviewWorkspace />
    </div>
  );
}
