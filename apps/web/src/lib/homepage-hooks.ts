"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomepageSections } from "@astro/types";
import { api } from "./api";

export function useHomepageContent() {
  return useQuery<{ sections: HomepageSections }>({
    queryKey: ["homepage"],
    queryFn: () => api.get<{ sections: HomepageSections }>("/api/homepage"),
    staleTime: 30_000,
  });
}
