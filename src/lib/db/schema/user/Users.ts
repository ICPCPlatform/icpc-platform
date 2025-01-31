import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  char,
} from "drizzle-orm/pg-core";

type Role = "admin" | "user" | "coach";
export const Users = pgTable("users", {
  userId: serial().primaryKey(),
  username: varchar().notNull(),
  password: varchar().notNull(),
  gmail: varchar().notNull().unique(),
  cfHandle: varchar().notNull(),
  phoneNumber: char({ length: 11 }).notNull(),
  // set by admin and the server
  role: varchar({ length: 40 }).$type<Role>().default("user").notNull(),
  lastOnline: timestamp().defaultNow(),
  isVerified: boolean().default(false).notNull(),
  deleted: boolean().default(false).notNull(),
});
