"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../components/sidebar";
import { useCurrentAdmin } from "../../lib/auth-hooks";
import { useAdminAuthStore } from "../../store/auth-store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoading: isFetching } = useCurrentAdmin();
  const admin = useAdminAuthStore((s) => s.admin);
  const isLoading = useAdminAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (!isLoading && !isFetching && !admin) {
      router.replace("/login");
    }
  }, [admin, isLoading, isFetching, router]);

  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50 p-8">{children}</main>
    </div>
  );
}
