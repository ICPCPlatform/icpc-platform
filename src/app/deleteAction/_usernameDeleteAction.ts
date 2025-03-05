"use server"
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
export async function DELETEUserAction(username: string ) {
    "use server"
    // Only allow this endpoint in the test environment
    if (process.env.NODE_ENV == "test") {
        await db.execute(sql`DELETE FROM users WHERE username = ${username}`);
    }
}