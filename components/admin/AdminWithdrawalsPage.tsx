'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

import { formatCurrency } from '@/lib/campaign-utils';
import AdminSidebar from './AdminSidebar';
import { getPendingWithdrawals, resolveWithdrawal } from '@/lib/withdrawal';

interface WithdrawalWithUser {
  id: string;
  amount: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
    bankName: string;
    bankAccountNumber: string;
    bankAccountName: string;
  };
}

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function fetchWithdrawals() {
    setIsLoading(true);
    try {
      const result = await getPendingWithdrawals();
      setWithdrawals(result.data as any);
    } catch (error) {
      toast.error('Gagal memuat data withdrawal');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  async function handleResolve(id: string, status: 'APPROVED' | 'REJECTED') {
    setProcessingId(id);
    try {
      await resolveWithdrawal(id, {
        status,
        rejectionReason: status === 'REJECTED' ? 'Ditolak admin' : undefined,
      });
      toast.success(
        `Withdrawal berhasil di${status === 'APPROVED' ? 'setujui' : 'tolak'}`,
      );
      setWithdrawals((prev) => prev.filter((w) => w.id !== id));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal proses withdrawal');
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
              Withdrawal Pending
            </h1>
            <p className="mt-1 text-sm font-bold text-gray-700">
              {withdrawals.length} permintaan nunggu approve.
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border-4 border-black bg-white p-12 text-center">
              <p className="text-lg font-black uppercase">
                Lagi Ngambil Data...
              </p>
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="rounded-2xl border-4 border-black bg-white p-12 text-center">
              <p className="text-lg font-black uppercase">
                Tidak Ada Withdrawal Pending
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((w) => {
                const isProcessing = processingId === w.id;
                return (
                  <div
                    key={w.id}
                    className="rounded-2xl border-4 border-black bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="font-black text-black">{w.user.name}</p>
                        <p className="text-xs font-bold text-gray-600">
                          {w.user.email}
                        </p>
                      </div>
                      <p className="text-xl font-black text-[#D90077]">
                        {formatCurrency(w.amount)}
                      </p>
                    </div>

                    <div className="rounded-xl border-2 border-black bg-[#F4F4F5] p-3 text-xs font-bold text-gray-700">
                      <p>
                        {w.user.bankName} — {w.user.bankAccountNumber}
                      </p>
                      <p>a.n. {w.user.bankAccountName}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleResolve(w.id, 'APPROVED')}
                        disabled={isProcessing}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-3 border-black bg-[#7ED957] py-2.5 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleResolve(w.id, 'REJECTED')}
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
