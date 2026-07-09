"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema, type AdminLoginSchema } from "@astro/shared";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@astro/ui";
import { useAdminLogin, useCurrentAdmin } from "../../lib/auth-hooks";
import { ApiClientError } from "../../lib/api";
import { useAdminAuthStore } from "../../store/auth-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAdminLogin();
  useCurrentAdmin();
  const admin = useAdminAuthStore((s) => s.admin);
  const isLoading = useAdminAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (!isLoading && admin) {
      router.replace("/dashboard");
    }
  }, [admin, isLoading, router]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginSchema>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (values: AdminLoginSchema) => {
    try {
      await login.mutateAsync(values);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : "Login failed";
      setError("root", { message });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin login</CardTitle>
          <p className="text-sm text-slate-500">Sign in to manage the platform</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" {...register("email")} />
              {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password ? (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              ) : null}
            </div>

            {errors.root ? <p className="text-xs text-red-600">{errors.root.message}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
