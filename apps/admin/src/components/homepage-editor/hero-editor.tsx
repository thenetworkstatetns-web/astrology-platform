"use client";

import { useFormContext } from "react-hook-form";
import type { UpdateHomepageSchema } from "@astro/shared";
import { Input, Label, Textarea } from "@astro/ui";

export function HeroEditor() {
  const {
    register,
    formState: { errors },
  } = useFormContext<UpdateHomepageSchema>();
  const heroErrors = errors.sections?.hero;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="hero-heading">Heading</Label>
        <Input id="hero-heading" {...register("sections.hero.heading")} />
        {heroErrors?.heading ? (
          <p className="text-xs text-red-600">{heroErrors.heading.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hero-subheading">Subheading</Label>
        <Textarea id="hero-subheading" rows={3} {...register("sections.hero.subheading")} />
        {heroErrors?.subheading ? (
          <p className="text-xs text-red-600">{heroErrors.subheading.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="hero-cta-label">Button label</Label>
          <Input id="hero-cta-label" {...register("sections.hero.ctaLabel")} />
          {heroErrors?.ctaLabel ? (
            <p className="text-xs text-red-600">{heroErrors.ctaLabel.message}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hero-cta-url">Button link</Label>
          <Input id="hero-cta-url" placeholder="/register" {...register("sections.hero.ctaUrl")} />
          {heroErrors?.ctaUrl ? (
            <p className="text-xs text-red-600">{heroErrors.ctaUrl.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hero-image">Image URL</Label>
        <Input
          id="hero-image"
          placeholder="https://..."
          {...register("sections.hero.imageUrl")}
        />
      </div>
    </div>
  );
}
