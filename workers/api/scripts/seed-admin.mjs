#!/usr/bin/env node
/**
 * Generates a SQL INSERT statement for the first admin user.
 *
 * There is intentionally no public "admin register" API endpoint (out of
 * scope for Task 1), so the first admin account must be seeded directly
 * into D1 using this script.
 *
 * Usage:
 *   node scripts/seed-admin.mjs "Admin Name" "admin@example.com" "StrongPass123"
 *
 * Then apply it:
 *   wrangler d1 execute astro-platform-db --local --file=./seed-admin.sql
 *   wrangler d1 execute astro-platform-db --remote --file=./seed-admin.sql
 */
import { webcrypto as crypto } from "node:crypto";
import { writeFileSync } from "node:fs";

const [, , name, email, password] = process.argv;

if (!name || !email || !password) {
  console.error('Usage: node scripts/seed-admin.mjs "Admin Name" "admin@example.com" "StrongPass123"');
  process.exit(1);
}

const PBKDF2_ITERATIONS = 100_000;
const SALT_LENGTH_BYTES = 16;
const HASH_LENGTH_BITS = 256;

function toBase64(bytes) {
  return Buffer.from(bytes).toString("base64");
}

async function hashPassword(plain) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTES));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(plain),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    HASH_LENGTH_BITS
  );
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64(salt)}$${toBase64(derived)}`;
}

const id = crypto.randomUUID();
const passwordHash = await hashPassword(password);
const now = new Date().toISOString();
const escapedName = name.replace(/'/g, "''");
const escapedEmail = email.replace(/'/g, "''");

const sql = `INSERT INTO admin_users (id, name, email, password_hash, created_at, updated_at)
VALUES ('admin_${id}', '${escapedName}', '${escapedEmail}', '${passwordHash}', '${now}', '${now}')
ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, updated_at = excluded.updated_at;
`;

writeFileSync("seed-admin.sql", sql);
console.log("Wrote seed-admin.sql");
console.log(sql);
