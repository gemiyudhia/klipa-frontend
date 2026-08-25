import AdminDisputesPage from "@/components/admin/AdminDisputesPage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelola Dispute',
  description: 'Tinjau dan selesaikan sengketa yang diajukan Clipper.',
  robots: { index: false, follow: false },
}; 

export default function Page() {
  return <AdminDisputesPage />;
}
