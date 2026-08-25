import WalletPage from "@/components/wallet/WalletPage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wallet',
  description:
    'Kelola saldo, top up, info rekening, dan riwayat penarikan dana kamu.',
  robots: { index: false, follow: false },
};

export default function MyWalletPage() {
  return <WalletPage />;
}
