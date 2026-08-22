'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

import {
  getPendingDisputes,
  resolveDispute,
  type Dispute,
} from '@/lib/api/dispute';
import AdminSidebar from './AdminSidebar';

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function fetchDisputes() {
    setIsLoading(true);
    try {
      const result = await getPendingDisputes();
      setDisputes(result.data);
    } catch (error) {
      toast.error('Gagal memuat dispute');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDisputes();
  }, []);

  async function handleResolve(id: string, status: 'APPROVED' | 'REJECTED') {
    setProcessingId(id);
    try {
      await resolveDispute(id, {
        status,
        resolutionNote:
          status === 'APPROVED' ? 'Disetujui admin' : 'Ditolak admin',
      });
      toast.success(
        `Dispute berhasil di${status === 'APPROVED' ? 'setujui' : 'tolak'}`,
      );
      setDisputes((prev) => prev.filter((d) => d.id !== id));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal proses dispute');
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row">
        <AdminSidebar />

        <div className="flex-1 space-y-6">
          <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black uppercase tracking-tight text-black">
              Dispute Pending
            </h1>
            <p className="mt-1 text-sm font-bold text-gray-700">
              {disputes.length} dispute nunggu keputusan.
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border-4 border-black bg-white p-12 text-center">
              <p className="text-lg font-black uppercase">
                Lagi Ngambil Data...
              </p>
            </div>
          ) : disputes.length === 0 ? (
            <div className="rounded-2xl border-4 border-black bg-white p-12 text-center">
              <p className="text-lg font-black uppercase">
                Tidak Ada Dispute Pending
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {disputes.map((d) => {
                const isProcessing = processingId === d.id;
                return (
                  <div
                    key={d.id}
                    className="rounded-2xl border-4 border-black bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <p className="text-xs font-black uppercase text-gray-500">
                      Klip: {d.clip.title}
                    </p>
                    <div className="mt-2 rounded-xl border-2 border-black bg-[#F4F4F5] p-3">
                      <p className="text-[10px] font-black uppercase text-gray-500">
                        Alasan Clipper
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {d.reason}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleResolve(d.id, 'APPROVED')}
                        disabled={isProcessing}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-3 border-black bg-[#7ED957] py-2.5 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" /> Setujui
                      </button>
                      <button
                        onClick={() => handleResolve(d.id, 'REJECTED')}
                        disabled={isProcessing}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-3 border-black bg-[#FF4848] py-2.5 text-xs font-black uppercase text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                      >
                        <X className="h-4 w-4" /> Tolak
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
