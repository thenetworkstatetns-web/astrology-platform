import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "../../workers/api/migrations",
  dialect: "sqlite",
  driver: "d1-http",
});
