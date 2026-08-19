'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowUpFromLine } from 'lucide-react';

import {
  withdrawalSchema,
  WithdrawalValue,
} from '@/lib/validations/wallet.schema';
import { createWithdrawal } from '@/lib/withdrawal';

interface WithdrawalCardProps {
  onSuccess: () => void;
}

export default function WithdrawalCard({ onSuccess }: WithdrawalCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WithdrawalValue>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: { amount: undefined },
  });

  async function onSubmit(data: WithdrawalValue) {
    setIsSubmitting(true);
    try {
      await createWithdrawal(data.amount);
      toast.success('Penarikan berhasil diajukan! Nunggu approve Admin.');
      form.reset({ amount: undefined });
      onSuccess();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Gagal mengajukan penarikan';
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-4 flex items-center gap-2">
        <ArrowUpFromLine className="h-5 w-5 text-black" />
        <h2 className="text-lg font-black uppercase text-black">Tarik Saldo</h2>
      </div>

      <div className="mb-4 rounded-xl border-2 border-black bg-[#FFF4D6] p-3">
        <p className="text-xs font-bold text-gray-700">
          Pastikan info rekening udah diisi sebelum narik saldo. Bakal kena
          potongan pajak saat di-approve Admin.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <Controller
          name="amount"
          control={form.control}
          render={({ field, fieldState }) => (
            <div>
              <label className="mb-2 block text-xs font-black uppercase text-gray-700">
                Jumlah Penarikan (Rp)
              </label>
              <input
                {...field}
                type="number"
                placeholder="100000"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-3 border-black bg-[#38B6FF] py-3 text-sm font-black uppercase text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
        >
          {isSubmitting ? 'Lagi Proses...' : 'Ajukan Penarikan'}
        </button>
      </form>
    </div>
  );
}
