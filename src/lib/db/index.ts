import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as fs from "fs";
import * as path from "path";
import { PgTable } from "drizzle-orm/pg-core";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection
pool
  .connect()
  .then(() => {
    console.log("🚀 Connected to PostgreSQL database");
    console.log("📍 Database URL:", process.env.DATABASE_URL?.split("@")[1]); // Only show host part for security
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
  });
const tables: Record<string, PgTable> = {};
const tablesFolder = path.resolve('.', "schema");

fs.readdirSync(tablesFolder).forEach(async (file) => {
  if (file.endsWith(".ts") || file.endsWith(".js")) {
    const table = await import(path.join(tablesFolder, file));
    Object.assign(tables, table[Object.keys(table)[0]]);
  }
});

export const db = drizzle(pool, {
  casing: "snake_case",
  schema: tables,
});
