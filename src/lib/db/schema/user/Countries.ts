import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Countries = pgTable("countries", {
  countryId: serial().primaryKey(),
  countryName: varchar({ length: 60 }).notNull().unique(),
});
