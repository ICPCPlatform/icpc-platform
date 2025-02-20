import { pgTable, serial } from "drizzle-orm/pg-core";
import { citext } from "@/lib/db/util";

export const Countries = pgTable("countries", {
  id: serial().primaryKey(),
  name: citext({ length: 60 }).notNull().unique(),
});
