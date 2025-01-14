import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as fs from "fs";
import * as path from "path";
import { PgTable } from "drizzle-orm/pg-core";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
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
  const tablesFolder = path.resolve(__dirname, "schema");
  
  fs.readdirSync(tablesFolder).forEach((file) => {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      const table = require(path.join(tablesFolder, file));
      Object.assign(tables, table[Object.keys(table)[0]]);
    }
  });
  
export const db = drizzle(pool, {
  casing: "snake_case",
  schema:  tables,
  
});
