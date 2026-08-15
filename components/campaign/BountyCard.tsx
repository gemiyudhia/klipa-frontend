import Link from 'next/link';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Campaign } from '@/lib/api/campaign';
import {
  formatCurrency,
  formatDate,
  calculateSlots,
} from '@/lib/campaign-utils';

const ROTATIONS = [
  'rotate-[-1deg]',
  'rotate-[1.5deg]',
  'rotate-[-1.5deg]',
  'rotate-[1deg]',
];

interface BountyCardProps {
  campaign: Campaign;
  index: number;
}

export default function BountyCard({ campaign, index }: BountyCardProps) {
  const { usedSlots, totalSlots, percentage, isFull } =
    calculateSlots(campaign);
  const rotationClass = ROTATIONS[index % ROTATIONS.length];

  return (
    <div
      className={`neo-card flex flex-col justify-between bg-white p-6 transition-transform hover:rotate-0 hover:scale-[1.01] ${rotationClass}`}
    >
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-black bg-[#FFE600]">
            <User className="h-5 w-5 stroke-[2.5] text-black" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">
              DEADLINE
            </p>
            <p className="text-xs font-black text-black">
              {formatDate(campaign.deadline)}
            </p>
          </div>
        </div>

        <h3 className="mb-2 text-xl font-black uppercase leading-snug text-black">
          {campaign.title}
        </h3>
        <p className="mb-6 line-clamp-3 text-xs font-medium leading-relaxed text-gray-600">
          {campaign.description}
        </p>
      </div>

      <div>
        <div className="neo-card mb-5 bg-[#F8F8F6] p-4">
          <div className="mb-2 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-500">
                REWARD PER KLIP
              </p>
              <p className="text-2xl font-black text-[#D90077]">
                {formatCurrency(campaign.rewardPerClip)}
              </p>
            </div>
            <p className="text-[10px] font-black text-gray-500">
              <span className="font-black text-black">
                {usedSlots}/{totalSlots}
              </span>{' '}
              SLOT TERISI
            </p>
          </div>

          <div className="h-3 w-full border-2 border-black bg-white p-0.5">
            <div
              className="h-full border-r-2 border-black bg-[#FFE600] transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <Link href={`/campaign/${campaign.id}`} className="block">
          <Button
            disabled={isFull}
            className={`neo-button w-full py-5 text-sm font-black uppercase transform-gpu tracking-wider ${
              isFull
                ? 'cursor-not-allowed border-gray-500 bg-gray-300 text-gray-600'
                : 'bg-[#FFE600] text-black hover:bg-[#e6ce00]'
            }`}
          >
            {isFull ? 'SLOT HABIS' : 'SIKAT BOUNTY INI'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
