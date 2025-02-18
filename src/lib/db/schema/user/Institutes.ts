import { pgTable, serial } from "drizzle-orm/pg-core";
import { citext } from "@/lib/db/util";

export const Institutes = pgTable("institutes", {
  instituteId: serial().primaryKey(),
  instituteName: citext({ length: 60 }).notNull().unique(),
});
