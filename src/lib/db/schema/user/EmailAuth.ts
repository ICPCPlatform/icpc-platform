import { sql } from "drizzle-orm";
import { pgTable, varchar, date, uuid } from "drizzle-orm/pg-core";

export const EmailAuth = pgTable("email_auth", {
  token: varchar().notNull(),
  userId: uuid().primaryKey(),
  expiresAt: date()
    .default(sql`now() + interval '7 day'`)
    .notNull(),
});
