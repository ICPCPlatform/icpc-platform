import { sql } from "drizzle-orm";
import { integer, pgTable, varchar, date } from "drizzle-orm/pg-core";

export const EmailAuth = pgTable("email_auth", {
  token: varchar().notNull(),
  userId: integer().primaryKey(),
  expiresAt: date()
    .default(sql`now() + interval '7 day'`)
    .notNull(),
});
