import { Campaign } from '@/lib/api/campaign';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  });
}

export function calculateSlots(campaign: Campaign) {
  if (!campaign.rewardPerClip || campaign.rewardPerClip <= 0) {
    return { usedSlots: 0, totalSlots: 0, percentage: 0, isFull: false };
  }

  const totalSlots = Math.floor(campaign.totalBudget / campaign.rewardPerClip);
  const remainingSlots = Math.floor(
    campaign.remainingBudget / campaign.rewardPerClip,
  );
  const usedSlots = Math.max(0, totalSlots - remainingSlots);
  const percentage =
    totalSlots > 0 ? Math.min(100, (usedSlots / totalSlots) * 100) : 0;
  const isFull = campaign.remainingBudget < campaign.rewardPerClip;

  return { usedSlots, totalSlots, percentage, isFull };
}
