import { Config, defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./util/db/schema/*",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  casing: "snake_case",
}) satisfies Config;
