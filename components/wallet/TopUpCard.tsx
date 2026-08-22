'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Wallet, PlusCircle } from 'lucide-react';

import { topUpSchema, TopUpValue } from '@/lib/validations/wallet.schema';
import { useAuthStore } from '@/store/authStore';
import { topUp } from '@/lib/user';

const QUICK_AMOUNTS = [50000, 100000, 500000, 1000000];

interface TopUpCardProps {
  onSuccess: () => void;
}

export default function TopUpCard({ onSuccess }: TopUpCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TopUpValue>({
    resolver: zodResolver(topUpSchema),
    defaultValues: { amount: undefined },
  });

  async function onSubmit(data: TopUpValue) {
    setIsSubmitting(true);
    try {
      const result = await topUp(data.amount);

      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore
          .getState()
          .setUser({ ...currentUser, balance: result.balance });
      }

      toast.success('Saldo berhasil ditambahkan!');
      form.reset({ amount: undefined });
      onSuccess();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Gagal top up saldo';
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-4 flex items-center gap-2">
        <Wallet className="h-5 w-5 text-black" />
        <h2 className="text-lg font-black uppercase text-black">
          Top Up Saldo
        </h2>
      </div>

      <div className="mb-4 rounded-xl border-2 border-dashed border-[#FF66C4] bg-[#FF66C4]/10 p-3">
        <p className="text-xs font-bold text-gray-700">
          ⚠️ Mode simulasi — belum ada payment gateway asli. Saldo ditambahkan
          langsung tanpa pembayaran sungguhan.
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
                Jumlah (Rp)
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

        <div className="flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() =>
                form.setValue('amount', amt, { shouldValidate: true })
              }
              className="rounded-lg border-2 border-black bg-[#F4F4F5] px-3 py-1.5 text-xs font-black text-black hover:bg-gray-200"
            >
              +{new Intl.NumberFormat('id-ID').format(amt)}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-3 border-black bg-[#7ED957] py-3 text-sm font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
        >
          <PlusCircle className="h-4 w-4" />
          {isSubmitting ? 'Lagi Proses...' : 'Top Up Sekarang'}
        </button>
      </form>
    </div>
  );
}
