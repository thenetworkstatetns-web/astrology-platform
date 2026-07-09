"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { UpdateHomepageSchema } from "@astro/shared";
import { Button, Input, Label, Textarea } from "@astro/ui";

const ICON_OPTIONS = [
  "sparkles",
  "shield-check",
  "clock",
  "star",
  "heart",
  "compass",
  "moon",
  "sun",
];

export function FeaturesEditor() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<UpdateHomepageSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections.features.items",
  });

  const sectionErrors = errors.sections?.features;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="features-heading">Heading</Label>
          <Input id="features-heading" {...register("sections.features.heading")} />
          {sectionErrors?.heading ? (
            <p className="text-xs text-red-600">{sectionErrors.heading.message}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="features-subheading">Subheading</Label>
          <Input id="features-subheading" {...register("sections.features.subheading")} />
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Feature {index + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-slate-400 hover:text-red-600"
                aria-label="Remove feature"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input {...register(`sections.features.items.${index}.title` as const)} />
              </div>
              <div className="space-y-1.5">
                <Label>Icon</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  {...register(`sections.features.items.${index}.icon` as const)}
                >
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={2}
                {...register(`sections.features.items.${index}.description` as const)}
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({
            id: crypto.randomUUID(),
            title: "",
            description: "",
            icon: "sparkles",
          })
        }
      >
        <Plus className="h-4 w-4" />
        Add feature
      </Button>
    </div>
  );
}
