import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { AUTH_COOKIE_NAME, ADMIN_AUTH_COOKIE_NAME } from "@astro/shared";
import type { AppEnv } from "../types";
import { verifyAuthToken } from "../lib/jwt";
import { AppError } from "../lib/response";

/**
 * Requires a valid public-user session cookie. Attaches decoded payload to
 * context as `user`.
 */
export const requireUser = createMiddleware<AppEnv>(async (c, next) => {
  const token = getCookie(c, AUTH_COOKIE_NAME);
  if (!token) {
    throw AppError.unauthorized("You must be logged in");
  }

  const payload = await verifyAuthToken(token, c.env.JWT_SECRET);
  if (!payload || payload.role !== "user") {
    throw AppError.unauthorized("Invalid or expired session");
  }

  c.set("user", payload);
  await next();
});

/**
 * Requires a valid admin session cookie. Attaches decoded payload to
 * context as `admin`.
 */
export const requireAdmin = createMiddleware<AppEnv>(async (c, next) => {
  const token = getCookie(c, ADMIN_AUTH_COOKIE_NAME);
  if (!token) {
    throw AppError.unauthorized("Admin authentication required");
  }

  const payload = await verifyAuthToken(token, c.env.JWT_SECRET);
  if (!payload || payload.role !== "admin") {
    throw AppError.unauthorized("Invalid or expired admin session");
  }

  c.set("admin", payload);
  await next();
});
