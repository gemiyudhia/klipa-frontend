import RoleSelectorForm from '@/components/auth/RoleSelectorForm';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pilih Peran',
  description:
    'Lengkapi profil kamu dengan memilih peran sebagai Creator atau Clipper.',
  robots: { index: false, follow: false },
};

export default function RoleSelectorPage() {
  return (
    <Suspense fallback={null}>
      <RoleSelectorForm />;
    </Suspense>
  );
}
