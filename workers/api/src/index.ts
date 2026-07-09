import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { StatusCode } from "hono/utils/http-status";
import type { AppEnv } from "./types";
import { AppError, fail } from "./lib/response";
import { authRoutes } from "./routes/auth";
import { adminAuthRoutes } from "./routes/admin-auth";
import { homepageRoutes, adminHomepageRoutes } from "./routes/homepage";
import { settingsRoutes, adminSettingsRoutes } from "./routes/settings";

const app = new Hono<AppEnv>();

app.use("*", logger());

app.use("*", async (c, next) => {
  const allowedOrigins = c.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  return cors({
    origin: allowedOrigins,
    credentials: true,
    allowHeaders: ["Content-Type"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })(c, next);
});

app.get("/health", (c) => c.json({ status: "ok", env: c.env.ENVIRONMENT }));

// Public user authentication
app.route("/api/auth", authRoutes);

// Admin authentication
app.route("/api/admin/auth", adminAuthRoutes);

// Homepage CMS (public read, admin write)
app.route("/api/homepage", homepageRoutes);
app.route("/api/admin/homepage", adminHomepageRoutes);

// Settings (public read, admin write)
app.route("/api/settings", settingsRoutes);
app.route("/api/admin/settings", adminSettingsRoutes);

app.notFound((c) => c.json(fail("Route not found", "NOT_FOUND"), 404));

app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json(fail(err.message, err.code, err.details), err.status as StatusCode);
  }

  console.error("Unhandled error:", err);
  return c.json(fail("Something went wrong", "INTERNAL_ERROR"), 500);
});

export default app;
