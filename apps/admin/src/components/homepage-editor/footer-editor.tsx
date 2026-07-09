"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { UpdateHomepageSchema } from "@astro/shared";
import { Button, Input, Label, Textarea } from "@astro/ui";

export function FooterEditor() {
  const { register, control } = useFormContext<UpdateHomepageSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections.footer.links",
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="footer-text">Footer text</Label>
        <Textarea id="footer-text" rows={2} {...register("sections.footer.text")} />
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Link {index + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-slate-400 hover:text-red-600"
                aria-label="Remove link"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Label</Label>
                <Input {...register(`sections.footer.links.${index}.label` as const)} />
              </div>
              <div className="space-y-1.5">
                <Label>URL</Label>
                <Input {...register(`sections.footer.links.${index}.url` as const)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ id: crypto.randomUUID(), label: "", url: "" })}
      >
        <Plus className="h-4 w-4" />
        Add link
      </Button>
    </div>
  );
}
