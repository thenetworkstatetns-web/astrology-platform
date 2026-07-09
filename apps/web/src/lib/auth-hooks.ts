"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoginInput, PublicUser, RegisterInput } from "@astro/types";
import { api, ApiClientError } from "./api";
import { useAuthStore } from "../store/auth-store";

const ME_QUERY_KEY = ["auth", "me"] as const;

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery<PublicUser | null>({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      try {
        return await api.get<PublicUser>("/api/auth/me");
      } catch (err) {
        if (err instanceof ApiClientError && err.status === 401) {
          return null;
        }
        throw err;
      }
    },
    retry: false,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!query.isLoading) {
      setUser(query.data ?? null);
    }
  }, [query.data, query.isLoading, setUser]);

  return query;
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => api.post<PublicUser>("/api/auth/login", input),
    onSuccess: (user) => {
      queryClient.setQueryData(ME_QUERY_KEY, user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterInput) => api.post<PublicUser>("/api/auth/register", input),
    onSuccess: (user) => {
      queryClient.setQueryData(ME_QUERY_KEY, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: () => api.post("/api/auth/logout"),
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(ME_QUERY_KEY, null);
    },
  });
}
