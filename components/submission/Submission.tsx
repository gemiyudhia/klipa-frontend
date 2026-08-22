'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Clapperboard } from 'lucide-react';
import { toast } from 'sonner';

import { getMyClips, type Clip } from '@/lib/api/clip';
import { formatCurrency, getStatusMeta } from '@/lib/clip-utils';
import DisputeModal from '../dispute/DisputeModal';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

type ClipFilter =
  | 'ALL'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'REVISION_REQUESTED';

export default function Submissions() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<ClipFilter>('ALL');
  const [disputeTargetId, setDisputeTargetId] = useState<string | null>(null);

  const fetchClips = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getMyClips();
      setClips(result.data);
    } catch (error) {
      toast.error('Gagal memuat klip lu');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClips();
  }, [fetchClips]);

  const filteredClips = clips.filter((clip) => {
    if (selectedFilter === 'ALL') return true;
    return clip.status === selectedFilter;
  });

  const filters: { key: ClipFilter; label: string; activeClass: string }[] = [
    { key: 'ALL', label: 'Semua', activeClass: 'bg-[#FFDE59] text-black' },
    {
      key: 'PENDING',
      label: 'Sabar Ya',
      activeClass: 'bg-[#FFDE59] text-black',
    },
    {
      key: 'REVISION_REQUESTED',
      label: 'Revisi Dulu',
      activeClass: 'bg-[#38B6FF] text-white',
    },
    {
      key: 'APPROVED',
      label: 'Mantap',
      activeClass: 'bg-[#7ED957] text-black',
    },
    {
      key: 'REJECTED',
      label: 'Ditolak',
      activeClass: 'bg-[#FF4848] text-white',
    },
  ];

  return (
    <>
      <Navbar />
      <div className="w-full max-w-6xl mx-auto px-4 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="relative bg-white border-4 border-black p-6 md:p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="absolute -top-5 -right-3 md:-top-6 md:-right-4 bg-[#FFDE59] border-4 border-black p-2.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-12 hover:rotate-0 transition-transform">
              <Clapperboard className="w-6 h-6 md:w-8 md:h-8 text-black stroke-[2.5]" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase">
              Klip Gue
            </h1>
            <p className="text-sm md:text-base font-bold text-gray-700 mt-2">
              Atur klip yang udah lu kirim, pantau statusnya, dan liat cuan yang
              masuk.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-6 py-2.5 rounded-xl border-3 border-black font-black text-sm uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                  selectedFilter === filter.key
                    ? filter.activeClass
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="bg-white border-4 border-black rounded-2xl p-12 text-center">
              <p className="text-lg font-black uppercase">
                Lagi Ngambil Data...
              </p>
            </div>
          ) : filteredClips.length === 0 ? (
            <div className="bg-white border-4 border-black rounded-2xl p-12 text-center">
              <p className="text-lg font-black uppercase">Belum Ada Klip Nih</p>
              <p className="text-sm font-medium text-gray-600 mt-1">
                Yuk cari bounty di halaman Explore!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {filteredClips.map((clip) => {
                const statusMeta = getStatusMeta(clip.status);
                const isApproved = clip.status === 'APPROVED';
                const isRejected = clip.status === 'REJECTED';

                return (
                  <div
                    key={clip.id}
                    className="bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between overflow-hidden hover:-translate-y-1 transition-transform"
                  >
                    <div>
                      <div className="relative w-full aspect-4/3 bg-gray-100 border-b-4 border-black overflow-hidden">
                        {clip.thumbnailUrl ? (
                          <Image
                            src={clip.thumbnailUrl}
                            alt={clip.title}
                            fill
                            className={`object-cover ${isRejected ? 'grayscale opacity-75' : ''}`}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <Clapperboard className="h-10 w-10 text-gray-400" />
                          </div>
                        )}

                        <div className="absolute top-3 left-3">
                          <span
                            className={`text-xs font-black px-3 py-1 rounded-md border-2 border-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${statusMeta.badgeClass}`}
                          >
                            {statusMeta.label}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3
                          className={`text-xl font-black text-black truncate ${
                            isRejected
                              ? 'line-through decoration-[#FF4848] decoration-4'
                              : ''
                          }`}
                        >
                          {clip.title}
                        </h3>
                        <p className="text-xs font-bold text-gray-600 mt-1 truncate">
                          Campaign: {clip.campaign.title}
                        </p>
                        {clip.status === 'REJECTED' && clip.feedback && (
                          <p className="text-xs font-bold text-red-600 mt-1 truncate">
                            Alasan: {clip.feedback}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 border-t-3 border-black flex items-center justify-between mt-2">
                      <div>
                        <span className="text-[11px] font-black uppercase text-gray-500 block">
                          {isApproved ? 'Cuan' : 'Est. Cuan'}
                        </span>
                        <span
                          className={`text-xl font-black ${
                            isApproved
                              ? 'text-[#16A34A]'
                              : isRejected
                                ? 'text-black'
                                : 'text-gray-400'
                          }`}
                        >
                          {isApproved && clip.payoutAmount
                            ? formatCurrency(clip.payoutAmount)
                            : isRejected
                              ? formatCurrency(0)
                              : '--'}
                        </span>
                      </div>

                      {isRejected ? (
                        <button
                          onClick={() => setDisputeTargetId(clip.id)}
                          className="bg-white hover:bg-[#FF66C4]/10 text-[#FF66C4] font-black text-xs px-4 py-2.5 rounded-lg border-3 border-[#FF66C4] shadow-[3px_3px_0px_0px_#FF66C4] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all uppercase cursor-pointer"
                        >
                          Gak Terima
                        </button>
                      ) : (
                        <span className="text-black font-black text-xs px-4 py-2.5">
                          {clip.status === 'PENDING' && 'Nunggu Review'}
                          {clip.status === 'REVISION_REQUESTED' &&
                            'Perlu Revisi'}
                          {clip.status === 'APPROVED' && 'Selesai'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {disputeTargetId && (
          <DisputeModal
            clipId={disputeTargetId}
            onClose={() => setDisputeTargetId(null)}
            onSuccess={fetchClips}
          />
        )}
      </div>

      <Footer />
    </>
  );
}
