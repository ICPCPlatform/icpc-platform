import {
    pgTable,
    serial,
    varchar,
    timestamp,
    boolean,
    char
} from "drizzle-orm/pg-core";

import {
    role_type
} from "./enums";

export const Users = pgTable("users", {
    userId: serial().primaryKey(),
    username: varchar().notNull(),
    gmail: varchar().notNull().unique(),
    role: role_type().notNull(),
    cfHandle: varchar().notNull(),
    lastOnline: timestamp().defaultNow(),
    password: varchar().notNull(),
    isVerified: boolean().default(false).notNull(),
    phoneNumber: char({ length: 11 }).notNull(),
});
