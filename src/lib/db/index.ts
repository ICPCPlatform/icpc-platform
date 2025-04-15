import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { EmailAuth } from "./schema/user/EmailAuth";
import { eq, sql } from "drizzle-orm";
import { Users } from "./schema/user/Users";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection
pool
  .connect()
  .then(() => {
    console.log("🚀 Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
  });

export const db = drizzle(pool, {
  casing: "snake_case",
});

/// TODO:
/// this is temporary, will be moved to a cron job
async function deleteExpiredLogs() {
  const userArr = await db
    .delete(EmailAuth)
    .where(sql`expires_at < now()`)
    .returning();
  if (userArr.length > 0) {
    await db.delete(Users).where(eq(Users.userId, userArr[0].userId)).execute();
  }
}

// delete expired logs every 1 hour
deleteExpiredLogs();
setInterval(deleteExpiredLogs, 60 * 60 * 1000);
