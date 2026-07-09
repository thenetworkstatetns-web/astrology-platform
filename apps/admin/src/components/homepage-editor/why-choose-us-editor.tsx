"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { UpdateHomepageSchema } from "@astro/shared";
import { Button, Input, Label, Textarea } from "@astro/ui";

export function WhyChooseUsEditor() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<UpdateHomepageSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections.whyChooseUs.items",
  });

  const sectionErrors = errors.sections?.whyChooseUs;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="wcu-heading">Heading</Label>
          <Input id="wcu-heading" {...register("sections.whyChooseUs.heading")} />
          {sectionErrors?.heading ? (
            <p className="text-xs text-red-600">{sectionErrors.heading.message}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wcu-subheading">Subheading</Label>
          <Input id="wcu-subheading" {...register("sections.whyChooseUs.subheading")} />
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Reason {index + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-slate-400 hover:text-red-600"
                aria-label="Remove reason"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input {...register(`sections.whyChooseUs.items.${index}.title` as const)} />
            </div>

            <div className="mt-3 space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={2}
                {...register(`sections.whyChooseUs.items.${index}.description` as const)}
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ id: crypto.randomUUID(), title: "", description: "" })}
      >
        <Plus className="h-4 w-4" />
        Add reason
      </Button>
    </div>
  );
}
