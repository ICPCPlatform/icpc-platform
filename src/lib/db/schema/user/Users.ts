import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { citext } from "@/lib/db/util";

type Role = "admin" | "user" | "coach";
export const Users = pgTable(
  "users",
  {
    userId: uuid().primaryKey(),
    username: citext({ length: 24 }).notNull(),
    password: varchar({ length: 75 }).notNull(),

    gmail: citext({ length: 40 }).notNull().unique(),
    cfHandle: citext({ length: 24 }).notNull().unique(),
    vjHandle: citext({ length: 16 }).unique(),

    // international numbers could be accepted in the future
    phoneNumber: varchar({ length: 15 }).notNull(),
    // set by admin and the server
    role: varchar({ length: 40 }).$type<Role>().default("user").notNull(),
    deleted: timestamp(), // null means <not deleted> otherwise <time of deletion>
  },
  // makes sure that the username is unique and searches are faster
  (table) => [uniqueIndex("users_username_idx").on(table.username)]
);
