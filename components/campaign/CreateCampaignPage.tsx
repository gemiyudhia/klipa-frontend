'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Megaphone, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

import { createCampaign } from '@/lib/api/campaign';
import {
  createCampaignSchema,
  CreateCampaignValue,
} from '@/lib/validations/campaign-schema';
import { formatCurrency } from '@/lib/campaign-utils';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

export default function CreateCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateCampaignValue>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      title: '',
      description: '',
      rewardPerClip: undefined,
      totalBudget: undefined,
      vodUrl: '',
      deadline: '',
    },
  });

  const totalBudget = Number(form.watch('totalBudget')) || 0;
  const rewardPerClip = Number(form.watch('rewardPerClip')) || 0;
  const platformFee = totalBudget * 0.05;
  const totalCharged = totalBudget + platformFee;
  const estimatedClips =
    rewardPerClip > 0 && totalBudget > 0
      ? Math.floor(totalBudget / rewardPerClip)
      : 0;

  async function onSubmit(data: CreateCampaignValue) {
    setIsSubmitting(true);
    try {
      await createCampaign({
        title: data.title,
        description: data.description,
        rewardPerClip: data.rewardPerClip,
        totalBudget: data.totalBudget,
        vodUrl: data.vodUrl || undefined,
        deadline: new Date(data.deadline).toISOString(),
      });
      toast.success('Campaign berhasil dibuat!');
      router.push('/campaigns');
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Gagal membuat campaign';
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="w-full max-w-6xl mx-auto px-4 py-44 pb-16 md:pt-36 md:pb-24">
        {/* 1. Header Box */}
        <div className="relative mb-8 rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-8">
          <div className="absolute -right-3 -top-5 rotate-12 rounded-xl border-4 border-black bg-[#FFDE59] p-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:rotate-0 md:-right-4 md:-top-6">
            <Megaphone className="h-6 w-6 stroke-[2.5] text-black md:h-8 md:w-8" />
          </div>

          <div className="inline-flex items-center gap-2 bg-[#38B6FF] text-black text-xs font-black px-3 py-1 rounded-md border-2 border-black uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Creator Campaign Studio
          </div>

          <h1 className="text-3xl font-black uppercase tracking-tight text-black md:text-4xl">
            Buat Campaign Baru
          </h1>
          <p className="mt-1 text-sm font-bold text-gray-700 md:text-base">
            Isi detail campaign lu, tentukan budget escrow, biar Clipper bisa
            langsung sikat!
          </p>
        </div>

        {/* 2. Form with 2-Column Responsive Layout */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* LEFT COLUMN: Campaign Content & Guidelines (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Judul Campaign */}
            <div className="rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <label className="mb-2 block text-xs font-black uppercase text-gray-700">
                Judul Campaign <span className="text-red-500">*</span>
              </label>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <input
                      {...field}
                      placeholder="Contoh: Klip Podcast Horor Eps 42"
                      className="w-full rounded-xl border-3 border-black bg-[#F4F4F5] px-4 py-3 text-sm font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
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

            {/* Deskripsi / Guideline */}
            <div className="rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <label className="mb-2 block text-xs font-black uppercase text-gray-700">
                Deskripsi / Guideline Potong Klip{' '}
                <span className="text-red-500">*</span>
              </label>
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <textarea
                      {...field}
                      rows={6}
                      placeholder="Jelasin detail apa yang harus di-clip, batas menit VOD yang menarik, format target (9:16), aturan subtitle, dsb..."
                      className="w-full resize-none rounded-xl border-3 border-black bg-[#F4F4F5] p-3.5 text-sm font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
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

            {/* Link Video Sumber */}
            <div className="rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <label className="mb-2 block text-xs font-black uppercase text-gray-700">
                Link Video Sumber / VOD (Opsional)
              </label>
              <Controller
                name="vodUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <input
                      {...field}
                      placeholder="https://youtube.com/watch?v=... atau Google Drive"
                      className="w-full rounded-xl border-3 border-black bg-[#F4F4F5] px-4 py-3 text-sm font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
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

          {/* RIGHT COLUMN: Budget, Calculation & Submit (5 cols - Sticky) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            {/* Box Input Budget & Target */}
            <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <p className="text-xs font-black uppercase tracking-wide text-gray-800 border-b-2 border-black/10 pb-2">
                Pengaturan Reward & Jadwal
              </p>

              {/* Reward per Klip */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase text-gray-700">
                  Reward per Klip (Rp) <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="rewardPerClip"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <input
                        {...field}
                        type="number"
                        placeholder="50000"
                        className="w-full rounded-xl border-3 border-black bg-[#F4F4F5] px-4 py-3 text-sm font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
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

              {/* Total Budget */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase text-gray-700">
                  Total Budget Bounty (Rp){' '}
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="totalBudget"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <input
                        {...field}
                        type="number"
                        placeholder="1000000"
                        className="w-full rounded-xl border-3 border-black bg-[#F4F4F5] px-4 py-3 text-sm font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
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

              {/* Deadline */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase text-gray-700">
                  Batas Akhir (Deadline) <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="deadline"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <input
                        {...field}
                        type="date"
                        className="w-full rounded-xl border-3 border-black bg-[#F4F4F5] px-4 py-3 text-sm font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
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

            {/* Escrow Fee Summary Card */}
            <div className="rounded-2xl border-4 border-black bg-[#FFF4D6] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-800">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>Kalkulasi Escrow Otomatis</span>
              </div>

              <div className="space-y-2 text-sm font-bold text-gray-700 pt-1">
                <div className="flex justify-between">
                  <span>Target Klip Dihasilkan:</span>
                  <span className="font-black text-black">
                    {estimatedClips > 0 ? `± ${estimatedClips} Klip` : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Budget Campaign:</span>
                  <span>{formatCurrency(totalBudget)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee Platform (5%):</span>
                  <span>{formatCurrency(platformFee)}</span>
                </div>
              </div>

              <div className="flex justify-between border-t-3 border-black pt-3 text-base font-black text-black">
                <span>Total Ditahan (Escrow):</span>
                <span className="text-lg text-[#16A34A]">
                  {formatCurrency(totalCharged)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer rounded-2xl border-4 border-black bg-[#FFDE59] hover:bg-[#FFE680] py-4 text-base font-black uppercase text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 transition-all active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 tracking-wider"
            >
              <span>
                {isSubmitting
                  ? 'Lagi Bikin Campaign...'
                  : 'Luncurkan Campaign!'}
              </span>
              <ArrowRight className="w-5 h-5 stroke-3" />
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
