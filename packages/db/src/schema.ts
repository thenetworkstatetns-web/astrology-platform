import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * admin_users — CMS administrators (Admin CMS login).
 */
export const adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

/**
 * users — public platform users (Email + Password authentication).
 */
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

/**
 * homepage_sections — one row per editable homepage section
 * (hero, features, whyChooseUs, testimonials, faq, footer).
 * `content` stores the section payload as JSON text so the shape can evolve
 * without schema migrations, while `section_key` keeps sections queryable
 * and uniquely constrained.
 */
export const homepageSections = sqliteTable("homepage_sections", {
  id: text("id").primaryKey(),
  sectionKey: text("section_key").notNull().unique(),
  content: text("content").notNull(), // JSON-encoded section data
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

/**
 * settings — singleton row holding site-wide CMS settings.
 */
export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(), // always "default"
  siteName: text("site_name").notNull().default("Astrology Platform"),
  logoUrl: text("logo_url").notNull().default(""),
  faviconUrl: text("favicon_url").notNull().default(""),
  contactEmail: text("contact_email").notNull().default(""),
  contactPhone: text("contact_phone").notNull().default(""),
  socialLinks: text("social_links").notNull().default("{}"), // JSON-encoded SocialLinks
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export type AdminUserRow = typeof adminUsers.$inferSelect;
export type NewAdminUserRow = typeof adminUsers.$inferInsert;

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;

export type HomepageSectionRow = typeof homepageSections.$inferSelect;
export type NewHomepageSectionRow = typeof homepageSections.$inferInsert;

export type SettingsRow = typeof settings.$inferSelect;
export type NewSettingsRow = typeof settings.$inferInsert;
