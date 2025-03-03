import { char, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { Users } from "./Users";
import { sql } from "drizzle-orm";


export const ResetPassword = pgTable("reset_password", {
  userId: uuid().primaryKey().references(() => Users.userId, {
    onDelete: "no action",
    onUpdate: "no action"
  }).notNull(),
  token: char({ length: 25 }).notNull(),
  endAt: timestamp().default(sql`now() + interval '1 day'`).notNull(),

})
