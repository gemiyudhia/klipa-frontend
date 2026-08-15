'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Play } from 'lucide-react';

import SubmitClipModal from '@/components/clip/SubmitClipModal';
import { type Campaign } from '@/lib/api/campaign';
import { useAuthStore } from '@/store/authStore';
import {
  formatCurrency,
  formatDate,
  calculateSlots,
} from '@/lib/campaign-utils';
import { CampaignActionButton } from '@/components/campaign/CampaignActionButton';

type Props = {
  campaign: Campaign;
};

export default function CampaignDetailClient({ campaign }: Props) {
  const user = useAuthStore((state) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { usedSlots, totalSlots, isFull } = calculateSlots(campaign);
  const isActive = campaign.status === 'ACTIVE';

  return (
    <div className="flex-1">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-6 flex items-center gap-2 text-xs font-black uppercase text-gray-500">
          <Link href="/explore" className="hover:text-black hover:underline">
            EKSPLOR
          </Link>

          <span>&gt;</span>

          <span className="text-black">DETAIL CAMPAIGN</span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <div>
              <span
                className={`neo-card mb-3 inline-block px-3 py-1 text-xs font-black uppercase text-white ${
                  isActive ? 'bg-emerald-600' : 'bg-gray-500'
                }`}
              >
                {campaign.status}
              </span>

              <h1 className="text-2xl font-black uppercase leading-tight text-black md:text-4xl">
                {campaign.title}
              </h1>
            </div>

            {campaign.vodUrl && (
              <div className="neo-card relative aspect-video w-full overflow-hidden bg-black">
                <div className="absolute inset-0 flex items-center justify-center bg-[#2B52FF]">
                  <div className="p-4 text-center">
                    <h2 className="rotate-left text-4xl font-black uppercase tracking-wider text-[#FFE600]">
                      KLIPA VIDEO SOURCE
                    </h2>

                    <p className="mt-2 text-xs font-bold uppercase text-white">
                      Klik tombol play untuk menonton video mentah
                    </p>
                  </div>
                </div>

                <a
                  href={campaign.vodUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Tonton video campaign"
                  className="neo-button absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FFE600] text-black transition-transform hover:scale-110"
                >
                  <Play className="ml-1 h-8 w-8 fill-black stroke-black" />
                </a>
              </div>
            )}

            <div className="neo-card bg-white p-6">
              <h3 className="mb-4 border-b-2 border-black pb-2 text-lg font-black uppercase text-black">
                DESKRIPSI CAMPAIGN
              </h3>

              <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-gray-800">
                {campaign.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-4">
            <div className="neo-card sticky top-28 bg-[#FFE600] p-6 text-black">
              <p className="text-xs font-black uppercase tracking-wider text-black/70">
                REWARD PER KLIP
              </p>

              <h2 className="mb-6 text-4xl font-black text-black">
                {formatCurrency(campaign.rewardPerClip)}
              </h2>

              <div className="mb-6 grid grid-cols-2 gap-4 border-y-2 border-black py-4">
                <div>
                  <p className="text-[10px] font-black uppercase text-black/70">
                    SLOT TERISI
                  </p>

                  <p className="text-xl font-black text-black">
                    {usedSlots}/{totalSlots}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase text-black/70">
                    DEADLINE
                  </p>

                  <p className="text-sm font-black text-black">
                    {formatDate(campaign.deadline)}
                  </p>
                </div>
              </div>

              <CampaignActionButton
                campaign={campaign}
                userRole={user?.role}
                isLoggedIn={!!user}
                isFull={isFull}
                isActive={isActive}
                onOpenModal={() => setIsModalOpen(true)}
              />

              <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] font-extrabold uppercase">
                <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
                <span>PANDUAN ESCROW</span>
              </div>
            </div>

            <div className="neo-card bg-white p-10">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-black bg-[#D90077] text-white">
                  <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
                </div>

                <p className="text-xs font-semibold leading-snug text-gray-700">
                  Reward aman di{' '}
                  <span className="font-black text-black">Escrow Klipa</span>.
                  Kerjain klipnya, submit, admin approve, cuan cair otomatis
                  bro!
                </p>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <SubmitClipModal
            campaignId={campaign.id}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => setIsModalOpen(false)}
          />
        )}
      </section>
    </div>
  );
}
