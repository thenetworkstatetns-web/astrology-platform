"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SiteSettings } from "@astro/types";
import { api } from "./api";

const QUERY_KEY = ["admin", "settings"] as const;

export function useAdminSettings() {
  return useQuery<SiteSettings>({
    queryKey: QUERY_KEY,
    queryFn: () => api.get<SiteSettings>("/api/admin/settings"),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<SiteSettings, "id" | "updatedAt">) =>
      api.put<SiteSettings>("/api/admin/settings", input),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data);
    },
  });
}
