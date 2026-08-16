import { Campaign } from '@/lib/api/campaign';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Zap } from 'lucide-react';

interface CampaignActionButtonProps {
  campaign: Campaign;
  userRole?: string;
  isLoggedIn: boolean;
  isFull: boolean;
  isActive: boolean;
}

export function CampaignActionButton({
  campaign,
  userRole,
  isLoggedIn,
  isFull,
  isActive,
}: CampaignActionButtonProps) {
  if (!isLoggedIn) {
    return (
      <Link
        href={`/sign-in?redirect=/campaign/${campaign.id}`}
        className="block"
      >
        <Button className="neo-button w-full bg-white py-7 text-base font-black uppercase tracking-wider text-black hover:bg-gray-100">
          Login Dulu Buat Ambil Bounty
        </Button>
      </Link>
    );
  }

  if (userRole !== 'CLIPPER') {
    return (
      <Button
        disabled
        className="neo-button w-full cursor-not-allowed border-gray-500 bg-gray-300 py-7 text-base font-black uppercase tracking-wider text-gray-600"
      >
        Khusus Akun Clipper
      </Button>
    );
  }

  const isDisabled = isFull || !isActive;

  if (isDisabled) {
    return (
      <Button
        disabled
        className="neo-button w-full cursor-not-allowed border-gray-500 bg-gray-300 py-7 text-base font-black uppercase tracking-wider text-gray-600"
      >
        {isFull ? 'SLOT HABIS' : 'CAMPAIGN TIDAK AKTIF'}
      </Button>
    );
  }

  return (
    <Link href={`/submit-clip/${campaign.id}`} className="block">
      <Button className="neo-button w-full bg-white py-7 text-base font-black uppercase tracking-wider text-black hover:bg-gray-100">
        <span className="flex items-center justify-center gap-2">
          AMBIL BOUNTY INI
          <Zap className="h-5 w-5 fill-black" />
        </span>
      </Button>
    </Link>
  );
}
