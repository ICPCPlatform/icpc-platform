import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { EmailAuth } from "./schema/user/EmailAuth";
import { lt, sql } from "drizzle-orm";
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

// this is temporary, will be moved to a cron job
async function deleteExpiredLogs() {
  const user = await db
    .delete(EmailAuth)
    .where(sql`expires_at < now()`)
    .returning();
  if (user.length > 0) {
    await db.delete(Users).where(lt(Users.userId, user[0].userId)).execute();
  }
}

// delete expired logs every 1 hour
deleteExpiredLogs();
setInterval(deleteExpiredLogs, 60 * 60 * 1000);
