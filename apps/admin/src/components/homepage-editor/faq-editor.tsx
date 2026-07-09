"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { UpdateHomepageSchema } from "@astro/shared";
import { Button, Input, Label, Textarea } from "@astro/ui";

export function FaqEditor() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<UpdateHomepageSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections.faq.items",
  });

  const sectionErrors = errors.sections?.faq;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="faq-heading">Heading</Label>
          <Input id="faq-heading" {...register("sections.faq.heading")} />
          {sectionErrors?.heading ? (
            <p className="text-xs text-red-600">{sectionErrors.heading.message}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="faq-subheading">Subheading</Label>
          <Input id="faq-subheading" {...register("sections.faq.subheading")} />
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Question {index + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-slate-400 hover:text-red-600"
                aria-label="Remove question"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <Label>Question</Label>
              <Input {...register(`sections.faq.items.${index}.question` as const)} />
            </div>

            <div className="mt-3 space-y-1.5">
              <Label>Answer</Label>
              <Textarea rows={3} {...register(`sections.faq.items.${index}.answer` as const)} />
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ id: crypto.randomUUID(), question: "", answer: "" })}
      >
        <Plus className="h-4 w-4" />
        Add question
      </Button>
    </div>
  );
}
