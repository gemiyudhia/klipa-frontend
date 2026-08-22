'use client';

import { useEffect } from 'react';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/store/authStore';

export default function AuthHydrator() {
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!isHydrated) return;

    async function verifySession() {
      try {
        const { data } = await apiClient.get('/auth/me');
        setUser(data);
      } catch {
        // cookie tidak ada/expired, dan tidak bisa di-refresh -> pastikan state bersih
        if (user) {
          logout();
        }
      }
    }

    verifySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  return null;
}
