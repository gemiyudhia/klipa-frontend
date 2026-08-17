'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Link2, Check, ArrowRight, Sparkles } from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

import {
  submitClipSchema,
  SubmitClipValue,
} from '@/lib/validations/clip.schema';
import { submitClip } from '@/lib/api/clip';
import { getCampaignDetail, type Campaign } from '@/lib/api/campaign';
import { formatCurrency } from '@/lib/campaign-utils';

export default function SubmitClip() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.campaignId as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(true);
  const [isVertical, setIsVertical] = useState(false);
  const [isDurationValid, setIsDurationValid] = useState(false);

  const form = useForm<SubmitClipValue>({
    resolver: zodResolver(submitClipSchema),
    defaultValues: {
      title: '',
      videoUrl: '',
      thumbnailUrl: '',
      duration: undefined,
    },
  });

  useEffect(() => {
    async function fetchCampaign() {
      try {
        const data = await getCampaignDetail(campaignId);
        setCampaign(data);
      } catch (error) {
        toast.error('Campaign tidak ditemukan');
        router.push('/explore');
      } finally {
        setIsLoadingCampaign(false);
      }
    }
    fetchCampaign();
  }, [campaignId, router]);

  async function onSubmit(data: SubmitClipValue) {
    try {
      await submitClip({
        campaignId,
        title: data.title,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl || undefined,
        duration: data.duration,
      });
      toast.success('Klip berhasil disubmit! Nunggu di-review Creator.');
      router.push('/my-clips');
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Gagal submit klip, coba lagi';
      toast.error(Array.isArray(message) ? message[0] : message);
    }
  }

  const canSubmit =
    isVertical && isDurationValid && !form.formState.isSubmitting;

  if (isLoadingCampaign) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
        <Navbar />
        <main className="w-full max-w-6xl mx-auto px-4 pt-28 pb-16 md:pt-36 text-center">
          <p className="text-xl font-black uppercase">
            Lagi Ngambil Data Campaign...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="w-full max-w-6xl mx-auto px-4 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="bg-white border-4 border-black p-6 md:p-8 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FF66C4] text-white text-xs font-black px-3 py-1 rounded-md border-2 border-black uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Submit Bounty Clip
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight">
                {campaign.title}
              </h1>
              <p className="text-sm md:text-base font-bold text-gray-700 mt-1">
                Submit klip terbaik lu buat campaign ini. Pastiin formatnya
                bener biar cepet cair!
              </p>
            </div>

            <div className="bg-[#38B6FF] border-3 border-black p-3 md:p-4 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-black">
              <span className="text-xs font-black uppercase block text-black/80">
                Reward Klip
              </span>
              <span className="text-xl md:text-2xl font-black">
                {formatCurrency(campaign.rewardPerClip)}{' '}
                <span className="text-xs font-bold">/ klip</span>
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border-4 border-black p-5 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <label className="block text-xs font-black text-gray-700 uppercase mb-2">
                  Judul Klip
                </label>
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <input
                        {...field}
                        placeholder="Momen Clutch Ngeri"
                        className="w-full bg-[#F4F4F5] border-3 border-black rounded-xl px-4 py-3 text-sm font-bold text-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
                      />
                      {fieldState.error && (
                        <p className="mt-1 text-xs font-bold text-red-600">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="bg-white border-4 border-black p-5 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <label className="block text-xs font-black text-gray-700 uppercase mb-2">
                  Link Video (TikTok / Reels / YouTube)
                </label>
                <Controller
                  name="videoUrl"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 text-black">
                          <Link2 className="w-5 h-5" />
                        </div>
                        <input
                          {...field}
                          type="url"
                          placeholder="https://vt.tiktok.com/..."
                          className="w-full bg-[#F4F4F5] border-3 border-black rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
                        />
                      </div>
                      {fieldState.error && (
                        <p className="mt-1 text-xs font-bold text-red-600">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="bg-white border-4 border-black p-5 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <label className="block text-xs font-black text-gray-700 uppercase mb-2">
                  Link Thumbnail (Opsional)
                </label>
                <Controller
                  name="thumbnailUrl"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <input
                        {...field}
                        type="url"
                        placeholder="https://..."
                        className="w-full bg-[#F4F4F5] border-3 border-black rounded-xl px-4 py-3 text-sm font-bold text-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
                      />
                      {fieldState.error && (
                        <p className="mt-1 text-xs font-bold text-red-600">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="bg-white border-4 border-black p-5 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <label className="block text-xs font-black text-gray-700 uppercase mb-2">
                  Durasi Detik (Opsional)
                </label>
                <Controller
                  name="duration"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <input
                        {...field}
                        type="number"
                        placeholder="45"
                        className="w-full bg-[#F4F4F5] border-3 border-black rounded-xl px-4 py-3 text-sm font-bold text-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
                      />
                      {fieldState.error && (
                        <p className="mt-1 text-xs font-bold text-red-600">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="bg-[#E4E4E7] border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5">
                <div className="flex items-center justify-between border-b-2 border-black/20 pb-3">
                  <p className="text-xs font-black text-gray-800 uppercase tracking-wide">
                    Ceklis Kelayakan
                  </p>
                  <span className="text-[11px] font-bold text-gray-600">
                    Wajib Centang Semua
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center space-x-3 cursor-pointer select-none">
                    <div
                      onClick={() => setIsVertical(!isVertical)}
                      className="w-6 h-6 border-3 border-black rounded-lg flex items-center justify-center bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      {isVertical && (
                        <Check className="w-4 h-4 text-black stroke-[3.5]" />
                      )}
                    </div>
                    <span className="text-sm font-black text-black">
                      Format 9:16 (Vertical)
                    </span>
                  </label>
                  <span className="bg-[#FF66C4] text-white text-[10px] font-black px-2 py-0.5 rounded border-2 border-black uppercase shrink-0">
                    Syarat Wajib
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center space-x-3 cursor-pointer select-none">
                    <div
                      onClick={() => setIsDurationValid(!isDurationValid)}
                      className="w-6 h-6 border-3 border-black rounded-lg flex items-center justify-center bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      {isDurationValid && (
                        <Check className="w-4 h-4 text-black stroke-[3.5]" />
                      )}
                    </div>
                    <span className="text-sm font-black text-black">
                      Durasi 15-60 Detik
                    </span>
                  </label>
                  <span className="bg-[#FF66C4] text-white text-[10px] font-black px-2 py-0.5 rounded border-2 border-black uppercase shrink-0">
                    Syarat Wajib
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full font-black text-lg py-4 px-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${
                  canSubmit
                    ? 'bg-[#FFDE59] hover:bg-[#FFE680] text-black active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>
                  {form.formState.isSubmitting
                    ? 'Lagi Ngirim...'
                    : 'Kirim Klip Sekarang!'}
                </span>
                {!form.formState.isSubmitting && (
                  <ArrowRight className="w-6 h-6 stroke-3" />
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
