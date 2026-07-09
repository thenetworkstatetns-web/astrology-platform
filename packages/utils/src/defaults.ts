import type { HomepageSections, SiteSettings, SocialLinks } from "@astro/types";
import { generateId } from "./id";

export function defaultHomepageSections(): HomepageSections {
  return {
    hero: {
      heading: "Discover What the Stars Have Planned for You",
      subheading:
        "Connect with expert astrologers and get personalized insights for love, career, and life.",
      ctaLabel: "Get Started",
      ctaUrl: "/register",
      imageUrl: "",
    },
    features: {
      heading: "Why Astrology Matters",
      subheading: "Everything you need to understand your cosmic path",
      items: [
        {
          id: generateId("feat"),
          title: "Personalized Readings",
          description: "Get insights tailored to your unique birth chart.",
          icon: "sparkles",
        },
        {
          id: generateId("feat"),
          title: "Trusted Guidance",
          description: "Guidance rooted in decades of astrological tradition.",
          icon: "shield-check",
        },
        {
          id: generateId("feat"),
          title: "Available Anytime",
          description: "Access insights whenever you need clarity.",
          icon: "clock",
        },
      ],
    },
    whyChooseUs: {
      heading: "Why Choose Us",
      subheading: "What sets our platform apart",
      items: [
        {
          id: generateId("wcu"),
          title: "Accuracy First",
          description: "Every reading is grounded in precise calculations.",
        },
        {
          id: generateId("wcu"),
          title: "Privacy Respected",
          description: "Your data and readings stay confidential.",
        },
      ],
    },
    testimonials: {
      heading: "What Our Users Say",
      subheading: "Real stories from real people",
      items: [],
    },
    faq: {
      heading: "Frequently Asked Questions",
      subheading: "Answers to common questions",
      items: [
        {
          id: generateId("faq"),
          question: "How does this platform work?",
          answer:
            "Create an account, complete your profile, and explore personalized astrological content.",
        },
      ],
    },
    footer: {
      text: "© Astrology Platform. All rights reserved.",
      links: [],
    },
  };
}

export function defaultSocialLinks(): SocialLinks {
  return {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
  };
}

export function defaultSiteSettings(): Omit<SiteSettings, "id" | "updatedAt"> {
  return {
    siteName: "Astrology Platform",
    logoUrl: "",
    faviconUrl: "",
    contactEmail: "",
    contactPhone: "",
    socialLinks: defaultSocialLinks(),
  };
}
