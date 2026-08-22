import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'CREATOR' | 'CLIPPER' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  balance: number;
  avatarUrl?: string;
  isRoleSelected: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isHydrated: boolean;

  setUser: (user: AuthUser) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,

      setUser: (user) => {
        set({ user });
      },

      login: (user) => {
        set({ user });
      },

      logout: () => {
        set({ user: null });
      },

      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'klipa-auth-storage',

      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
