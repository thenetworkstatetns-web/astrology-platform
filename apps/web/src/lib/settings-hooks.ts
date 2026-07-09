"use client";

import { useQuery } from "@tanstack/react-query";
import type { SiteSettings } from "@astro/types";
import { api } from "./api";

export function useSiteSettings() {
  return useQuery<SiteSettings>({
    queryKey: ["settings"],
    queryFn: () => api.get<SiteSettings>("/api/settings"),
    staleTime: 60_000,
  });
}
