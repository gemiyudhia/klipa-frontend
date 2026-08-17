'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { Clapperboard, Play, Check, X as XIcon } from 'lucide-react';

import { getClipsByCampaign, reviewClip, type Clip } from '@/lib/api/clip';
import { getCampaignDetail, type Campaign } from '@/lib/api/campaign';
import VerticalVideoModal from './VerticalVideoModal';
import RejectReasonModal from './RejectReasonModal';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

export default function ClipReviewWorkspace() {
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewClip, setPreviewClip] = useState<Clip | null>(null);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [campaignData, clipsResult] = await Promise.all([
        getCampaignDetail(campaignId),
        getClipsByCampaign(campaignId),
      ]);
      setCampaign(campaignData);
      setClips(clipsResult.data.filter((c) => c.status === 'PENDING'));
    } catch (error) {
      toast.error('Gagal memuat data klip');
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleApprove(clip: Clip) {
    setProcessingId(clip.id);
    try {
      await reviewClip(clip.id, { status: 'APPROVED' });
      toast.success(
        `Klip "${clip.title}" disetujui! Cuan langsung cair ke Clipper.`,
      );
      setClips((prev) => prev.filter((c) => c.id !== clip.id));
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Gagal approve klip';
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(reason: string) {
    if (!rejectTargetId) return;
    setProcessingId(rejectTargetId);
    try {
      await reviewClip(rejectTargetId, {
        status: 'REJECTED',
        feedback: reason,
      });
      toast.success('Klip berhasil ditolak, budget dikembalikan ke campaign.');
      setClips((prev) => prev.filter((c) => c.id !== rejectTargetId));
      setRejectTargetId(null);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Gagal menolak klip';
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="min-h-screen py-44 px-4 md:px-12">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="relative rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-8">
              <div className="absolute -right-3 -top-5 rotate-12 rounded-xl border-4 border-black bg-[#FFDE59] p-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:rotate-0 md:-right-4 md:-top-6">
                <Clapperboard className="h-6 w-6 stroke-[2.5] text-black md:h-8 md:w-8" />
              </div>

              <h1 className="text-3xl font-black uppercase tracking-tight text-black md:text-4xl">
                Review Klip Masuk
              </h1>
              <p className="mt-2 text-sm font-bold text-gray-700 md:text-base">
                {campaign ? campaign.title : 'Lagi ngambil data campaign...'}
              </p>
              <p className="mt-1 text-xs font-bold uppercase text-gray-500">
                {clips.length} klip nunggu di-review
              </p>
            </div>

            {isLoading ? (
              <div className="rounded-2xl border-4 border-black bg-white p-12 text-center">
                <p className="text-lg font-black uppercase">
                  Lagi Ngambil Data...
                </p>
              </div>
            ) : clips.length === 0 ? (
              <div className="rounded-2xl border-4 border-black bg-white p-12 text-center">
                <p className="text-lg font-black uppercase">
                  Semua Klip Udah Di-review!
                </p>
                <p className="mt-1 text-sm font-medium text-gray-600">
                  Tidak ada klip pending saat ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {clips.map((clip) => {
                  const isProcessing = processingId === clip.id;

                  return (
                    <div
                      key={clip.id}
                      className="flex flex-col justify-between overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <button
                        onClick={() => setPreviewClip(clip)}
                        className="relative aspect-4/3 w-full overflow-hidden border-b-4 border-black bg-gray-100"
                      >
                        {clip.thumbnailUrl ? (
                          <Image
                            src={clip.thumbnailUrl}
                            alt={clip.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <Clapperboard className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full border-3 border-white bg-black/60">
                            <Play className="ml-1 h-6 w-6 fill-white stroke-white" />
                          </div>
                        </div>
                      </button>

                      <div className="p-5">
                        <h3 className="truncate text-lg font-black text-black">
                          {clip.title}
                        </h3>
                        <p className="mt-1 truncate text-xs font-bold text-gray-600">
                          {new Date(clip.createdAt).toLocaleDateString(
                            'id-ID',
                            {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </p>
                      </div>

                      <div className="flex gap-2 border-t-3 border-black p-3">
                        <button
                          onClick={() => handleApprove(clip)}
                          disabled={isProcessing}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-3 border-black bg-[#7ED957] py-2.5 text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
                        >
                          <Check className="h-4 w-4 stroke-3" /> Approve
                        </button>
                        <button
                          onClick={() => setRejectTargetId(clip.id)}
                          disabled={isProcessing}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-3 border-black bg-[#FF4848] py-2.5 text-xs font-black uppercase text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
                        >
                          <XIcon className="h-4 w-4 stroke-3" /> Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {previewClip && (
            <VerticalVideoModal
              clip={previewClip}
              onClose={() => setPreviewClip(null)}
            />
          )}

          {rejectTargetId && (
            <RejectReasonModal
              onClose={() => setRejectTargetId(null)}
              onConfirm={handleReject}
            />
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
