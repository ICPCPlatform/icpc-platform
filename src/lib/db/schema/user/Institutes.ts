import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Institutes = pgTable("institutes", {
  institutId: serial().primaryKey(),
  institutName: varchar({ length: 60 }).notNull().unique(),
});
