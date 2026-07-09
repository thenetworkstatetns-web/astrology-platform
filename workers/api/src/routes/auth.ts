import { Hono, type Context } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { validate } from "../lib/validate";
import { eq } from "drizzle-orm";
import { registerSchema, loginSchema, AUTH_COOKIE_NAME, JWT_EXPIRY_SECONDS } from "@astro/shared";
import type { PublicUser } from "@astro/types";
import { createDb, users } from "@astro/db";
import { generateId } from "@astro/utils";
import type { AppEnv } from "../types";
import { AppError, ok } from "../lib/response";
import { hashPassword, verifyPassword } from "../lib/password";
import { signAuthToken } from "../lib/jwt";
import { requireUser } from "../middleware/auth";

export const authRoutes = new Hono<AppEnv>();

function toPublicUser(row: { id: string; name: string; email: string; createdAt: string }): PublicUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.createdAt,
  };
}

function setAuthCookie(c: Context<AppEnv>, token: string, isProduction: boolean) {
  setCookie(c, AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "Lax",
    path: "/",
    maxAge: JWT_EXPIRY_SECONDS,
  });
}

authRoutes.post("/register", validate("json", registerSchema), async (c) => {
  const { name, email, password } = c.req.valid("json");
  const db = createDb(c.env.DB);

  const existing = await db.select().from(users).where(eq(users.email, email)).get();
  if (existing) {
    throw AppError.conflict("An account with this email already exists");
  }

  const passwordHash = await hashPassword(password);
  const id = generateId("user");
  const now = new Date().toISOString();

  await db.insert(users).values({
    id,
    name,
    email,
    passwordHash,
    createdAt: now,
    updatedAt: now,
  });

  const token = await signAuthToken({ sub: id, email, role: "user" }, c.env.JWT_SECRET);
  setAuthCookie(c, token, c.env.ENVIRONMENT === "production");

  return c.json(ok(toPublicUser({ id, name, email, createdAt: now })), 201);
});

authRoutes.post("/login", validate("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const db = createDb(c.env.DB);

  const user = await db.select().from(users).where(eq(users.email, email)).get();
  if (!user) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const token = await signAuthToken(
    { sub: user.id, email: user.email, role: "user" },
    c.env.JWT_SECRET
  );
  setAuthCookie(c, token, c.env.ENVIRONMENT === "production");

  return c.json(ok(toPublicUser(user)));
});

authRoutes.post("/logout", requireUser, async (c) => {
  deleteCookie(c, AUTH_COOKIE_NAME, { path: "/" });
  return c.json(ok({ loggedOut: true }));
});

authRoutes.get("/me", requireUser, async (c) => {
  const payload = c.get("user")!;
  const db = createDb(c.env.DB);

  const user = await db.select().from(users).where(eq(users.id, payload.sub)).get();
  if (!user) {
    throw AppError.unauthorized("Session is no longer valid");
  }

  return c.json(ok(toPublicUser(user)));
});
