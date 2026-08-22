'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Landmark } from 'lucide-react';

import { bankInfoSchema, BankInfoValue } from '@/lib/validations/wallet.schema';
import { updateBankInfo } from '@/lib/withdrawal';

export default function BankInfoCard() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const form = useForm<BankInfoValue>({
    resolver: zodResolver(bankInfoSchema),
    defaultValues: { bankName: '', bankAccountNumber: '', bankAccountName: '' },
  });

  async function onSubmit(data: BankInfoValue) {
    setIsSubmitting(true);
    try {
      await updateBankInfo(data);
      toast.success('Info rekening berhasil disimpan!');
      setIsSaved(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Gagal menyimpan info rekening';
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-4 flex items-center gap-2">
        <Landmark className="h-5 w-5 text-black" />
        <h2 className="text-lg font-black uppercase text-black">
          Info Rekening
        </h2>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-3"
      >
        <Controller
          name="bankName"
          control={form.control}
          render={({ field, fieldState }) => (
            <div>
              <input
                {...field}
                placeholder="Nama Bank (BCA, BRI, dll)"
                className="w-full rounded-xl border-3 border-black bg-[#F4F4F5] px-4 py-2.5 text-sm font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
              />
              {fieldState.error && (
                <p className="mt-1 text-xs font-bold text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="bankAccountNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <div>
              <input
                {...field}
                placeholder="Nomor Rekening"
                className="w-full rounded-xl border-3 border-black bg-[#F4F4F5] px-4 py-2.5 text-sm font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
              />
              {fieldState.error && (
                <p className="mt-1 text-xs font-bold text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="bankAccountName"
          control={form.control}
          render={({ field, fieldState }) => (
            <div>
              <input
                {...field}
                placeholder="Nama Pemilik Rekening"
                className="w-full rounded-xl border-3 border-black bg-[#F4F4F5] px-4 py-2.5 text-sm font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
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
          className="w-full rounded-xl border-3 border-black bg-white py-2.5 text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-gray-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
        >
          {isSubmitting
            ? 'Lagi Simpan...'
            : isSaved
              ? 'Update Rekening'
              : 'Simpan Rekening'}
        </button>
      </form>
    </div>
  );
}
