/**
 * Shared domain types for the Astrology Platform MVP (Task 1 scope only:
 * Admin CMS, Public Home Page, Email+Password Authentication).
 */

// ---------------------------------------------------------------------------
// Auth / Users
// ---------------------------------------------------------------------------

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: "user" | "admin";
  iat?: number;
  exp?: number;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

// ---------------------------------------------------------------------------
// Homepage CMS
// ---------------------------------------------------------------------------

export interface HeroSection {
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FeaturesSection {
  heading: string;
  subheading: string;
  items: FeatureItem[];
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
}

export interface WhyChooseUsSection {
  heading: string;
  subheading: string;
  items: WhyChooseUsItem[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  message: string;
  avatarUrl: string;
  rating: number;
}

export interface TestimonialsSection {
  heading: string;
  subheading: string;
  items: TestimonialItem[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqSection {
  heading: string;
  subheading: string;
  items: FaqItem[];
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export interface FooterSection {
  text: string;
  links: FooterLink[];
}

export interface HomepageSections {
  hero: HeroSection;
  features: FeaturesSection;
  whyChooseUs: WhyChooseUsSection;
  testimonials: TestimonialsSection;
  faq: FaqSection;
  footer: FooterSection;
}

export type HomepageSectionKey = keyof HomepageSections;

export interface HomepageContent {
  id: string;
  sections: HomepageSections;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  linkedin: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: SocialLinks;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// API envelope
// ---------------------------------------------------------------------------

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
