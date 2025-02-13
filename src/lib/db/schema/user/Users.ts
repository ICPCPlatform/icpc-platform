import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  char,
  uniqueIndex,
} from "drizzle-orm/pg-core";

type Role = "admin" | "user" | "coach";
export const Users = pgTable(
  "users",
  {
    userId: serial().primaryKey(),
    username: varchar().notNull().unique(),
    password: varchar().notNull().unique(),

    gmail: varchar().notNull().unique(),
    cfHandle: varchar().notNull().unique(),
    phoneNumber: char({ length: 11 }).notNull().unique(),
    // set by admin and the server
    role: varchar({ length: 40 }).$type<Role>().default("user").notNull(),
    lastOnline: timestamp().defaultNow(),
    isVerified: boolean().default(false).notNull(),
    deleted: boolean().default(false).notNull(),
  },
  (table) => [uniqueIndex("users_username_idx").on(table.username)],
);
