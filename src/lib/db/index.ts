import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { EmailAuth } from "./schema/user/EmailAuth";
import { lt, sql } from "drizzle-orm";
import { Users } from "./schema/user/Users";

/**
 * Database configuration and connection setup using Drizzle ORM
 * 
 * @description
 * Establishes PostgreSQL connection pool and exports configured Drizzle instance.
 * Includes automated cleanup of expired email authentication tokens.
 * 
 * @requires DATABASE_URL environment variable
 */

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

/**
 * Configured Drizzle ORM instance for database operations
 * 
 * @description
 * Main database instance with snake_case column naming convention.
 * Use this for all database queries throughout the application.
 * 
 * @example
 * ```typescript
 * import { db } from '@/lib/db';
 * 
 * const users = await db.select().from(Users);
 * ```
 */
export const db = drizzle(pool, {
  casing: "snake_case",
});

/**
 * Cleans up expired email authentication tokens and associated unverified users
 * 
 * @description
 * Removes expired email authentication tokens and deletes any users
 * who haven't verified their email before token expiration.
 * This prevents accumulation of unverified accounts in the database.
 * 
 * @todo Move to a cron job for better separation of concerns
 * @todo Add logging for cleanup operations
 * @todo Consider soft delete instead of hard delete for user data
 */
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
