'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import RoleSelector, { RoleValue } from './RoleSelector';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/store/authStore';

export default function RoleSelectorForm() {
  const router = useRouter();

  const [role, setRole] = useState<RoleValue>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!role || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Token TIDAK dikirim dari frontend.
      // /api/proxy/auth/select-role akan membaca
      // accessToken dari HttpOnly cookie.
      const { data } = await apiClient.patch('/auth/select-role', { role });

      // Update user di Zustand setelah role berhasil disimpan
      const currentUser = useAuthStore.getState().user;

      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          role: data.role,
          isRoleSelected: true,
        });
      }

      toast.success('Role berhasil dipilih!');

      router.replace('/explore');
    } catch (error: any) {
      console.error('SELECT ROLE ERROR:', error);

      const message =
        error?.response?.data?.message || 'Gagal memilih role, coba lagi';

      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
          Lu Pengen Jadi Apa?
        </h1>

        <p className="mt-2 text-base md:text-lg font-medium text-muted-foreground">
          Mau ngasih bahan video atau nyulap video jadi emas?
        </p>
      </header>

      <RoleSelector value={role} onChange={setRole} />

      <footer className="mt-10 flex flex-col gap-3">
        <Button
          type="button"
          disabled={!role || isSubmitting}
          onClick={handleSubmit}
          className="w-full h-14 bg-tertiary text-tertiary-foreground font-black text-lg md:text-xl uppercase border-4 border-black rounded-none neo-shadow neo-press transition-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Lagi Diproses...' : 'Lanjutkan'}
        </Button>
      </footer>
    </main>
  );
}
