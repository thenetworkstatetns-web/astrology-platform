import { create } from "zustand";
import type { AdminUser } from "@astro/types";

interface AdminAuthState {
  admin: AdminUser | null;
  isLoading: boolean;
  setAdmin: (admin: AdminUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  admin: null,
  isLoading: true,
  setAdmin: (admin) => set({ admin, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
