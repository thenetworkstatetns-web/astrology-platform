import { Hono, type Context } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { validate } from "../lib/validate";
import { eq } from "drizzle-orm";
import { adminLoginSchema, ADMIN_AUTH_COOKIE_NAME, JWT_EXPIRY_SECONDS } from "@astro/shared";
import type { AdminUser } from "@astro/types";
import { createDb, adminUsers } from "@astro/db";
import type { AppEnv } from "../types";
import { AppError, ok } from "../lib/response";
import { verifyPassword } from "../lib/password";
import { signAuthToken } from "../lib/jwt";
import { requireAdmin } from "../middleware/auth";

export const adminAuthRoutes = new Hono<AppEnv>();

function toAdminUser(row: { id: string; name: string; email: string; createdAt: string }): AdminUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.createdAt,
  };
}

function setAdminCookie(c: Context<AppEnv>, token: string, isProduction: boolean) {
  setCookie(c, ADMIN_AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "Lax",
    path: "/",
    maxAge: JWT_EXPIRY_SECONDS,
  });
}

adminAuthRoutes.post("/login", validate("json", adminLoginSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const db = createDb(c.env.DB);

  const admin = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).get();
  if (!admin) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const validPassword = await verifyPassword(password, admin.passwordHash);
  if (!validPassword) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const token = await signAuthToken(
    { sub: admin.id, email: admin.email, role: "admin" },
    c.env.JWT_SECRET
  );
  setAdminCookie(c, token, c.env.ENVIRONMENT === "production");

  return c.json(ok(toAdminUser(admin)));
});

adminAuthRoutes.post("/logout", requireAdmin, async (c) => {
  deleteCookie(c, ADMIN_AUTH_COOKIE_NAME, { path: "/" });
  return c.json(ok({ loggedOut: true }));
});

adminAuthRoutes.get("/me", requireAdmin, async (c) => {
  const payload = c.get("admin")!;
  const db = createDb(c.env.DB);

  const admin = await db.select().from(adminUsers).where(eq(adminUsers.id, payload.sub)).get();
  if (!admin) {
    throw AppError.unauthorized("Session is no longer valid");
  }

  return c.json(ok(toAdminUser(admin)));
});
