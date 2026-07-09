export const AUTH_COOKIE_NAME = "astro_session";
export const ADMIN_AUTH_COOKIE_NAME = "astro_admin_session";

export const JWT_EXPIRY_SECONDS = 60 * 60 * 24 * 7; // 7 days

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 80;

export const API_ROUTES = {
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  adminAuth: {
    login: "/api/admin/auth/login",
    logout: "/api/admin/auth/logout",
    me: "/api/admin/auth/me",
  },
  homepage: {
    get: "/api/homepage",
    update: "/api/admin/homepage",
  },
  settings: {
    get: "/api/settings",
    update: "/api/admin/settings",
  },
} as const;

export const HOMEPAGE_SECTION_KEYS = [
  "hero",
  "features",
  "whyChooseUs",
  "testimonials",
  "faq",
  "footer",
] as const;
