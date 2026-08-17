'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Scale, MessageSquareWarning } from 'lucide-react';
import { toast } from 'sonner';

import { getMyDisputes, type Dispute } from '@/lib/api/dispute';
import { getDisputeStatusMeta } from '@/lib/dispute-utils';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

export default function DisputesListPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDisputes() {
      setIsLoading(true);
      try {
        const result = await getMyDisputes();
        setDisputes(result.data);
      } catch (error) {
        toast.error('Gagal memuat dispute lu');
      } finally {
        setIsLoading(false);
      }
    }
    fetchDisputes();
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="min-h-screen py-44 px-4 md:px-12">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="relative rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-8">
              <div className="absolute -right-3 -top-5 rotate-12 rounded-xl border-4 border-black bg-[#FF66C4] p-2.5 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:rotate-0 md:-right-4 md:-top-6">
                <Scale className="h-6 w-6 stroke-[2.5] md:h-8 md:w-8" />
              </div>

              <h1 className="text-3xl font-black uppercase tracking-tight text-black md:text-4xl">
                Dispute Gue
              </h1>
              <p className="mt-2 text-sm font-bold text-gray-700 md:text-base">
                Pantau status sengketa klip yang lu ajukan ke Admin.
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
                <MessageSquareWarning className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                <p className="text-lg font-black uppercase">
                  Belum Ada Dispute
                </p>
                <p className="mt-1 text-sm font-medium text-gray-600">
                  Kalau klip lu ditolak sepihak, lu bisa ajukan dispute dari
                  halaman{' '}
                  <Link
                    href="/my-clips"
                    className="font-black text-black underline"
                  >
                    Klip Gue
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {disputes.map((dispute) => {
                  const statusMeta = getDisputeStatusMeta(dispute.status);

                  return (
                    <div
                      key={dispute.id}
                      className="rounded-2xl border-4 border-black bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-black uppercase text-gray-500">
                            Klip: {dispute.clip.title}
                          </p>
                          <p className="mt-0.5 text-[11px] font-bold text-gray-400">
                            {new Date(dispute.createdAt).toLocaleDateString(
                              'id-ID',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              },
                            )}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-md border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${statusMeta.badgeClass}`}
                        >
                          {statusMeta.label}
                        </span>
                      </div>

                      <div className="rounded-xl border-2 border-black bg-[#F4F4F5] p-3">
                        <p className="text-[10px] font-black uppercase text-gray-500">
                          Alasan Lu
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {dispute.reason}
                        </p>
                      </div>

                      {dispute.resolutionNote && (
                        <div
                          className={`mt-3 rounded-xl border-2 border-black p-3 ${
                            dispute.status === 'APPROVED'
                              ? 'bg-[#7ED957]/20'
                              : 'bg-[#FF4848]/10'
                          }`}
                        >
                          <p className="text-[10px] font-black uppercase text-gray-500">
                            Keputusan Admin
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {dispute.resolutionNote}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
