import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial().primaryKey(),
    firstName: varchar().notNull(),
    lastName: varchar().notNull(),
    email: varchar().notNull().unique(),
    googleId: varchar().unique(),
    password: varchar(),
    role: varchar({ length: 50 }).default("user").notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});
