import ProfilePage from '@/components/profile/ProfilePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profil Saya',
  description: 'Kelola informasi profil akun Klipa kamu.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ProfilePage />;
}
