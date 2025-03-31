import { sql } from "drizzle-orm";
import { pgTable, varchar, date, uuid } from "drizzle-orm/pg-core";

export const EmailAuth = pgTable("email_auth", {
  userId: uuid().primaryKey(),
  token: varchar().notNull(), // length ? 
  expiresAt: date()
    .default(sql`now() + interval '7 day'`)
    .notNull(),
});
