import SignUpForm from '@/components/auth/SignUpForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar Akun',
  description:
    'Daftar sebagai Creator atau Clipper dan mulai berkarya di Klipa.',
  robots: { index: false, follow: false },
};
export default function SignUpPage() {
  return <SignUpForm />;
}
