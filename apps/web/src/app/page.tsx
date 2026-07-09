"use client";

import { SiteHeader } from "../components/site-header";
import { HeroSection } from "../components/hero-section";
import { FeaturesSection } from "../components/features-section";
import { WhyChooseUsSection } from "../components/why-choose-us-section";
import { TestimonialsSection } from "../components/testimonials-section";
import { FaqSection } from "../components/faq-section";
import { FooterSection } from "../components/footer-section";
import { useHomepageContent } from "../lib/homepage-hooks";
import { useSiteSettings } from "../lib/settings-hooks";

export default function HomePage() {
  const { data, isLoading, isError } = useHomepageContent();
  const { data: settings } = useSiteSettings();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Loading...</p>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-red-600">Unable to load homepage content. Please try again.</p>
      </main>
    );
  }

  const { sections } = data;

  return (
    <>
      <SiteHeader siteName={settings?.siteName ?? "Astrology Platform"} />
      <main>
        <HeroSection data={sections.hero} />
        <FeaturesSection data={sections.features} />
        <WhyChooseUsSection data={sections.whyChooseUs} />
        <TestimonialsSection data={sections.testimonials} />
        <FaqSection data={sections.faq} />
      </main>
      <FooterSection data={sections.footer} settings={settings} />
    </>
  );
}
