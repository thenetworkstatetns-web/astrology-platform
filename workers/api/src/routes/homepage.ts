import { Hono } from "hono";
import { validate } from "../lib/validate";
import { updateHomepageSchema, HOMEPAGE_SECTION_KEYS } from "@astro/shared";
import type { HomepageSectionKey, HomepageSections } from "@astro/types";
import { createDb, homepageSections } from "@astro/db";
import { defaultHomepageSections } from "@astro/utils";
import type { AppEnv } from "../types";
import { ok } from "../lib/response";
import { requireAdmin } from "../middleware/auth";

export const homepageRoutes = new Hono<AppEnv>();
export const adminHomepageRoutes = new Hono<AppEnv>();

async function loadHomepageSections(db: ReturnType<typeof createDb>): Promise<HomepageSections> {
  const rows = await db.select().from(homepageSections).all();
  const fallback = defaultHomepageSections();

  const result = { ...fallback };
  for (const row of rows) {
    const key = row.sectionKey as HomepageSectionKey;
    if (HOMEPAGE_SECTION_KEYS.includes(key)) {
      try {
        (result as Record<HomepageSectionKey, unknown>)[key] = JSON.parse(row.content);
      } catch {
        // Keep default for this section if stored JSON is corrupted.
      }
    }
  }
  return result;
}

// Public: GET /api/homepage
homepageRoutes.get("/", async (c) => {
  const db = createDb(c.env.DB);
  const sections = await loadHomepageSections(db);
  return c.json(ok({ sections }));
});

// Admin: GET /api/admin/homepage
adminHomepageRoutes.get("/", requireAdmin, async (c) => {
  const db = createDb(c.env.DB);
  const sections = await loadHomepageSections(db);
  return c.json(ok({ sections }));
});

// Admin: PUT /api/admin/homepage
adminHomepageRoutes.put(
  "/",
  requireAdmin,
  validate("json", updateHomepageSchema),
  async (c) => {
    const { sections } = c.req.valid("json");
    const db = createDb(c.env.DB);
    const now = new Date().toISOString();

    for (const key of HOMEPAGE_SECTION_KEYS) {
      const content = JSON.stringify(sections[key]);
      await db
        .insert(homepageSections)
        .values({
          id: `hs_${key}`,
          sectionKey: key,
          content,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: homepageSections.sectionKey,
          set: { content, updatedAt: now },
        });
    }

    return c.json(ok({ sections }));
  }
);
