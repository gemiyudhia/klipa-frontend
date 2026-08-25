import AdminUsersPage from "@/components/admin/AdminUsersPage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelola User',
  description: 'Kelola akun user, termasuk suspend dan unsuspend.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminUsersPage />;
}
