import { z } from "zod";
import {
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "./constants";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .max(PASSWORD_MAX_LENGTH, `Password must be at most ${PASSWORD_MAX_LENGTH} characters`)
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a number");

export const nameSchema = z
  .string()
  .trim()
  .min(NAME_MIN_LENGTH, `Name must be at least ${NAME_MIN_LENGTH} characters`)
  .max(NAME_MAX_LENGTH, `Name must be at most ${NAME_MAX_LENGTH} characters`);

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// ---------------------------------------------------------------------------
// Homepage CMS validation
// ---------------------------------------------------------------------------

export const heroSectionSchema = z.object({
  heading: z.string().trim().min(1).max(200),
  subheading: z.string().trim().min(1).max(400),
  ctaLabel: z.string().trim().min(1).max(60),
  ctaUrl: z.string().trim().min(1).max(300),
  imageUrl: z.string().trim().max(1000).optional().default(""),
});

export const featureItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(400),
  icon: z.string().trim().max(60).optional().default(""),
});

export const featuresSectionSchema = z.object({
  heading: z.string().trim().min(1).max(200),
  subheading: z.string().trim().max(400).optional().default(""),
  items: z.array(featureItemSchema).max(24),
});

export const whyChooseUsItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(400),
});

export const whyChooseUsSectionSchema = z.object({
  heading: z.string().trim().min(1).max(200),
  subheading: z.string().trim().max(400).optional().default(""),
  items: z.array(whyChooseUsItemSchema).max(24),
});

export const testimonialItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  role: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(1).max(600),
  avatarUrl: z.string().trim().max(1000).optional().default(""),
  rating: z.number().min(1).max(5),
});

export const testimonialsSectionSchema = z.object({
  heading: z.string().trim().min(1).max(200),
  subheading: z.string().trim().max(400).optional().default(""),
  items: z.array(testimonialItemSchema).max(24),
});

export const faqItemSchema = z.object({
  id: z.string().min(1),
  question: z.string().trim().min(1).max(300),
  answer: z.string().trim().min(1).max(1000),
});

export const faqSectionSchema = z.object({
  heading: z.string().trim().min(1).max(200),
  subheading: z.string().trim().max(400).optional().default(""),
  items: z.array(faqItemSchema).max(50),
});

export const footerLinkSchema = z.object({
  id: z.string().min(1),
  label: z.string().trim().min(1).max(80),
  url: z.string().trim().min(1).max(300),
});

export const footerSectionSchema = z.object({
  text: z.string().trim().max(500).optional().default(""),
  links: z.array(footerLinkSchema).max(24),
});

export const homepageSectionsSchema = z.object({
  hero: heroSectionSchema,
  features: featuresSectionSchema,
  whyChooseUs: whyChooseUsSectionSchema,
  testimonials: testimonialsSectionSchema,
  faq: faqSectionSchema,
  footer: footerSectionSchema,
});

export const updateHomepageSchema = z.object({
  sections: homepageSectionsSchema,
});

// ---------------------------------------------------------------------------
// Settings validation
// ---------------------------------------------------------------------------

export const socialLinksSchema = z.object({
  facebook: z.string().trim().max(300).optional().default(""),
  instagram: z.string().trim().max(300).optional().default(""),
  twitter: z.string().trim().max(300).optional().default(""),
  youtube: z.string().trim().max(300).optional().default(""),
  linkedin: z.string().trim().max(300).optional().default(""),
});

export const updateSettingsSchema = z.object({
  siteName: z.string().trim().min(1).max(120),
  logoUrl: z.string().trim().max(1000).optional().default(""),
  faviconUrl: z.string().trim().max(1000).optional().default(""),
  contactEmail: z.union([emailSchema, z.literal("")]).optional().default(""),
  contactPhone: z.string().trim().max(30).optional().default(""),
  socialLinks: socialLinksSchema,
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type AdminLoginSchema = z.infer<typeof adminLoginSchema>;
export type UpdateHomepageSchema = z.infer<typeof updateHomepageSchema>;
export type UpdateSettingsSchema = z.infer<typeof updateSettingsSchema>;
