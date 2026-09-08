import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'CLIENT' | 'ADMIN' | 'VET' | 'VETERINARIAN';
  tenantId: string;
  phone?: string;
  avatarUrl?: string;
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string, tenantId: string) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser, token: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password, tenantId) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'}/auth/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': tenantId,
              },
              body: JSON.stringify({ email, password }),
            },
          );

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message ?? 'Credenciales incorrectas');
          }

          const data = await res.json();
          const user: AuthUser = { ...data.user, tenantId };
          set({ user, token: data.token, isLoading: false });
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : 'Error de autenticacion',
            isLoading: false,
          });
          throw e;
        }
      },

      logout: () => set({ user: null, token: null, error: null }),

      setUser: (user, token) => set({ user, token }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'apex_auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
