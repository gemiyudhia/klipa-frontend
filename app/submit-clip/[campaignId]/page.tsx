import SubmitClip from '@/components/clip/SubmitCip';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Klip',
  description:
    'Kirim klip terbaik kamu untuk campaign ini dan dapatkan reward.',
  robots: { index: false, follow: false },
};

export default function SubmitClipPage() {
  return <SubmitClip />;
}
