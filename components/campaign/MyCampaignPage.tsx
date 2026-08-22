'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';

import { getMyCampaigns, type Campaign } from '@/lib/api/campaign';
import {
  formatCurrency,
  formatDate,
  calculateSlots,
} from '@/lib/campaign-utils';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

function getStatusBadge(status: Campaign['status']) {
  switch (status) {
    case 'ACTIVE':
      return { label: 'AKTIF', className: 'bg-emerald-600 text-white' };
    case 'PAUSED':
      return { label: 'DIJEDA', className: 'bg-gray-500 text-white' };
    case 'COMPLETED':
      return { label: 'SELESAI', className: 'bg-[#38B6FF] text-white' };
    case 'BANNED':
      return { label: 'DIBANNED', className: 'bg-[#FF4848] text-white' };
    case 'DRAFT':
      return { label: 'DRAFT', className: 'bg-gray-300 text-black' };
  }
}

export default function MyCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      setIsLoading(true);
      try {
        const result = await getMyCampaigns();
        setCampaigns(result.data);
      } catch (error) {
        toast.error('Gagal memuat campaign lu');
      } finally {
        setIsLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  return (
    <div className="">
      <Navbar />
      <div className="min-h-screen py-44 px-4 md:px-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="relative rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-8">
            <div className="absolute -right-3 -top-5 rotate-12 rounded-xl border-4 border-black bg-[#FFDE59] p-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:rotate-0 md:-right-4 md:-top-6">
              <Megaphone className="h-6 w-6 stroke-[2.5] text-black md:h-8 md:w-8" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-black md:text-4xl">
                  Campaign Gue
                </h1>
                <p className="mt-2 text-sm font-bold text-gray-700 md:text-base">
                  Kelola campaign lu dan review klip yang masuk.
                </p>
              </div>

              <Link href="/campaigns/new">
                <button className="flex items-center gap-2 rounded-xl border-4 border-black bg-[#FFDE59] px-6 py-3 text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-[#ffe680] active:translate-x-1 active:translate-y-1 active:shadow-none">
                  <Plus className="h-4 w-4 stroke-3" /> Buat Campaign
                </button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border-4 border-black bg-white p-12 text-center">
              <p className="text-lg font-black uppercase">
                Lagi Ngambil Data...
              </p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="rounded-2xl border-4 border-black bg-white p-12 text-center">
              <Megaphone className="mx-auto mb-3 h-10 w-10 text-gray-400" />
              <p className="text-lg font-black uppercase">Belum Ada Campaign</p>
              <p className="mt-1 text-sm font-medium text-gray-600">
                Yuk buat campaign pertama lu!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => {
                const { usedSlots, totalSlots } = calculateSlots(campaign);
                const percentage =
                  totalSlots > 0 ? (usedSlots / totalSlots) * 100 : 0;
                const badge = getStatusBadge(campaign.status);

                return (
                  <div
                    key={campaign.id}
                    className="flex flex-col justify-between rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div>
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <span
                          className={`rounded-md border-2 border-black px-2.5 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-[10px] font-bold text-gray-500">
                          {formatDate(campaign.deadline)}
                        </span>
                      </div>

                      <h3 className="mb-2 truncate text-lg font-black uppercase text-black">
                        {campaign.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-xs font-medium text-gray-600">
                        {campaign.description}
                      </p>

                      <div className="mb-4 rounded-xl border-2 border-black bg-[#F8F8F6] p-3">
                        <div className="mb-2 flex items-end justify-between">
                          <div>
                            <p className="text-[9px] font-black uppercase text-gray-500">
                              Reward/Klip
                            </p>
                            <p className="text-lg font-black text-[#D90077]">
                              {formatCurrency(campaign.rewardPerClip)}
                            </p>
                          </div>
                          <p className="text-[10px] font-black text-gray-600">
                            {usedSlots}/{totalSlots} SLOT
                          </p>
                        </div>
                        <div className="h-2.5 w-full border-2 border-black bg-white p-0.5">
                          <div
                            className="h-full bg-[#FFE600] transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="mb-4 flex justify-between text-[11px] font-bold text-gray-600">
                        <span>Sisa Budget</span>
                        <span className="text-black">
                          {formatCurrency(campaign.remainingBudget)}
                        </span>
                      </div>
                    </div>

                    <Link href={`/creator/campaigns/${campaign.id}/review`}>
                      <button className="flex w-full items-center justify-center gap-2 rounded-xl border-3 border-black bg-white py-2.5 text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-gray-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                        <Eye className="h-4 w-4" /> Review Klip Masuk
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
