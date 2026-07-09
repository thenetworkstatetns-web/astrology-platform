"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminLoginInput, AdminUser } from "@astro/types";
import { api, ApiClientError } from "./api";
import { useAdminAuthStore } from "../store/auth-store";

const ME_QUERY_KEY = ["admin", "me"] as const;

export function useCurrentAdmin() {
  const setAdmin = useAdminAuthStore((s) => s.setAdmin);

  const query = useQuery<AdminUser | null>({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      try {
        return await api.get<AdminUser>("/api/admin/auth/me");
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
      setAdmin(query.data ?? null);
    }
  }, [query.data, query.isLoading, setAdmin]);

  return query;
}

export function useAdminLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminLoginInput) => api.post<AdminUser>("/api/admin/auth/login", input),
    onSuccess: (admin) => {
      queryClient.setQueryData(ME_QUERY_KEY, admin);
    },
  });
}

export function useAdminLogout() {
  const queryClient = useQueryClient();
  const setAdmin = useAdminAuthStore((s) => s.setAdmin);
  return useMutation({
    mutationFn: () => api.post("/api/admin/auth/logout"),
    onSuccess: () => {
      setAdmin(null);
      queryClient.setQueryData(ME_QUERY_KEY, null);
    },
  });
}
