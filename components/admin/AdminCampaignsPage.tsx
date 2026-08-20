'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Ban } from 'lucide-react';

import { getPublicCampaigns, type Campaign } from '@/lib/api/campaign';
import { closeCampaign } from '@/lib/api/admin';
import { formatCurrency, formatDate } from '@/lib/campaign-utils';
import AdminSidebar from './AdminSidebar';
import SuspendModal from './SuspendModal';

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [closeTarget, setCloseTarget] = useState<Campaign | null>(null);

  async function fetchCampaigns() {
    setIsLoading(true);
    try {
      const result = await getPublicCampaigns();
      setCampaigns(result.data);
    } catch (error) {
      toast.error('Gagal memuat campaign');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function handleClose(reason: string) {
    if (!closeTarget) return;
    try {
      await closeCampaign(closeTarget.id, reason);
      toast.success('Campaign berhasil ditutup');
      setCloseTarget(null);
      fetchCampaigns();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal menutup campaign');
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row">
        <AdminSidebar />

        <div className="flex-1 space-y-6">
          <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black uppercase tracking-tight text-black">
              Kelola Campaign
            </h1>
            <p className="mt-1 text-sm font-bold text-gray-700">
              Tutup paksa campaign yang melanggar.
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border-4 border-black bg-white p-12 text-center">
              <p className="text-lg font-black uppercase">
                Lagi Ngambil Data...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col items-start justify-between gap-3 rounded-2xl border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:flex-row md:items-center"
                >
                  <div>
                    <p className="font-black text-black">{c.title}</p>
                    <p className="text-xs font-bold text-gray-600">
                      Budget: {formatCurrency(c.totalBudget)} • Deadline:{' '}
                      {formatDate(c.deadline)}
                    </p>
                    <span className="mt-1 inline-block rounded-md border-2 border-black bg-[#F4F4F5] px-2 py-0.5 text-[10px] font-black uppercase">
                      {c.status}
                    </span>
                  </div>

                  {c.status !== 'BANNED' && c.status !== 'COMPLETED' && (
                    <button
                      onClick={() => setCloseTarget(c)}
                      className="flex items-center gap-1.5 rounded-lg border-2 border-black bg-[#FF4848] px-3 py-2 text-xs font-black uppercase text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <Ban className="h-4 w-4" /> Tutup Paksa
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {closeTarget && (
        <SuspendModal
          userName={closeTarget.title}
          onClose={() => setCloseTarget(null)}
          onConfirm={handleClose}
        />
      )}
    </div>
  );
}
