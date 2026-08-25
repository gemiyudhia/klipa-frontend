import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import AuthHydrator from '@/components/auth/AuthHydrator';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: {
    default: 'Klipa — Platform Klip & Campaign untuk Creator dan Clipper',
    template: '%s | Klipa',
  },
  description:
    'Klipa menghubungkan Creator dengan Clipper lewat sistem campaign berbasis reward. Buat campaign, potong klip, dan dapatkan cuan dengan escrow otomatis.',
  keywords: ['klipa', 'clipper', 'creator', 'campaign', 'klip video', 'reward konten'],
  metadataBase: new URL('https://klipa-psi.vercel.app'),
  openGraph: {
    title: 'Klipa — Platform Klip & Campaign untuk Creator dan Clipper',
    description:
      'Buat campaign, potong klip, dan dapatkan cuan dengan sistem escrow otomatis.',
    siteName: 'Klipa',
    locale: 'id_ID',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} h-full antialiased scroll-smooth`}>
      <body className={`${spaceGrotesk.className} min-h-full flex flex-col tracking-wide`}>
        <AuthHydrator />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
