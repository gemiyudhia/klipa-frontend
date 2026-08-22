'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { UserCircle, Mail, ShieldCheck, Wallet, Save, Ban } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import {
  updateProfileSchema,
  UpdateProfileValue,
} from '@/lib/validations/profile.schema';
import { formatCurrency } from '@/lib/campaign-utils';
import { updateProfile } from '@/lib/user';
import Footer from '../layout/Footer';
import Navbar from '../layout/Navbar';

const ROLE_LABEL: Record<string, string> = {
  CREATOR: 'Creator',
  CLIPPER: 'Clipper',
  ADMIN: 'Admin',
};

const ROLE_BADGE_CLASS: Record<string, string> = {
  CREATOR: 'bg-[#38B6FF] text-white',
  CLIPPER: 'bg-[#7ED957] text-black',
  ADMIN: 'bg-[#FF4848] text-white',
};

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateProfileValue>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name ?? '',
      avatarUrl: user?.avatarUrl ?? '',
    },
  });

  if (!user) return null;

  async function onSubmit(data: UpdateProfileValue) {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const updated = await updateProfile({
        name: data.name,
        avatarUrl: data.avatarUrl || undefined,
      });

      setUser({
        id: user.id,
        name: updated.name,
        email: user.email,
        role: user.role,
        balance: user.balance,
        avatarUrl: updated.avatarUrl,
        isRoleSelected: user.isRoleSelected,
      });

      toast.success('Profil berhasil diperbarui!');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Gagal update profil';

      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-44 px-4 md:px-12">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Header profil */}
          <div className="relative rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-8">
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-black bg-[#FFDE59] overflow-hidden">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircle className="h-12 w-12 text-black" />
                )}
              </div>

              <div>
                <h1 className="text-2xl font-black uppercase text-black md:text-3xl">
                  {user.name}
                </h1>
                <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-gray-600 md:justify-start">
                  <Mail className="h-4 w-4" /> {user.email}
                </p>
                <span
                  className={`mt-2 inline-block rounded-md border-2 border-black px-3 py-1 text-xs font-black uppercase ${ROLE_BADGE_CLASS[user.role]}`}
                >
                  {ROLE_LABEL[user.role]}
                </span>
              </div>
            </div>
          </div>

          {/* Info ringkas */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border-4 border-black bg-[#FFDE59] p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase text-black/70">
                <Wallet className="h-4 w-4" /> Saldo
              </div>
              <p className="text-2xl font-black text-black">
                {formatCurrency(user.balance)}
              </p>
            </div>

            <div className="rounded-2xl border-4 border-black bg-[#E4E4E7] p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase text-black/70">
                <ShieldCheck className="h-4 w-4" /> Status Role
              </div>
              <p className="text-sm font-black text-black">
                {user.isRoleSelected ? 'Sudah Dikonfirmasi' : 'Belum Dipilih'}
              </p>
            </div>
          </div>

          {/* Form edit profil */}
          <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-4 text-lg font-black uppercase text-black">
              Edit Profil
            </h2>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase text-gray-700">
                      Nama
                    </label>
                    <input
                      {...field}
                      placeholder="Nama lu"
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

              <Controller
                name="avatarUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase text-gray-700">
                      Link Avatar (Opsional)
                    </label>
                    <input
                      {...field}
                      placeholder="https://..."
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
                className="flex items-center justify-center gap-2 rounded-xl border-3 border-black bg-[#FFDE59] px-6 py-3 text-sm font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-[#ffe680] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Lagi Nyimpen...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>

          {/* Info akun terkait */}
          <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-black uppercase text-black">
              <Ban className="h-4 w-4" /> Info Akun
            </h2>
            <p className="text-xs font-medium text-gray-600">
              Email tidak bisa diubah karena terhubung dengan akun login lu.
              Buat ganti kata sandi atau informasi rekening, kunjungi halaman{' '}
              <a href="/wallet" className="font-black text-black underline">
                Wallet
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
