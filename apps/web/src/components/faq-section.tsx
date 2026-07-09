"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqSection as FaqSectionType } from "@astro/types";
import { cn } from "@astro/ui";

export function FaqSection({ data }: { data: FaqSectionType }) {
  const [openId, setOpenId] = useState<string | null>(data.items[0]?.id ?? null);

  if (data.items.length === 0) return null;

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">{data.heading}</h2>
          {data.subheading ? <p className="mt-3 text-slate-600">{data.subheading}</p> : null}
        </div>

        <div className="mt-10 divide-y divide-slate-200 rounded-xl border border-slate-200">
          {data.items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-slate-900">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-slate-500 transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen ? (
                  <div className="px-5 pb-4 text-sm text-slate-600">{item.answer}</div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
