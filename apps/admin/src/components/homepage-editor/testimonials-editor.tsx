"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { UpdateHomepageSchema } from "@astro/shared";
import { Button, Input, Label, Textarea } from "@astro/ui";

export function TestimonialsEditor() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<UpdateHomepageSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections.testimonials.items",
  });

  const sectionErrors = errors.sections?.testimonials;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="testimonials-heading">Heading</Label>
          <Input id="testimonials-heading" {...register("sections.testimonials.heading")} />
          {sectionErrors?.heading ? (
            <p className="text-xs text-red-600">{sectionErrors.heading.message}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="testimonials-subheading">Subheading</Label>
          <Input id="testimonials-subheading" {...register("sections.testimonials.subheading")} />
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Testimonial {index + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-slate-400 hover:text-red-600"
                aria-label="Remove testimonial"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input {...register(`sections.testimonials.items.${index}.name` as const)} />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Input {...register(`sections.testimonials.items.${index}.role` as const)} />
              </div>
              <div className="space-y-1.5">
                <Label>Rating (1-5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  {...register(`sections.testimonials.items.${index}.rating` as const, {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>

            <div className="mt-3 space-y-1.5">
              <Label>Message</Label>
              <Textarea
                rows={2}
                {...register(`sections.testimonials.items.${index}.message` as const)}
              />
            </div>

            <div className="mt-3 space-y-1.5">
              <Label>Avatar URL</Label>
              <Input
                placeholder="https://..."
                {...register(`sections.testimonials.items.${index}.avatarUrl` as const)}
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
            name: "",
            role: "",
            message: "",
            avatarUrl: "",
            rating: 5,
          })
        }
      >
        <Plus className="h-4 w-4" />
        Add testimonial
      </Button>
    </div>
  );
}
