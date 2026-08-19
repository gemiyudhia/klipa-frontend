'use client';

import { useEffect, useState, useCallback } from 'react';
import { History } from 'lucide-react';
import { toast } from 'sonner';

import { formatCurrency } from '@/lib/campaign-utils';
import { getMyWithdrawals, Withdrawal } from '@/lib/withdrawal';

function getStatusMeta(status: Withdrawal['status']) {
  switch (status) {
    case 'PENDING':
      return { label: 'MENUNGGU', className: 'bg-[#FFDE59] text-black' };
    case 'APPROVED':
      return { label: 'CAIR', className: 'bg-[#7ED957] text-black' };
    case 'REJECTED':
      return { label: 'DITOLAK', className: 'bg-[#FF4848] text-white' };
  }
}

export interface WithdrawalHistoryRef {
  refresh: () => void;
}

export default function WithdrawalHistory({
  refreshKey,
}: {
  refreshKey: number;
}) {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getMyWithdrawals();
      setWithdrawals(result.data);
    } catch (error) {
      toast.error('Gagal memuat riwayat penarikan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  return (
    <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-4 flex items-center gap-2">
        <History className="h-5 w-5 text-black" />
        <h2 className="text-lg font-black uppercase text-black">
          Riwayat Penarikan
        </h2>
      </div>

      {isLoading ? (
        <p className="text-sm font-bold text-gray-500">Lagi ngambil data...</p>
      ) : withdrawals.length === 0 ? (
        <p className="text-sm font-bold text-gray-500">
          Belum ada riwayat penarikan.
        </p>
      ) : (
        <div className="space-y-3">
          {withdrawals.map((wd) => {
            const meta = getStatusMeta(wd.status);
            return (
              <div
                key={wd.id}
                className="flex items-center justify-between rounded-xl border-2 border-black bg-[#F8F8F6] p-3"
              >
                <div>
                  <p className="text-sm font-black text-black">
                    {formatCurrency(wd.amount)}
                  </p>
                  <p className="text-[10px] font-bold text-gray-500">
                    {new Date(wd.createdAt).toLocaleDateString('id-ID')}
                    {wd.netAmount != null &&
                      ` • Diterima ${formatCurrency(wd.netAmount)}`}
                  </p>
                  {wd.rejectionReason && (
                    <p className="text-[10px] font-bold text-red-600">
                      {wd.rejectionReason}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-md border-2 border-black px-2.5 py-1 text-[10px] font-black uppercase ${meta.className}`}
                >
                  {meta.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
