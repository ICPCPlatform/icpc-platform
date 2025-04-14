import { pgTable, serial } from "drizzle-orm/pg-core";
import { citext } from "@/lib/db/util";

export const Faculties = pgTable("faculties", {
  id: serial().primaryKey(),
  name: citext({ length: 60 }).notNull().unique(),
});
