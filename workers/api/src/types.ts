import type { AuthTokenPayload } from "@astro/types";

export interface Bindings {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  JWT_SECRET: string;
  ENVIRONMENT: string;
  ALLOWED_ORIGINS: string;
}

export interface Variables {
  user?: AuthTokenPayload;
  admin?: AuthTokenPayload;
}

export interface AppEnv {
  Bindings: Bindings;
  Variables: Variables;
}
