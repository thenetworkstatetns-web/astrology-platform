import { Hono } from "hono";
import { validate } from "../lib/validate";
import { eq } from "drizzle-orm";
import { updateSettingsSchema } from "@astro/shared";
import type { SiteSettings } from "@astro/types";
import { createDb, settings } from "@astro/db";
import { defaultSiteSettings, defaultSocialLinks } from "@astro/utils";
import type { AppEnv } from "../types";
import { ok } from "../lib/response";
import { requireAdmin } from "../middleware/auth";

export const settingsRoutes = new Hono<AppEnv>();
export const adminSettingsRoutes = new Hono<AppEnv>();

const SETTINGS_ID = "default";

async function loadSettings(db: ReturnType<typeof createDb>): Promise<SiteSettings> {
  const row = await db.select().from(settings).where(eq(settings.id, SETTINGS_ID)).get();

  if (!row) {
    const fallback = defaultSiteSettings();
    return {
      id: SETTINGS_ID,
      updatedAt: new Date(0).toISOString(),
      ...fallback,
    };
  }

  let socialLinks;
  try {
    socialLinks = JSON.parse(row.socialLinks);
  } catch {
    socialLinks = defaultSocialLinks();
  }

  return {
    id: row.id,
    siteName: row.siteName,
    logoUrl: row.logoUrl,
    faviconUrl: row.faviconUrl,
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone,
    socialLinks,
    updatedAt: row.updatedAt,
  };
}

// Public: GET /api/settings
settingsRoutes.get("/", async (c) => {
  const db = createDb(c.env.DB);
  const data = await loadSettings(db);
  return c.json(ok(data));
});

// Admin: GET /api/admin/settings
adminSettingsRoutes.get("/", requireAdmin, async (c) => {
  const db = createDb(c.env.DB);
  const data = await loadSettings(db);
  return c.json(ok(data));
});

// Admin: PUT /api/admin/settings
adminSettingsRoutes.put(
  "/",
  requireAdmin,
  validate("json", updateSettingsSchema),
  async (c) => {
    const input = c.req.valid("json");
    const db = createDb(c.env.DB);
    const now = new Date().toISOString();

    const values = {
      id: SETTINGS_ID,
      siteName: input.siteName,
      logoUrl: input.logoUrl ?? "",
      faviconUrl: input.faviconUrl ?? "",
      contactEmail: input.contactEmail ?? "",
      contactPhone: input.contactPhone ?? "",
      socialLinks: JSON.stringify(input.socialLinks),
      updatedAt: now,
    };

    await db
      .insert(settings)
      .values(values)
      .onConflictDoUpdate({
        target: settings.id,
        set: {
          siteName: values.siteName,
          logoUrl: values.logoUrl,
          faviconUrl: values.faviconUrl,
          contactEmail: values.contactEmail,
          contactPhone: values.contactPhone,
          socialLinks: values.socialLinks,
          updatedAt: values.updatedAt,
        },
      });

    const data = await loadSettings(db);
    return c.json(ok(data));
  }
);
