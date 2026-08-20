'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Users,
  Megaphone,
  Film,
  Scale,
  Wallet,
  TrendingUp,
} from 'lucide-react';

import { getAnalytics, type Analytics } from '@/lib/api/admin';
import { formatCurrency } from '@/lib/campaign-utils';
import AdminSidebar from './AdminSidebar';

function StatCard({
  icon: Icon,
  label,
  value,
  bgClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  bgClass: string;
}) {
  return (
    <div
      className={`rounded-2xl border-4 border-black p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${bgClass}`}
    >
      <Icon className="mb-2 h-6 w-6 text-black" />
      <p className="text-[10px] font-black uppercase text-black/70">{label}</p>
      <p className="text-2xl font-black text-black">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (error) {
        toast.error('Gagal memuat analytics');
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row">
        <AdminSidebar />

        <div className="flex-1 space-y-6">
          <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black uppercase tracking-tight text-black">
              Dashboard
            </h1>
            <p className="mt-1 text-sm font-bold text-gray-700">
              Ringkasan aktivitas platform Klipa.
            </p>
          </div>

          {isLoading || !analytics ? (
            <div className="rounded-2xl border-4 border-black bg-white p-12 text-center">
              <p className="text-lg font-black uppercase">
                Lagi Ngambil Data...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                  icon={Users}
                  label="Total User"
                  value={analytics.users.total}
                  bgClass="bg-[#38B6FF]"
                />
                <StatCard
                  icon={Megaphone}
                  label="Total Campaign"
                  value={analytics.campaign.total}
                  bgClass="bg-[#FFDE59]"
                />
                <StatCard
                  icon={Film}
                  label="Total Klip"
                  value={analytics.clips.total}
                  bgClass="bg-[#7ED957]"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Total Revenue"
                  value={formatCurrency(analytics.revenue.total)}
                  bgClass="bg-[#FF66C4]"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase text-black">
                    <Scale className="h-4 w-4" /> Perlu Ditindak
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border-2 border-black bg-[#FFF4D6] p-3">
                      <span className="text-sm font-bold">Dispute Pending</span>
                      <span className="rounded-md border-2 border-black bg-white px-2 py-1 text-sm font-black">
                        {analytics.pendingActions.disputes}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border-2 border-black bg-[#FFF4D6] p-3">
                      <span className="text-sm font-bold">
                        Withdrawal Pending
                      </span>
                      <span className="rounded-md border-2 border-black bg-white px-2 py-1 text-sm font-black">
                        {analytics.pendingActions.withdrawals}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase text-black">
                    <Wallet className="h-4 w-4" /> Revenue by Source
                  </h3>
                  <div className="space-y-3">
                    {analytics.revenue.bySource.map((item) => (
                      <div
                        key={item.source}
                        className="flex items-center justify-between rounded-xl border-2 border-black bg-[#F4F4F5] p-3"
                      >
                        <span className="text-sm font-bold">{item.source}</span>
                        <span className="text-sm font-black text-[#16A34A]">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="mb-4 text-sm font-black uppercase text-black">
                    User by Role
                  </h3>
                  <div className="space-y-2">
                    {analytics.users.byRole.map((item) => (
                      <div
                        key={item.role}
                        className="flex justify-between text-sm font-bold"
                      >
                        <span className="text-gray-600">{item.role}</span>
                        <span className="text-black">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="mb-4 text-sm font-black uppercase text-black">
                    Campaign by Status
                  </h3>
                  <div className="space-y-2">
                    {analytics.campaign.byStatus.map((item) => (
                      <div
                        key={item.status}
                        className="flex justify-between text-sm font-bold"
                      >
                        <span className="text-gray-600">{item.status}</span>
                        <span className="text-black">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
