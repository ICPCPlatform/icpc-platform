import {
  pgTable,
  serial,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const UserRoleEnum = pgEnum("user_role", ["user", "mentor", "admin"]);

export const Users = pgTable("users", {
  id: serial().primaryKey(),
  firstName: varchar().notNull(),
  lastName: varchar().notNull(),
  email: varchar().notNull().unique(),
  googleId: varchar().unique(),
  password: varchar(),
  role: UserRoleEnum().default("user").notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});
