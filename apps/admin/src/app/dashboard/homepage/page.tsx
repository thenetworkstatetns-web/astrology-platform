"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateHomepageSchema, type UpdateHomepageSchema } from "@astro/shared";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@astro/ui";
import { cn } from "@astro/ui";
import { useAdminHomepage, useUpdateHomepage } from "../../../lib/homepage-hooks";
import { HeroEditor } from "../../../components/homepage-editor/hero-editor";
import { FeaturesEditor } from "../../../components/homepage-editor/features-editor";
import { WhyChooseUsEditor } from "../../../components/homepage-editor/why-choose-us-editor";
import { TestimonialsEditor } from "../../../components/homepage-editor/testimonials-editor";
import { FaqEditor } from "../../../components/homepage-editor/faq-editor";
import { FooterEditor } from "../../../components/homepage-editor/footer-editor";

const TABS = [
  { key: "hero", label: "Hero" },
  { key: "features", label: "Features" },
  { key: "whyChooseUs", label: "Why Choose Us" },
  { key: "testimonials", label: "Testimonials" },
  { key: "faq", label: "FAQ" },
  { key: "footer", label: "Footer" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function HomepageCmsPage() {
  const { data, isLoading } = useAdminHomepage();
  const updateHomepage = useUpdateHomepage();
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const methods = useForm<UpdateHomepageSchema>({
    resolver: zodResolver(updateHomepageSchema),
  });

  useEffect(() => {
    if (data) {
      methods.reset({ sections: data.sections });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSubmit = async (values: UpdateHomepageSchema) => {
    setSaveMessage(null);
    await updateHomepage.mutateAsync(values.sections);
    setSaveMessage("Homepage content saved successfully.");
    setTimeout(() => setSaveMessage(null), 4000);
  };

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-slate-500">Loading homepage content...</p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Homepage</h1>
            <p className="mt-1 text-sm text-slate-500">
              Edit every section of the public homepage. Nothing here is hardcoded.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {saveMessage ? <span className="text-sm text-green-600">{saveMessage}</span> : null}
            <Button type="submit" disabled={updateHomepage.isPending}>
              {updateHomepage.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "bg-brand-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{TABS.find((t) => t.key === activeTab)?.label}</CardTitle>
          </CardHeader>
          <CardContent>
            {activeTab === "hero" && <HeroEditor />}
            {activeTab === "features" && <FeaturesEditor />}
            {activeTab === "whyChooseUs" && <WhyChooseUsEditor />}
            {activeTab === "testimonials" && <TestimonialsEditor />}
            {activeTab === "faq" && <FaqEditor />}
            {activeTab === "footer" && <FooterEditor />}
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
