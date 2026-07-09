"use client";

import Link from "next/link";
import { Home, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@astro/ui";
import { useAdminAuthStore } from "../../store/auth-store";

export default function DashboardPage() {
  const admin = useAdminAuthStore((s) => s.admin);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back{admin ? `, ${admin.name}` : ""}. Manage your homepage content and site
          settings.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link href="/dashboard/homepage">
          <Card className="transition hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                <Home className="h-5 w-5" />
              </div>
              <CardTitle>Homepage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Edit the Hero, Features, Why Choose Us, Testimonials, FAQ, and Footer sections.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/settings">
          <Card className="transition hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                <Settings className="h-5 w-5" />
              </div>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Update site name, logo, favicon, contact details, and social links.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
