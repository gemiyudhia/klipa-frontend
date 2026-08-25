import AdminCampaignsPage from "@/components/admin/AdminCampaignsPage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelola Campaign',
  description: 'Moderasi campaign yang melanggar ketentuan platform.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminCampaignsPage />;
}
