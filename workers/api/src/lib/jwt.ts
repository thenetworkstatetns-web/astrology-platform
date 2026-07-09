import { sign, verify } from "hono/jwt";
import type { AuthTokenPayload } from "@astro/types";
import { JWT_EXPIRY_SECONDS } from "@astro/shared";

export async function signAuthToken(
  payload: Pick<AuthTokenPayload, "sub" | "email" | "role">,
  secret: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: AuthTokenPayload = {
    ...payload,
    iat: now,
    exp: now + JWT_EXPIRY_SECONDS,
  };
  return sign(fullPayload as unknown as Record<string, unknown>, secret, "HS256");
}

export async function verifyAuthToken(
  token: string,
  secret: string
): Promise<AuthTokenPayload | null> {
  try {
    const decoded = await verify(token, secret, "HS256");
    return decoded as unknown as AuthTokenPayload;
  } catch {
    return null;
  }
}
