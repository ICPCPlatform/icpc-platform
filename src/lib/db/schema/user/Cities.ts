import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { citext } from "@/lib/db/util";

export const Cities = pgTable("cities", {
  cityId: serial().primaryKey(),
  cityName: citext({ length: 60 }).notNull().unique(),
});
