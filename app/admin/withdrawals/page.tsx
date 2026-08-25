import AdminWithdrawalsPage from "@/components/admin/AdminWithdrawalsPage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelola Withdrawal',
  description: 'Setujui atau tolak permintaan penarikan dana dari user.',
  robots: { index: false, follow: false },
}; 

export default function Page() {
  return <AdminWithdrawalsPage />;
}
