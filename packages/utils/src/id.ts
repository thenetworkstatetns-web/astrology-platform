/**
 * Generates a URL-safe unique id. Uses the Web Crypto API which is available
 * in both Cloudflare Workers and modern browsers/Node runtimes.
 */
export function generateId(prefix?: string): string {
  const uuid = crypto.randomUUID();
  return prefix ? `${prefix}_${uuid}` : uuid;
}
