"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { HomepageSections } from "@astro/types";
import { api } from "./api";

const QUERY_KEY = ["admin", "homepage"] as const;

export function useAdminHomepage() {
  return useQuery<{ sections: HomepageSections }>({
    queryKey: QUERY_KEY,
    queryFn: () => api.get<{ sections: HomepageSections }>("/api/admin/homepage"),
  });
}

export function useUpdateHomepage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sections: HomepageSections) =>
      api.put<{ sections: HomepageSections }>("/api/admin/homepage", { sections }),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data);
    },
  });
}
