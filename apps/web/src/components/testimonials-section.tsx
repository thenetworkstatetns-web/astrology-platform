import { Star } from "lucide-react";
import type { TestimonialsSection as TestimonialsSectionType } from "@astro/types";

export function TestimonialsSection({ data }: { data: TestimonialsSectionType }) {
  if (data.items.length === 0) return null;

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">{data.heading}</h2>
          {data.subheading ? <p className="mt-3 text-slate-600">{data.subheading}</p> : null}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 p-6">
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4"
                    fill={i < item.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-700">&ldquo;{item.message}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                {item.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  {item.role ? <p className="text-xs text-slate-500">{item.role}</p> : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
