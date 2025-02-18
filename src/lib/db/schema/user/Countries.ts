import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { citext } from "@/lib/db/util";

export const Countries = pgTable("countries", {
  countryId: serial().primaryKey(),
  countryName: citext({ length: 60 }).notNull().unique(),
});
