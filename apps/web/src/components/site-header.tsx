"use client";

import Link from "next/link";
import { Button } from "@astro/ui";
import { useAuthStore } from "../store/auth-store";
import { useCurrentUser, useLogout } from "../lib/auth-hooks";

export function SiteHeader({ siteName }: { siteName: string }) {
  useCurrentUser();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          {siteName}
        </Link>

        <nav className="flex items-center gap-3">
          {isLoading ? null : user ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:inline">Hi, {user.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                {logout.isPending ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
