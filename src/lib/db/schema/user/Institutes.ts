import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Institutes = pgTable("institutes", {
  instituteId: serial().primaryKey(),
  instituteName: varchar({ length: 60 }).notNull().unique(),
});
