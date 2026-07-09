import { Sparkles, ShieldCheck, Clock, Star, Heart, Compass, Moon, Sun } from "lucide-react";
import type { FeaturesSection as FeaturesSectionType } from "@astro/types";

const ICON_MAP = {
  sparkles: Sparkles,
  "shield-check": ShieldCheck,
  clock: Clock,
  star: Star,
  heart: Heart,
  compass: Compass,
  moon: Moon,
  sun: Sun,
} as const;

function resolveIcon(name: string) {
  return ICON_MAP[name as keyof typeof ICON_MAP] ?? Sparkles;
}

export function FeaturesSection({ data }: { data: FeaturesSectionType }) {
  if (data.items.length === 0) return null;

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">{data.heading}</h2>
          {data.subheading ? <p className="mt-3 text-slate-600">{data.subheading}</p> : null}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item) => {
            const Icon = resolveIcon(item.icon || "sparkles");
            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 p-6 transition hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
