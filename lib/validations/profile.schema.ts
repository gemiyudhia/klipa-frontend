import * as z from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(100),
  avatarUrl: z
    .string()
    .url('Link avatar tidak valid')
    .optional()
    .or(z.literal('')),
});

export type UpdateProfileValue = z.infer<typeof updateProfileSchema>;
