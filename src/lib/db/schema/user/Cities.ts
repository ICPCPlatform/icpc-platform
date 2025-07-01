import { pgTable, serial } from "drizzle-orm/pg-core";
import { citext } from "@/lib/db/schema/util";

export const Cities = pgTable("cities", {
  id: serial().primaryKey(),
  name: citext({ length: 60 }).notNull().unique(),
});
