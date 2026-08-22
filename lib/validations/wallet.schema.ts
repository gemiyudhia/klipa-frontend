import * as z from 'zod';

export const topUpSchema = z.object({
  amount: z.coerce.number().min(10000, 'Minimal top up Rp 10.000'),
});
export type TopUpValue = z.infer<typeof topUpSchema>;

export const bankInfoSchema = z.object({
  bankName: z.string().min(1, 'Nama bank wajib diisi'),
  bankAccountNumber: z.string().min(1, 'Nomor rekening wajib diisi'),
  bankAccountName: z.string().min(1, 'Nama pemilik rekening wajib diisi'),
});
export type BankInfoValue = z.infer<typeof bankInfoSchema>;

export const withdrawalSchema = z.object({
  amount: z.coerce.number().min(50000, 'Minimal penarikan Rp 50.000'),
});
export type WithdrawalValue = z.infer<typeof withdrawalSchema>;
