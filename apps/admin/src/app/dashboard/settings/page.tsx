"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSettingsSchema, type UpdateSettingsSchema } from "@astro/shared";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@astro/ui";
import { useAdminSettings, useUpdateSettings } from "../../../lib/settings-hooks";

const SOCIAL_PLATFORMS = ["facebook", "instagram", "twitter", "youtube", "linkedin"] as const;

export default function SettingsPage() {
  const { data, isLoading } = useAdminSettings();
  const updateSettings = useUpdateSettings();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateSettingsSchema>({
    resolver: zodResolver(updateSettingsSchema),
  });

  useEffect(() => {
    if (data) {
      reset({
        siteName: data.siteName,
        logoUrl: data.logoUrl,
        faviconUrl: data.faviconUrl,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        socialLinks: data.socialLinks,
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: UpdateSettingsSchema) => {
    setSaveMessage(null);
    await updateSettings.mutateAsync(values);
    setSaveMessage("Settings saved successfully.");
    setTimeout(() => setSaveMessage(null), 4000);
  };

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-slate-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Site-wide configuration for the CMS.</p>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage ? <span className="text-sm text-green-600">{saveMessage}</span> : null}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="siteName">Site name</Label>
            <Input id="siteName" {...register("siteName")} />
            {errors.siteName ? (
              <p className="text-xs text-red-600">{errors.siteName.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input id="logoUrl" placeholder="https://..." {...register("logoUrl")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="faviconUrl">Favicon URL</Label>
              <Input id="faviconUrl" placeholder="https://..." {...register("faviconUrl")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="contactEmail">Contact email</Label>
            <Input id="contactEmail" type="email" {...register("contactEmail")} />
            {errors.contactEmail ? (
              <p className="text-xs text-red-600">{errors.contactEmail.message}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contactPhone">Contact phone</Label>
            <Input id="contactPhone" {...register("contactPhone")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {SOCIAL_PLATFORMS.map((platform) => (
            <div key={platform} className="space-y-1.5">
              <Label htmlFor={`social-${platform}`} className="capitalize">
                {platform}
              </Label>
              <Input
                id={`social-${platform}`}
                placeholder="https://..."
                {...register(`socialLinks.${platform}` as const)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </form>
  );
}
