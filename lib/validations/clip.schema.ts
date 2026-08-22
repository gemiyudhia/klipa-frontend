import * as z from 'zod';

export const submitClipSchema = z.object({
  title: z.string().min(1, 'Judul klip wajib diisi').max(200),
  videoUrl: z
    .string()
    .min(1, 'Link video wajib diisi')
    .url('Link video tidak valid'),
  thumbnailUrl: z
    .string()
    .url('Link thumbnail tidak valid')
    .optional()
    .or(z.literal('')),
  duration: z.coerce.number().min(0).optional(),
});

export type SubmitClipValue = z.infer<typeof submitClipSchema>;
