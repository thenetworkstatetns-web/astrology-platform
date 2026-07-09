import { create } from "zustand";
import type { PublicUser } from "@astro/types";

interface AuthState {
  user: PublicUser | null;
  isLoading: boolean;
  setUser: (user: PublicUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
