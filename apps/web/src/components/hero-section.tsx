import Link from "next/link";
import type { HeroSection as HeroSectionType } from "@astro/types";
import { Button } from "@astro/ui";

export function HeroSection({ data }: { data: HeroSectionType }) {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            {data.heading}
          </h1>
          <p className="mt-4 text-lg text-slate-600">{data.subheading}</p>
          <div className="mt-8">
            <Link href={data.ctaUrl || "/register"}>
              <Button size="lg">{data.ctaLabel || "Get Started"}</Button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          {data.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.imageUrl}
              alt={data.heading}
              className="max-h-96 w-full rounded-2xl object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-72 w-full max-w-md items-center justify-center rounded-2xl bg-brand-100 text-brand-400">
              <span className="text-sm">Hero image</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
