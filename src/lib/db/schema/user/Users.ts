import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

type Role = "admin" | "user" | "coach";
export const Users = pgTable(
  "users",
  {
    userId: uuid().primaryKey(),
    username: varchar({ length: 24 }).notNull(),
    password: varchar({ length: 75 }).notNull(),

    gmail: varchar({ length: 40 }).notNull().unique(),
    cfHandle: varchar({ length: 24 }).notNull().unique(),
    vjHandle: varchar({ length: 16 }).unique(),

    // international numbers could be accepted in the future
    phoneNumber: varchar({ length: 15 }).notNull(),
    // set by admin and the server
    role: varchar({ length: 40 }).$type<Role>().default("user").notNull(),
    deleted: timestamp(),// null means <not deleted> otherwise <time of deletion>
  },
  // makes sure that the username is unique and searches are faster
  (table) => [uniqueIndex("users_username_idx").on(table.username)] 
  
);
