import { CheckCircle2 } from "lucide-react";
import type { WhyChooseUsSection as WhyChooseUsSectionType } from "@astro/types";

export function WhyChooseUsSection({ data }: { data: WhyChooseUsSectionType }) {
  if (data.items.length === 0) return null;

  return (
    <section className="border-b border-slate-200 bg-brand-50/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">{data.heading}</h2>
          {data.subheading ? <p className="mt-3 text-slate-600">{data.subheading}</p> : null}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {data.items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-xl bg-white p-6 shadow-sm">
              <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-brand-600" />
              <div>
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
