import * as z from 'zod';

export const createCampaignSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(200),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  rewardPerClip: z.coerce.number().min(1, 'Reward per klip wajib diisi'),
  totalBudget: z.coerce.number().min(1, 'Total budget wajib diisi'),
  vodUrl: z.string().url('Link tidak valid').optional().or(z.literal('')),
  deadline: z.string().min(1, 'Deadline wajib diisi'),
});

export type CreateCampaignValue = z.infer<typeof createCampaignSchema>;
