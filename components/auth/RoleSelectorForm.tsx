'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import RoleSelector, { RoleValue } from './RoleSelector';

import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/store/authStore';

export default function RoleSelectorForm() {
  const router = useRouter();

  const [role, setRole] = React.useState<RoleValue>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    async function init() {
      try {
        const { data: profile } = await apiClient.get('/auth/me');

        useAuthStore.getState().setUser(profile);

        setIsReady(true);
      } catch (error) {
        console.error('ROLE SELECTOR AUTH:', error);

        toast.error('Sesi tidak valid, silakan login ulang');

        router.push('/sign-in');
      }
    }

    init();
  }, [router]);

  async function handleSubmit() {
    if (!role) return;

    setIsSubmitting(true);

    try {
      const { data } = await apiClient.patch('/auth/select-role', { role });

      const currentUser = useAuthStore.getState().user;

      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          role: data.role,
          isRoleSelected: true,
        });
      }

      toast.success('Role berhasil dipilih!');

      router.push('/explore');
      router.refresh();
    } catch (error: any) {
      console.error('SELECT ROLE ERROR:', error);

      const message =
        error?.response?.data?.message || 'Gagal memilih role, coba lagi';

      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isReady) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
          Lu Pengen Jadi Apa?
        </h1>

        <p className="mt-2 text-base font-medium text-muted-foreground md:text-lg">
          Mau ngasih bahan video atau nyulap video jadi emas?
        </p>
      </header>

      <RoleSelector value={role} onChange={setRole} />

      <footer className="mt-10 flex flex-col gap-3">
        <Button
          type="button"
          disabled={!role || isSubmitting}
          onClick={handleSubmit}
          className="neo-shadow neo-press h-14 w-full rounded-none border-4 border-black bg-tertiary text-lg font-black uppercase text-tertiary-foreground transition-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xl"
        >
          {isSubmitting ? 'Lagi Diproses...' : 'Lanjutkan'}
        </Button>
      </footer>
    </main>
  );
}
