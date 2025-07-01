import { pgTable, serial } from "drizzle-orm/pg-core";
import { citext } from "@/lib/db/schema/util";

export const Institutes = pgTable("institutes", {
  id: serial().primaryKey(),
  name: citext({ length: 60 }).notNull().unique(),
});
