import { zValidator as zv } from "@hono/zod-validator";
import type { ZodSchema } from "zod";
import { fail } from "./response";

/**
 * Wraps @hono/zod-validator so validation failures return our standard
 * { success: false, error: { message, code, details } } envelope instead of
 * the library's default shape.
 */
export function validate<T extends ZodSchema>(target: "json" | "query" | "param", schema: T) {
  return zv(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        fail("Validation failed", "VALIDATION_ERROR", result.error.flatten()),
        400
      );
    }
  });
}
