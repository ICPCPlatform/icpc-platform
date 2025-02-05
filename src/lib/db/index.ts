import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

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

export const db = drizzle(pool, {
  casing: "snake_case",
});
