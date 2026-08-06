import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

export type Role = 'CREATOR' | 'CLIPPER' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser) => void;
  login: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setHydrated: () => void;
}

const COOKIE_OPTIONS = {
  expires: 7,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

function syncAuthCookies(accessToken: string | null, role: Role | null) {
  if (accessToken && role) {
    Cookies.set('accessToken', accessToken, COOKIE_OPTIONS);
    Cookies.set('userRole', role, COOKIE_OPTIONS);
  } else {
    Cookies.remove('accessToken');
    Cookies.remove('userRole');
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isHydrated: false,

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
        syncAuthCookies(accessToken, get().user?.role ?? null);
      },

      setUser: (user) => {
        set({ user });
        syncAuthCookies(get().accessToken, user.role);
      },

      login: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken });
        syncAuthCookies(accessToken, user.role);
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
        syncAuthCookies(null, null);
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'klipa-auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          syncAuthCookies(state.accessToken, state.user?.role ?? null);
        }
        state?.setHydrated();
      },
    },
  ),
);
