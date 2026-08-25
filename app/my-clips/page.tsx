import Submissions from '@/components/submission/Submission'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Klip Saya',
  description: 'Pantau status klip yang sudah kamu submit dan cuan yang masuk.',
  robots: { index: false, follow: false },
};

export default function MyClipPage() {
  return (
    <Submissions />
  )
}
