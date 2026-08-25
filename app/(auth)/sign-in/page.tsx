import SignInForm from '@/components/auth/SignInForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk',
  description:
    'Masuk ke akun Klipa kamu untuk mulai membuat campaign atau submit klip.',
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return <SignInForm />;
}
