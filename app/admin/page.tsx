import AdminDashboardPage from "@/components/admin/AdminDashboardPage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Admin',
  description: 'Ringkasan statistik dan aktivitas platform Klipa.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminDashboardPage />;
}
