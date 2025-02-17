import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Cities = pgTable("cities", {
  cityId: serial().primaryKey(),
  cityName: varchar({ length: 60 }).notNull().unique(),
});
